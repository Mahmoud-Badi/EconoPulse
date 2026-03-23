# Expansion Plan

## Post-MVP Feature Roadmap

### Quarter 1 (Post-Launch + 3 months)

| Feature | Impact | Effort | Source | Dependencies |
|---------|--------|--------|--------|-------------|
| Real-time availability calendar | 5 | 3 | Deep dive nice-to-have | WebSocket infrastructure |
| Advanced search filters (location, price, date range) | 4 | 2 | Deep dive nice-to-have | search-service exists |
| Email template customization (admin) | 3 | 2 | Deep dive nice-to-have | notification-service exists |
| Booking modification (reschedule) | 5 | 4 | Industry standard gap | booking-service, billing proration |
| User reviews & ratings | 4 | 3 | Tribunal competitor analysis | New review-service needed |

### Quarter 2 (Months 4-6)

| Feature | Impact | Effort | Source | Dependencies |
|---------|--------|--------|--------|-------------|
| Mobile app (React Native) | 5 | 5 | Market demand | API layer complete |
| Multi-language support (i18n) | 4 | 3 | Market expansion | All UI strings externalized |
| Bulk booking management | 3 | 3 | Enterprise requests | booking-service, admin UI |
| Webhook notifications for integrators | 4 | 2 | API ecosystem | notification-service |
| Analytics dashboard (real-time) | 3 | 4 | Deep dive nice-to-have | analytics-service, WebSocket |

### Quarter 3 (Months 7-9)

| Feature | Impact | Effort | Source | Dependencies |
|---------|--------|--------|--------|-------------|
| Marketplace for service providers | 5 | 5 | Vertical expansion | New marketplace-service |
| White-label / multi-tenant | 4 | 5 | Enterprise vertical | Tenant isolation architecture |
| AI-powered scheduling recommendations | 4 | 4 | Competitive advantage | ML pipeline, booking data |

## Vertical Analysis

### Primary Vertical: Service Booking (Current)
- **TAM:** $12B globally for online appointment scheduling
- **Current positioning:** SMB-focused booking platform
- **Differentiation:** Speed of setup, integrated billing, modern UX

### Expansion Vertical 1: Enterprise Fleet Management
- **Opportunity:** $4B market, high willingness to pay
- **Required additions:** Multi-tenant, SSO, advanced permissions, SLA management
- **Effort:** ~3 months dedicated work
- **Revenue impact:** 3-5x ARPU increase vs. SMB

### Expansion Vertical 2: Healthcare Scheduling
- **Opportunity:** $8B market, highly fragmented
- **Required additions:** HIPAA compliance, patient portal, insurance verification, EHR integration
- **Effort:** ~6 months + compliance certification
- **Revenue impact:** 2-4x ARPU, longer sales cycle

## Growth Strategy

### Viral Loops
1. **Booking confirmation pages** — "Powered by [Product]" with signup CTA
2. **Shareable booking links** — Providers share links that expose brand
3. **Review widgets** — Embeddable review badges drive traffic back

### Enterprise Upsell Path
```
Free tier (1 user, 50 bookings/mo)
  → Pro ($29/mo, unlimited bookings, analytics)
    → Team ($99/mo, 5 users, priority support)
      → Enterprise (custom, SSO, SLA, dedicated instance)
```

### API Ecosystem
- Public API for third-party integrations (calendar apps, CRMs)
- Marketplace for extensions (payment gateways, communication tools)
- Developer documentation and sandbox environment

## Technology Roadmap

| Timeline | Infrastructure Change | Why |
|----------|----------------------|-----|
| Q1 | Add WebSocket layer (Socket.io / Pusher) | Real-time features |
| Q2 | Internationalization framework (i18next) | Multi-language support |
| Q2 | React Native setup | Mobile app |
| Q3 | Tenant isolation architecture | Multi-tenant / white-label |
| Q3 | ML pipeline (Python microservice) | AI recommendations |

## Competitive Moat Assessment

| Moat Type | Current | 6 Months | 12 Months |
|-----------|---------|----------|-----------|
| Network effects | None | Weak (reviews) | Moderate (marketplace) |
| Data advantage | None | Booking patterns | AI recommendations |
| Switching cost | Low | Medium (integrations) | High (workflow dependency) |
| Brand | None | SMB recognition | Category awareness |
