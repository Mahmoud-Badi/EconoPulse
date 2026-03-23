# NestJS Backend Gotchas

NestJS provides excellent structure for enterprise backends, but its decorator-driven DI system and opinionated module architecture create pitfalls that produce silent bugs — especially in multi-tenant SaaS applications with Prisma.

---

## 1. Circular Dependency Injection

**Problem:** Two modules depend on each other, causing NestJS to throw `undefined` or "Cannot read property" errors at runtime — not at compile time.

**Why It Happens:** Module A imports Module B, and Module B imports Module A. NestJS resolves dependencies sequentially and cannot satisfy both at once.

```typescript
// WRONG — circular dependency, runtime crash
@Module({
  imports: [UsersModule],
  providers: [OrdersService],
})
export class OrdersModule {}

@Module({
  imports: [OrdersModule],  // Circular!
  providers: [UsersService],
})
export class UsersModule {}
```

```typescript
// RIGHT — use forwardRef to break the cycle
@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [OrdersService],
})
export class OrdersModule {}

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [UsersService],
})
export class UsersModule {}

// ALSO RIGHT — extract shared logic into a third module
@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
```

**Prevention:** Run `madge --circular src/` in CI. Prefer extracting shared logic into a dedicated module over using `forwardRef`. If you need `forwardRef`, document why.

---

## 2. Guard Execution Order

**Problem:** A route-level guard runs but the expected user context is missing because the global auth guard has not run yet — or so you think.

**Why It Happens:** Guards execute in order: Global → Controller → Route. If you register a guard at the controller level expecting data set by a global guard, that works. But if you register a global guard AFTER another global guard that depends on it, order is not guaranteed.

```typescript
// WRONG — assuming guard order without explicit binding
app.useGlobalGuards(new RolesGuard());      // Needs user context
app.useGlobalGuards(new JwtAuthGuard());    // Sets user context — too late!

// RIGHT — order matters, auth first
app.useGlobalGuards(
  new JwtAuthGuard(),     // 1. Sets req.user
  new TenantGuard(),      // 2. Sets req.tenantId (needs req.user)
  new RolesGuard(),       // 3. Checks roles (needs req.user)
);
```

**Prevention:** Document your guard chain in a comment at the `useGlobalGuards` call site. Test guard order with integration tests that verify the full request lifecycle.

---

## 3. DTO Validation Not Running

**Problem:** Invalid request bodies pass through to your service layer without any validation errors. The `@IsString()`, `@IsNotEmpty()` decorators are ignored.

**Why It Happens:** `class-validator` decorators do nothing unless a `ValidationPipe` is registered globally or on the route.

```typescript
// WRONG — decorators exist but never execute
// create-load.dto.ts
export class CreateLoadDto {
  @IsString()
  @IsNotEmpty()
  origin: string;  // Accepts undefined, null, numbers — anything
}

// RIGHT — register ValidationPipe globally in main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw on unexpected properties
    transform: true,            // Auto-transform payloads to DTO instances
  }));
  await app.listen(3000);
}
```

**Prevention:** Add an integration test that sends an invalid body and asserts a 400 response. If it returns 200, your pipe is missing. Include `whitelist: true` to prevent mass-assignment attacks.

---

## 4. Prisma Connection Pool Exhaustion

**Problem:** Under moderate load, requests start timing out with "Timed out fetching a new connection from the connection pool" errors.

**Why It Happens:** Prisma's default connection pool size is 5 (based on `num_cpus * 2 + 1`). In a multi-tenant app with concurrent requests, 5 connections run out fast.

```typescript
// WRONG — default connection string, pool size = 5
DATABASE_URL="postgresql://user:pass@localhost:5432/tms"

// RIGHT — explicit pool sizing based on workload
DATABASE_URL="postgresql://user:pass@localhost:5432/tms?connection_limit=20&pool_timeout=30"

// RIGHT — also configure in PrismaService
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Prevention:** Set `connection_limit` to match your expected concurrent request count. Monitor pool usage with Prisma metrics. Set `pool_timeout` to a value shorter than your HTTP timeout so you get a clear error instead of a generic timeout.

---

## 5. Multi-Tenant WHERE Clause Forgotten

**Problem:** An endpoint returns data belonging to other tenants. This is a data breach.

**Why It Happens:** A developer writes a query and forgets to add `tenantId` to the WHERE clause. Every single query in a multi-tenant app needs tenant filtering — and humans forget.

```typescript
// WRONG — no tenant filtering, returns ALL loads across ALL tenants
async findAll() {
  return this.prisma.load.findMany({
    where: { status: 'ACTIVE' },
  });
}

// RIGHT — always include tenantId from request context
async findAll(tenantId: string) {
  return this.prisma.load.findMany({
    where: {
      tenantId,           // NEVER forget this
      status: 'ACTIVE',
    },
  });
}

// BEST — use Prisma Client Extension to enforce automatically
const prismaWithTenant = prisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where, tenantId: getCurrentTenantId() };
        return query(args);
      },
    },
  },
});
```

**Prevention:** Use a Prisma Client Extension or middleware that injects `tenantId` into every query automatically. Never rely on developers remembering. Add integration tests that verify tenant isolation.

---

## 6. Soft Delete Not Filtered

**Problem:** Queries return records that were "deleted" by users. Deleted carriers show up in dropdowns, deleted loads appear in reports.

**Why It Happens:** Soft delete sets `deletedAt` to a timestamp but does not physically remove the row. Every query must filter `deletedAt: null` — and developers forget, just like with tenantId.

```typescript
// WRONG — returns soft-deleted records
async findAll(tenantId: string) {
  return this.prisma.carrier.findMany({
    where: { tenantId },
  });
}

// RIGHT — explicit soft delete filter
async findAll(tenantId: string) {
  return this.prisma.carrier.findMany({
    where: {
      tenantId,
      deletedAt: null,    // Exclude soft-deleted records
    },
  });
}

// BEST — Prisma middleware that auto-filters
prisma.$use(async (params, next) => {
  if (params.action === 'findMany' || params.action === 'findFirst') {
    if (params.args.where === undefined) {
      params.args.where = { deletedAt: null };
    } else {
      params.args.where.deletedAt = params.args.where.deletedAt ?? null;
    }
  }
  return next(params);
});
```

**Prevention:** Use Prisma middleware or Client Extensions to auto-filter `deletedAt: null`. Create a `findAllIncludingDeleted` method for admin use cases where you explicitly want deleted records.

---

## 7. Response Envelope Inconsistency

**Problem:** Frontend code breaks because some endpoints return `{ data: [...] }` while others return raw arrays. The frontend guesses wrong.

**Why It Happens:** No enforced standard. Each developer returns whatever shape feels right. Over time, the API becomes an inconsistent mess.

```typescript
// WRONG — inconsistent response shapes
@Get('loads')
async findLoads() {
  return this.loadService.findAll(); // Returns raw array
}

@Get('carriers')
async findCarriers() {
  return { data: await this.carrierService.findAll() }; // Returns envelope
}

// RIGHT — interceptor enforces consistent envelope
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Already wrapped (pagination responses)
        if (data && data.data !== undefined && data.pagination !== undefined) {
          return data;
        }
        // Wrap in standard envelope
        return { data };
      }),
    );
  }
}

// Register globally
app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
```

**Prevention:** Use a global interceptor. Define the envelope type once. Frontend always does `response.data.data` — no guessing.

---

## 8. JWT Token in localStorage

**Problem:** XSS attack steals the JWT token from localStorage, granting full API access to the attacker.

**Why It Happens:** localStorage is accessible to any JavaScript running on the page. If an XSS vulnerability exists anywhere in the app (or in any third-party script), the token is compromised.

```typescript
// WRONG — token in localStorage (XSS vulnerable)
// Frontend
localStorage.setItem('token', response.data.token);
// API call
headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

// RIGHT — httpOnly cookie (not accessible via JavaScript)
// Backend: set cookie on login
@Post('auth/login')
async login(@Res() res: Response) {
  const token = await this.authService.generateToken(user);
  res.cookie('access_token', token, {
    httpOnly: true,       // Not accessible via document.cookie
    secure: true,         // HTTPS only
    sameSite: 'strict',   // CSRF protection
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });
  return res.json({ data: { user } }); // Do NOT return the token
}

// Backend: read cookie in guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;
    // ... validate token
  }
}
```

**Prevention:** Never store tokens in localStorage or sessionStorage. Use httpOnly cookies with `secure` and `sameSite` flags. Add refresh token rotation for long-lived sessions.

---

## 9. Missing @UseGuards on New Endpoints

**Problem:** A new endpoint is publicly accessible without authentication. Anyone can call it.

**Why It Happens:** Developer adds a new route handler but forgets to add `@UseGuards(JwtAuthGuard)`. If guards are not global, every single endpoint needs the decorator.

```typescript
// WRONG — endpoint is public, no guard
@Controller('loads')
export class LoadsController {
  @Get(':id/documents')
  async getDocuments(@Param('id') id: string) {
    return this.loadService.getDocuments(id); // Anyone can access!
  }
}

// RIGHT — use global guard + @Public() decorator for exceptions
// app.module.ts
@Module({
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}

// auth/public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// Only health check is public
@Public()
@Get('health')
async healthCheck() { return { status: 'ok' }; }
```

**Prevention:** Register `JwtAuthGuard` as `APP_GUARD` (global). New endpoints are protected by default. Use `@Public()` to explicitly opt out. This is the secure-by-default pattern.

---

## 10. Swagger/OpenAPI Not Reflecting Actual Response Shape

**Problem:** The Swagger docs show a different response shape than what the API actually returns. Frontend developers build against wrong types.

**Why It Happens:** Swagger decorators describe the DTO, but an interceptor wraps the response in an envelope. Swagger does not know about the interceptor.

```typescript
// WRONG — Swagger says response is LoadDto, but it is actually { data: LoadDto }
@ApiResponse({ type: LoadDto })
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.loadService.findOne(id);
  // Interceptor wraps this as { data: LoadDto }
  // Swagger shows LoadDto (no wrapper)
}

// RIGHT — create envelope wrapper types
export class ApiEnvelope<T> {
  data: T;
}

// Use @ApiExtraModels + @ApiResponse with schema
@ApiExtraModels(LoadDto)
@ApiResponse({
  schema: {
    properties: {
      data: { $ref: getSchemaPath(LoadDto) },
    },
  },
})
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.loadService.findOne(id);
}

// BEST — create a custom decorator that handles both
export function ApiEnvelopeResponse(dto: Type<any>) {
  return applyDecorators(
    ApiExtraModels(dto),
    ApiResponse({
      schema: {
        properties: {
          data: { $ref: getSchemaPath(dto) },
        },
      },
    }),
  );
}
```

**Prevention:** Build a custom `@ApiEnvelopeResponse()` decorator that wraps the DTO type in the envelope schema. Use it everywhere instead of raw `@ApiResponse()`.

---

## 11. Error Handling Inconsistency

**Problem:** Some errors come back as `{ statusCode: 400, message: "..." }` (NestJS default), others as `{ error: "...", details: [...] }` (custom), and others as plain strings.

**Why It Happens:** Some developers throw `HttpException`, others return error objects, others throw raw errors that the default exception filter catches differently.

```typescript
// WRONG — mixed error patterns
// Pattern 1: HttpException (NestJS default format)
throw new BadRequestException('Invalid load');

// Pattern 2: Custom object (breaks frontend error parsing)
return { error: 'Invalid load', code: 'INVALID_LOAD' };

// Pattern 3: Unhandled error (becomes generic 500)
throw new Error('Something went wrong');

// RIGHT — global exception filter with consistent format
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
      code = (res as any).code || `HTTP_${status}`;
    }

    response.status(status).json({
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
```

**Prevention:** Register a global exception filter. Define error codes as an enum. Frontend has one error shape to parse. Log the full error server-side but return a safe message to the client.

---

## 12. Module Import Order Matters

**Problem:** A provider that depends on another module's export is `undefined` at injection time, even though both modules are in the imports array.

**Why It Happens:** NestJS resolves modules in the order they appear in the `imports` array. If Module A depends on Module B's export, Module B must be imported first (or use `forwardRef`).

```typescript
// WRONG — ConfigModule not yet resolved when PrismaModule initializes
@Module({
  imports: [
    PrismaModule,        // Uses ConfigService — but ConfigModule is not loaded yet
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}

// RIGHT — dependencies first
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // First: makes ConfigService available
    PrismaModule,                               // Second: can now inject ConfigService
    AuthModule,                                  // Third: depends on PrismaModule
  ],
})
export class AppModule {}
```

**Prevention:** Order imports by dependency level: Config → Database → Auth → Feature modules. Use `isGlobal: true` for truly shared modules like `ConfigModule`. Document the expected import order in a comment.

---

## 13. Testing with Real Database vs Mocks

**Problem:** Unit tests use mocks that do not match real Prisma behavior. Tests pass, but the feature is broken in production because the mock returns a different shape than the real query.

**Why It Happens:** Prisma queries have nuanced behaviors (include/select shaping, relation loading, implicit filtering) that mocks do not replicate.

```typescript
// WRONG — mock returns flat object, but Prisma returns nested relations
const mockPrisma = {
  load: {
    findUnique: jest.fn().mockResolvedValue({
      id: '1',
      carrierId: 'c1',
      carrierName: 'ACME',  // This field does not exist — it is on the relation
    }),
  },
};

// RIGHT — use appropriate testing strategy per test type
// Unit tests: mock Prisma but match real shapes
const mockPrisma = {
  load: {
    findUnique: jest.fn().mockResolvedValue({
      id: '1',
      carrierId: 'c1',
      carrier: { id: 'c1', name: 'ACME' },  // Matches include: { carrier: true }
    }),
  },
};

// Integration tests: use real database with test container
describe('LoadService (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } },
    });
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.load.deleteMany(); // Clean slate per test
  });
});
```

**Prevention:** Unit tests for business logic (mocked Prisma). Integration tests for queries and data access (real database). Run integration tests in CI with a test database container.

---

## 14. Environment Variable Validation Missing

**Problem:** The app starts successfully but crashes at runtime when it tries to use an undefined environment variable. Or worse — it silently uses `undefined` as a value.

**Why It Happens:** No validation at startup. `process.env.STRIPE_SECRET_KEY` is `undefined` but nothing checks until the first Stripe API call, which might be hours later.

```typescript
// WRONG — trusting that env vars exist
@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Could be undefined!
}

// RIGHT — validate at startup with @nestjs/config + Joi or class-validator
// config/env.validation.ts
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  REDIS_URL: Joi.string().uri().required(),
  S3_BUCKET: Joi.string().required(),
});

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true }, // Fail fast on first missing var
    }),
  ],
})
export class AppModule {}
```

**Prevention:** Use `ConfigModule.forRoot()` with a Joi schema. The app refuses to start if any required variable is missing. Fail at startup, not at runtime.

---

## 15. Rate Limiting Not Applied to Expensive Endpoints

**Problem:** A single user (or bot) hammers an expensive endpoint (report generation, bulk export, AI inference) and brings the server to its knees.

**Why It Happens:** Rate limiting is either not set up at all, or it is set too high, or it is only on auth endpoints (login) and not on compute-heavy routes.

```typescript
// WRONG — no rate limiting on expensive report endpoint
@Get('reports/financial')
async generateFinancialReport(@Query() query: ReportQueryDto) {
  return this.reportService.generate(query); // 30-second query, no limits
}

// RIGHT — per-endpoint rate limiting with @nestjs/throttler
import { Throttle, ThrottlerModule } from '@nestjs/throttler';

// app.module.ts — default rate limit
ThrottlerModule.forRoot([{
  ttl: 60000,    // 1 minute window
  limit: 100,    // 100 requests per minute (general)
}]),

// Expensive endpoint — stricter limit
@Throttle([{ default: { ttl: 60000, limit: 5 } }])  // 5 per minute
@Get('reports/financial')
async generateFinancialReport(@Query() query: ReportQueryDto) {
  return this.reportService.generate(query);
}

// Auth endpoint — prevent brute force
@Throttle([{ default: { ttl: 60000, limit: 10 } }]) // 10 per minute
@Post('auth/login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

**Prevention:** Apply global rate limiting with `ThrottlerModule`. Override with stricter limits on expensive endpoints using `@Throttle()`. Use per-tenant rate limiting in multi-tenant apps (see multi-tenant gotchas).

---

## 16. Prisma Middleware vs Client Extensions Confusion

**Problem:** You add a Prisma middleware for audit logging, but it does not fire for some operations, or it fires twice, or the new Client Extensions API conflicts with it.

**Why It Happens:** Prisma middleware (`$use`) is legacy. Client Extensions (`$extends`) are the recommended approach in Prisma 4.16+. Mixing them causes unpredictable behavior.

```typescript
// WRONG — mixing middleware and extensions
prisma.$use(async (params, next) => {
  // Old middleware approach
  console.log(`Query: ${params.model}.${params.action}`);
  return next(params);
});

const extendedPrisma = prisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        // Extension approach — may not see middleware changes
        return query(args);
      },
    },
  },
});

// RIGHT — use Client Extensions exclusively (Prisma 4.16+)
const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const start = Date.now();
        const result = await query(args);
        const duration = Date.now() - start;
        if (duration > 1000) {
          console.warn(`Slow query: ${model}.${operation} took ${duration}ms`);
        }
        return result;
      },
    },
  },
});
```

**Prevention:** Use Client Extensions for all cross-cutting concerns (audit logging, tenant filtering, soft delete, query timing). Do not use `$use` middleware in new code. Migrate existing middleware to extensions.

---

## 17. Transaction Isolation Level Ignored

**Problem:** Concurrent requests create duplicate records or read uncommitted data because the default transaction isolation level is too permissive.

**Why It Happens:** PostgreSQL defaults to "Read Committed" which is fine for most queries but not for read-then-write patterns where two requests could read the same state and both write.

```typescript
// WRONG — race condition: two requests assign the same load number
async assignLoadNumber(tenantId: string): Promise<string> {
  const latest = await this.prisma.load.findFirst({
    where: { tenantId },
    orderBy: { loadNumber: 'desc' },
  });
  const next = (parseInt(latest?.loadNumber || '0') + 1).toString();
  return this.prisma.load.create({
    data: { tenantId, loadNumber: next }, // Both requests get the same number!
  });
}

// RIGHT — use serializable transaction for read-then-write
async assignLoadNumber(tenantId: string): Promise<string> {
  return this.prisma.$transaction(async (tx) => {
    const latest = await tx.load.findFirst({
      where: { tenantId },
      orderBy: { loadNumber: 'desc' },
    });
    const next = (parseInt(latest?.loadNumber || '0') + 1).toString();
    return tx.load.create({
      data: { tenantId, loadNumber: next },
    });
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  });
}
```

**Prevention:** Use explicit transactions with appropriate isolation levels for any read-then-write operation. Use database sequences or `SERIAL` columns for auto-incrementing values instead of application-level counting.
