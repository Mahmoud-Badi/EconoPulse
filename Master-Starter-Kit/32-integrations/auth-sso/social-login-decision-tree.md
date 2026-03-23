# Social Login Decision Tree

> Which social login providers should you support? How many is too many? This decision tree helps you choose the right providers for your audience without over-investing in providers nobody uses.

---

## Step 1: Know Your Audience

| Audience | Essential Providers | Nice to Have |
|----------|-------------------|-------------|
| **General consumers (B2C)** | Google, Apple | Facebook, Microsoft |
| **Developers / tech users** | GitHub, Google | GitLab, Bitbucket |
| **Enterprise / B2B** | Microsoft (Azure AD), Google Workspace | Okta (SAML), OneLogin |
| **Gaming community** | Discord, Google | Twitch, Steam |
| **Creative professionals** | Google, Apple | Figma, Adobe |
| **Students / education** | Google, Microsoft | Apple |
| **China market** | WeChat, Alipay | QQ |
| **Japan market** | LINE, Google | Yahoo Japan |

### The "Start with Two" Rule

Launch with **two** social login providers maximum, plus email/password as fallback. Adding more later is easy; removing one that 5% of users rely on is painful.

**Default recommendation for most SaaS:** Google + GitHub (developer audience) or Google + Apple (consumer audience).

---

## Step 2: Provider Selection Criteria

### For Each Candidate Provider, Evaluate:

| Criterion | Weight | How to Assess |
|-----------|--------|---------------|
| **Audience overlap** | High | What % of your users have accounts with this provider? |
| **Data you get** | High | Does the provider give you name, email, avatar? Or just an ID? |
| **Email verification** | High | Does the provider guarantee the email is verified? |
| **Implementation effort** | Medium | Standard OAuth? Or custom protocol? |
| **Maintenance burden** | Medium | How often does the provider change their API/requirements? |
| **App review required?** | Medium | Apple requires app review. Facebook requires business verification. |
| **Legal/compliance** | Low | GDPR implications of integrating with certain providers? |

### Provider Data Availability

| Provider | Email | Name | Avatar | Email Verified | Notes |
|----------|-------|------|--------|----------------|-------|
| Google | ✅ | ✅ | ✅ | ✅ Always | Best data quality |
| GitHub | ✅ | ✅ | ✅ | ⚠️ May not be | Check `verified` flag on email |
| Apple | ✅ | ✅ | ❌ | ✅ Always | Name only provided on first login |
| Microsoft | ✅ | ✅ | ✅ | ✅ Usually | Azure AD accounts always verified |
| Discord | ✅ | ✅ | ✅ | ⚠️ May not be | Username != display name |
| Facebook | ✅ | ✅ | ✅ | ⚠️ Check scope | Requires app review for email |
| LinkedIn | ✅ | ✅ | ✅ | ✅ Usually | Requires LinkedIn app approval |
| Twitter/X | ❌ | ✅ | ✅ | ❌ | Email not always available |

---

## Step 3: Implementation Considerations

### Apple Sign-In Requirements

If your app is on the App Store and offers any social login, **Apple requires you to also offer Sign in with Apple**. This is an App Store Review Guideline (4.8).

Key implementation gotchas:
- Apple only provides the user's name on the **first** authentication. If you don't save it, you lose it.
- Apple allows users to hide their email (relay address like `xyz@privaterelay.appleid.com`). You must support this.
- Apple requires a Services ID, Key, Team ID, and associated domain verification.

### Progressive Profiling

Don't ask users for information the social provider already gave you:

```
User signs in with Google
  → You receive: name, email, avatar
  → DON'T ask: "What's your name?" "What's your email?"
  → DO ask: Company, role, use case (if needed for onboarding)
```

### Account Linking Edge Cases

```
Scenario: User has email/password account (alice@gmail.com)
          User clicks "Sign in with Google" (same email)

Option A: Auto-link (recognize same email, add Google as login method)
  Pros: Seamless experience
  Cons: Security risk if email not verified by both

Option B: Block and prompt (show "Account exists. Log in with password to link.")
  Pros: More secure
  Cons: Users get confused, abandon flow

Option C: Create separate account
  Pros: Zero risk
  Cons: User now has two accounts, will contact support
```

**Recommendation:** Option A if both sources have verified the email. Option B otherwise.

---

## Step 4: Login UI Patterns

### Button Order

Place providers in order of expected usage (most popular first):

```
[ Sign in with Google    ]    ← Most popular
[ Sign in with GitHub    ]    ← Second most popular
[ Sign in with Apple     ]    ← Required for App Store

─────── or ───────

[ Email and password     ]    ← Fallback
```

### Design Guidelines

- Use official brand colors and logos (providers have brand guidelines)
- Use consistent button sizes and styling
- "Sign in with X" for returning users, "Sign up with X" for new users (or use "Continue with X" for both)
- Show provider icon + provider name (not just icon — users don't recognize all logos)
- Don't offer more than 4 social providers (choice paralysis)

### Consent and Permissions

- Request **minimum scopes** (email + profile only for most apps)
- Never request write permissions at login (ask later when the feature needs it)
- Show what data you'll access before redirecting to provider
- Comply with provider's branding and UX requirements

---

## Step 5: Monitoring & Analytics

Track these metrics per social login provider:

| Metric | Purpose | Action If Low |
|--------|---------|--------------|
| Sign-up conversion rate | Which providers convert best | Promote top performers, consider removing low performers |
| Sign-in success rate | Which providers have technical issues | Investigate failures, check for API changes |
| Account linking rate | How often users link multiple providers | May indicate UX confusion |
| Provider distribution | Which providers your users prefer | Allocate maintenance effort accordingly |
| Error rate by provider | Provider-specific reliability | Investigate or add fallback |

### Quarterly Review

Every quarter, review:
1. Which social providers have less than 5% usage? Consider removing them.
2. Which providers have the highest error rates? Investigate or replace.
3. Are there new providers your audience is asking for?
4. Are any provider APIs deprecated or changing?
5. Are your provider app credentials still valid and properly scoped?
