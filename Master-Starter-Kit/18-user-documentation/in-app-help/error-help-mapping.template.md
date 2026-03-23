---
generated_date: {{GENERATED_DATE}}
---

# Error → Help Article Mapping

Maps application error codes and messages to user-facing troubleshooting articles. When the application displays an error, it should include a "Learn more" or "How to fix this" link that points to the corresponding troubleshooting article.

---

## How This Works

1. The application catches an error (API error, validation error, etc.)
2. It looks up the error code/message in this mapping
3. It displays the user-friendly message along with a link to the help article
4. The user clicks through to the troubleshooting guide for step-by-step resolution

---

## Mapping Table

| Error Code | Internal Message | User-Friendly Message | Help Article | Category |
|------------|-----------------|----------------------|--------------|----------|
| `AUTH_001` | `session_expired` | "Your session has expired. Please sign in again." | [Session Issues]({{USER_DOCS_PATH}}/troubleshooting/authentication.md#session-expired) | Authentication |
| `AUTH_002` | `invalid_credentials` | "The email or password you entered is incorrect." | [Sign In Help]({{USER_DOCS_PATH}}/troubleshooting/authentication.md#wrong-password) | Authentication |
| `AUTH_003` | `account_locked` | "Your account has been temporarily locked. Try again in 15 minutes." | [Account Locked]({{USER_DOCS_PATH}}/troubleshooting/authentication.md#locked) | Authentication |
| `PERM_001` | `forbidden` | "You don't have permission to do this. Contact your administrator." | [Permissions]({{USER_DOCS_PATH}}/troubleshooting/permissions.md) | Permissions |
| `VAL_001` | `validation_error` | "Some fields need attention. Check the highlighted fields below." | [Form Help]({{USER_DOCS_PATH}}/troubleshooting/forms.md) | Validation |
| `NET_001` | `network_error` | "Unable to connect. Check your internet connection and try again." | [Connection Issues]({{USER_DOCS_PATH}}/troubleshooting/connectivity.md) | Network |
| `NET_002` | `timeout` | "This is taking longer than expected. Please try again." | [Slow Loading]({{USER_DOCS_PATH}}/troubleshooting/connectivity.md#slow) | Network |
| `SRV_001` | `internal_server_error` | "Something went wrong on our end. We're looking into it." | [Service Issues]({{USER_DOCS_PATH}}/troubleshooting/service-status.md) | Server |
| `SRV_002` | `service_unavailable` | "{{PROJECT_NAME}} is currently under maintenance. Check back shortly." | [Status Page]({{STATUS_PAGE_URL}}) | Server |
| {{ERROR_CODE}} | {{INTERNAL_MESSAGE}} | {{USER_FRIENDLY_MESSAGE}} | [{{HELP_ARTICLE_TITLE}}]({{HELP_ARTICLE_URL}}) | {{CATEGORY}} |

---

## Implementation Pattern

```text
// When displaying an error to the user:
1. Map the error code to its user-friendly message
2. Display the message prominently
3. If a help article exists, show a "How to fix this" link
4. Log the error code + timestamp for support tickets
```

<!-- IF {{HAS_MOBILE}} == "true" -->

---

## Mobile-Specific Errors

| Error Code | Internal Message | User-Friendly Message | Help Article |
|------------|-----------------|----------------------|--------------|
| `MOB_001` | `permission_denied_camera` | "Camera access is needed for this feature. Go to Settings to enable it." | [App Permissions]({{USER_DOCS_PATH}}/troubleshooting/mobile-permissions.md#camera) |
| `MOB_002` | `permission_denied_location` | "Location access is needed. Go to Settings to enable it." | [App Permissions]({{USER_DOCS_PATH}}/troubleshooting/mobile-permissions.md#location) |
| `MOB_003` | `permission_denied_notifications` | "Enable notifications to stay updated. Go to Settings → Notifications." | [Notifications]({{USER_DOCS_PATH}}/troubleshooting/mobile-permissions.md#notifications) |
| `MOB_004` | `offline_sync_conflict` | "Changes were made offline and online. Review the conflict below." | [Offline Sync]({{USER_DOCS_PATH}}/troubleshooting/offline-sync.md) |
| `MOB_005` | `app_update_required` | "Please update {{PROJECT_NAME}} to the latest version." | [App Updates]({{USER_DOCS_PATH}}/troubleshooting/app-updates.md) |
| `MOB_006` | `biometric_failed` | "Biometric authentication failed. Use your password instead." | [Biometric Login]({{USER_DOCS_PATH}}/troubleshooting/authentication.md#biometric) |
<!-- ENDIF -->

---

## Rules for Adding New Mappings

1. Every error the user can see MUST have a user-friendly message (no raw error codes shown to users)
2. Every user-friendly message SHOULD link to a troubleshooting article
3. User-friendly messages must be actionable ("Check your connection" not "Network error")
4. Keep messages under 100 characters
5. The `/document-feature` skill adds new mappings when building features that introduce new error states
