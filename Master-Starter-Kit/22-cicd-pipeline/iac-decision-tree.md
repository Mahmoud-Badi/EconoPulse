# Infrastructure as Code Decision Tree

> Start manual, graduate to IaC when the pain of manual infrastructure exceeds the setup cost of automation. For most projects, that moment comes sooner than you think.

---

## When Do You Need IaC?

Answer these questions. If **any** are true, you need IaC:

```
Do you have more than 1 environment (e.g., staging + production)?
├── YES → You need IaC
│
Do you have more than 2 infrastructure services (DB + cache + queue + etc.)?
├── YES → You need IaC
│
Is your team larger than 1 person working on infrastructure?
├── YES → You need IaC (you need reproducibility and audit trails)
│
Do you use any cloud resources beyond a single PaaS deploy?
├── YES → You need IaC
│
Have you ever said "I don't remember how I configured that"?
├── YES → You need IaC
│
Are you deploying to a managed PaaS (Vercel, Railway, Render) with no custom cloud resources?
├── YES → You probably do NOT need IaC yet
│
Is this a prototype, hackathon, or throwaway project?
└── YES → Skip IaC entirely, move fast
```

---

## The Decision Tree

```
What is your infrastructure complexity?

Level 1: Single PaaS deploy (Vercel, Netlify, Railway)
└── Skip IaC. Use the platform's built-in configuration.
    Git push = deploy. Done.

Level 2: PaaS + a few managed services (database, Redis, S3)
└── Consider lightweight IaC (SST, Pulumi) or just document the manual steps.
    IaC is nice-to-have here, not required.

Level 3: Multiple cloud services, 2+ environments, team > 1
└── You need IaC. Choose between Terraform, Pulumi, SST, or CDK.
    The cost of not having IaC (drift, misconfiguration, "works on my machine")
    now exceeds the setup cost.

Level 4: Multi-cloud, complex networking, compliance requirements
└── You need Terraform or Pulumi. Full IaC with state management,
    modules, CI/CD for infrastructure changes.
```

---

## IaC Tool Comparison

### Terraform

| Attribute | Details |
|-----------|---------|
| **Language** | HCL (HashiCorp Configuration Language) |
| **Learning curve** | Medium (HCL is unique but readable) |
| **Provider ecosystem** | Massive (AWS, GCP, Azure, Cloudflare, Vercel, Datadog, PagerDuty, everything) |
| **State management** | Remote state with locking (S3 + DynamoDB, Terraform Cloud, etc.) |
| **Plan/Apply model** | `terraform plan` shows changes before applying |
| **Community** | Largest IaC community, most resources and examples |
| **License** | BSL (Business Source License) since 2023; OpenTofu is the open-source fork |

**When to use Terraform:**
- You are using multiple cloud providers
- You want the largest ecosystem of providers and modules
- Your team includes infrastructure engineers who will specialize in IaC
- You need to manage non-cloud resources (DNS, monitoring, PagerDuty, etc.)
- You want the most job-market-relevant IaC skill

**When NOT to use Terraform:**
- You only deploy to a single PaaS (overkill)
- Your team is purely frontend/full-stack with no infrastructure experience
- You are all-in on AWS and prefer TypeScript over HCL

**Example: Terraform for a typical web app**

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "my-app-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}

resource "aws_ecs_cluster" "main" {
  name = "my-app-cluster"
}

resource "aws_rds_instance" "db" {
  identifier     = "my-app-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t4g.micro"
  # ...
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "my-app-redis"
  engine          = "redis"
  node_type       = "cache.t4g.micro"
  num_cache_nodes = 1
}
```

---

### Pulumi

| Attribute | Details |
|-----------|---------|
| **Language** | TypeScript, Python, Go, C#, Java, YAML |
| **Learning curve** | Low-Medium (use languages you already know) |
| **Provider ecosystem** | Large (uses Terraform providers via bridge + native providers) |
| **State management** | Pulumi Cloud (free tier) or self-managed (S3, Azure Blob, GCS) |
| **Plan/Apply model** | `pulumi preview` shows changes before applying |
| **Community** | Growing fast, strong TypeScript community |
| **License** | Apache 2.0 (open source) |

**When to use Pulumi:**
- Your team writes TypeScript/Python and does not want to learn HCL
- You want type-safe infrastructure definitions with IDE autocomplete
- You need complex logic in your infrastructure code (loops, conditionals, abstractions)
- You are building a platform or reusable infrastructure components

**When NOT to use Pulumi:**
- Your team already knows Terraform and has existing Terraform code
- You want the largest community and most examples (Terraform still wins here)
- You need a tool that every DevOps hire already knows

**Example: Pulumi TypeScript for a typical web app**

```typescript
// index.ts
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const environment = config.require("environment");

const cluster = new aws.ecs.Cluster("app-cluster", {
  name: `my-app-${environment}`,
});

const db = new aws.rds.Instance("app-db", {
  identifier: `my-app-db-${environment}`,
  engine: "postgres",
  engineVersion: "16",
  instanceClass: "db.t4g.micro",
});

const redis = new aws.elasticache.Cluster("app-redis", {
  clusterId: `my-app-redis-${environment}`,
  engine: "redis",
  nodeType: "cache.t4g.micro",
  numCacheNodes: 1,
});

export const dbEndpoint = db.endpoint;
export const redisEndpoint = redis.cacheNodes[0].address;
```

---

### SST (Serverless Stack)

| Attribute | Details |
|-----------|---------|
| **Language** | TypeScript |
| **Learning curve** | Low (especially for serverless/Next.js developers) |
| **Provider ecosystem** | AWS-focused (with Cloudflare, coming to more) |
| **State management** | Managed by SST (uses Pulumi under the hood) |
| **Local dev** | `sst dev` provides live Lambda debugging |
| **Community** | Active Discord, strong in serverless community |
| **License** | MIT (open source) |

**When to use SST:**
- You are building serverless applications on AWS
- You are deploying Next.js, Remix, Astro, or SvelteKit to AWS
- You want the simplest possible path from TypeScript app to deployed infrastructure
- You want live local development with real AWS services

**When NOT to use SST:**
- You are not on AWS (SST is AWS-first)
- You are running containers (ECS, EKS) -- SST is serverless-focused
- You need multi-cloud support
- You have complex networking or VPC requirements

**Example: SST for a Next.js app**

```typescript
// sst.config.ts
export default $config({
  app(input) {
    return {
      name: "my-app",
      removal: input.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("uploads");
    const database = new sst.aws.Postgres("db", {
      scaling: { min: "0.5 ACU", max: "2 ACU" },
    });

    new sst.aws.Nextjs("web", {
      link: [bucket, database],
      domain: {
        name: "my-app.com",
        redirects: ["www.my-app.com"],
      },
    });
  },
});
```

---

### AWS CDK (Cloud Development Kit)

| Attribute | Details |
|-----------|---------|
| **Language** | TypeScript, Python, Java, C#, Go |
| **Learning curve** | Medium-High (need to understand CloudFormation concepts) |
| **Provider ecosystem** | AWS only |
| **State management** | CloudFormation stacks (managed by AWS) |
| **Constructs** | L1 (raw CloudFormation), L2 (opinionated defaults), L3 (patterns) |
| **Community** | Large AWS community, many construct libraries |
| **License** | Apache 2.0 |

**When to use CDK:**
- You are 100% on AWS and plan to stay there
- Your team has AWS expertise and understands CloudFormation
- You want L3 constructs that handle best practices automatically
- You need deep integration with AWS services

**When NOT to use CDK:**
- You might use other cloud providers (CDK is AWS-only)
- You want simpler syntax (CDK can be verbose)
- You need fast iteration (CloudFormation deploys are slower than Terraform)
- Your team does not understand CloudFormation (CDK abstracts it but does not eliminate it)

**Example: CDK for a typical web app**

```typescript
// lib/app-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'AppCluster');

    const db = new rds.DatabaseInstance(this, 'AppDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO
      ),
    });
  }
}
```

---

### Manual (No IaC)

| Attribute | Details |
|-----------|---------|
| **Language** | Click buttons in a web console |
| **Learning curve** | Low (initially), High (when things break) |
| **Reproducibility** | None |
| **Audit trail** | None (unless you screenshot everything) |
| **Drift detection** | None (you will not know until something breaks) |

**When manual is acceptable:**
- Single Vercel/Netlify deploy (the platform IS your IaC)
- Prototype or hackathon project (< 1 week lifespan)
- Learning/experimenting with a new cloud service
- Solo project with a single environment

**When manual is NOT acceptable:**
- Production workloads with SLA expectations
- Team > 1 person (how do you share "click here, then here"?)
- Multiple environments (staging + production)
- Regulated industries (you need audit trails)
- Anything that would take > 30 minutes to recreate manually

---

## Comparison Table

| Feature | Terraform | Pulumi | SST | CDK | Manual |
|---------|-----------|--------|-----|-----|--------|
| **Language** | HCL | TS/Py/Go/C# | TypeScript | TS/Py/Java/C# | N/A |
| **Multi-cloud** | Yes (best) | Yes (good) | AWS (+ Cloudflare) | AWS only | N/A |
| **Learning curve** | Medium | Low-Medium | Low | Medium-High | None |
| **Community size** | Largest | Growing | Niche (serverless) | Large (AWS) | N/A |
| **Job market** | Most demanded | Growing demand | Niche | AWS shops | N/A |
| **Type safety** | Limited (HCL) | Full | Full | Full | N/A |
| **Local dev** | No | No | Yes (`sst dev`) | No | N/A |
| **State management** | Self/Cloud | Self/Cloud | Managed | AWS-managed | N/A |
| **Deploy speed** | Fast | Fast | Medium | Slow (CloudFormation) | N/A |
| **Drift detection** | Built-in | Built-in | Via Pulumi | Via CloudFormation | None |
| **Cost** | Free / Paid Cloud | Free / Paid Cloud | Free | Free | Free |
| **Maturity** | Very mature | Mature | Maturing | Mature | N/A |

---

## State Management Patterns

If you choose Terraform or Pulumi, you must manage state. State is a record of what infrastructure exists so the tool knows what to create, update, or delete.

### Remote State (Required for Teams)

Never store state locally. Always use remote state with locking.

**Terraform Remote State (AWS):**

```hcl
terraform {
  backend "s3" {
    bucket         = "my-app-terraform-state"
    key            = "environments/production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
```

**Pulumi Remote State:**

```bash
# Option 1: Pulumi Cloud (recommended, free tier)
pulumi login

# Option 2: Self-managed S3 backend
pulumi login s3://my-app-pulumi-state
```

### State Locking

State locking prevents two people from modifying infrastructure simultaneously.

| Tool | Locking Mechanism |
|------|-------------------|
| Terraform (S3) | DynamoDB table |
| Terraform Cloud | Built-in |
| Pulumi Cloud | Built-in |
| Pulumi (S3) | Not built-in (use CI concurrency controls) |
| CDK | CloudFormation handles it |

### State File Security

- State files contain sensitive information (database passwords, API keys)
- Encrypt state at rest (S3 bucket encryption, Pulumi Cloud encryption)
- Restrict access to state storage (IAM policies, bucket policies)
- Never commit state files to git (add `*.tfstate` to `.gitignore`)
- Audit who accesses state files (S3 access logging, Pulumi Cloud audit log)

---

## IaC in Your CI/CD Pipeline

Infrastructure changes should go through the same review process as application code.

### Terraform CI/CD Workflow

```yaml
# On PR: terraform plan (show what would change)
- name: Terraform Plan
  run: |
    terraform init
    terraform plan -out=tfplan
    # Post plan output as PR comment

# On merge to main: terraform apply (execute changes)
- name: Terraform Apply
  run: |
    terraform init
    terraform apply -auto-approve tfplan
```

### Pulumi CI/CD Workflow

```yaml
# On PR: pulumi preview
- name: Pulumi Preview
  run: pulumi preview --stack production

# On merge to main: pulumi up
- name: Pulumi Deploy
  run: pulumi up --stack production --yes
```

### Safety Rules for IaC in CI/CD

1. **Always run plan/preview on PRs.** Never apply without reviewing changes.
2. **Require approval for destructive changes.** Deleting a database should not be automatic.
3. **Use separate state per environment.** Never share state between staging and production.
4. **Lock down the apply step.** Only the CI/CD pipeline should apply changes to production.
5. **Tag all resources.** Every resource should have `environment`, `project`, and `managed-by` tags.

---

## Graduation Path

```
Stage 1: Manual (prototype, learning)
    "I clicked buttons in the AWS console and it works."
    ↓
    Pain: "I cannot remember how I set up staging."
    ↓
Stage 2: Documented Manual
    "I wrote a README with step-by-step instructions."
    ↓
    Pain: "The README is outdated and half the steps are wrong."
    ↓
Stage 3: Scripted
    "I wrote bash scripts to create resources."
    ↓
    Pain: "Scripts are not idempotent and fail on re-run."
    ↓
Stage 4: IaC
    "I use Terraform/Pulumi and infrastructure is version-controlled."
    ↓
    Result: Reproducible, auditable, reviewable infrastructure.
```

Most projects should jump from Stage 1 directly to Stage 4 once they have a production environment. Stages 2 and 3 are traps that feel productive but create maintenance burdens.

---

## Recommendation Summary

| Situation | Recommendation |
|-----------|----------------|
| **Deploying to Vercel/Netlify only** | Skip IaC. The platform handles it. |
| **AWS serverless (Lambda, DynamoDB)** | SST (simplest path) |
| **AWS containers (ECS, Fargate)** | Pulumi or CDK |
| **Multi-cloud or non-AWS** | Terraform |
| **Team already knows Terraform** | Terraform (do not switch) |
| **TypeScript team, no IaC experience** | Pulumi (lowest learning curve) |
| **Enterprise, compliance, audit** | Terraform (most mature, most tooling) |
| **Just starting out, unsure** | Start manual, adopt Terraform or Pulumi when it hurts |
