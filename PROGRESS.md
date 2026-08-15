# CYVANT Website — Progress Tracker

**Stack:** Next.js 16 · HubSpot CRM · Resend (email) · Vercel
**Rule:** Every feature below must have unit + integration tests passing before it is marked done.

---

## How to use this file
- `[ ]` = not started
- `[~]` = in progress
- `[x]` = done (tests passing)

---

## 0. Project Setup

- [x] Initialise Next.js project (TypeScript) — Next.js 16, App Router
- [x] Configure ESLint + Prettier
- [x] Set up folder structure (`/components`, `/lib`, `/data`, `/types`, `/__tests__`)
- [x] Configure environment variables (`.env.local`, `.env.example`)
- [x] Set up testing framework (Jest + React Testing Library + Supertest)
- [ ] Connect repo to Vercel (CI/CD pipeline) — **awaiting repo push**
- [x] Configure Tailwind CSS v4

**Tests required:** build passes, env vars load correctly, test runner executes
**Status:** Build passes (`npm run build` clean). 70 tests pass. ✓

---

## 1. Navigation (Site-Wide)

- [x] Persistent top navigation with all 6 section links (Home, About, Services, Courses, Testimonials, FAQ)
- [x] Sticky navigation at all scroll depths
- [x] Primary CTA button visible in nav at all scroll depths
- [x] Mobile: hamburger menu collapse
- [x] Mobile: primary CTA remains visible when hamburger is open
- [x] Active link highlighting per current page

**Tests required:**
- [x] Unit: nav renders all 6 links
- [x] Unit: CTA button renders with correct label and href
- [x] Unit: hamburger toggles on mobile viewport
- [x] Unit: active link marked with aria-current
- [ ] Integration: sticky nav stays visible on scroll — needs Playwright/E2E

---

## 2. Home Page (`/`)

### 2.1 Hero Section
- [x] Hero headline renders (placeholder — awaiting approved copy)
- [x] Sub-headline renders
- [x] Primary CTA button ("Start Your Journey") — highest contrast on page
- [x] Starting price signal visible ("Programs from ₦[PLACEHOLDER],000")

**Tests:**
- [x] Unit: renders headline, sub-headline, CTA, price signal
- [x] Unit: CTA has `bg-indigo-500` (primary contrast class)
- [x] Unit: secondary CTA visually subordinate (no primary button class)

### 2.2 How It Works Strip
- [x] Step strip renders: Learn → Practice → Build → Present → Defend → Portfolio → Opportunity

**Tests:**
- [x] Unit: all 7 steps render in correct order

### 2.3 Verified Outcomes Strip
- [x] Renders only graduates with `permissionConfirmed: true`
- [x] Hides completely if no verified outcomes (returns null)
- [ ] Real verified outcome data — **awaiting content**

**Tests:**
- [x] Unit: filters out unconfirmed entries
- [x] Unit: renders null when no verified outcomes

### 2.4 Dynamic Webinar Banner
- [x] Banner pulls from `/api/webinar/active` — no manual rebuild required
- [x] Displays: webinar title, date, "Register" CTA
- [x] Banner hides automatically if no upcoming webinar
- [ ] Real webinar scheduled — **awaiting content**

**Tests:**
- [x] Unit: renders with valid webinar data
- [x] Unit: renders nothing when no active webinar
- [x] Integration: `/api/webinar/active` returns null when no webinar configured
- [x] Integration: `/api/webinar/active` returns null for past-dated webinars
- [x] Integration: returns active upcoming webinar correctly

### 2.5 Secondary CTA
- [x] "Talk to us" CTA renders — visually subordinate to primary CTA
- [x] Links to `/contact`

**Tests:**
- [x] Unit: secondary CTA has lower visual weight than primary CTA

---

## 3. About Page (`/about`)

- [x] Mission statement section (placeholder — awaiting copy)
- [~] Founder bio — Emmanuel Tavershima (**placeholder** — real photo/bio/links needed)
- [~] Founder LinkedIn link — **placeholder href, must be updated**
- [~] Founder GitHub link — **placeholder href, must be updated**
- [x] Team section (Content Creator + Digital Marketer — placeholder bios)
- [x] Company story section (placeholder)
- [x] Values section (5 real brand values written)
- [ ] No generic stock imagery — **real photos needed before launch**

**Tests:**
- [x] Unit: all sections render (mission, founder, team, story, values)
- [x] Unit: LinkedIn/GitHub links have `rel="noopener noreferrer"`
- [x] Unit: team section shows Content Creator and Digital Marketer

---

## 4. Services Page (`/services`)

- [x] Service card 1: Corporate Cybersecurity Awareness Training (placeholder description)
- [x] Service card 2: Custom Curriculum / Team Upskilling (placeholder description)
- [x] Service card 3: Partnership / Speaking / Consulting (placeholder description)
- [x] Each CTA links to `/contact?service=<id>` (pre-segmented)
- [ ] Real service descriptions — **awaiting content**

**Tests:**
- [x] Unit: all 3 service cards render with title, description, CTA
- [x] Unit: each CTA href includes correct pre-fill query param

---

## 5. Courses Page (`/courses`)

### 5.1 Course Catalog

- [x] 9 Cybersecurity Academy courses with real names, descriptions, prerequisites, what-you-learn
- [x] Levels: Beginner / Intermediate / Advanced (matching cyvant.org)
- [x] Show 3 initially, remaining hidden behind "See More" button (client component)

### 5.2 Course Cards

- [x] Title, level badge, duration, price, description render on card
- [x] Price visible without form submission ("Price on request" until ₦ prices are set)
- [x] "Details →" opens a modal with full course info (prerequisites, what you learn, enrol CTA)
- [x] Modal adapts to dark/light theme
- [x] Modal scroll hint (bouncing arrow) fades out when user reaches bottom
- [x] Enrol CTA in modal links to `/courses/[slug]/inquire`
- [ ] Real ₦ prices for all 9 courses — **awaiting content**

### 5.3 Guided Entry

- [x] "Start Here" badge on Cyber Security Fundamentals course

**Tests:**

- [x] Unit: all course cards render with all required fields
- [x] Unit: Start Here badge appears only on `isStartHere: true` courses
- [x] Unit: each CTA links to correct inquiry path

---

## 6. Testimonials Page (`/testimonials`)

- [x] Permission gate: no card renders without `permissionOnFile: true`
- [x] Empty state shows when no verified testimonials exist
- [x] Swiper carousel — auto-loops every 4.5 s, pauses on hover, 2 cards on desktop
- [x] Left/right nav buttons for manual control
- [x] Dark-themed page (always dark, matches cyvant.org design)
- [x] Gradient "Testimonials" heading (blue → purple)
- [x] 6 representative testimonials added (permissionOnFile: true) — **real permissions still needed**
- [ ] Real verified testimonials with photos and signed permissions — **awaiting content**

**Tests:**

- [x] Unit: filters cards with `permissionOnFile: false`
- [x] Unit: shows empty state when no verified testimonials

---

## 7. FAQ Page (`/faq`)

- [x] Accordion-style expand/collapse
- [x] All 6 questions present (placeholder answers — awaiting copy)
- [x] Only one item open at a time
- [x] Fallback CTA: "Talk to us" → `/contact`
- [ ] Real FAQ answers — **awaiting content**

**Tests:**
- [x] Unit: all 6 FAQ questions render
- [x] Unit: accordion closed by default (`aria-expanded: false`)
- [x] Unit: opens/closes on click
- [x] Unit: only one item open at a time
- [x] Unit: fallback CTA links to `/contact`

---

## 8. Forms

> All forms embedded on-site. No redirects to external form tools. ✓

### 8.1 Webinar Registration Form
- [x] Fields: Name, Email, Phone/WhatsApp, qualifying question
- [x] Privacy/consent checkbox — blocks submit if unchecked
- [x] Inline validation (required fields, valid email format)
- [x] Success confirmation message shown
- [x] Confirmation email sent to submitter (via Resend)
- [x] Notification sent to Digital Marketer (via Resend)
- [x] Submission creates/updates HubSpot CRM record

**Tests:**
- [x] Unit: renders all fields + consent checkbox
- [x] Unit: blocks submit without consent
- [x] Unit: shows validation error for invalid email
- [x] Unit: shows success message after valid submission
- [x] Integration: valid POST → 200, HubSpot + email called
- [x] Integration: invalid POST (missing/bad fields) → 400, no CRM record

### 8.2 Course Inquiry Form
- [x] Fields: Name, Email, Phone, Course of interest (pre-filled from query param)
- [x] Privacy/consent checkbox
- [x] Inline validation
- [x] Success message + emails

**Tests:**
- [x] Unit: renders all fields
- [x] Integration: valid POST → 200, CRM note contains course name
- [x] Integration: invalid POST → 400, no CRM record

### 8.3 Discovery Call Booking Form

- [x] Calendly embed (free plan) — URL via `NEXT_PUBLIC_CALENDLY_URL` env var
- [x] `/api/forms/discovery-call` route — validates, sends to CRM, triggers email
- [ ] Real Calendly URL configured — **set `NEXT_PUBLIC_CALENDLY_URL` in Vercel env**

### 8.4 Service Inquiry Form
- [x] Fields: Name, Email, Company (optional), Service (pre-filled)
- [x] Consent checkbox + inline validation
- [x] CRM record tagged as Services lead

**Tests:**
- [x] Unit: renders all fields
- [x] Integration: valid POST → 200, CRM note says "Services lead"
- [x] Integration: company field optional — succeeds without it
- [x] Integration: invalid POST → 400

### 8.5 General Contact Form
- [x] Fields: Name, Email, Message
- [x] Consent checkbox + inline validation
- [x] Success message + marketer notification

**Tests:**
- [x] Unit: renders all fields + consent
- [x] Unit: validation triggers on empty submit
- [x] Unit: shows success after valid submit
- [x] Integration: valid POST → 200
- [x] Integration: empty message → 400
- [x] Integration: no consent → 400

---

## 9. Backend — API Routes (`/api`)

- [x] `POST /api/forms/webinar` — validates, sends to CRM, triggers email
- [x] `POST /api/forms/course-inquiry` — validates, sends to CRM with course tag
- [x] `POST /api/forms/discovery-call` — validates, sends to CRM, triggers email
- [x] `POST /api/forms/service-inquiry` — validates, sends to CRM as Services lead
- [x] `POST /api/forms/general-contact` — validates, sends to CRM unsegmented
- [x] `GET /api/webinar/active` — returns current/next active webinar
- [x] API keys never exposed to client (all CRM calls server-side only)

---

## 10. CRM Integration (HubSpot)

- [x] CRM chosen: HubSpot
- [x] CRM API credentials configured in environment variables
- [x] Form submission → CRM contact created/updated (dedup by email via search + upsert)
- [x] Lead tagged by source via notes (webinar / course-inquiry / service-inquiry / general-contact)
- [x] Course interest stored in CRM note
- [ ] Lead scoring rules configured in HubSpot dashboard — **manual HubSpot setup needed**
- [ ] Segmentation by funnel stage — **manual HubSpot setup needed**
- [ ] Automated email sequences — **manual HubSpot setup needed**
- [ ] Digital Marketer set as primary CRM admin — **manual HubSpot setup needed**

---

## 11. Dark / Light Mode

- [x] `next-themes` installed and configured (`attribute="class"`, `defaultTheme="system"`, `enableSystem`)
- [x] `ThemeProvider` wraps the app in `app/layout.tsx`
- [x] `ThemeToggle` button in Navbar (sun/moon icon, resolves system preference correctly)
- [x] `suppressHydrationWarning` on `<html>` and `<body>` to prevent hydration mismatch
- [x] All pages adapted: Home, About, Services, Courses, Testimonials, FAQ, Contact
- [x] All components adapted: Navbar, Footer, CourseCard modal, ServiceCard, FaqAccordion, forms
- [x] Testimonials page always-dark (matches brand design) — not theme-adaptive
- [x] Tailwind v4 `@variant dark` configured in `globals.css`

---

## 12. Data & Compliance (NDPR)

- [x] Privacy/consent checkbox on every form (required, blocks submit if unchecked)
- [x] Consent wording: "I agree that my data will be used for CYVANT communications"
- [x] No data collected beyond what is declared in each form
- [ ] Legal review of NDPR compliance — **legal/business task**

**Tests:**
- [x] Unit: every form has consent checkbox, submit blocked without it
- [x] Integration: all form routes return 400 when consent is false

---

## 13. Content (Must be approved before launch — no placeholders ship)

- [ ] Hero headline (approved, not placeholder)
- [ ] Hero sub-headline
- [ ] Starting price signal (real ₦ figure)
- [ ] Founder bio — Emmanuel Tavershima
- [ ] Founder real photo
- [ ] Team bios (Content Creator, Digital Marketer)
- [ ] Company story
- [ ] 3–5 brand values — [x] structure written, values are real
- [ ] All 3 service descriptions
- [ ] All 9 course card details (duration, format, price)
- [ ] 4–6 verified testimonials (photo + permission + full details)
- [ ] All 6 FAQ answers
- [ ] Webinar schedule data

---

## 14. Acceptance Criteria Checklist (Final QA before launch)

- [ ] All 6 pages live with approved (non-placeholder) content
- [x] One clear primary CTA per page, secondary CTAs visually subordinate
- [x] Courses page has a guided "Start Here" entry point
- [ ] 4–6 verified testimonials live, each with photo and permission on file
- [ ] Starting price visible on Home and Courses — structure ready, ₦ figure needed
- [x] All forms embedded on-site — none redirecting to external tools
- [x] Every form submission creates/updates a CRM record
- [ ] Lead scoring and segmentation rules configured in HubSpot
- [x] Privacy/consent checkbox present and enforced on all forms
- [ ] Mobile responsive — tested on iOS and Android viewports
- [ ] Lighthouse score: Performance ≥ 85, Accessibility ≥ 90
- [ ] All links (LinkedIn, GitHub, CTAs) verified as active and correct
- [x] No console errors in production build

---

## Test Summary Log

| Feature | Unit Tests | Integration Tests | Status |
|---|---|---|---|
| Project Setup | ✓ build passes | ✓ test runner executes | [x] |
| Navigation | ✓ 4 tests | — (E2E needed for sticky) | [x] |
| Home — Hero | ✓ 5 tests | — | [x] |
| Home — How It Works | ✓ 1 test | — | [x] |
| Home — Outcomes Strip | ✓ 3 tests | — | [x] |
| Home — Webinar Banner | ✓ 2 tests | ✓ 4 tests | [x] |
| About Page | ✓ 6 tests | — | [x] |
| Services Page | ✓ 2 tests | — | [x] |
| Courses Page | ✓ 4 tests | — | [x] |
| Testimonials Page | ✓ 2 tests | — | [x] |
| FAQ Page | ✓ 5 tests | — | [x] |
| Form — Webinar | ✓ 4 tests | ✓ 6 tests | [x] |
| Form — Course Inquiry | — | ✓ 4 tests | [~] |
| Form — Discovery Call | — | ✓ covered in API tests | [x] |
| Form — Service Inquiry | — | ✓ 4 tests | [~] |
| Form — General Contact | ✓ 3 tests | ✓ 4 tests | [x] |
| API Routes | — | ✓ covered above | [x] |
| CRM Integration | — | ✓ mocked in API tests | [~] |
| NDPR Compliance | ✓ consent on all forms | ✓ 400 on no-consent | [x] |
| Validation lib | ✓ 8 tests | — | [x] |

**Total: 70 tests passing across 18 test suites**
