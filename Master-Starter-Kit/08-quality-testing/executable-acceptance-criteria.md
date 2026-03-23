# Executable Acceptance Criteria

Every acceptance criterion must map to at least one automated test. If an AC cannot be expressed as a test, it is too vague to implement. Prose-only acceptance criteria are a project risk — they mean different things to different people and cannot be verified automatically.

---

## The Rule

```
For every acceptance criterion AC(n):
  ∃ test T(n) such that:
    T(n) passes ⟺ AC(n) is satisfied
```

No test = no proof = not done.

---

## How to Translate Acceptance Criteria to Tests

### The Translation Process

1. **Read the AC literally.** Identify the subject (who), the action (what), and the expected outcome (then what).
2. **Identify the test type.** Is this testing business logic (unit), an API contract (integration), or a user journey (E2E)?
3. **Write the test name** as a sentence that mirrors the AC.
4. **Write the assertion** that would fail if the AC is not met.

### Translation Examples

#### Example 1: Registration

**AC:** "User can register with a valid email address"

```typescript
// auth/register.integration.test.ts
describe('User registration', () => {
  it('registers a new user with a valid email address', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'new-user@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({
      user: { email: 'new-user@example.com', name: 'Test User' },
    });

    // Verify user actually exists in DB
    const user = await db.user.findUnique({ where: { email: 'new-user@example.com' } });
    expect(user).not.toBeNull();
  });
});
```

#### Example 2: Validation

**AC:** "Name longer than 100 characters shows a validation error"

```typescript
// users/validators.unit.test.ts
describe('Name validation', () => {
  it('rejects name exceeding 100 characters', () => {
    const longName = 'A'.repeat(101);
    const result = validateUserName(longName);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name must be 100 characters or fewer');
  });

  it('accepts name of exactly 100 characters', () => {
    const maxName = 'A'.repeat(100);
    const result = validateUserName(maxName);

    expect(result.valid).toBe(true);
  });
});
```

#### Example 3: Performance

**AC:** "Dashboard loads in under 2 seconds"

```typescript
// dashboard/performance.e2e.test.ts
import { test, expect } from '@playwright/test';

test('dashboard LCP is under 2000ms', async ({ page }) => {
  // Navigate and capture LCP
  const lcpPromise = page.evaluate(() => {
    return new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  await page.goto('/dashboard');
  const lcp = await lcpPromise;

  expect(lcp).toBeLessThan(2000);
});
```

#### Example 4: Authorization

**AC:** "Regular users cannot access admin pages"

```typescript
// auth/authorization.integration.test.ts
describe('Admin page authorization', () => {
  it('returns 403 for regular user accessing admin routes', async () => {
    const userToken = await getTokenForRole('user');

    const adminRoutes = ['/api/admin/users', '/api/admin/settings', '/api/admin/audit-log'];

    for (const route of adminRoutes) {
      const res = await app.inject({
        method: 'GET',
        url: route,
        headers: { authorization: `Bearer ${userToken}` },
      });

      expect(res.statusCode).toBe(403);
    }
  });

  it('returns 200 for admin user accessing admin routes', async () => {
    const adminToken = await getTokenForRole('admin');

    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
  });
});
```

#### Example 5: Data Integrity

**AC:** "Deleting a trip cancels all associated bookings"

```typescript
// trips/cascade-delete.integration.test.ts
describe('Trip deletion cascading', () => {
  it('cancels all bookings when trip is deleted', async () => {
    // Setup: create trip with 3 bookings
    const trip = await createTrip({ status: 'scheduled' });
    const bookings = await Promise.all([
      createBooking({ tripId: trip.id, status: 'confirmed' }),
      createBooking({ tripId: trip.id, status: 'confirmed' }),
      createBooking({ tripId: trip.id, status: 'pending' }),
    ]);

    // Act: delete the trip
    await tripService.delete(trip.id);

    // Assert: all bookings are cancelled (not deleted — audit trail preserved)
    for (const booking of bookings) {
      const updated = await db.booking.findUnique({ where: { id: booking.id } });
      expect(updated?.status).toBe('cancelled');
      expect(updated?.cancelledReason).toBe('trip_deleted');
    }
  });
});
```

#### Example 6: Notification

**AC:** "User receives email notification when their order ships"

```typescript
// orders/notifications.integration.test.ts
describe('Order shipment notification', () => {
  it('sends email when order status changes to shipped', async () => {
    const emailSpy = vi.spyOn(emailService, 'send');

    const order = await createOrder({ userId: testUser.id, status: 'processing' });

    await orderService.updateStatus(order.id, 'shipped', {
      trackingNumber: 'TRACK123',
      carrier: 'FedEx',
    });

    expect(emailSpy).toHaveBeenCalledWith({
      to: testUser.email,
      template: 'order-shipped',
      data: expect.objectContaining({
        orderId: order.id,
        trackingNumber: 'TRACK123',
        carrier: 'FedEx',
      }),
    });
  });
});
```

#### Example 7: Search

**AC:** "Search results appear within 500ms of typing"

```typescript
// search/debounce.unit.test.ts
describe('Search debounce behavior', () => {
  it('triggers search within 500ms of last keystroke', async () => {
    vi.useFakeTimers();
    const searchFn = vi.fn();
    const debouncedSearch = createDebouncedSearch(searchFn, 300);

    debouncedSearch('w');
    debouncedSearch('wi');
    debouncedSearch('wid');

    // Should not have fired yet
    expect(searchFn).not.toHaveBeenCalled();

    // Advance 300ms (debounce period)
    vi.advanceTimersByTime(300);

    expect(searchFn).toHaveBeenCalledTimes(1);
    expect(searchFn).toHaveBeenCalledWith('wid');
    vi.useRealTimers();
  });
});
```

#### Example 8: Pagination

**AC:** "List shows 20 items per page with working next/previous navigation"

```typescript
// trips/pagination.integration.test.ts
describe('Trip list pagination', () => {
  beforeAll(async () => {
    // Seed 55 trips for pagination testing
    await seedTrips(55);
  });

  it('returns 20 items per page by default', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/trips' });
    const body = res.json();

    expect(body.data).toHaveLength(20);
    expect(body.pagination.total).toBe(55);
    expect(body.pagination.totalPages).toBe(3);
    expect(body.pagination.currentPage).toBe(1);
  });

  it('returns correct items for page 2', async () => {
    const page1 = await app.inject({ method: 'GET', url: '/api/trips?page=1' });
    const page2 = await app.inject({ method: 'GET', url: '/api/trips?page=2' });

    const page1Ids = page1.json().data.map((t: any) => t.id);
    const page2Ids = page2.json().data.map((t: any) => t.id);

    // No overlap between pages
    expect(page1Ids.filter((id: string) => page2Ids.includes(id))).toHaveLength(0);
    expect(page2.json().data).toHaveLength(20);
  });

  it('returns remaining items on last page', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/trips?page=3' });
    expect(res.json().data).toHaveLength(15); // 55 - 40
  });
});
```

#### Example 9: File Upload

**AC:** "Users can upload profile photos up to 5MB in JPEG or PNG format"

```typescript
// users/avatar-upload.integration.test.ts
describe('Avatar upload', () => {
  it('accepts JPEG under 5MB', async () => {
    const jpeg = createTestFile('photo.jpg', 'image/jpeg', 2 * 1024 * 1024); // 2MB

    const res = await app.inject({
      method: 'POST',
      url: '/api/users/me/avatar',
      headers: { authorization: `Bearer ${userToken}` },
      payload: jpeg,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().avatarUrl).toMatch(/\.jpg$/);
  });

  it('rejects file over 5MB', async () => {
    const large = createTestFile('big.jpg', 'image/jpeg', 6 * 1024 * 1024); // 6MB

    const res = await app.inject({
      method: 'POST',
      url: '/api/users/me/avatar',
      payload: large,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(413);
    expect(res.json().error).toContain('5MB');
  });

  it('rejects non-image file types', async () => {
    const pdf = createTestFile('doc.pdf', 'application/pdf', 1024);

    const res = await app.inject({
      method: 'POST',
      url: '/api/users/me/avatar',
      payload: pdf,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(415);
  });
});
```

#### Example 10: Accessibility

**AC:** "All form fields have associated labels readable by screen readers"

```typescript
// forms/accessibility.unit.test.ts
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Form accessibility', () => {
  it('all fields have associated labels', () => {
    render(<RegistrationForm />);

    // Every input must be findable by its label text
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<RegistrationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## AC-to-Test Mapping Template

Maintain this for every feature in `dev_docs/specs/` or alongside the feature spec.

```markdown
## Acceptance Criteria — {{FEATURE_NAME}}

| AC # | Acceptance Criterion | Test File | Test Name | Type | Status |
|------|---------------------|-----------|-----------|------|--------|
| AC-1 | {{AC_DESCRIPTION_1}} | {{TEST_FILE_1}} | {{TEST_NAME_1}} | unit/integration/e2e | pass/fail/missing |
| AC-2 | {{AC_DESCRIPTION_2}} | {{TEST_FILE_2}} | {{TEST_NAME_2}} | unit/integration/e2e | pass/fail/missing |
| AC-3 | {{AC_DESCRIPTION_3}} | {{TEST_FILE_3}} | {{TEST_NAME_3}} | unit/integration/e2e | pass/fail/missing |

### Coverage Summary
- Total ACs: {{TOTAL_AC_COUNT}}
- ACs with tests: {{TESTED_AC_COUNT}}
- ACs passing: {{PASSING_AC_COUNT}}
- ACs missing tests: {{MISSING_AC_COUNT}}

### Gate Status
- [ ] All ACs have at least one mapped test
- [ ] All mapped tests are passing
- [ ] No prose-only ACs remain
```

---

## Feature Gate Auto-Fail

The Feature Gate (see `enforcement/feature-gate.md`) must include this check:

```
FEATURE GATE — Acceptance Criteria Verification

1. Load AC-to-test mapping for this feature
2. For each AC:
   a. Is there at least one mapped test? → If NO: FAIL ("AC-{n} has no test")
   b. Does the mapped test exist as a file? → If NO: FAIL ("Test file missing: {path}")
   c. Does the mapped test pass? → If NO: FAIL ("AC-{n} test failing: {test_name}")
3. If any AC fails: Feature Gate = BLOCKED
```

A feature with 10 ACs where 9 have passing tests and 1 has no test is NOT done. It is 90% done, which means not done.

---

## Anti-Pattern: Prose-Only Acceptance Criteria

### What It Looks Like

```markdown
## Acceptance Criteria
- The user experience should be smooth and intuitive
- The page should load quickly
- Data should be accurate
- The feature should work on mobile
```

### Why It Fails

- "Smooth and intuitive" — Means nothing. Cannot be tested. Different reviewers will disagree.
- "Load quickly" — How quickly? 100ms? 5 seconds? Without a number, there is no test.
- "Data should be accurate" — Accurate compared to what? Under what conditions?
- "Work on mobile" — Which devices? Which breakpoints? Which OS versions?

### How to Fix It

| Vague AC | Executable AC |
|----------|--------------|
| "Smooth and intuitive" | "User completes checkout in ≤ 4 steps" AND "All interactive elements have ≥ 44px touch targets" |
| "Load quickly" | "Dashboard LCP ≤ 2000ms on 4G connection" |
| "Data should be accurate" | "Invoice total equals sum of line items minus discount, rounded to 2 decimal places" |
| "Work on mobile" | "All pages pass Lighthouse accessibility ≥ 90 at 375px viewport" AND "No horizontal scroll at 320px-428px" |

---

## Verification Script

```bash
#!/bin/bash
# scripts/verify-acceptance-criteria.sh
# Scans AC mapping tables and verifies all tests exist and pass

echo "=== Acceptance Criteria Verification ==="

# Find all AC mapping files
MAPPINGS=$(find dev_docs/specs -name "*acceptance*" -o -name "*ac-mapping*" | head -20)
MISSING=0
TOTAL=0

for mapping in $MAPPINGS; do
  # Extract test file paths from mapping table
  TEST_FILES=$(grep -oP '`[^`]+\.test\.[^`]+`' "$mapping" | tr -d '`')

  for test_file in $TEST_FILES; do
    TOTAL=$((TOTAL + 1))
    if [ ! -f "$test_file" ]; then
      echo "MISSING: $test_file (referenced in $mapping)"
      MISSING=$((MISSING + 1))
    fi
  done
done

echo ""
echo "Total AC test references: $TOTAL"
echo "Missing test files:       $MISSING"

if [ "$MISSING" -gt 0 ]; then
  echo "FAIL: $MISSING acceptance criteria have no test file."
  exit 1
else
  echo "PASS: All acceptance criteria have corresponding test files."
fi
```
