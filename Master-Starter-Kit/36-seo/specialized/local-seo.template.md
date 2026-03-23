# Local SEO Strategy for {{BUSINESS_NAME}}

> Comprehensive local search optimization — from Google Business Profile setup through multi-location landing pages, local link building, and rank tracking. Local SEO is fundamentally different from organic web SEO: you are competing in a geographic radius, not a global index. The ranking signals, content requirements, and measurement approaches are all location-specific.

---

## Table of Contents

1. [Google Business Profile Optimization](#google-business-profile-optimization)
2. [NAP Consistency Audit](#nap-consistency-audit)
3. [Local Citation Building](#local-citation-building)
4. [Google Reviews Strategy](#google-reviews-strategy)
5. [Local Schema Markup](#local-schema-markup)
6. [Local Keyword Strategy](#local-keyword-strategy)
7. [Google Maps Optimization](#google-maps-optimization)
8. [Multi-Location Landing Pages](#multi-location-landing-pages)
9. [Local Link Building](#local-link-building)
10. [Local Rank Tracking](#local-rank-tracking)

---

## Google Business Profile Optimization

Google Business Profile (GBP) is the single most important asset for local SEO. It controls how your business appears in Google Maps, the local pack (3-pack), and the knowledge panel. Every field matters because Google uses profile completeness as a ranking signal.

### Profile Completeness Checklist

#### Business Identity

| Field | Requirements | Notes |
|-------|-------------|-------|
| **Business name** | `{{BUSINESS_NAME}}` — exact legal name, no keyword stuffing | Adding keywords to your business name that are not part of the legal name violates Google guidelines and risks suspension. "Joe's Plumbing" is correct. "Joe's Plumbing — Best Emergency Plumber in Chicago" is a suspension risk. |
| **Primary category** | `{{BUSINESS_CATEGORY}}` — the single most important ranking factor in local SEO | Choose the most specific category that matches your core service. "Italian Restaurant" outperforms "Restaurant" for Italian food queries. |
| **Secondary categories** | Add all that genuinely apply (up to 9 additional categories) | Do not add aspirational categories. If you are a plumber who also does HVAC, add HVAC. If you do not do HVAC, do not add it. |
| **Business description** | 750 characters max. Include `{{BUSINESS_CATEGORY}}` and `{{SERVICE_AREA}}` naturally. | This field does not directly impact rankings but it does influence click-through from the profile. Lead with what makes you different, not generic claims. |
| **Opening date** | Accurate month and year | Established businesses with longer histories may receive a slight trust signal. |

#### Contact and Location

| Field | Requirements | Notes |
|-------|-------------|-------|
| **Address** | `{{BUSINESS_ADDRESS}}` — must match exactly across all citations | PO boxes are not accepted for most business types. If you serve customers at their location (e.g., plumber), you can hide the address and set a service area instead. |
| **Phone number** | `{{BUSINESS_PHONE}}` — use a local number, not a toll-free number | Local area codes correlate with local relevance. Use the same number across all citations. Call tracking numbers should be used cautiously — mismatched numbers hurt NAP consistency. |
| **Website URL** | Link to your homepage or a location-specific landing page | For multi-location businesses, each GBP should link to its specific location page, not the homepage. |
| **Service area** | `{{SERVICE_AREA}}` — set if you serve customers at their location | Define by city, county, or radius. Do not set an unrealistically large service area — Google penalizes implausible coverage claims. |

#### Hours and Attributes

| Field | Requirements | Notes |
|-------|-------------|-------|
| **Regular hours** | Set accurate hours for every day of the week | "Closed" days must be explicitly marked. Missing hours reduce profile completeness. |
| **Special hours** | Set for all holidays and irregular closures in advance | Google prompts you to set these before major holidays. Proactively setting them prevents "Is this place open?" uncertainty. |
| **More hours** | Set specific hours for departments (kitchen, pharmacy, drive-through) | Only available for certain business categories. Use if applicable. |
| **Attributes** | Complete all relevant attributes (payment methods, accessibility, amenities) | Attributes vary by category. A restaurant gets "outdoor seating," "serves wine," "good for kids." A retailer gets "in-store shopping," "curbside pickup." Complete every relevant one. |

#### Visual Content

| Content Type | Minimum | Best Practice | Specifications |
|-------------|---------|---------------|----------------|
| **Logo** | 1 | Square, transparent background | 720x720px minimum |
| **Cover photo** | 1 | Represents the business experience | 1080x608px, landscape |
| **Interior photos** | 3 | Show different areas, ambiance, cleanliness | Well-lit, professional quality |
| **Exterior photos** | 2 | Building from street level, signage visible | Helps customers find you |
| **Team photos** | 2 | Employees at work, friendly and professional | Builds trust and humanizes the business |
| **Product/service photos** | 5+ | Your actual products or services being delivered | Not stock photos — Google can detect and devalue stock images |
| **Videos** | 1+ | 30-second walkthrough or service demonstration | Up to 30 seconds, 720p minimum |

**Photo posting cadence:** Upload at least 1-2 new photos per week. Businesses with more photos receive 42% more direction requests and 35% more website clicks (Google data). Freshness of photos is a ranking signal.

#### Google Posts

Google Posts appear directly on your business profile and in Google Maps. They expire after 7 days (event posts after the event date), so consistent posting is required.

| Post Type | Use Case | Best Practice |
|-----------|----------|---------------|
| **What's New** | General updates, announcements | Post 1-2x per week. Include a CTA button (Book, Order, Learn More). |
| **Offer** | Promotions, discounts, deals | Include start/end date, coupon code if applicable. These get a yellow "Offer" tag. |
| **Event** | Upcoming events, webinars, open houses | Include date, time, and event details. Appears until event ends. |

**Post optimization:**
- Include target keywords naturally in the first 100 characters
- Add a high-quality image (1200x900px minimum)
- Always include a CTA button with a tracked URL
- Posts with images get 10x more engagement than text-only

#### Q&A Management

The Q&A section on your GBP is publicly editable — anyone can ask or answer questions. If you do not manage it, your competitors or random users will.

**Proactive Q&A strategy:**
1. Seed your Q&A with 10-15 frequently asked questions and answer them yourself
2. Include keywords naturally in both questions and answers
3. Monitor weekly for new questions — unanswered questions look neglected
4. Upvote your own answers so they appear as the "top answer"
5. Report spam or misleading questions/answers

**Seed Q&A examples for {{BUSINESS_NAME}}:**

```
Q: What areas does {{BUSINESS_NAME}} serve?
A: We serve {{SERVICE_AREA}} and surrounding communities. [List specific neighborhoods/cities.]

Q: Do I need an appointment or can I walk in?
A: [Answer based on your business model.]

Q: What payment methods do you accept?
A: We accept [list methods]. [Mention financing if applicable.]

Q: How long has {{BUSINESS_NAME}} been in business?
A: {{BUSINESS_NAME}} has been serving {{SERVICE_AREA}} since [year].

Q: Do you offer free estimates/consultations?
A: [Answer based on your business model.]
```

---

## NAP Consistency Audit

NAP stands for Name, Address, Phone Number. Consistent NAP across every place your business appears online is one of the strongest local ranking signals. Inconsistent NAP confuses Google about which information is correct and dilutes your local authority.

### Why NAP Consistency Matters

Google cross-references your business information across hundreds of sources. When your NAP matches everywhere, Google has high confidence in your data and rewards you with better local rankings. When it varies — different phone number on Yelp, abbreviated street name on the BBB, old address on an industry directory — Google loses confidence and may rank a competitor with cleaner data instead.

### The Canonical NAP Record

Before auditing, establish your single source of truth:

```
CANONICAL NAP RECORD FOR {{BUSINESS_NAME}}
──────────────────────────────────────────────
Business Name:  {{BUSINESS_NAME}}
                (exact spelling, capitalization, punctuation — no variations)

Address:        {{BUSINESS_ADDRESS}}
                (use the exact format from your Google Business Profile)

Phone:          {{BUSINESS_PHONE}}
                (the primary number on your GBP — use consistent formatting)

Website:        {{BASE_URL}}

Abbreviation Policy:
  Street → St. or Street?     [choose one and use it everywhere]
  Suite → Ste. or Suite?      [choose one and use it everywhere]
  Road → Rd. or Road?         [choose one and use it everywhere]

Variations to NEVER use:
  - [list any old names, old addresses, old phone numbers]
```

### NAP Audit Process

**Step 1: Inventory all existing listings**

Search for your business across these source types:
- Google your exact business name and phone number
- Google your address
- Use a citation scanner (BrightLocal, Moz Local, Whitespark) for automated discovery
- Check each directory manually from the citation building list below

**Step 2: Document inconsistencies**

| Source | Name Match? | Address Match? | Phone Match? | Action Needed |
|--------|-------------|---------------|--------------|---------------|
| Google Business Profile | -- | -- | -- | This IS the canonical record |
| Yelp | | | | |
| Facebook | | | | |
| Apple Maps | | | | |
| Bing Places | | | | |
| BBB | | | | |
| Industry directories | | | | |
| Old website versions (Wayback Machine) | | | | |

**Step 3: Fix inconsistencies**

Priority order:
1. **Data aggregators first** (Foursquare/Factual, Data.com, Localeze/Neustar, Infogroup/Data.com) — fixing these propagates corrections to hundreds of downstream directories
2. **Major platforms** (Google, Apple, Bing, Facebook, Yelp) — direct traffic sources
3. **Industry directories** — category relevance
4. **All remaining** — long tail cleanup

**Step 4: Monitor ongoing**

- Set Google Alerts for your business name + address + phone
- Run citation scans quarterly
- When any business detail changes (phone number, address, name), update ALL sources within 48 hours

---

## Local Citation Building

Citations are mentions of your business NAP on other websites. They come in two forms: **structured** (directory listings with standardized fields) and **unstructured** (mentions in blog posts, news articles, or social media). Both contribute to local ranking signals.

### Tier 1: Core Citations (Do These First)

These platforms have the highest domain authority and the strongest local ranking influence. Complete all of them before moving to lower tiers.

| # | Platform | URL | Category Coverage |
|---|----------|-----|-------------------|
| 1 | Google Business Profile | business.google.com | All |
| 2 | Apple Maps (Apple Business Connect) | businessconnect.apple.com | All |
| 3 | Bing Places | bingplaces.com | All |
| 4 | Facebook Business | business.facebook.com | All |
| 5 | Yelp | biz.yelp.com | All |
| 6 | Better Business Bureau | bbb.org | All |
| 7 | Foursquare | business.foursquare.com | All |
| 8 | Yellow Pages | yellowpages.com | All |
| 9 | MapQuest | mapquest.com | All |
| 10 | Superpages | superpages.com | All |

### Tier 2: Data Aggregators

These feed data to hundreds of downstream directories. Submitting to aggregators is the most efficient way to build citation volume.

| Aggregator | Coverage | Submission |
|-----------|----------|-----------|
| **Foursquare (Factual)** | Powers Apple Maps, Bing, Uber, 100+ apps | business.foursquare.com |
| **Data.com (Infogroup)** | Feeds 50+ directories including MapQuest, Superpages | expressupdateusa.com |
| **Neustar Localeze** | Feeds 100+ directories, GPS systems, 411 services | neustarlocaleze.biz |
| **Acxiom** | Feeds directories, financial institutions, government databases | acxiom.com |

### Tier 3: General Directories (Pick 15-20)

| # | Platform | Notes |
|---|----------|-------|
| 11 | Angi (Angie's List) | Home services, healthcare |
| 12 | Thumbtack | Service professionals |
| 13 | Citysearch | Local businesses |
| 14 | DexKnows | General directory |
| 15 | Hotfrog | Small businesses |
| 16 | Manta | Small businesses |
| 17 | MerchantCircle | Local merchants |
| 18 | ShowMeLocal | Local businesses |
| 19 | CitySquares | Local businesses |
| 20 | eLocal | Service professionals |
| 21 | Brownbook | Global directory |
| 22 | ChamberOfCommerce.com | Local businesses |
| 23 | Local.com | Local discovery |
| 24 | Tupalo | European + US coverage |
| 25 | US City Pages | US cities |
| 26 | Hub.biz | Business directory |
| 27 | Cylex | Business directory |
| 28 | n49 | North American businesses |
| 29 | Opendi | Business directory |
| 30 | Yalwa | International directory |

### Tier 4: Industry-Specific Directories

These carry outsized weight because they provide category relevance signals.

| Industry | Key Directories |
|----------|----------------|
| **Restaurants/Food** | TripAdvisor, OpenTable, Zomato, Grubhub, DoorDash, MenuPages |
| **Healthcare** | Healthgrades, Zocdoc, Vitals, WebMD, RateMDs, CareDash |
| **Legal** | Avvo, FindLaw, Justia, Lawyers.com, Martindale-Hubbell |
| **Real Estate** | Zillow, Realtor.com, Trulia, Redfin, Homes.com |
| **Home Services** | HomeAdvisor, Angi, Porch, Thumbtack, Houzz |
| **Automotive** | CarFax, Cars.com, AutoTrader, DealerRater, Edmunds |
| **Hotels/Travel** | TripAdvisor, Booking.com, Hotels.com, Expedia, Kayak |
| **Financial** | NerdWallet, Bankrate, Investopedia, WalletHub, Credit Karma |
| **Fitness/Wellness** | ClassPass, Mindbody, GymBird, Wellness.com |
| **Education** | GreatSchools, Niche, Privateschoolreview |
| **Wedding** | The Knot, WeddingWire, Zola |
| **Pet Services** | Rover, BringFido, PetSmart |

### Citation Building Checklist

- [ ] Establish canonical NAP record
- [ ] Submit to all Tier 1 platforms
- [ ] Submit to all 4 data aggregators
- [ ] Identify and submit to 15-20 Tier 3 general directories
- [ ] Identify and submit to 5-10 industry-specific directories for `{{BUSINESS_CATEGORY}}`
- [ ] Verify all listings are live and accurate 2 weeks after submission
- [ ] Set quarterly citation audit reminders
- [ ] Track citation count and consistency score in BrightLocal or Moz Local

---

## Google Reviews Strategy

Reviews are the third most important local ranking factor (after GBP signals and on-page signals). But beyond ranking, they are the primary trust signal for consumers — 87% of consumers read online reviews for local businesses.

### Review Acquisition Framework

#### Timing the Ask

The highest review conversion happens at the "peak moment of satisfaction":

| Business Type | Peak Moment | Ask Method |
|--------------|-------------|------------|
| **Service business** | Immediately after service completion | In-person ask + follow-up text/email within 2 hours |
| **Restaurant** | At the table after a positive dining experience | Table card with QR code + follow-up for catering clients |
| **Retail** | At checkout or after delivery confirmation | Receipt QR code + post-purchase email |
| **Healthcare** | After successful treatment outcome | Follow-up email 1-2 days after appointment |
| **Professional services** | After project milestone or case resolution | Personal email from the lead professional |

#### Review Solicitation Methods

1. **Direct URL shortcut**: Create a Google review link for {{BUSINESS_NAME}}:
   ```
   https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
   ```
   Find your Place ID at: https://developers.google.com/maps/documentation/places/web-service/place-id

2. **QR codes**: Print the review link as a QR code on receipts, table tents, business cards, and signage

3. **Email sequence**:
   - Email 1 (2 hours post-service): "How did we do?" with direct Google review link
   - Email 2 (48 hours, only if no review): "Your feedback helps other [residents of SERVICE_AREA] find us"
   - Do NOT send a third email — it becomes spam

4. **SMS/text message**: Highest open rate (98%). Send a short message with the review link. Ensure opt-in compliance.

5. **In-person ask script**:
   ```
   "We're glad you're happy with [specific service]. Would you mind sharing
   your experience on Google? It really helps other people in {{SERVICE_AREA}}
   find us. I can text you the link right now."
   ```

#### Review Velocity Targets

| Monthly Revenue | Target Reviews/Month | Why |
|----------------|---------------------|-----|
| < $50K | 2-4 new reviews | Build initial credibility |
| $50K-$250K | 4-10 new reviews | Maintain competitive pace |
| $250K-$1M | 10-20 new reviews | Dominate local pack |
| > $1M | 20+ new reviews | Defend market position |

**Warning:** Sudden spikes in review volume (e.g., 0 reviews for months then 30 in a week) trigger Google's spam filters. Aim for steady, consistent velocity.

### Review Response Templates

#### Responding to Positive Reviews (5 stars)

```
Thank you, [Reviewer Name]! We're glad [specific detail they mentioned]
went well. Our team at {{BUSINESS_NAME}} takes pride in [relevant service
quality point]. We look forward to serving you again.

— [Staff Name], {{BUSINESS_NAME}}
```

**Rules:**
- Respond within 24-48 hours
- Reference something specific from their review (proves you read it)
- Mention your business name and a service keyword naturally (it gets indexed)
- Keep it under 100 words — do not write an essay

#### Responding to Negative Reviews (1-3 stars)

```
[Reviewer Name], thank you for letting us know about your experience.
This is not the standard we hold ourselves to at {{BUSINESS_NAME}}.
I'd like to understand what happened and make it right. Please contact
me directly at {{BUSINESS_PHONE}} or [email] so we can resolve this.

— [Owner/Manager Name], {{BUSINESS_NAME}}
```

**Rules:**
- Respond within 12-24 hours — speed matters for damage control
- Never argue, never be defensive, never blame the customer publicly
- Acknowledge the issue without admitting legal liability
- Move the conversation offline immediately
- If you resolve the issue, the customer may update their review

#### Responding to Fake/Spam Reviews

```
We have no record of this transaction in our system at {{BUSINESS_NAME}}.
We take all feedback seriously, but we believe this review may have been
posted in error. If you are a customer, please contact us at
{{BUSINESS_PHONE}} so we can look into this.
```

**Then:** Flag the review in Google Business Profile as spam. Go to the review, click the three dots, select "Report review." If the review violates Google's policies (fake, off-topic, conflict of interest), it may be removed. Follow up through Google Business Profile support if it is not removed within 7 days.

### Review Monitoring Setup

- [ ] Set up email notifications for new Google reviews in GBP dashboard
- [ ] Configure alerts for Yelp, Facebook, and industry-specific review platforms
- [ ] Create a shared response template document that staff can use
- [ ] Assign review response ownership (who responds, within what timeframe)
- [ ] Track review metrics monthly: total count, average rating, response rate, review velocity

---

## Local Schema Markup

Structured data helps Google understand your business information with precision. For local businesses, the `LocalBusiness` schema (and its more specific subtypes) provides location, contact, hours, and geo-coordinates in a machine-readable format.

### Complete LocalBusiness JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "{{BASE_URL}}/#organization",
  "name": "{{BUSINESS_NAME}}",
  "description": "Brief description of {{BUSINESS_NAME}} and its services in {{SERVICE_AREA}}.",
  "url": "{{BASE_URL}}",
  "telephone": "{{BUSINESS_PHONE}}",
  "email": "contact@example.com",
  "image": [
    "{{BASE_URL}}/images/storefront.jpg",
    "{{BASE_URL}}/images/interior.jpg",
    "{{BASE_URL}}/images/logo.png"
  ],
  "logo": "{{BASE_URL}}/images/logo.png",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "City",
    "addressRegion": "ST",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "14:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "00:00",
      "closes": "00:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/{{BUSINESS_NAME_SLUG}}",
    "https://www.instagram.com/{{BUSINESS_NAME_SLUG}}",
    "https://www.linkedin.com/company/{{BUSINESS_NAME_SLUG}}",
    "https://www.yelp.com/biz/{{BUSINESS_NAME_SLUG}}"
  ],
  "hasMap": "https://www.google.com/maps?cid=YOUR_CID_NUMBER",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "geoRadius": "50000"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

### More Specific Schema Types

Use the most specific `@type` that matches your business. `LocalBusiness` is the parent; subtypes carry more semantic meaning:

| Business Type | Schema @type | Parent |
|---------------|-------------|--------|
| Restaurant | `Restaurant` | `FoodEstablishment` > `LocalBusiness` |
| Bar | `BarOrPub` | `FoodEstablishment` > `LocalBusiness` |
| Dentist | `Dentist` | `MedicalBusiness` > `LocalBusiness` |
| Attorney | `Attorney` | `LegalService` > `LocalBusiness` |
| Auto repair | `AutoRepair` | `AutomotiveBusiness` > `LocalBusiness` |
| Hair salon | `HairSalon` | `HealthAndBeautyBusiness` > `LocalBusiness` |
| Real estate agent | `RealEstateAgent` | `LocalBusiness` |
| Hotel | `Hotel` | `LodgingBusiness` > `LocalBusiness` |
| Gym | `ExerciseGym` | `SportsActivityLocation` > `LocalBusiness` |
| Pharmacy | `Pharmacy` | `MedicalBusiness` > `LocalBusiness` |
| Store | `Store` (or `ClothingStore`, `ElectronicsStore`, etc.) | `LocalBusiness` |

### Service Schema (for service-area businesses)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Emergency Plumbing Repair",
  "provider": {
    "@type": "LocalBusiness",
    "name": "{{BUSINESS_NAME}}",
    "@id": "{{BASE_URL}}/#organization"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Chicago",
      "@id": "https://en.wikipedia.org/wiki/Chicago"
    },
    {
      "@type": "City",
      "name": "Evanston",
      "@id": "https://en.wikipedia.org/wiki/Evanston,_Illinois"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Plumbing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Drain Cleaning"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Water Heater Repair"
        }
      }
    ]
  }
}
```

### Schema Validation

- [ ] Test all schema with Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Validate JSON-LD syntax at https://validator.schema.org/
- [ ] Verify schema appears in Google Search Console > Enhancements
- [ ] Check that no errors or warnings appear for structured data in Search Console
- [ ] Ensure `geo` coordinates match your actual business location (not a generic city center)

---

## Local Keyword Strategy

Local keywords have a fundamentally different structure than general organic keywords. They are geographically modified, intent-heavy, and often trigger the local map pack instead of standard organic results.

### Keyword Pattern Matrix

| Pattern | Example | Intent | Competition | Value |
|---------|---------|--------|-------------|-------|
| `[service] + [city]` | "plumber chicago" | High commercial | High | High |
| `[service] + near me` | "plumber near me" | High commercial | Very high | Very high |
| `best + [service] + [city]` | "best plumber chicago" | Commercial investigation | High | High |
| `[service] + [neighborhood]` | "plumber lincoln park" | High commercial | Low-medium | High |
| `[service] + [zip code]` | "plumber 60614" | High commercial | Low | Medium |
| `cheap/affordable + [service] + [city]` | "affordable plumber chicago" | Price-sensitive | Medium | Medium |
| `emergency + [service] + [city]` | "emergency plumber chicago" | Urgent commercial | Medium | Very high |
| `[service] + reviews + [city]` | "plumber reviews chicago" | Research | Medium | Medium |
| `[service] + open now` | "plumber open now" | Urgent commercial | Medium | Very high |
| `[service] + [landmark/area]` | "plumber near O'Hare" | Local discovery | Low | Medium |

### Building Your Local Keyword Universe

**Step 1: Core service keywords**

List every service {{BUSINESS_NAME}} offers:
```
Service 1: ________________
Service 2: ________________
Service 3: ________________
Service 4: ________________
Service 5: ________________
```

**Step 2: Geographic modifiers**

List all relevant geographic terms for {{SERVICE_AREA}}:
```
Primary city: ________________
Secondary cities: ________________, ________________, ________________
Neighborhoods: ________________, ________________, ________________, ________________
Counties: ________________
Zip codes: ________________, ________________, ________________
Landmarks: ________________, ________________
```

**Step 3: Cross-multiply**

Every service keyword x every geographic modifier = your local keyword universe. A business with 5 services and 10 geographic modifiers has 50 core local keywords before adding intent modifiers.

**Step 4: Add intent modifiers**

For each service x location combination, consider adding:
- "best" — commercial investigation
- "cheap" / "affordable" — price-sensitive
- "emergency" / "24 hour" — urgency
- "reviews" / "ratings" — research
- "near me" — proximity (optimized through GBP, not page targeting)

### "Near Me" Optimization

You cannot literally optimize a page for "near me" by putting "near me" in your content. Google replaces "near me" with the searcher's actual location and returns results based on proximity, relevance, and prominence. Instead:

- **Proximity**: Ensure your GBP address and geo-coordinates are accurate
- **Relevance**: Ensure your GBP categories and website content match the service being searched
- **Prominence**: Build citations, earn reviews, and create location-relevant content
- **Mobile optimization**: "Near me" searches are 90%+ mobile — your site must be fast and mobile-friendly

### Neighborhood Targeting Strategy

Neighborhoods are low-competition, high-intent local keywords that most competitors ignore.

**Content approach:**
- Create a dedicated page for each major neighborhood you serve
- Include neighborhood-specific content: landmarks, common issues, testimonials from residents
- Internal link each neighborhood page to the parent city service page
- Add neighborhood-specific schema with `areaServed`

**Example URL structure:**
```
{{BASE_URL}}/plumbing-services/chicago/
{{BASE_URL}}/plumbing-services/chicago/lincoln-park/
{{BASE_URL}}/plumbing-services/chicago/wicker-park/
{{BASE_URL}}/plumbing-services/chicago/lakeview/
```

---

## Google Maps Optimization

The Google Maps "local pack" (3-pack) appears for the majority of local-intent queries and receives a disproportionate share of clicks. Ranking in the local pack is governed by different factors than standard organic results.

### Local Pack Ranking Factors

| Factor | Weight | What It Means |
|--------|--------|---------------|
| **Proximity** | Very high | How close your business is to the searcher. You cannot change your physical location, but you can optimize service area settings. |
| **Relevance** | High | How well your GBP profile matches the search query. Driven by categories, business description, reviews, and website content. |
| **Prominence** | High | How well-known and trusted your business is. Driven by review count, review quality, citation volume, backlinks, and brand search volume. |
| **GBP completeness** | Medium | Fully completed profiles outrank incomplete ones consistently. |
| **Review signals** | Medium-high | Total count, average rating, review velocity, keyword mentions in reviews, owner responses. |
| **Website signals** | Medium | On-page SEO, domain authority, mobile-friendliness of the linked website. |
| **Behavioral signals** | Medium | Click-through rate, direction requests, phone calls, dwell time on profile. |

### Pin Placement and Service Area

- If your business has a physical location customers visit, ensure the map pin is on your exact building, not the parking lot or the street
- Log in to GBP, go to Info > Location, and drag the pin to the precise location
- If customers visit you: show your address and pin on the map
- If you visit customers: hide your address, set service area by city/region, pin will not show to searchers
- If both: show your address AND set a service area

### Driving Directions Optimization

Google tracks how many people request driving directions to your business as a ranking signal.

- Make your address easy to find on your website (footer, contact page, location pages)
- Embed Google Maps on your contact page and each location page
- Include a "Get Directions" link that opens Google Maps with your location pre-filled:
  ```
  https://www.google.com/maps/dir/?api=1&destination={{BUSINESS_ADDRESS_ENCODED}}
  ```
- Encourage check-ins and direction requests through your GBP posts

### Local Pack Grid Tracking

Standard rank tracking checks one position for a keyword. But local pack results change based on where the searcher is physically located. Grid tracking checks your ranking from dozens of points across your service area.

**Tools for grid tracking:**
- Local Falcon (localfalcon.com) — the most widely used grid tracker
- Local Viking (localviking.com) — grid tracking with GBP management
- BrightLocal (brightlocal.com) — grid tracking within broader local SEO suite

**How to use grid tracking:**
1. Set your business location as the center point
2. Define a grid (e.g., 7x7 = 49 points) covering {{SERVICE_AREA}}
3. Track your target keywords weekly
4. Identify geographic weak spots where you rank poorly
5. Strengthen weak areas through neighborhood-specific content, citations, and reviews mentioning those areas

---

## Multi-Location Landing Pages

If {{BUSINESS_NAME}} operates multiple locations or serves multiple distinct areas, each location needs its own landing page. These pages must be substantive — not thin duplicates with only the city name swapped.

### Location Page Template

```
URL: {{BASE_URL}}/locations/[city-slug]/

H1: {{BUSINESS_CATEGORY}} in [City Name] | {{BUSINESS_NAME}}

Section 1: Location-Specific Introduction (150-200 words)
  - What services you provide in this specific location
  - How long you have served this area
  - What makes this location unique (team members, specialties, community ties)

Section 2: Services Available at This Location
  - List of services with brief descriptions
  - Link each service to its dedicated service page
  - Note any services unique to or unavailable at this location

Section 3: Location Details
  - Full address with embedded Google Map
  - Phone number (location-specific if applicable)
  - Business hours for this location (may differ from other locations)
  - Parking and accessibility information
  - Public transit directions

Section 4: Team at This Location (3-5 staff profiles)
  - Name, photo, role, brief bio
  - This is unique content that no other location page has

Section 5: Customer Reviews from This Location
  - Embed or display 3-5 reviews specifically mentioning this location
  - Include a CTA to leave a review for this location

Section 6: Service Area Map
  - Visual map showing the neighborhoods/areas served from this location
  - List of neighborhoods with links to neighborhood-specific pages if they exist

Section 7: Local Community Involvement
  - Sponsorships, events, partnerships in this specific area
  - Photos from local events

Section 8: FAQ Specific to This Location
  - 3-5 questions specific to this location (parking, hours, services)
```

### Avoiding Thin Location Pages

Google explicitly penalizes "doorway pages" — pages that exist solely to rank for location keywords with no unique value. Every location page must pass this test:

| Thin Page Signal | How to Avoid It |
|-----------------|-----------------|
| Same content with only the city name changed | Write unique intro, include location-specific team, reviews, and community info |
| No unique images | Photograph the actual location, team, and local landmarks |
| No unique reviews or testimonials | Pull reviews that mention the specific location |
| Boilerplate service descriptions | Adapt service descriptions to mention local conditions or regulations |
| No embedded map or real address | Embed a Google Map for the actual location; show the real address |
| Hundreds of pages for cities you do not actually serve | Only create pages for areas where you have a physical presence or actively serve customers |

### Location Page Schema

Each location page should include its own `LocalBusiness` structured data with the specific address, phone, hours, and geo-coordinates for that location. Do NOT use a single organization-level schema for a multi-location business — each location is a distinct entity.

---

## Local Link Building

Links from locally relevant websites carry more weight for local SEO than links from random high-DA sites with no geographic connection.

### Local Link Opportunities

| Strategy | Effort | Impact | Approach |
|----------|--------|--------|----------|
| **Chamber of Commerce** | Low | High | Join your local chamber. Membership includes a directory listing with a backlink. |
| **Local sponsorships** | Medium | High | Sponsor local sports teams, school events, charity runs. Sponsorship pages link to sponsors. |
| **Local event hosting** | Medium | High | Host workshops, open houses, community events. Event listings on local news and calendar sites create links. |
| **Local news/PR** | Medium | Very high | Pitch stories to local newspapers, TV stations, and local blogs. A link from a local news site is extremely valuable. |
| **Local business associations** | Low | Medium | Join industry associations that have member directories with links. |
| **Local blogger outreach** | Medium | Medium | Identify local bloggers (food, lifestyle, parenting) and offer to collaborate. |
| **Scholarship program** | Medium | High | Create a local scholarship. Schools and universities link to scholarship pages with .edu backlinks. |
| **Testimonials for vendors** | Low | Medium | Write a testimonial for a vendor or partner you use. Many businesses display testimonials with a link back. |
| **Local charity/nonprofit partnerships** | Low | Medium | Partner with local nonprofits. Their websites often list partners and sponsors. |
| **Local resource pages** | Medium | High | Many city and community websites have "local resources" or "local business" pages. Reach out to be included. |
| **Guest posts on local blogs** | Medium | Medium | Write for local business blogs, community sites, or neighborhood publications. |
| **Co-marketing with complementary businesses** | Medium | Medium | Partner with non-competing local businesses for cross-promotion and reciprocal content features. |

### Local Link Building Checklist

- [ ] Join the local Chamber of Commerce and ensure directory listing is live
- [ ] Identify 5 local sponsorship opportunities (sports teams, events, schools)
- [ ] Build a list of 10 local bloggers and journalists for outreach
- [ ] Create a scholarship or community program that attracts .edu links
- [ ] Write testimonials for 3-5 vendors and request they link back
- [ ] Identify 5 local resource/directory pages and submit for inclusion
- [ ] Plan 2 community events per year that generate local press coverage
- [ ] Set up Google Alerts for local news opportunities related to `{{BUSINESS_CATEGORY}}`

---

## Local Rank Tracking

Local SEO measurement requires different tools and approaches than standard organic rank tracking because results vary by the searcher's physical location.

### Core Local SEO Metrics

| Metric | Source | Frequency | Target |
|--------|--------|-----------|--------|
| **GBP profile views** | GBP Insights | Weekly | Increasing month-over-month |
| **GBP search queries** | GBP Insights | Weekly | Growing keyword diversity |
| **Direction requests** | GBP Insights | Weekly | Increasing |
| **Phone calls from GBP** | GBP Insights | Weekly | Increasing |
| **Website clicks from GBP** | GBP Insights | Weekly | Increasing |
| **Photo views** | GBP Insights | Monthly | Higher than competitors |
| **Review count** | GBP Dashboard | Monthly | Steady growth per velocity targets |
| **Average rating** | GBP Dashboard | Monthly | 4.5+ stars |
| **Local pack position** | Grid tracking tool | Weekly | Top 3 for priority keywords |
| **Organic local keywords** | Rank tracker | Weekly | Position improvements |
| **Citation count and accuracy** | Citation scanner | Quarterly | Growing count, 95%+ accuracy |
| **Local organic traffic** | GA4 (geo filter) | Monthly | Increasing from target areas |

### Tool Recommendations

| Tool | Purpose | Pricing Tier |
|------|---------|-------------|
| **Google Business Profile Insights** | First-party GBP performance data | Free |
| **Google Search Console** | Organic search queries and click data | Free |
| **BrightLocal** | Full local SEO suite: citations, grid tracking, auditing | Paid |
| **Local Falcon** | Grid-based local pack rank tracking | Paid |
| **Whitespark** | Citation building and local rank tracking | Paid |
| **Moz Local** | Citation management and distribution | Paid |
| **GatherUp** | Review monitoring and solicitation | Paid |
| **Semrush/Ahrefs** | Organic keyword tracking with local filters | Paid |

### Monthly Local SEO Reporting Template

```
LOCAL SEO MONTHLY REPORT — {{BUSINESS_NAME}}
Period: [Month Year]

GBP PERFORMANCE
  Total profile views:      _____ (vs last month: _____%)
  Search queries:           _____ (vs last month: _____%)
  Direction requests:       _____ (vs last month: _____%)
  Phone calls:              _____ (vs last month: _____%)
  Website clicks:           _____ (vs last month: _____%)

REVIEWS
  New reviews this month:   _____
  Average rating:           _____ stars
  Total lifetime reviews:   _____
  Response rate:            _____% (target: 100%)

LOCAL PACK RANKINGS
  Keywords in top 3:        _____
  Keywords in positions 4-7: _____
  Keywords not in pack:     _____
  Grid coverage score:      _____% (from grid tracking)

CITATIONS
  Total citations:          _____
  NAP accuracy score:       _____%
  New citations built:      _____

LOCAL ORGANIC TRAFFIC (GA4)
  Sessions from target area: _____
  Conversions from local:    _____
  Top landing pages:         _____

ACTIONS FOR NEXT MONTH
  1. _________________________________
  2. _________________________________
  3. _________________________________
```

---

## Cross-References

- **Structured data patterns**: `36-seo/technical/structured-data-cookbook.md`
- **On-page SEO fundamentals**: `36-seo/on-page/`
- **Link building strategy (non-local)**: `36-seo/off-page/`
- **SEO measurement framework**: `36-seo/measurement/`
- **Overall SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **NAP/citation data in placeholder registry**: `PLACEHOLDER-REGISTRY.md`
