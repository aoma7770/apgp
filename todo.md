# APGP Website TODO

## Database & Schema
- [ ] Extend schema: providers table (email, password, company details, ABN, regions, support types, monday_item_id)
- [ ] Extend schema: accommodations table (provider_id, address, type, vacancy status, support needs, rooms)
- [ ] Generate and apply migrations

## Global Branding & Layout
- [ ] Set navy/teal colour palette in index.css (matching APGP landing page)
- [ ] Build PublicLayout component (top nav + footer)
- [ ] Build responsive navigation with mobile hamburger menu

## Public Pages
- [ ] Home page (hero, what is APGP, stats, CTA)
- [ ] About APGP page (program overview, Ausnew background)
- [ ] Partnership Pathways page (JV + Referral details)
- [ ] Pricing Structure page (pricing tables)
- [ ] Program Outcomes page
- [ ] FAQ page (accordion)
- [ ] Register / Sign Up CTA page

## Provider Auth & Portal
- [ ] Provider sign-up (email + password, free account)
- [ ] Provider login page
- [ ] Provider dashboard layout
- [ ] Company profile creation/edit form (org name, ABN, contact, regions, support types)
- [ ] Accommodation listing: add new property
- [ ] Accommodation listing: edit/delete property
- [ ] Accommodation listing: list all provider's properties

## Staff / Admin Portal
- [ ] Staff login page (separate from provider login)
- [ ] Staff dashboard layout
- [ ] Staff property search interface (filter by region, type, vacancy, support needs)
- [ ] Role-based access control (staff/admin cannot see provider portal and vice versa)
- [ ] Admin user management (promote users to staff role)

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
- [ ] provider.register (public)
- [ ] provider.login (public)
- [ ] provider.getProfile (protected)
- [ ] provider.updateProfile (protected)
- [ ] accommodation.create (protected, provider only)
- [ ] accommodation.update (protected, provider only)
- [ ] accommodation.delete (protected, provider only)
- [ ] accommodation.listMine (protected, provider only)
- [ ] accommodation.search (protected, staff/admin only)

## Tests
- [ ] Provider registration and login test
- [ ] Accommodation CRUD test
- [ ] Staff search access control test
- [ ] Monday.com sync mock test
