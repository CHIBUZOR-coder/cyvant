# CYVANT — Progress & Pending Work

## Pending: content needed from you (no code required)

### 5. Team member details

No additional team members yet. When ready, add each person (name, role, bio, photo, LinkedIn) to the `FOUNDERS` array in `app/page.tsx`. The avatar will automatically use their photo if provided, or fall back to initials.

### 7. Individual course prices

All 9 courses in `data/courses.ts` have `startingPrice: 0`. Update each with the real naira price once confirmed.

### 8. AI Academy course track (Academy 2)

The PRD requires a second Academy (AI/Data track). No AI courses exist yet in `data/courses.ts`. Once the curriculum is defined, add them under a new `academy: "AI Academy"` group.

### 9. Testimonial photos

`data/testimonials.ts` has 6 testimonials with `photo: ""`. Save each graduate photo to `public/images/testimonials/` and update the `photo` field with the matching filename.

### 10. Graduate outcomes (OutcomesStrip)

`data/outcomes.ts` contains placeholder entries. Replace with verified graduate outcomes (role, company/employer, cohort, photo) once real data is available.

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
- [x] Enrollment confirmation email — fires on lead status → enrolled (fire-and-forget)
- [x] Payment confirmation email — fires on student paymentStatus → paid (fire-and-forget)
- [x] Testimonial carousel replaced with 3 SVG slides
- [x] Founder photo (Emmanuel) — saved to public/images/emmanuel.png
- [x] Services section descriptions — all 3 updated with real copy
- [x] Webinar feature — banner, /webinars page, admin CRUD, DB-backed (Prisma)
- [x] Webinar flier image upload via Cloudinary
- [x] Student inquiry photo upload via Cloudinary (optional field)
- [x] All screens and pages made responsive across all screen sizes
- [x] Image uploads switched from filesystem to Cloudinary
- [x] Admin password reset flow — `/admin/forgot-password` + `/admin/reset-password`, DB token model, email via Resend
- [x] Homepage and public pages fetch courses/webinars live from DB (force-dynamic, revalidatePath) — admin changes reflect immediately
- [x] Unit, integration, and E2E tests — 80 passing across 6 test files; uses `chibuzormekalam@gmail.com` as test lead/student
- [x] Lead deletion — admin can delete non-enrolled leads; enrolled leads (converted to student) are protected
- [x] Lead delete confirmation — replaced browser confirm() with inline custom UI (no native alert)
- [x] Status change loader — spinner appears on the active status button while the PATCH request is in flight
- [x] Admin notification emails — all 5 form routes send a distinct, structured admin alert to NOTIFICATION_EMAIL with lead details table and reply-to set to the lead's email; clearly separate from the customer-facing confirmation
- [x] Admin notifications driven by DB — `notifyAdmins()` queries `AdminUser` where `role = "admin"` so adding/changing the admin automatically updates who gets notified; no hardcoded env var needed
- [x] Cursor pointer on all admin action buttons — every button across LeadDetail, StudentDetail, TeamManager, WebinarManager, CourseManager, AdminNav, Login, Forgot Password, and Reset Password pages
- [x] Services DB feature — `Service` model added to Prisma schema, seeded with 3 existing services; admin can add, edit, and delete services at `/admin/services`; homepage and `/services` page now fetch live from DB (hardcoded array removed); 6 icon choices available; published/draft toggle; sort order control
