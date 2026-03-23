# AI Slop Detection Reference

> Read this before generating any UI code. Apply every checklist item.
> If a design fails any signal check, fix it before writing code.

---

## What Is AI Slop?

AI-generated UI that looks like every other AI-generated UI. Generic layouts, stock patterns, and vague design language that signals "nobody made real decisions here." Users can feel it. Designers spot it instantly. It erodes trust.

The antidote: **specificity**. Every visual decision must be traceable to a reason — the product's identity, the user's context, or a deliberate constraint.

---

## AI Slop Signal Checklist

Check every UI component against these signals. If it matches, it's slop — rewrite it.

### Layout Signals

| Signal | What It Looks Like | Fix |
| --- | --- | --- |
| **Generic card grid** | 3-4 equal cards in a row, each with icon + title + description | What differentiates these cards from every SaaS template? Name the specific visual treatment, hierarchy, and interaction. |
| **Stock hero section** | Full-width gradient blob, centered headline, subtitle, CTA button | What makes this hero feel like THIS product? Use product-specific imagery, a real user scenario, or a functional preview instead of decorative gradients. |
| **3-column feature layout** | Three columns with icons explaining features | Why three? What visual rhythm serves the content? Consider asymmetric layouts, progressive disclosure, or feature demos instead. |
| **Dashboard widget grid** | Equal-sized metric cards in a grid | What does the user need FIRST? Design for information hierarchy, not visual symmetry. Lead with the most actionable metric. |
| **Centered everything** | Every section centered, no visual tension | Centering is the absence of a layout decision. Use alignment to create reading flow and visual hierarchy. |

### Visual Signals

| Signal | What It Looks Like | Fix |
| --- | --- | --- |
| **Purposeless glassmorphism** | Frosted glass effects on every card/panel | Glass effects imply layering and depth. Only use them where spatial metaphor matters (overlays, floating panels). Otherwise, use solid surfaces. |
| **Gradient abuse** | Gradients on backgrounds, buttons, text, cards — everywhere | Reserve gradients for one hero moment. Use solid colors and whitespace for everything else. |
| **Generic illustrations** | Abstract blob people, undraw-style illustrations | Use product screenshots, real data visualizations, or typography-driven layouts instead. |
| **Icon overload** | Every list item and card starts with a colored icon | Icons are for scannability at speed. If the user reads the text anyway, the icon adds noise, not signal. |
| **Rainbow accent soup** | Multiple bright accent colors competing for attention | One accent color. One. Use shade variations and neutral tones for hierarchy. |

### Language Signals

| Signal | What It Looks Like | Fix |
| --- | --- | --- |
| **"Clean, modern UI"** | Used in design brief or comments | This is not a design decision. Name the font, spacing scale, color palette, and interaction pattern. |
| **"Beautiful and intuitive"** | Vague aspirational language | Beautiful to whom? Intuitive for what task? Replace with specific usability goals. |
| **"Sleek dashboard"** | No specifics about information hierarchy | What data matters most? What action follows? Design the flow, not the adjective. |
| **"Responsive design"** | Listed as a feature, not specified | "Responsive" means intentional layout decisions per viewport. Specify what changes at each breakpoint and why. |

---

## Interaction State Coverage

Every UI feature must specify ALL states. Empty states are features, not afterthoughts.

```
FEATURE              | LOADING        | EMPTY              | ERROR            | SUCCESS        | PARTIAL
---------------------|----------------|--------------------|-----------------|--------------|---------
[each UI feature]    | What user sees | Warmth + action    | What went wrong  | Confirmation  | Mixed state
                     | skeleton/spin  | + context + CTA    | + recovery path  | + next step   | handling
```

### Empty State Requirements

Never ship "No items found." as an empty state. Every empty state needs:

1. **Warmth** — acknowledge the user's situation without blame
2. **Primary action** — the one thing they should do next
3. **Context** — why it's empty and what it will look like when populated

**Bad:** "No projects found."
**Good:** "You haven't created any projects yet. Start with a template or build from scratch — either way, you'll see your projects here."

---

## Cognitive Design Patterns

These aren't a checklist — they're how to see. Apply them instinctively when reviewing any UI decision.

1. **See the system, not the screen** — Never evaluate a screen in isolation. What comes before? After? What happens when it breaks?

2. **Empathy as simulation** — Run mental simulations: bad network, one hand free, first time vs 1000th time, boss watching over shoulder, colorblind user, screen reader.

3. **Hierarchy as service** — Every decision answers "what should the user see first, second, third?" Respect their time. Don't prettify pixels — serve attention.

4. **Constraint worship** — Limitations force clarity. "If I can only show 3 things, which 3 matter most?" Constraints are gifts.

5. **The question reflex** — First instinct is questions, not opinions. "Who is this for? What did they try before this? What are they trying to do next?"

6. **Edge case paranoia** — What if the name is 47 characters? Zero results? Network fails mid-action? RTL language? Screen reader? Touch target too small?

7. **The "would I notice?" test** — Invisible design is perfect design. The highest compliment is the user not noticing the design at all.

8. **Principled taste** — "This feels wrong" must be traceable to a broken principle. Taste is debuggable, not subjective. If you can't name the principle, dig deeper.

9. **Subtraction default** — "As little design as possible" (Rams). Before adding an element, ask: does this earn its pixels? If removing it breaks nothing, remove it.

10. **Time-horizon design** — Design for three timescales simultaneously:
    - **5 seconds** (visceral) — first impression, does it feel right?
    - **5 minutes** (behavioral) — can they accomplish their task?
    - **5 years** (reflective) — would they recommend this to someone?

11. **Design for trust** — Every design decision either builds or erodes trust. Pixel-level intentionality about safety, identity, and reliability.

12. **Storyboard the journey** — Before touching code, storyboard the emotional arc: every moment is a scene with a mood, not just a screen with a layout.

---

## The Two-Question Gate

Before finalizing any UI component, answer both:

**1. "Would a designer ship this?"**
Not "does it work" — does it demonstrate intentional visual decisions? Would someone who cares about craft sign off on this?

**2. "Would a user notice it's AI-generated?"**
If a user looked at this and thought "this looks like every ChatGPT-generated landing page," it fails. Specificity is the antidote to slop.

If either answer is wrong, iterate before shipping.

---

## Applying This Reference

When generating UI code:

1. **Before coding:** Run the slop signal checklist against the design brief. Flag and fix any matches.
2. **During coding:** Apply interaction state coverage to every component. No component ships without all 5 states specified.
3. **After coding:** Run the two-question gate. If it fails, iterate.

This reference supplements — not replaces — the `frontend-design` skill. Use both together.
