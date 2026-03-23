# AI Agent Patterns

> Building AI agents that take actions on behalf of your users. Agents are AI systems that can reason, use tools, and execute multi-step workflows. Powerful when done right, dangerous when done wrong.

---

## What Is an Agent?

An agent is an AI system that can:
1. **Reason** about what action to take next
2. **Use tools** (call APIs, query databases, perform calculations)
3. **Observe** the result of each action
4. **Decide** whether to take another action or respond to the user

The key difference from a simple LLM call: the model controls the flow. You define the tools. The model decides when and how to use them.

---

## When to Use Agents (and When Not To)

| Use Agents | Do NOT Use Agents |
|------------|------------------|
| User request requires multiple steps you cannot predict in advance | The steps are always the same (use a fixed pipeline instead) |
| The task requires dynamic decision-making | A simple prompt + response is sufficient |
| The user needs to interact with multiple systems | You only need to call one API |
| The workflow has branching logic based on intermediate results | The output format is always structured and predictable |

**Rule of thumb:** If you can write the workflow as a fixed function, do not use an agent. Agents add latency, cost, and unpredictability. Use them only when the workflow genuinely requires dynamic reasoning.

---

## 1. Tool / Function Calling Architecture

Define tools with clear descriptions and typed parameters. The LLM decides when to use them.

### Tool Definition

```typescript
// lib/ai/tools.ts

import { tool } from "ai";
import { z } from "zod";

// Each tool needs: name, description (for the LLM), typed parameters, execute function

export const lookupOrder = tool({
  description: "Look up an order by its ID. Returns order details including status, items, and total.",
  parameters: z.object({
    orderId: z.string().describe("The order ID (e.g., ORD-12345)"),
  }),
  execute: async ({ orderId }) => {
    const order = await db.orders.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { error: "Order not found" };

    return {
      id: order.id,
      status: order.status,
      total: order.total,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      createdAt: order.createdAt.toISOString(),
    };
  },
});

export const searchKnowledgeBase = tool({
  description: "Search the knowledge base for articles related to a query. Use this when the user asks a question about product features or how to do something.",
  parameters: z.object({
    query: z.string().describe("The search query"),
    maxResults: z.number().optional().default(3).describe("Maximum number of results"),
  }),
  execute: async ({ query, maxResults }) => {
    const results = await ragSearch(query, maxResults);
    return results.map((r) => ({
      title: r.metadata.title,
      content: r.content,
      relevance: r.similarity,
    }));
  },
});

export const createSupportTicket = tool({
  description: "Create a support ticket to escalate an issue to a human agent. Use this when you cannot resolve the user's issue yourself.",
  parameters: z.object({
    subject: z.string().describe("Brief description of the issue"),
    priority: z.enum(["low", "medium", "high", "urgent"]).describe("Ticket priority"),
    category: z.enum(["billing", "technical", "account", "other"]),
    details: z.string().describe("Full details of the issue and what has been tried"),
  }),
  execute: async ({ subject, priority, category, details }) => {
    const ticket = await db.supportTickets.create({
      data: { subject, priority, category, details },
    });
    return { ticketId: ticket.id, message: "Ticket created successfully" };
  },
});

export const refundPayment = tool({
  description: "Process a refund for a payment. IMPORTANT: Always confirm with the user before executing this tool.",
  parameters: z.object({
    paymentId: z.string().describe("The payment ID to refund"),
    amount: z.number().describe("The refund amount in dollars"),
    reason: z.string().describe("The reason for the refund"),
  }),
  execute: async ({ paymentId, amount, reason }) => {
    // This is a destructive action — the agent should confirm first
    const result = await payments.refund(paymentId, amount, reason);
    return { success: result.success, refundId: result.refundId };
  },
});
```

### Tool Design Guidelines

1. **Descriptions matter.** The LLM uses the description to decide when to call a tool. Vague descriptions lead to wrong tool calls.
2. **Return structured data.** Return JSON objects, not prose. The LLM processes structured results more reliably.
3. **Return errors gracefully.** Return `{ error: "message" }` instead of throwing. The agent can reason about errors and try alternatives.
4. **Keep tools focused.** One tool = one action. Do not create god-tools that do multiple things.
5. **Include examples in descriptions** if the parameter format is non-obvious (e.g., date formats, ID patterns).

---

## 2. Agent Loop

The core agent pattern: call the LLM, check if it wants to use a tool, execute the tool, feed the result back, repeat.

### Using Vercel AI SDK (Recommended)

```typescript
// app/api/agent/route.ts

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { lookupOrder, searchKnowledgeBase, createSupportTicket, refundPayment } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a customer support agent for Acme SaaS.

You have access to tools to help users. Follow these rules:
1. Use searchKnowledgeBase for product questions before making up answers.
2. Use lookupOrder when users ask about their orders.
3. Use createSupportTicket to escalate issues you cannot resolve.
4. ALWAYS ask for confirmation before using refundPayment.
5. Be concise and helpful. Do not apologize excessively.`,
    messages,
    tools: {
      lookupOrder,
      searchKnowledgeBase,
      createSupportTicket,
      refundPayment,
    },
    maxSteps: 5, // Maximum number of tool call rounds
    onStepFinish: ({ text, toolCalls, toolResults, finishReason }) => {
      // Log each step for observability
      console.log("Agent step:", {
        toolCalls: toolCalls?.map((tc) => tc.toolName),
        finishReason,
      });
    },
  });

  return result.toDataStreamResponse();
}
```

### Manual Agent Loop (When You Need Full Control)

```typescript
// lib/ai/agent-loop.ts

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

interface AgentConfig {
  systemPrompt: string;
  tools: Anthropic.Tool[];
  toolExecutors: Record<string, (input: any) => Promise<any>>;
  maxSteps: number;
  onStep?: (step: AgentStep) => void;
}

interface AgentStep {
  stepNumber: number;
  type: "tool_call" | "response";
  toolName?: string;
  toolInput?: any;
  toolResult?: any;
  response?: string;
}

export async function runAgent(
  messages: Anthropic.MessageParam[],
  config: AgentConfig
): Promise<{ response: string; steps: AgentStep[] }> {
  const steps: AgentStep[] = [];
  let currentMessages = [...messages];

  for (let step = 0; step < config.maxSteps; step++) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: config.systemPrompt,
      tools: config.tools,
      messages: currentMessages,
    });

    // Check if the model wants to use a tool
    if (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        const executor = config.toolExecutors[toolUse.name];
        if (!executor) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: `Unknown tool: ${toolUse.name}` }),
          });
          continue;
        }

        try {
          const result = await executor(toolUse.input);

          const agentStep: AgentStep = {
            stepNumber: step,
            type: "tool_call",
            toolName: toolUse.name,
            toolInput: toolUse.input,
            toolResult: result,
          };
          steps.push(agentStep);
          config.onStep?.(agentStep);

          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          });
        } catch (error: any) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify({ error: error.message }),
            is_error: true,
          });
        }
      }

      // Add assistant message and tool results to conversation
      currentMessages.push({ role: "assistant", content: response.content });
      currentMessages.push({ role: "user", content: toolResults });
    } else {
      // Model is done — extract final text response
      const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === "text"
      );

      const finalStep: AgentStep = {
        stepNumber: step,
        type: "response",
        response: textBlock?.text ?? "",
      };
      steps.push(finalStep);
      config.onStep?.(finalStep);

      return { response: textBlock?.text ?? "", steps };
    }
  }

  return {
    response: "I was unable to complete the request within the allowed number of steps. Please try simplifying your request.",
    steps,
  };
}
```

---

## 3. Multi-Step Reasoning

For complex tasks, the agent needs to break the problem into steps.

### Planning Pattern

```typescript
// Give the agent explicit planning instructions
const PLANNING_PROMPT = `
When you receive a complex request:
1. First, create a plan by thinking through the steps needed.
2. Execute each step one at a time.
3. After each step, evaluate whether you need to adjust the plan.
4. When all steps are complete, provide a final summary.

Always think before acting. Never call multiple tools simultaneously unless they are truly independent.`;
```

### Structured Planning with Tool Calls

```typescript
// Define a "think" tool that forces the agent to plan
const planTool = tool({
  description: "Use this tool to think through a complex problem before taking action. Always use this before a multi-step task.",
  parameters: z.object({
    thought: z.string().describe("Your reasoning about what to do next"),
    plan: z.array(z.string()).describe("Ordered list of steps to take"),
  }),
  execute: async ({ thought, plan }) => {
    // This tool does not actually do anything — it just forces the agent to think
    return { acknowledged: true, stepsPlanned: plan.length };
  },
});
```

---

## 4. Error Recovery

Agents will encounter errors. Tools fail, data is missing, APIs are down. The agent needs to handle this gracefully.

```typescript
// Tool that handles its own errors and provides alternatives
const lookupUser = tool({
  description: "Look up a user by email or ID",
  parameters: z.object({
    identifier: z.string().describe("User email or ID"),
  }),
  execute: async ({ identifier }) => {
    try {
      // Try by ID first
      let user = await db.users.findUnique({ where: { id: identifier } });
      if (user) return { found: true, user };

      // Try by email
      user = await db.users.findUnique({ where: { email: identifier } });
      if (user) return { found: true, user };

      return {
        found: false,
        suggestion: "User not found. Ask the user to verify their email or account ID.",
      };
    } catch (error: any) {
      return {
        found: false,
        error: "Database temporarily unavailable. Try again in a moment.",
      };
    }
  },
});
```

### System Prompt for Error Handling

```typescript
const ERROR_HANDLING_INSTRUCTIONS = `
When a tool call returns an error:
1. Do NOT retry the exact same call immediately (it will likely fail again).
2. If the error suggests a different approach, try that.
3. If the tool is temporarily unavailable, inform the user and offer to create a support ticket.
4. Never make up data that a tool failed to return. Say you could not retrieve it.
5. After 2 failed attempts with the same tool, stop trying and explain the situation.`;
```

---

## 5. Human-in-the-Loop

For destructive or high-stakes actions, require user confirmation before executing.

### Confirmation Pattern

```typescript
// The agent asks for confirmation, then the user confirms in the next message
const CONFIRMATION_TOOLS = ["refundPayment", "deleteAccount", "cancelSubscription"];

// System prompt instruction
const CONFIRMATION_PROMPT = `
For the following actions, you MUST ask the user for explicit confirmation before executing:
- refundPayment: "I'll process a refund of $X for payment Y. Shall I proceed?"
- deleteAccount: "This will permanently delete your account and all data. Are you sure?"
- cancelSubscription: "This will cancel your subscription effective [date]. Confirm?"

Only proceed with these tools after the user explicitly says "yes", "confirm", "proceed", or similar.
Do NOT infer confirmation from the original request.`;
```

### Implementation with Tool Call Gating

```typescript
// Middleware that intercepts destructive tool calls
function gateDestructiveTools(toolCall: { name: string; input: any }): {
  execute: boolean;
  message?: string;
} {
  if (CONFIRMATION_TOOLS.includes(toolCall.name)) {
    return {
      execute: false,
      message: `This action requires confirmation. The agent wants to call ${toolCall.name} with: ${JSON.stringify(toolCall.input)}`,
    };
  }
  return { execute: true };
}
```

---

## 6. Agent Observability

Tracing agent behavior is critical for debugging and optimization.

### Custom Tracing

```typescript
// lib/ai/agent-tracing.ts

interface AgentTrace {
  traceId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  totalSteps: number;
  totalTokens: number;
  totalCostCents: number;
  steps: {
    stepNumber: number;
    type: "llm_call" | "tool_call" | "tool_result";
    duration: number;
    tokens?: number;
    toolName?: string;
    input?: any;
    output?: any;
    error?: string;
  }[];
  success: boolean;
}

class AgentTracer {
  private trace: AgentTrace;

  constructor(userId: string) {
    this.trace = {
      traceId: crypto.randomUUID(),
      userId,
      startTime: new Date(),
      totalSteps: 0,
      totalTokens: 0,
      totalCostCents: 0,
      steps: [],
      success: false,
    };
  }

  recordStep(step: AgentTrace["steps"][0]) {
    this.trace.steps.push(step);
    this.trace.totalSteps++;
    if (step.tokens) this.trace.totalTokens += step.tokens;
  }

  async finish(success: boolean): Promise<void> {
    this.trace.endTime = new Date();
    this.trace.success = success;

    // Store trace for debugging
    await db.agentTraces.create({ data: this.trace });

    // Emit metrics
    metrics.histogram("agent.steps", this.trace.totalSteps);
    metrics.histogram("agent.tokens", this.trace.totalTokens);
    metrics.histogram(
      "agent.duration_ms",
      this.trace.endTime.getTime() - this.trace.startTime.getTime()
    );
  }
}
```

### Integration with LangSmith

```typescript
// If using LangChain, LangSmith provides built-in tracing
import { Client } from "langsmith";

const langsmith = new Client({
  apiUrl: process.env.LANGSMITH_API_URL,
  apiKey: process.env.LANGSMITH_API_KEY,
});

// Traces are captured automatically when using LangChain agents
// View them at: https://smith.langchain.com
```

---

## 7. Agent Safety

### Preventing Infinite Loops

```typescript
const AGENT_SAFETY_CONFIG = {
  maxSteps: 10,              // Hard limit on agent steps
  maxTokenBudget: 50000,     // Total tokens across all steps
  maxDurationMs: 30000,      // 30 second timeout
  maxToolCallsPerTool: 3,    // Prevent calling same tool repeatedly
};

function checkSafetyLimits(
  steps: AgentStep[],
  startTime: number,
  totalTokens: number
): { safe: boolean; reason?: string } {
  if (steps.length >= AGENT_SAFETY_CONFIG.maxSteps) {
    return { safe: false, reason: "Maximum steps exceeded" };
  }

  if (totalTokens >= AGENT_SAFETY_CONFIG.maxTokenBudget) {
    return { safe: false, reason: "Token budget exceeded" };
  }

  if (Date.now() - startTime >= AGENT_SAFETY_CONFIG.maxDurationMs) {
    return { safe: false, reason: "Duration limit exceeded" };
  }

  // Check for tool call loops
  const toolCallCounts = new Map<string, number>();
  for (const step of steps) {
    if (step.type === "tool_call" && step.toolName) {
      const count = (toolCallCounts.get(step.toolName) ?? 0) + 1;
      if (count > AGENT_SAFETY_CONFIG.maxToolCallsPerTool) {
        return { safe: false, reason: `Tool ${step.toolName} called too many times` };
      }
      toolCallCounts.set(step.toolName, count);
    }
  }

  return { safe: true };
}
```

### Action Allowlists

Only allow tools appropriate for the current context and user role.

```typescript
// Filter available tools based on user role and context
function getToolsForUser(userRole: string): Record<string, any> {
  const ALL_TOOLS = {
    searchKnowledgeBase,
    lookupOrder,
    lookupUser,
    createSupportTicket,
    refundPayment,
    deleteAccount,
  };

  const ROLE_PERMISSIONS: Record<string, string[]> = {
    customer: ["searchKnowledgeBase", "lookupOrder", "createSupportTicket"],
    support_agent: ["searchKnowledgeBase", "lookupOrder", "lookupUser", "createSupportTicket", "refundPayment"],
    admin: Object.keys(ALL_TOOLS),
  };

  const allowed = ROLE_PERMISSIONS[userRole] ?? ROLE_PERMISSIONS.customer;

  return Object.fromEntries(
    Object.entries(ALL_TOOLS).filter(([name]) => allowed.includes(name))
  );
}
```

---

## 8. Multi-Agent Patterns

### Orchestrator / Worker

One agent coordinates, multiple specialized agents execute.

```typescript
// Orchestrator decides which specialist to invoke
const orchestrator = {
  system: `You are a routing agent. Based on the user's request, decide which specialist to invoke:
- billing_agent: For payment, refund, invoice questions
- technical_agent: For product bugs, API issues, integration help
- account_agent: For account settings, profile, security questions

Respond with the specialist name and a brief summary of the user's need.`,
  tools: {
    routeToSpecialist: tool({
      description: "Route the user to a specialist agent",
      parameters: z.object({
        specialist: z.enum(["billing_agent", "technical_agent", "account_agent"]),
        summary: z.string(),
      }),
      execute: async ({ specialist, summary }) => {
        // Invoke the specialist agent with the original conversation + summary
        return { routed: true, specialist };
      },
    }),
  },
};
```

### Reviewer Pattern

One agent generates, another reviews and provides feedback.

```typescript
async function generateWithReview(prompt: string): Promise<string> {
  // Step 1: Generator creates initial response
  const { text: draft } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: "You are a content writer. Generate high-quality content.",
    prompt,
  });

  // Step 2: Reviewer evaluates and suggests improvements
  const { object: review } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    system: "You are a content reviewer. Evaluate the draft critically.",
    schema: z.object({
      score: z.number().min(1).max(10),
      issues: z.array(z.string()),
      suggestion: z.string(),
    }),
    prompt: `Review this draft:\n\n${draft}\n\nOriginal request: ${prompt}`,
  });

  // Step 3: If score is low, regenerate with feedback
  if (review.score < 7) {
    const { text: revised } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: "You are a content writer. Revise based on the reviewer's feedback.",
      prompt: `Original request: ${prompt}\n\nYour draft:\n${draft}\n\nReviewer feedback:\n${review.issues.join("\n")}\n\nSuggestion: ${review.suggestion}\n\nPlease revise.`,
    });
    return revised;
  }

  return draft;
}
```

---

## Decision: Agent vs. Fixed Pipeline

| Indicator | Use Agent | Use Fixed Pipeline |
|-----------|-----------|-------------------|
| Number of possible workflows | Many (dynamic) | Few (predictable) |
| Steps depend on intermediate results | Yes | No |
| User input is ambiguous | Yes | No |
| Latency tolerance | 5-30 seconds | <2 seconds |
| Cost tolerance | Higher | Lower |
| Debugging difficulty tolerance | Higher | Lower |
| Need for deterministic behavior | No | Yes |

**Default recommendation:** Start with a fixed pipeline. Convert to an agent only when the fixed pipeline cannot handle the variety of user requests.
