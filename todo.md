# APGP Website TODO

## Database & Schema
- [x] Extend schema: providers table (email, password, company details, ABN, regions, support types, monday_item_id)
- [x] Extend schema: accommodations table (provider_id, address, type, vacancy status, support needs, rooms)
- [x] Generate and apply migrations

## Global Branding & Layout
- [x] Set navy/teal colour palette in index.css (matching APGP landing page)
- [x] Build PublicLayout component (top nav + footer)
- [x] Build responsive navigation with mobile hamburger menu

## Public Pages
- [x] Home page (hero, what is APGP, stats, CTA)
- [x] About APGP page (program overview, Ausnew background)
- [x] How It Works page (single Referral Partnership details; all JV references removed)
- [x] Pricing Structure page (pricing tables)
- [x] Program Outcomes page
- [x] FAQ page (accordion)
- [x] Register / Sign Up page at /provider/register with site-wide CTAs

## Provider Auth & Portal
- [x] Provider sign-up (email + password, free account)
- [x] Provider login page
- [x] Provider dashboard layout
- [x] Company profile creation/edit form (org name, ABN, contact, regions, support types)
- [x] Accommodation listing: add new property
- [x] Accommodation listing: edit/delete property
- [x] Accommodation listing: list all provider's properties

## Staff / Admin Portal
- [x] Staff login page (separate from provider login)
- [x] Staff dashboard layout
- [x] Staff property search interface (filter by region, type, vacancy, support needs)
- [x] Role-based access control (staff/admin cannot see provider portal and vice versa)
- [x] Admin user management (super admin and admin roles)

## Admin Portal Overhaul
- [x] Rename Staff Login to Admin Login site-wide (nav, pages, routes)
- [x] Add lead management to admin dashboard: hide/unhide leads (toggle isActive), edit lead details, delete leads
- [x] Add tRPC admin procedures: leads.adminList, leads.toggleActive, leads.update, leads.delete
- [x] Remove active lead count from provider dashboard Live Enquiries header
- [x] Save signed referral agreement as a document in provider Documents tab on expressInterest submit

## Provider Registration Overhaul
- [x] Expand /provider/register to multi-step form with all fields: org name, ABN (optional), contact name, role/position, phone, email, password, state, company type, current vacancies yes/no
- [x] Update provider tRPC register mutation to accept and store all new fields
- [x] Replace all JotformModal Register Free buttons site-wide with Link to /provider/register
- [x] Keep JotformModal component available for general enquiry use (not registration)
- [x] Send welcome notification to Ausnew team with full provider details on registration

## Abdi Feedback Round 3
- [ ] Fix Jotform modal: ensure ALL register buttons use identical centred popup (same as floating button)
- [ ] Update Jotform URL to new form with ABN field and vacancies question (once Abdi provides new URL)
- [ ] Add registration confirmation/welcome email to provider on sign-up
- [x] Add Documents tab to provider dashboard (upload/view signed agreements)
- [x] Add Billing tab to provider dashboard (placeholder for future billing)
- [x] Update Done For You page: add participant enquiries as an alternative pathway in How It Works
- [x] Update copywriting: replace 'Ausnew CRM' with 'our CRM' / 'our pipeline' across all pages
- [ ] Update Home page How It Works steps to mention participant enquiries feed as option 2

## Participant Leads Feed (Corrected Architecture)
- [x] Remove public /request-accommodation page and route
- [x] Add mondayLeadId field to participantLeads table (e.g. M12-123456)
- [x] Add Zapier webhook endpoint POST /api/leads/ingest (API-key protected) so Zapier can push Monday.com leads into the DB
- [x] Rename feed tab to "Live Participant Enquiries" in provider dashboard
- [x] Make feed look like a live real-time stream with new badge and timestamps
- [x] Add teaser/preview section on public home page showing blurred/locked lead cards to entice providers to register
- [x] Keep referral agreement + consent popup as-is
- [x] Keep notifyOwner on provider interest submission

## Blog Section
- [x] Add blog_posts table to schema (title, slug, excerpt, content, cover_image, category, published, author, created_at)
- [x] Apply migration
- [x] Add blog tRPC procedures: list (public), getBySlug (public), create/update/delete (admin only)
- [x] Build /blog listing page with post cards
- [x] Build /blog/:slug individual post page
- [x] Build admin blog management page at /staff/blog (create, edit, delete posts)
- [x] Add Blog nav link to PublicLayout
- [x] Seed 3 starter blog posts
- [x] Add Blog preview section to Home page

## Updates from Abdi Feedback (Jun 3)
- [x] Generate AI hero images for home page and key sections
- [x] Add floating "Register Free" button visible on all public pages while scrolling
- [x] Update contact email to provider@APGPaccommodation.com.au site-wide
- [x] Add phone number (02) 9669 9302 to footer and contact areas
- [x] Update footer copyright to "Accommodation Provider Growth Program" (not Ausnew Support Services)
- [x] Add Terms of Service page at /terms with full APGP MOU content
- [x] Add Terms of Service link to footer
- [x] Enhance scroll animations — elements animate in from left/right/bottom as user scrolls

## Done For You / Turnkey Marketing
- [x] Build dedicated DoneForYou.tsx page at /done-for-you with full turnkey pitch, process steps, and pay-per-result framing
- [x] Add "Done For You" nav link to PublicLayout
- [x] Add "Done For You" hero section/banner to Home page below stats
- [x] Update Home page CTA copy to reflect pay-per-result positioning

## Jotform Lead Form
- [ ] Remove Monday.com server code and schema references
- [x] Build JotformModal component: button triggers a modal popup with Jotform iframe embedded (https://form.jotform.com/253411013737044)
- [x] Add JotformModal to Home page hero and CTA sections
- [x] Add JotformModal to Pathways, Pricing, Outcomes, FAQ, About pages
- [x] Add JotformModal to PublicLayout nav Register Free button

## Backend Procedures (tRPC)
- [x] provider.register (public)
- [x] provider.login (public)
- [x] provider.getProfile (protected)
- [x] provider.updateProfile (protected)
- [x] accommodation.create (protected, provider only)
- [x] accommodation.update (protected, provider only)
- [x] accommodation.delete (protected, provider only)
- [x] accommodation.listMine (protected, provider only)
- [x] accommodation.search (protected, staff/admin only)

## Tests
- [x] Provider registration and login test
- [ ] Accommodation CRUD test
- [x] Staff search access control test
- [ ] Monday.com sync mock test

## Registered Providers Admin Management
- [x] Add secure admin-only provider directory with full registration and company details
- [x] Track provider login activity (last login and login history)
- [x] Build Registered Providers tab with search, summary cards, and expandable activity details
- [x] Add tests for provider directory access control and activity tracking
- [x] Add successful authenticated-admin access test for the provider directory
- [x] Add provider sign-in and sign-out activity tracking tests
