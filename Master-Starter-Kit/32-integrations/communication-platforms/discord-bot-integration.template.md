# {{PROJECT_NAME}} — Discord Bot Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Bot Name:** {{DISCORD_BOT_NAME}}
> **Gateway Intents:** {{DISCORD_INTENTS}}
> **Last Updated:** {{DATE}}

---

## 1. Integration Scope

| Feature | Description | Status |
|---------|-------------|--------|
| Slash commands | `/{{COMMAND_1}}`, `/{{COMMAND_2}}` | Planned / Done |
| Event reactions | Respond to messages, reactions, member joins | Planned / Done |
| Embed notifications | Rich notifications to channels | Planned / Done |
| Role management | Auto-assign roles based on actions | Planned / Done |

---

## 2. Bot Configuration

### Credentials

| Credential | Environment Variable | Purpose |
|-----------|---------------------|---------|
| Bot Token | `DISCORD_BOT_TOKEN` | Authenticate with Discord Gateway/API |
| Application ID | `DISCORD_APP_ID` | Register slash commands |
| Public Key | `DISCORD_PUBLIC_KEY` | Verify interaction requests |
| Client Secret | `DISCORD_CLIENT_SECRET` | OAuth2 for user auth (if needed) |

### Gateway Intents

| Intent | Privileged | Purpose | Required |
|--------|-----------|---------|----------|
| `Guilds` | No | Server/channel information | Yes |
| `GuildMessages` | No | Receive messages in servers | If responding to messages |
| `GuildMembers` | **Yes** | Member join/leave events, member list | If managing roles |
| `MessageContent` | **Yes** | Read message content | If parsing message text |
| `DirectMessages` | No | DM the bot | If supporting DMs |

**Privileged intents require approval** from Discord when your bot is in 75+ servers.

---

## 3. Interaction Model

### Slash Commands

| Command | Description | Options | Response |
|---------|-------------|---------|----------|
| `/{{COMMAND_1}}` | {{DESCRIPTION}} | {{OPTIONS}} | Ephemeral / Channel |
| `/{{COMMAND_2}}` | {{DESCRIPTION}} | {{OPTIONS}} | Ephemeral / Channel |

### Registration

Slash commands can be registered:
- **Globally:** Available in all servers (takes ~1 hour to propagate)
- **Per-guild:** Available immediately in specific server (for development/testing)

**Strategy:** Use guild commands for development, global commands for production.

### Interaction Endpoints vs. Gateway

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **HTTP interactions endpoint** | Discord sends POST to your URL | Stateless, serverless-friendly | Only handles interactions |
| **Gateway (WebSocket)** | Persistent connection to Discord | Full event access, real-time | Requires persistent process |
| **Hybrid** | Gateway for events, HTTP for interactions | Best of both | More complex |

**Selected approach:** {{DISCORD_INTERACTION_MODE}}

---

## 4. Bot Architecture

### Library Selection

| Library | Language | Maintained | Best For |
|---------|----------|-----------|----------|
| **discord.js** | JavaScript/TS | ✅ Actively | Most Node.js projects |
| **discord.py** | Python | ✅ Actively | Python projects |
| **JDA** | Java | ✅ Actively | Java/Kotlin projects |
| **Serenity** | Rust | ✅ Actively | Performance-critical bots |
| **No library (HTTP API)** | Any | — | Serverless, minimal bots |

### Embed Messages

Rich notifications using Discord embeds:

```
Embed Structure:
  - Color: Brand color hex (sidebar accent)
  - Title: Notification headline
  - Description: Details (markdown supported)
  - Fields: Key-value pairs (inline or stacked)
  - Thumbnail: Small image (top-right)
  - Image: Large image (bottom)
  - Footer: Timestamp + bot name
  - URL: Link when clicking title
```

---

## 5. Rate Limits

| Endpoint Category | Rate Limit | Scope |
|------------------|-----------|-------|
| Global | 50 req/s | Per bot |
| Per-route | Varies (check headers) | Per route per bot |
| `POST /channels/{id}/messages` | 5 req/5s per channel | Per channel |
| Gateway | 120 events/60s | Per connection |

Discord rate limits are communicated via response headers:
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- `X-RateLimit-Bucket` — rate limits are bucketed, not strictly per-endpoint

---

## 6. Hosting & Scaling

| Approach | Best For | Cost |
|----------|----------|------|
| Always-on VPS (Railway, Fly.io) | Full-featured bots with Gateway | $5–20/month |
| Serverless (Cloudflare Workers) | HTTP interactions only, no Gateway | Free–$5/month |
| Container (Docker) | Self-hosted, full control | Varies |
| Bot hosting (Bot-Hosting.net) | Simple bots | $2–10/month |

### Scaling Considerations

- **Sharding:** Required when bot is in 2,500+ servers. discord.js handles automatically.
- **Clustering:** Run multiple bot processes for CPU-heavy workloads.
- **State:** Store server-specific config in database, not in memory.

---

## 7. Security Checklist

- [ ] Bot token stored in environment variables (never in code)
- [ ] Interaction requests verified via public key (Ed25519)
- [ ] Minimum required permissions in bot invite URL
- [ ] Command permissions configured (admin-only commands restricted)
- [ ] Rate limiting implemented for user-triggered commands
- [ ] No sensitive data logged from user messages
- [ ] Bot cannot be tricked into executing arbitrary commands (input validation)
- [ ] DM abuse prevention (rate limit DM responses)
