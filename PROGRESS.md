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
- [x] Unit, integration, and E2E tests — 207 passing across 30 test files, 0 failing; uses `chibuzormekalam@gmail.com` as test lead/student
- [x] Lead deletion — admin can delete non-enrolled leads; enrolled leads (converted to student) are protected
- [x] Lead delete confirmation — replaced browser confirm() with inline custom UI (no native alert)
- [x] Status change loader — spinner appears on the active status button while the PATCH request is in flight
- [x] Admin notification emails — all 5 form routes send a distinct, structured admin alert to NOTIFICATION_EMAIL with lead details table and reply-to set to the lead's email; clearly separate from the customer-facing confirmation
- [x] Admin notifications driven by DB — `notifyAdmins()` queries `AdminUser` where `role = "admin"` so adding/changing the admin automatically updates who gets notified; no hardcoded env var needed
- [x] Cursor pointer on all admin action buttons — every button across LeadDetail, StudentDetail, TeamManager, WebinarManager, CourseManager, AdminNav, Login, Forgot Password, and Reset Password pages
- [x] Services DB feature — `Service` model added to Prisma schema, seeded with 3 existing services; admin can add, edit, and delete services at `/admin/services`; homepage and `/services` page now fetch live from DB (hardcoded array removed); 6 icon choices available; published/draft toggle; sort order control
- [x] Cursor pointer on all public-facing action buttons — added `cursor-pointer` to every interactive button across the public UI: CourseCard (Details/close modal), HeroSection (pagination dots), Navbar (hamburger), CourseList (See More/Show Less), TestimonialCarousel (prev/next), FaqAccordion (toggle), ThemeToggle, and CourseInquiryForm (Remove photo)
- [x] Webinar modal registration — each webinar on `/webinars` is its own card with a "Register Now" button that opens a modal form (WebinarCard component, mirrors CourseCard pattern); past webinars show "Watch Recording" instead; homepage webinar section replaced with a preview grid of up to 6 webinars (3 upcoming + 3 past) as link cards to `/webinars`
- [x] 6-layer audit fixes — all FAIL and PARTIAL FAIL items from the Layer 1–6 audit resolved: (1) DB indexes added on Lead.status/leadSource/createdAt, Student.paymentStatus, Webinar.date; (2) Admin JWT session maxAge set to 8 hours (was defaulting to 30 days); (3) Cloudinary added to next.config.ts remotePatterns so student photos can use Next/Image; (4) force-dynamic removed from homepage and /services — both now use ISR (revalidatePath already called on all admin mutations); (5) Leads and students list APIs now paginate at 50/page with `{ data, total, page, pages }` response; (6) LeadsTable and StudentsTable updated with Prev/Next pagination UI; (7) courses PATCH route now uses an explicit field allowlist instead of spreading the full request body into Prisma
- [x] Webinar "notify me" loop — visitors with no upcoming webinar can submit name+email via WebinarNotifyForm (leadSource: "webinar_notify"); admin sees the count on the Webinars panel and can broadcast a registration-open email to all interested leads with one click via POST /api/admin/webinars/notify-all; all tests updated to match the new pagination and webinar API shapes (207 passing, 0 failing)
- [x] Admin forgot-password now returns a 404 error when the email is not in the database — previously returned silent success
- [x] Full-screen Cyvant spinner overlay (CyvantSpinner component) added to all forms and admin action buttons — dark backdrop with animated ring and CY/VANT wordmark
- [x] Pagination added to all admin list views (TeamManager, ServiceManager, PartnerManager, WebinarManager, CourseManager) — 10 items per page, shared Pagination component, per-tier pagination in CourseManager
- [x] Webinar admin "View list" panel — shows all leads who signed up for webinar notifications (name, email, date), always visible with empty state when count is 0
- [x] Password visibility toggle (eye icon) added to admin login, forgot-password, and reset-password pages
- [x] Favicon replaced — removed default Vercel logo; browser tab now shows a dark rounded square with CY in white and V in Cyvant blue (app/icon.svg)
- [x] CourseCard badges (Start Here, Most Popular) now render even when no cover image is set — previously only appeared over the image
- [x] Test suite updated and passing — 207 tests, 30 suites, 0 failing; fixed HeroSection class assertion (bg-[#007dff]) and CourseCard/CoursesPage badge tests
