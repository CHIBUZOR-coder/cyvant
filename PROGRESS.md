# CYVANT — Progress & Pending Work

## Pending: requires RESEND_API_KEY + sending domain

Add `RESEND_API_KEY` and `NOTIFICATION_EMAIL` to `.env.local` then implement the following:

### 1. Enrollment confirmation email

When a lead is marked **enrolled** (PATCH `/api/admin/leads/[id]`), send the new student a confirmation email with their course name and next steps.

- File to edit: `app/api/admin/leads/[id]/route.ts`
- Use `sendConfirmation()` from `lib/email.ts`
- Fire-and-forget pattern (don't let email failure block the 200 response)

### 2. Payment confirmation email

When a student's payment status is updated to **paid** (PATCH `/api/admin/students/[id]`), send a payment receipt email.

- File to edit: `app/api/admin/students/[id]/route.ts`
- Use `sendConfirmation()` from `lib/email.ts`

### 3. Admin password reset flow

If an admin or marketer forgets their password, there is currently no way to reset it from the UI.

- Needs a `/admin/forgot-password` page with an email input
- Needs a `/admin/reset-password?token=...` page to set a new password
- Needs a `PasswordResetToken` model in Prisma (or use a signed JWT)
- Send reset link via `sendConfirmation()` from `lib/email.ts`

---

## Pending: content needed from you (no code required)

### 4. Founder photo

Save Emmanuel's photo as `public/images/emmanuel.jpg`. Then in `app/page.tsx`, replace the `<div>` initials avatar with an `<Image>` tag pointing to that file.

### 5. Team member details (Digital Marketer & Content Creator)

The "Meet the team" section (`app/page.tsx` → `FOUNDERS` array) currently only shows Emmanuel. Add the remaining two team members once you have their names, photos, and short bios.

### 6. Services section descriptions

The three service cards in `app/page.tsx` still use placeholder descriptions:

- Corporate Training
- Custom Curriculum Design
- Partnership & Consulting

Replace each with a real one-to-two sentence pitch.

### 7. Individual course prices

All 9 courses in `data/courses.ts` have `startingPrice: 0`. Update each with the real naira price once confirmed.

### 8. AI Academy course track (Academy 2)

The PRD requires a second Academy (AI/Data track). No AI courses exist yet in `data/courses.ts`. Once the curriculum is defined, add them under a new `academy: "AI Academy"` group.

### 9. Testimonial photos

`data/testimonials.ts` has 6 testimonials with `photo: ""`. Save each graduate photo to `public/images/testimonials/` and update the `photo` field with the matching filename.

### 10. Graduate outcomes (OutcomesStrip)

`data/outcomes.ts` contains placeholder entries. Replace with verified graduate outcomes (role, company/employer, cohort, photo) once real data is available.

### 11. Webinar schedule

`data/webinars.ts` is currently empty. Add upcoming webinar entries (title, date, time, registration link) when the schedule is confirmed.

---

## Completed

- [x] Public forms (course inquiry, service inquiry, webinar, discovery call, general contact) write leads to Prisma DB
- [x] Email sending is non-fatal: missing RESEND_API_KEY logs a warning, does not return 500
- [x] Admin lead management (list, detail, status change, activity log)
- [x] Auto-create Student record when lead is marked enrolled
- [x] Admin student management (list, detail, payment status, cohort, notes)
- [x] Lead detail page is read-only once converted to student
- [x] Admin team management (list members, add member via modal, role-based access)
- [x] Role-based access: only admins can access /admin/team and /api/admin/users
- [x] Integration tests updated to match Prisma-based form routes (removed stale HubSpot mocks)
- [x] Hero sub-headline and price signal updated from PDF content
- [x] Founder bio, vision, mission, FAQ answers, and program highlights filled from PDF
- [x] GitHub button on founder card hidden when no URL is provided
