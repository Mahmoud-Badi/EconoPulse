# State Recovery Tests

## What It Is

State recovery testing verifies that your application handles unexpected interruptions gracefully — browser refreshes mid-form, network reconnection after an offline period, session expiry during active use, and app crashes followed by restart. Users don't close your app politely; they lose WiFi in a tunnel, their browser crashes, their laptop dies mid-transaction, and they come back expecting to pick up where they left off. State recovery tests prove that your app preserves meaningful state through these interruptions, syncs correctly when connectivity returns, and redirects gracefully when sessions expire — instead of losing user work, showing stale data, or crashing on resume.

---

## What It Catches

- **Form data lost on refresh** — User spends 10 minutes filling out a long form, accidentally hits F5, and all data is gone because nothing was persisted to localStorage or sessionStorage
- **Stale data after reconnect** — App was offline for 5 minutes, reconnects, and shows the cached version of the dashboard. New items added by other users are invisible until a manual refresh.
- **Duplicate submissions on retry** — User clicks submit, network drops, they click again when it comes back. Two identical orders are created because the backend has no idempotency check.
- **Session expiry crash** — Token expires while user is editing. The next API call returns 401. The app shows a raw error message instead of redirecting to login. The user's unsaved work is lost.
- **Offline queue corruption** — App queues 5 actions while offline. When reconnecting, action 3 fails (conflict), and actions 4-5 (which depended on 3) are applied anyway, creating inconsistent state.
- **localStorage quota exceeded** — App aggressively caches data to localStorage. After months of use, it hits the 5MB limit and crashes with an unhandled QuotaExceededError on the next save.
- **Race condition after tab restore** — User has 3 tabs open, laptop sleeps for 2 hours, all tabs wake simultaneously and fire API requests with expired tokens, creating a thundering herd on the auth refresh endpoint.
- **Partial state restoration** — App saves form step 2 data but not step 1 data to storage. On refresh, user lands on step 2 with empty step 1 fields, which causes validation errors they can't fix without starting over.
- **PWA service worker version mismatch** — Old service worker serves cached HTML while the API has been updated. User sees a broken interface because the frontend expects response fields that don't exist in the old cached version.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Multi-step forms or wizards | Users will refresh, navigate away, and come back |
| Real-time or collaborative features | Multiple clients must reconcile state after disconnection |
| Mobile or unreliable network users | Mobile networks drop constantly |
| Long-running user sessions (dashboards, editors) | Sessions will expire during active use |
| Offline-capable or PWA applications | Offline state management is the entire feature |
| E-commerce checkout flows | Losing a cart during checkout directly costs revenue |
| Any form that takes >2 minutes to fill out | The longer the form, the higher the chance of interruption |
| Financial or medical data entry | Users cannot afford to lose entered data |

**Skip when:** Static content site, app with no user input, throwaway prototype where data loss is acceptable.

---

## Setup Guide

### Tools

```bash
# Playwright — browser automation (refresh, offline, storage manipulation)
npm install -D @playwright/test

# No additional tools needed — Playwright provides:
# - context.setOffline(true/false) for network simulation
# - page.reload() for refresh testing
# - page.evaluate() for localStorage/sessionStorage manipulation
# - page.context().clearCookies() for session expiry
# - page.route() for selective request blocking
```

### Project Structure

```
tests/
  state-recovery/
    form-persistence.spec.ts      # Form data survives refresh
    offline-sync.spec.ts          # Offline queue and reconnection
    session-expiry.spec.ts        # Graceful auth expiry handling
    crash-recovery.spec.ts        # Recovery after unexpected closure
    storage-edge-cases.spec.ts    # Quota limits, corrupted storage
```

### Alternatives

| Approach | Best For | Notes |
|----------|----------|-------|
| **Playwright** | Full browser state recovery testing | Network control, storage access, page lifecycle |
| **Cypress** | Similar capabilities with different API | `cy.clearLocalStorage()`, network stubbing |
| **Manual testing scripts** | Exploratory state recovery | Checklist-driven for QA team |
| **Service Worker testing (Workbox)** | PWA-specific offline/cache recovery | Test SW update lifecycle |

---

## Template

### Form Data Persistence on Refresh

```ts
// tests/state-recovery/form-persistence.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Data Persistence', () => {

  test('single-page form data survives browser refresh', async ({ page }) => {
    await page.goto('/settings/profile');

    // Fill in form fields
    await page.fill('[name="displayName"]', 'Jane Doe');
    await page.fill('[name="bio"]', 'A long biography that took time to write');
    await page.selectOption('[name="timezone"]', 'America/New_York');
    await page.check('[name="emailNotifications"]');

    // Simulate accidental refresh
    await page.reload();

    // All form data should be preserved
    await expect(page.locator('[name="displayName"]')).toHaveValue('Jane Doe');
    await expect(page.locator('[name="bio"]')).toHaveValue('A long biography that took time to write');
    await expect(page.locator('[name="timezone"]')).toHaveValue('America/New_York');
    await expect(page.locator('[name="emailNotifications"]')).toBeChecked();
  });

  test('multi-step wizard preserves completed steps on refresh', async ({ page }) => {
    await page.goto('/onboarding');

    // Complete step 1
    await page.fill('[name="companyName"]', 'Acme Corp');
    await page.fill('[name="industry"]', 'Technology');
    await page.click('[data-testid="next-step"]');

    // Verify we're on step 2
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 2');

    // Fill in step 2 partially
    await page.fill('[name="teamSize"]', '25');

    // Refresh
    await page.reload();

    // Should be back on step 2 (not reset to step 1)
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 2');
    await expect(page.locator('[name="teamSize"]')).toHaveValue('25');

    // Navigate back to step 1 — data should still be there
    await page.click('[data-testid="prev-step"]');
    await expect(page.locator('[name="companyName"]')).toHaveValue('Acme Corp');
  });

  test('unsaved changes prompt on navigation away', async ({ page }) => {
    await page.goto('/settings/profile');

    // Make a change
    await page.fill('[name="displayName"]', 'Modified Name');

    // Try to navigate away
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('unsaved');
      await dialog.dismiss(); // Cancel navigation
    });

    await page.click('[data-testid="nav-dashboard"]');

    // Should still be on settings page
    await expect(page).toHaveURL(/\/settings/);
  });

  test('draft is cleared after successful submission', async ({ page }) => {
    await page.goto('/posts/new');

    // Fill in form
    await page.fill('[name="title"]', 'Draft Post Title');
    await page.fill('[name="content"]', 'Draft content');

    // Verify draft is saved
    await page.reload();
    await expect(page.locator('[name="title"]')).toHaveValue('Draft Post Title');

    // Submit the form
    await page.click('[data-testid="publish-button"]');
    await page.waitForURL(/\/posts\/\d+/);

    // Go back to new post page — draft should be cleared
    await page.goto('/posts/new');
    await expect(page.locator('[name="title"]')).toHaveValue('');
    await expect(page.locator('[name="content"]')).toHaveValue('');
  });
});
```

### Offline Sync and Reconnection

```ts
// tests/state-recovery/offline-sync.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Offline Sync', () => {

  test('actions queued offline are synced on reconnect', async ({ page, context }) => {
    await page.goto('/tasks');

    // Verify initial state
    const initialCount = await page.locator('[data-testid="task-item"]').count();

    // Go offline
    await context.setOffline(true);

    // Perform actions while offline
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="new-task-input"]', 'Offline Task 1');
    await page.click('[data-testid="save-task"]');

    // Should show "saved offline" or "pending sync" indicator
    await expect(page.locator('[data-testid="sync-status"]')).toContainText(/offline|pending/i);

    // Task should appear in the UI (optimistic update)
    await expect(page.locator('text=Offline Task 1')).toBeVisible();

    // Reconnect
    await context.setOffline(false);

    // Wait for sync
    await expect(page.locator('[data-testid="sync-status"]')).toContainText(/synced|online/i, {
      timeout: 10000,
    });

    // Verify the task persisted after reload
    await page.reload();
    await expect(page.locator('text=Offline Task 1')).toBeVisible();
    const newCount = await page.locator('[data-testid="task-item"]').count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('conflicting offline edits show resolution UI', async ({ page, context }) => {
    await page.goto('/documents/1');

    // Note the original content
    const originalContent = await page.locator('[data-testid="doc-content"]').textContent();

    // Go offline
    await context.setOffline(true);

    // Edit while offline
    await page.fill('[data-testid="doc-editor"]', 'My offline edit');
    await page.click('[data-testid="save-button"]');

    // Simulate a server-side change by intercepting the sync request
    await context.setOffline(false);
    await page.route('**/api/documents/1', async (route) => {
      if (route.request().method() === 'PUT') {
        // Return conflict
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'conflict',
            serverVersion: 'Someone else edited this',
            yourVersion: 'My offline edit',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Should show conflict resolution UI
    await expect(page.locator('[data-testid="conflict-dialog"]')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="conflict-dialog"]')).toContainText(/conflict|changed/i);
  });

  test('network reconnect refreshes stale data', async ({ page, context }) => {
    await page.goto('/dashboard');

    // Note current data
    const initialData = await page.locator('[data-testid="last-updated"]').textContent();

    // Go offline for a period
    await context.setOffline(true);
    await page.waitForTimeout(3000);

    // Come back online
    await context.setOffline(false);

    // Data should auto-refresh
    await expect(page.locator('[data-testid="last-updated"]')).not.toHaveText(initialData!, {
      timeout: 10000,
    });
  });
});
```

### Session Expiry Handling

```ts
// tests/state-recovery/session-expiry.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Session Expiry', () => {

  test('expired session redirects to login with return URL', async ({ page }) => {
    // Login normally
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to a deep page
    await page.goto('/settings/billing');

    // Expire the session by clearing cookies/tokens
    await page.context().clearCookies();
    // Also clear any in-memory tokens
    await page.evaluate(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    });

    // Try to perform an action that requires auth
    await page.click('[data-testid="update-billing"]');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // Should include return URL so user comes back to billing after login
    const url = new URL(page.url());
    expect(url.searchParams.get('redirect') || url.searchParams.get('returnTo'))
      .toContain('/settings/billing');
  });

  test('session expiry during form edit preserves data', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Start filling a form
    await page.goto('/items/new');
    await page.fill('[name="title"]', 'Important Item');
    await page.fill('[name="description"]', 'Detailed description that took time to write');

    // Expire session
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.removeItem('token'));

    // Submit the form (will fail due to 401)
    await page.click('button[type="submit"]');

    // Should show a friendly "session expired" message, NOT a crash
    await expect(page.locator('[data-testid="session-expired-modal"]')).toBeVisible();

    // Should offer to re-login without losing data
    await expect(page.locator('[data-testid="session-expired-modal"]')).toContainText(
      /session|expired|log in/i
    );

    // After re-login, form data should still be there
    // (This depends on your implementation — the key is that the data isn't destroyed)
  });

  test('multiple tabs handle session refresh without conflict', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Login in tab 1
    await page1.goto('/login');
    await page1.fill('[name="email"]', 'test@test.com');
    await page1.fill('[name="password"]', 'password123');
    await page1.click('button[type="submit"]');
    await page1.waitForURL('/dashboard');

    // Navigate in tab 2 (should share session)
    await page2.goto('/dashboard');
    await expect(page2.locator('[data-testid="main-content"]')).toBeVisible();

    // Logout in tab 1
    await page1.click('[data-testid="logout-button"]');
    await page1.waitForURL('/login');

    // Tab 2 should detect the logout (via storage event, broadcast channel, etc.)
    // and redirect to login on next interaction
    await page2.click('[data-testid="refresh-button"]');
    await expect(page2).toHaveURL(/\/login/, { timeout: 5000 });

    await page1.close();
    await page2.close();
  });
});
```

### Crash and Storage Recovery

```ts
// tests/state-recovery/crash-recovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Crash Recovery', () => {

  test('app recovers from corrupted localStorage', async ({ page }) => {
    await page.goto('/dashboard');

    // Corrupt localStorage
    await page.evaluate(() => {
      localStorage.setItem('app-state', 'THIS IS NOT VALID JSON{{{');
      localStorage.setItem('user-preferences', '');
    });

    // Reload — app should handle corrupted data gracefully
    await page.reload();

    // Should not crash — should show the app in a default state
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();

    // No unhandled error in console
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test('app handles localStorage quota exceeded', async ({ page }) => {
    await page.goto('/dashboard');

    // Fill localStorage to near capacity (5MB limit)
    await page.evaluate(() => {
      try {
        const bigString = 'x'.repeat(1024 * 1024); // 1MB
        for (let i = 0; i < 5; i++) {
          localStorage.setItem(`filler-${i}`, bigString);
        }
      } catch {
        // Expected — quota exceeded
      }
    });

    // Try to use a feature that saves to localStorage
    await page.goto('/settings/profile');
    await page.fill('[name="displayName"]', 'Test User');

    // Should not crash — should handle the error gracefully
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();

    // Clean up
    await page.evaluate(() => localStorage.clear());
  });

  test('app recovers from cleared sessionStorage mid-flow', async ({ page }) => {
    await page.goto('/checkout/step-1');
    await page.fill('[name="address"]', '123 Main St');
    await page.click('[data-testid="next-step"]');

    // Clear sessionStorage (simulating a crash or browser clearing)
    await page.evaluate(() => sessionStorage.clear());

    // Try to continue checkout
    await page.reload();

    // Should handle gracefully — redirect to step 1 or show a meaningful message
    // Should NOT show step 2 with empty data from step 1
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');

    // Either redirected to step 1 or shows recovery message
    expect(
      currentUrl.includes('step-1') ||
      pageContent?.includes('start over') ||
      pageContent?.includes('expired')
    ).toBe(true);
  });
});
```

### package.json Scripts

```json
{
  "scripts": {
    "test:recovery": "playwright test tests/state-recovery/",
    "test:recovery:forms": "playwright test tests/state-recovery/form-persistence.spec.ts",
    "test:recovery:offline": "playwright test tests/state-recovery/offline-sync.spec.ts",
    "test:recovery:session": "playwright test tests/state-recovery/session-expiry.spec.ts",
    "test:recovery:crash": "playwright test tests/state-recovery/crash-recovery.spec.ts"
  }
}
```

---

## Common Pitfalls

### 1. Testing only the happy recovery path
**Problem:** You test "refresh preserves data" but not "refresh mid-save corrupts data" or "two simultaneous refreshes create duplicates."
**Fix:** Test the uncomfortable scenarios: refresh during an API call, multiple rapid refreshes, offline-to-online-to-offline rapid toggling, storage corruption, and expired + revoked sessions.

### 2. Over-relying on localStorage
**Problem:** Your entire app state is in localStorage, which has a 5MB limit, no expiry mechanism, persists across sessions (security risk for shared computers), and can be cleared by the user at any time.
**Fix:** Use localStorage for non-critical preferences. Use sessionStorage for sensitive session data. Use IndexedDB for larger datasets. Always have a fallback for when storage is unavailable or full.

### 3. Not handling the "silent 401"
**Problem:** Token expires, API returns 401, the fetch call rejects, but there's no global handler. The specific component that made the call shows an error, but the user doesn't understand they need to re-login.
**Fix:** Implement a global API response interceptor (Axios interceptor, fetch wrapper) that catches 401s and triggers a unified session-expired flow with re-login redirect.

### 4. Optimistic updates without rollback
**Problem:** App shows the task as completed (optimistic update) while offline. When reconnecting, the sync fails (task was deleted by another user). The UI still shows it as completed.
**Fix:** Every optimistic update must have a rollback mechanism. If the sync fails, revert the UI state and show the user what happened.

### 5. Not testing with multiple tabs
**Problem:** Everything works with one tab. With two tabs open, logging out in one doesn't affect the other, token refresh in one doesn't propagate, and state changes in one don't sync.
**Fix:** Test multi-tab scenarios explicitly. Use BroadcastChannel or storage events to synchronize state across tabs. Playwright supports multiple pages in one test.

### 6. Draft data accumulating forever
**Problem:** Every form visit saves a draft to localStorage. After 6 months, there are 400 stale drafts consuming storage space and occasionally loading outdated data into forms.
**Fix:** Add TTL (time-to-live) to draft data. Clean up drafts that are older than a reasonable threshold (24 hours for most forms). Clear drafts after successful submission.

---

## Proof Artifact

A state recovery test pass produces these artifacts:

### Test output
```
Running 16 tests using 3 workers

  Form Data Persistence
    ✓ single-page form data survives browser refresh (2.3s)
    ✓ multi-step wizard preserves completed steps on refresh (3.1s)
    ✓ unsaved changes prompt on navigation away (1.8s)
    ✓ draft is cleared after successful submission (2.5s)

  Offline Sync
    ✓ actions queued offline are synced on reconnect (6.2s)
    ✓ conflicting offline edits show resolution UI (4.8s)
    ✓ network reconnect refreshes stale data (5.1s)

  Session Expiry
    ✓ expired session redirects to login with return URL (2.4s)
    ✓ session expiry during form edit preserves data (3.2s)
    ✓ multiple tabs handle session refresh without conflict (4.5s)

  Crash Recovery
    ✓ app recovers from corrupted localStorage (1.9s)
    ✓ app handles localStorage quota exceeded (2.1s)
    ✓ app recovers from cleared sessionStorage mid-flow (1.7s)

  16 passed (41.6s)
```

### What constitutes a pass:
1. **Form data persists** through browser refresh at every step of a multi-step flow
2. **Offline actions sync** correctly when network returns, with conflict detection
3. **Session expiry redirects** gracefully to login with return URL, without data loss
4. **Corrupted storage** doesn't crash the app — it recovers to a default state
5. **Multi-tab scenarios** work without conflicts or stale state
6. **CI pipeline** completes the state recovery test step with exit code 0
