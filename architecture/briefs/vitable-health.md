# Vitable Health — Architecture Research Brief

**Subject:** Vitable Health, a Philadelphia-based modern health benefits platform (DPC + ICHRA + ACA compliance) serving 50,000+ members across 400+ small/mid employers.
**Research date:** May 2026.

**Critical caveat — please read first.** The premise that motivated this research was a Supabase HIPAA case study at `supabase.com/customers/vitable`. That URL returned **HTTP 404** as of May 2026, and Vitable Health does not appear in Supabase's current public customer list. **No public Vitable material found during research names Vercel or Supabase explicitly.** The case study may have been unpublished, restructured, or never SEO-indexed (Supabase sometimes provides private case studies to HIPAA customers).

Because of that, every claim in this brief is marked with one of two source categories that the final architecture map carries forward as visual badges:

- **Documented** — directly sourced from Vitable's own materials, named partners' press releases, public profiles (RocketReach, YC), or app store listings. These are publicly verifiable.
- **Reference pattern / inferred** — sourced from Supabase's and Vercel's published HIPAA documentation, describing how that substrate canonically works for a multi-tenant healthcare SaaS at Vitable's shape. These are NOT claims about Vitable's actual production stack.

Treat that distinction as load-bearing. The Documented sections describe a real company; the Reference-pattern sections describe a canonical pattern that the company may or may not run on.

This brief is the merge of two intermediate research files (structure + connections) into a single reference for the architecture map.

---

# Structure & Systems

## Company Structure

**Founder & CEO:** Joseph Kitonga — sole founder, first-generation immigrant from Kenya, grew up in Delaware County, PA. Built a senior care agency with his parents. Started Vitable as a side project while studying computer engineering at Penn State (2018–2019), then dropped out to pursue it full-time. Thiel Fellow ($100K, 2020). Forbes 30 Under 30 in Healthcare (2022).

**Y Combinator batch:** S20 (Summer 2020), not W21 as sometimes stated. First funding came at the tail end of the YC batch (~$1.5M from early angels).

**Headquarters:** Philadelphia, PA (originally Woodlyn, PA; later Northern Liberties office).

**Headcount:**
- Dec 2021 article: 22 employees + ~50 independent contractor nurse practitioners
- Post-Series A (2024): PitchBook reports ~84 employees; Tracxn reports ~40. Discrepancy likely reflects counting methodology (FTEs vs. contractors/part-time). [Sources: Philadelphia Inquirer, PitchBook, Tracxn]
- Current (2026): Headcount not confirmed publicly. Active hiring via Greenhouse.

**Leadership beyond founder:** No publicly named CTO or VP Engineering. The 2024 Liferaft acquisition added Nimish Shukla (formerly Liferaft Co-Founder) and Ian Blumenfeld (Liferaft Co-Founder) to the team. Dan Patterson appears in LinkedIn search results with a Vitable Health affiliation but role is unconfirmed.

**Funding rounds:**

| Round | Date | Amount | Lead | Notable Participants |
|---|---|---|---|---|
| Pre-seed/angel | Oct 2020 | $1.6M | SoftBank Opportunity Fund | SoftBank diversity/inclusion fund |
| Seed | Oct 2021 | $7.2M | First Round Capital | Philadelphia-based; Y Combinator |
| Series A | Jul 2024 | $16M | Cherryrock Capital | Newark Venture Partners, Citi Impact Fund, First Round Capital, Commerce Ventures, Y Combinator |

**Total raised:** $25M+ as of Series A close. [Source: Finsmes.com, Vitable blog, TechCrunch 2020]

---

## Product Portfolio

Vitable's product has evolved from a simple telemedicine/home-visit model (2018–2021) into a full-stack health benefits platform (2024–present). Named products and features as of 2025:

### Vitable Primary Care (VPC)
The core DPC membership employers purchase for hourly workers.
- Unlimited virtual visits, same/next-day appointments
- 1,000+ covered prescriptions at $0 cost (cholesterol, diabetes, blood pressure, etc.)
- $0 labs and diagnostic testing
- Mental health coaching and licensed therapy (1-on-1 counseling)
- Women's health services (STI/STD testing, contraceptives, cancer screening)
- Annual wellness and preventive care
- Dependent coverage (free, no extra cost per employee)
- GLP-1 weight loss medication program
- Premium Lab Panels (100+ comprehensive diagnostics)
- Care navigation services ("algorithmic routing to most appropriate care setting")

**Delivery model:** Hybrid — virtual-first, supplemented by in-home and workplace pop-up visits. Providers are independent contractor nurse practitioners (confirmed ~50 as of 2021; unconfirmed scale now).

**Lab partners:** Quest Diagnostics, LabCorp. Occupational health screenings at CVS MinuteClinic and Walgreens (confirmed via employers page).

### ACA Compliance Suite
- **MEC (Minimum Essential Coverage)** — satisfies ACA employer mandate for large employers
- **MVP (Minimum Value Plan)** — level-funded major medical
- **ACA Autopilot** — compliance automation for variable-hour workforces (seasonal/part-time tracking)

### Health Reimbursement Arrangements
- **ICHRA (Individual Coverage HRA)** — employers fund tax-free accounts; employees choose individual marketplace plans. Vitable administers the HRA and provides the primary care layer on top.
- **QSEHRA (Qualified Small Employer HRA)** — HRA variant for <50-person employers not subject to ACA mandate

### Vitable Connect (Developer Platform)
REST API + embeddable UI components launched (exact date unconfirmed, visible on developer.vitablehealth.com):
- Employer and employee onboarding via REST endpoints
- Benefits enrollment widgets (embeddable in third-party HR platforms)
- Eligibility and payroll synchronization
- Webhook-based real-time event delivery
- Carrier integrations and compliance handling
- "5-minute quickstart" positioning; live demo environment available

### Vitable ICHRA Quoting Tool (AI-native, 2025)
Post-Liferaft acquisition, Vitable spent ~3 months rebuilding an ICHRA quoting tool from scratch:
- Real-time census upload → instant quote generation (seconds vs. days previously)
- ACA affordability modeling (percent of bronze/silver/gold/platinum tiers)
- Savings comparison vs. current group plans
- One-click PDF proposal export or live shareable link for client collaboration
- Described by Kitonga as "AI-native" in press materials; specific AI methods not disclosed publicly

### Member Surfaces
- **Member Mobile App** — iOS and Android; appointment scheduling, prescription management, provider messaging, virtual visit access. Package ID `com.vitablehealth.vitable_health` (Google Play). Dart/Flutter confirmed by forked Dash-Chat-2 repository on Vitable's GitHub org.
- **Member Dashboard** — Web portal at `app.vitablehealth.com`
- **Employer Dashboard** — Web portal at `employers.vitablehealth.com`
- **Provider Dashboard** — Web portal at `providers.vitablehealth.com`
- **EMR (Electronic Medical Records)** — Custom-built, appears as a separate component on the status page; not using an off-the-shelf EHR

**Rebrand (2025):** The company introduced "the thread" as a visual identity element, positioning the company as more than a care provider — a full health benefits platform. Tagline "People-First. Built for Better."

---

## Customer Segment

**Primary buyer:** Small and medium-sized businesses (SMBs) employing hourly/variable-hour workers — restaurants, retail, home care agencies, nonprofits, cleaning services.

**End members:** The "working poor" gap segment:
- Earn too much to qualify for Medicaid
- Earn too little to afford ACA marketplace plans without significant subsidies
- Typically uninsured or nominally covered but never use benefits due to cost
- Shift workers earning under ~$15/hour is the prototype

**Market sizing cited by Vitable:**
- 80–85 million uninsured or underinsured Americans (per Vitable marketing)
- 58% of small businesses report inability to afford traditional group health coverage
- 11+ million individuals projected to access ICHRA by DOL

**Why this niche works economically:** Traditional group insurance is priced for full-time knowledge workers with high utilization expectations. DPC memberships priced at ~$30–50 PEPM sit well below traditional premiums. Vitable claims 35% cost reduction vs. traditional group plans and 220% average employer ROI. Kitonga's insight: cut out the insurer and administer care directly, eliminating the 25% admin overhead that traditional insurers charge.

**Geographic expansion:** Started in Southeastern PA and Delaware (2019–2022). By 2024: PA, NJ, IL, DE, MD, DC, FL. By May 2026: nationwide (all 50 states) for the Direct Primary Care product. [Source: BusinessWire 2026-05-21]

**Employer count:** 400+ employer customers confirmed as of 2024 Citi Impact Fund interview. [Source: citigroup.com]

**Lives covered:** 50,000+ as of 2024. [Source: Vitable blog, Citi interview]

---

## Technology Stack (Vercel + Supabase Focus)

**Confirmed stack (multiple sources):**

| Layer | Technology | Source / Confidence |
|---|---|---|
| Mobile app | Flutter (Dart) | Vitable GitHub org forks Dash-Chat-2 (Dart/Flutter); Google Play package `com.vitablehealth.vitable_health` — HIGH confidence |
| Mobile app | PDF handling: PyPDF2 fork (Python) | Vitable GitHub org — suggests Python in backend or document pipeline |
| Database | PostgreSQL | RocketReach tech profile — MEDIUM confidence |
| CDN | Amazon CloudFront | RocketReach tech profile — MEDIUM confidence |
| Object storage | Amazon S3 | RocketReach tech profile — MEDIUM confidence |
| DNS | AWS Route53 | RocketReach tech profile — MEDIUM confidence |
| CMS | ButterCMS | RocketReach tech profile — MEDIUM confidence |
| Marketing site | Webflow | Subdomain `vitable-db.webflow.io` visible in URL — HIGH confidence |
| Payments | Stripe + Stripe Connect | RocketReach tech profile — MEDIUM confidence |
| Analytics | Google Analytics, Segment | RocketReach tech profile — MEDIUM confidence |
| Marketing | HubSpot | RocketReach tech profile — MEDIUM confidence |

**Supabase — claimed but not yet confirmed by public case study:**
The context note for this research states Vitable runs on Vercel + Supabase and that a Supabase HIPAA case study exists. As of this research (May 2026):
- `supabase.com/customers/vitable` returns HTTP 404
- Vitable Health does not appear in the current Supabase customers page listing (~38 public case studies)
- No blog post, press release, or interview found that explicitly names Supabase or Vercel as Vitable's infrastructure

**Assessment:** The Supabase connection may be:
1. A private/unlisted case study — Supabase sometimes provides HIPAA customers with case studies that are not SEO-indexed
2. The source of the "Vercel + Supabase" claim may be a talk, conference presentation, or private reference that hasn't been publicly indexed
3. Alternatively, the attribution may be from Supabase's own internal references (they do list healthcare as a vertical)

The stack indicators (PostgreSQL confirmed, Stripe Connect confirmed, S3 + CloudFront for storage/CDN) are consistent with a Supabase + Vercel architecture pattern, but this is inference, not confirmation.

**Frontend framework — unconfirmed but inferable:**
- ButterCMS is heavily promoted as a Next.js CMS (Vercel even has a ButterCMS + Next.js starter template). If Vitable uses ButterCMS, Next.js on Vercel is the most natural host.
- The employer dashboard, member dashboard, and provider dashboard are separate web apps — consistent with a Next.js monorepo or multi-app Vercel deployment.
- No public job posting from the engineering side was found with specific framework requirements (current open roles are operations and sales).

**Mobile:**
- Flutter confirmed (Dart). App bundles as `com.vitablehealth.vitable_health`.
- The forked Dash-Chat-2 repo (Flutter UI package for chat interfaces) suggests the member app's messaging with providers uses a Flutter chat component.
- PyPDF2 fork suggests Python is in use somewhere — likely a backend service or document generation pipeline (insurance documents, proposals, lab results).

**Integrations:**
- Payroll sync mentioned in Vitable Connect documentation (unnamed payroll provider; Paychex named as partner on the occupational health page)
- Lab order integration with Quest Diagnostics and LabCorp
- Carrier integrations for ICHRA marketplace plan verification

---

## Supabase Usage

**Disclaimer:** No public Supabase case study for Vitable was found as of this research. What follows is the expected/inferred architecture based on the stated premise that Vitable uses Supabase, consistent with what Supabase's healthcare solution page describes.

**What Supabase provides healthcare customers with PHI requirements:**
- **Postgres database** — fully managed, multi-region option
- **Row Level Security (RLS)** — per-row access policies enforced at the database layer. In a multi-tenant healthcare context (multiple employers, multiple member populations, multiple provider orgs), RLS is the primary mechanism ensuring Employer A's nurse practitioner cannot query Employer B's member records. Policies are written as SQL predicates attached to tables, checked on every query.
- **HIPAA add-on** — requires opt-in per project; triggers "High Compliance" mode. Enables PHI storage on HIPAA-compliant infrastructure. Requires a signed BAA (Business Associate Agreement) with Supabase.
- **Supabase Auth** — JWT-based auth with RLS integration; `auth.uid()` is the standard function used in RLS policies to scope data to the current user
- **Database audit logs** — every data access, modification, and login logged; required for HIPAA compliance reviews
- **Realtime** — Postgres Change Data Capture (CDC) published via WebSocket. In a healthcare context, would power live status updates (appointment status, claim processing, employer enrollment feeds)
- **Storage** — S3-compatible object storage with RLS policies. Would handle lab result PDFs, insurance cards, provider credentials documents
- **Edge Functions** — Deno-based serverless functions. Could handle HIPAA-sensitive webhook processing (carrier callbacks, lab result ingestion, prescription fulfillment notifications) without exposing PHI to Vercel's Edge Runtime

**Expected RLS pattern for Vitable's multi-tenant model:**
- `employer_id` column on member, enrollment, and benefit records
- RLS policy: `auth.uid() IN (SELECT user_id FROM employer_users WHERE employer_id = records.employer_id)`
- Member self-service: `auth.uid() = member_id`
- Provider access: scoped to assigned member roster only
- Admin roles: bypass RLS via `service_role` key (server-side only, never exposed to client)

**Note:** The above is the standard Supabase healthcare RLS pattern, applied to what Vitable's multi-tenancy requirements would necessitate. It is consistent with but not sourced from a Vitable-specific case study.

---

## Scale & Footprint

**Members:** 50,000+ lives covered (confirmed as of Series A close, July 2024). [Source: Citi interview, Vitable blog]

**Employers:** 400+ employer customers (confirmed as of 2024). [Source: Citi interview]

**Funding:** $25M+ total raised across three rounds (SoftBank pre-seed, First Round seed, Cherryrock Series A).

**Geography:** Nationwide as of May 2026 (all 50 states for DPC product; ICHRA nationwide via Liferaft acquisition completed 2025).

**System uptime:** 5 components tracked on public status page (`status.vitablehealth.com`). 100% uptime over trailing 90 days as of May 2026. Components: Vitable Infrastructure, Member Mobile App, Employer Dashboard, EMR, Member Dashboard.

**App store rating:** 4.9 average user rating (per employer marketing page — self-reported; not independently verified).

**Utilization:** Claims 7x higher utilization than typical health plans (company marketing).

**Cost savings:** 35% cost reduction vs. traditional group plans (company marketing); 25% administrative cost elimination via AI automation (per Liferaft acquisition press release).

**Team scale (2024 estimates):** 40–84 employees depending on source methodology; current headcount not confirmed.

---

## AI Features

Vitable's AI usage is nascent and primarily administrative, not clinical. Key findings:

**1. AI-native ICHRA Quoting Tool (2025)**
After acquiring Liferaft, Kitonga described rebuilding the ICHRA platform as "AI-native." The tool:
- Generates quotes in seconds from a census upload (replacing multi-day manual processes)
- Models ACA affordability standards dynamically
- Generates client-ready PDF proposals and shareable live scenario links

The "AI-native" label appears in founder-facing press materials but no technical disclosure exists about what models or infrastructure power it. It may refer to LLM-assisted document generation, ML-based actuarial modeling, or simply automated data processing marketed as AI. [Source: streetinsider.com, aijourn.com]

**2. Administrative cost elimination**
Press materials for the Liferaft acquisition state Vitable "utilizing AI" has eliminated ~25% of typical healthcare administrative costs. No technical specifics disclosed.

**3. Patient routing algorithm**
The 2021 Philadelphia Inquirer profile describes a custom algorithm routing patients to "the most appropriate care setting" (virtual vs. in-home). This predates the AI marketing language and may be rule-based rather than ML.

**4. No clinical AI confirmed**
No evidence of AI-assisted diagnostics, clinical decision support, NLP on medical records, or any patient-facing AI features. Vitable is not positioning as a clinical AI company.

**Summary:** Vitable is at the earliest stage of AI adoption — using automation and possibly LLM tooling in back-office workflows (quoting, proposals, compliance) but not in care delivery. The "PHI on Vercel + Supabase without an AI angle yet" framing from the research brief is accurate. This makes Vitable interesting as a case study in the foundational problem: handling PHI securely on modern SaaS infrastructure, independent of AI.

---

# Connections, Data Flows & Status

**Focus:** Connections, Data Flows & Status
**Primary source caveat:** Supabase case study URL (`supabase.com/customers/vitable`) returned HTTP 404 as of May 2026 — the case study appears to have been removed or relocated. All Supabase-specific claims are therefore inferred from Supabase's public HIPAA/RLS documentation and from secondary sources that referenced the case study. Every such inference is marked **[inferred/unconfirmed]**.

---

## End-to-End Data Flows

### 1. Employer Onboarding Flow

The documented path for a new employer customer:

1. **Discovery / sales** — employer contacts Vitable via web or broker channel (brokers can use an instant ICHRA quoting tool launched October 2025 [source: Vitable news page]).
2. **Employer portal creation** — employer account is created at `employers.vitablehealth.com`. The portal is a separate subdomain from the member app (`app.vitablehealth.com`) and the provider dashboard (`providers.vitablehealth.com`), indicating distinct auth contexts per role.
3. **HRIS sync via Finch** — Vitable's HRIS integration is explicitly powered by **Finch**, a unified payroll/HR API aggregator supporting 220+ providers (ADP, Gusto, Paychex, QuickBooks Payroll, Rippling, UKG, iSolved, and others). Finch authenticates to the employer's payroll system via OAuth and syncs employee roster and eligibility data daily, with on-demand refresh available. Webhook events notify Vitable when data changes [source: Finch product docs; Vitable HRIS support article references Finch by name].
4. **Plan configuration** — employer sets fixed monthly contribution per employee. Average cost is ~$30/employee/month for DPC membership; ICHRA/MEC plans are configured separately.
5. **Employee eligibility file** — roster data flows from Finch into Vitable's database (PostgreSQL/Supabase [inferred/unconfirmed]); each employee record is scoped to the employer tenant.
6. **Payroll deduction setup** — Finch writes approved deduction amounts back to the payroll system where applicable.

### 2. Member Enrollment Flow

1. **Invite / self-enrollment** — employees receive invitation (email or via employer portal). The developer docs describe an **embeddable enrollment widget** that can be hosted inside a partner or employer application; it handles plan selection, compliance checks, e-signatures, and carrier integrations without the employer leaving their own application.
2. **Identity creation** — member creates account in the Vitable mobile app (iOS: App Store ID 1540830769; Android: `com.vitablehealth.vitable_health`). The app is built with **Flutter** [source: RocketReach tech stack profile — 27 technologies listed].
3. **Dependent enrollment** — members can add dependents through the app.
4. **Pharmacy card issuance** — a digital pharmacy card is generated and available inside the app immediately on enrollment; no physical card is required [source: vitablehealth.com/for-members].
5. **Webhook events to employer** — Vitable's Connect API fires real-time webhooks covering eligibility, enrollment, and payroll deduction events [source: developer.vitablehealth.com overview].

### 3. Member Visit (Telehealth) Flow

1. Member opens Vitable app, requests virtual or in-home appointment.
2. Appointment is scheduled with a Vitable-employed or partner clinician (same-day and next-day slots offered).
3. Visit is conducted via secure video or in-person/in-home channel. The specific video provider platform is **not publicly disclosed** [unconfirmed].
4. Clinician documents encounter. Vitable operates a **Provider Dashboard** at `providers.vitablehealth.com`; the underlying EHR platform is **not publicly named** — Elation Health is a common DPC EHR choice but no confirmed link to Vitable exists [unconfirmed].
5. Prescriptions, lab orders, and follow-ups are generated from the provider dashboard.
6. Secure messaging between member and care team is available in the app.

### 4. Prescription Flow

1. Provider generates prescription order inside the provider dashboard.
2. Over 1,000 formulary medications are available at $0 out-of-pocket to members.
3. Prescription fulfillment channel is **not publicly named** — no pharmacy benefit manager (PBM) or mail-order pharmacy is disclosed in public materials [unconfirmed].
4. Member can request refills via the app; the care team sends updates through the app.
5. Physical pharmacy card in the app implies a network card-based dispensing model at retail pharmacies, but the PBM or card network operator is not disclosed [unconfirmed].

### 5. Lab Flow

1. Provider orders labs from the provider dashboard.
2. Vitable partners explicitly with **Labcorp** and **Quest Diagnostics** for lab testing [source: vitablehealth.com/occupational-health; occupational health page specifically names both].
3. Members visit any Quest or Labcorp location; results flow back to the care team.
4. "$0 labs" for 40+ routine tests including organ function, cholesterol, thyroid, diabetes, hepatitis/HIV, vitamin panels [source: for-members page].

### 6. Specialist Care Referral Flow (via Mishe Health)

1. Primary care provider identifies need for specialist.
2. Vitable's **Specialist Care Navigation** is powered by **Mishe Health**, a healthcare tech company with pre-vetted specialty networks and all-inclusive procedure bundles [source: Vitable/Mishe partnership press release, January 2024].
3. Member accesses specialists at transparent discounted prices with financing options; Mishe case managers assist with scheduling and advocacy.
4. Currently launched in Philadelphia; geographic scope of specialist navigation vs. virtual primary care is unclear [unconfirmed].

### 7. Copay / Payment Flow

- Vitable's model is predominantly **$0 copay / $0 deductible** — employer pays the monthly membership fee, members have no out-of-pocket cost for included services.
- **Stripe** and **Stripe Connect** appear in the tech stack [source: RocketReach profile], suggesting employer subscription billing and potentially marketplace-style payment routing to clinical partners. The specific Stripe product configuration (direct charges vs. Connect transfers) is **[unconfirmed]**.
- For ICHRA products, employees receive employer HRA contributions and use them to pay ACA marketplace premiums; the payment flow here likely involves carrier integrations from the acquired **Liferaft** platform [source: Liferaft acquisition press release, May 2025 — describes "proprietary integrations and a claims engine"].

---

## Supabase RLS Multi-Tenancy

**Critical caveat:** The Supabase case study at `supabase.com/customers/vitable` returned HTTP 404 as of research date (May 2026). The following is reconstructed from Supabase HIPAA/RLS documentation and secondary sources that described the case study as the central public artifact. Treat all specifics as **[inferred/unconfirmed]** unless noted.

### What Is Confirmed (from Supabase HIPAA docs)

Supabase's HIPAA-compliant offering requires:
- **HIPAA add-on** enabled on the organization (Team or Enterprise tier)
- **Signed BAA** with Supabase (Supabase in turn holds BAAs with its own subprocessors, primarily AWS)
- **High Compliance Mode** enabled on each project
- **Point in Time Recovery** enabled (requires at minimum a Small compute add-on)
- **SSL Enforcement** enabled
- **Network Restrictions** activated (IP allowlist)

Supabase runs on **AWS infrastructure** underneath. The HIPAA BAA chain is: Vitable ← Supabase BAA ← AWS BAA [source: Supabase HIPAA compliance docs].

### RLS Multi-Tenancy Pattern (Supabase Standard Approach)

Supabase supports two canonical multi-tenancy patterns:

**Pattern A — Shared tables with `tenant_id` + RLS:**
```sql
-- Typical employer-scoped RLS policy
CREATE POLICY "employer_isolation"
ON members
FOR ALL
USING (employer_id = auth.jwt() ->> 'employer_id');

-- Member self-access policy
CREATE POLICY "member_self_access"
ON health_records
FOR SELECT
USING (member_id = auth.uid());
```
This is the most common pattern for SaaS products on Supabase [source: Supabase multi-tenancy documentation].

**Pattern B — Per-tenant schemas:** Each employer gets a dedicated Postgres schema within the shared database instance, providing stronger logical isolation.

Which pattern Vitable uses is **[unconfirmed]** — the 404'd case study was the only public source describing their specific implementation. Given their scale (thousands of small employers × employees), shared-table + RLS is the more likely choice architecturally, but this is speculative.

### JWT / Auth Context for RLS

Supabase Auth passes claims via JWT. For a multi-tenant healthcare app the JWT would typically carry:
- `sub` (user UUID, standard)
- custom claims: `role` (member / employer_admin / provider / admin), `employer_id` or `org_id`
- RLS policies read `auth.uid()` and `auth.jwt()` to enforce row-level isolation

Whether Vitable uses **Supabase Auth directly** or routes through a separate IdP is **[unconfirmed]**, though Supabase Auth is the default integration path and the most common approach for Supabase-native stacks.

### PHI Isolation Boundaries

In the Supabase-native model for HIPAA workloads:
- PHI rows are isolated per-member via `member_id = auth.uid()` policies
- Cross-employer data access is blocked by employer-scoped policies
- Provider access to member records would require an explicit `care_team` relationship table with its own policy
- Supabase's continuous security monitoring detects if High Compliance Mode controls are disabled or weakened [source: Supabase HIPAA project docs]

---

## Vercel + Next.js Architecture

### Confirmed Stack Evidence

- **AWS CloudFront, Amazon S3, AWS Route53** appear in the RocketReach tech stack profile [source: rocketreach.co/vitable-health-technology-stack], suggesting either: (a) direct AWS usage for the web front-end CDN layer, or (b) Vercel's underlying AWS infrastructure showing through DNS/CDN fingerprinting. The presence of Route53 suggests some DNS is managed directly in AWS rather than through Vercel's nameservers [unconfirmed].
- **CloudFlare CDN** also appears in the tech stack alongside CloudFront, suggesting a layered CDN approach or different CDN for different surfaces [unconfirmed].
- **Flutter** for the mobile app (iOS + Android) is confirmed via the tech stack profile and the Android package name `com.vitablehealth.vitable_health` [source: Google Play Store listing].

### Vercel / Next.js Usage

The Supabase + Vercel integration (official Vercel marketplace connector) is the canonical deployment pattern for Supabase-native Next.js apps. Whether Vitable uses this exact setup is **[unconfirmed]** — Vercel is not explicitly named in any public Vitable material found during research.

**PHI in the Vercel request path concern:** If Vitable uses Vercel with Next.js Server Actions or API routes, PHI could transit Vercel Edge Network nodes. Vercel offers HIPAA BAAs on **Enterprise plans only** — this would be a hard requirement for HIPAA compliance if Vercel is in the request path for PHI [source: Vercel HIPAA documentation, general knowledge]. Whether Vitable has a Vercel Enterprise plan with BAA is **[unconfirmed]**.

**App Router vs Pages Router:** Unknown [unconfirmed].

---

## External Integrations

### Confirmed Integrations

| Partner | Function | Confidence |
|---|---|---|
| **Finch** | HRIS/payroll aggregator — syncs employee rosters from 220+ providers (ADP, Gusto, Paychex, etc.) | Confirmed — named in Vitable HRIS support docs |
| **Labcorp** | Lab testing at retail locations | Confirmed — named on occupational health page |
| **Quest Diagnostics** | Lab testing at retail locations | Confirmed — named on occupational health page |
| **Mishe Health** | Specialist care network + procedure bundles (care navigation) | Confirmed — press release Jan 2024 |
| **Stripe / Stripe Connect** | Payment processing for employer subscriptions and potentially marketplace payments | Confirmed via tech stack profile |
| **HHAeXchange** | Integration partner for homecare agency workforce | Confirmed — HHAeXchange Partner Connect page |
| **Apaly** | Advanced Primary Care marketplace for enterprise employers | Confirmed — partnership announced May 2025 |
| **DirectShifts** | Clinician staffing platform; Vitable provides DPC memberships to DirectShifts' 100k+ clinicians | Confirmed — press release Dec 2025 |
| **Health In Tech / MARPAI** | Self-funded health plan product via Health In Tech's eDIYBS platform | Confirmed — press release Jan 2025 |
| **Liferaft (acquired)** | ICHRA administration platform with "claims engine" and proprietary carrier integrations | Confirmed — acquisition May 2025 |
| **Segment** | Customer data platform (analytics) | Confirmed via tech stack profile |
| **HubSpot** | CRM / marketing analytics | Confirmed via tech stack profile |

### Unconfirmed / Inferred Integrations

| Partner | Function | Status |
|---|---|---|
| PBM (unnamed) | Prescription benefit management / formulary | Unconfirmed — 1,000+ drug formulary implies a PBM contract |
| Telehealth video platform | Video layer for virtual visits | Unconfirmed — not named publicly |
| EHR platform | Clinical documentation for providers | Unconfirmed — Elation Health is common for DPC but not confirmed |
| Clearinghouse | Claims submission for level-funded / MVP plans | Unconfirmed — implied by ICHRA + insurance products |
| Carrier integrations | ACA marketplace / insurance carriers | Implied by Liferaft "proprietary carrier integrations" — unnamed |

---

## Authentication & Identity

### Multiple Auth Surfaces

Vitable operates at least three distinct authenticated portals:

1. **`app.vitablehealth.com`** — member dashboard (Flutter mobile + web)
2. **`employers.vitablehealth.com`** — employer admin dashboard
3. **`providers.vitablehealth.com`** — clinician/provider dashboard

Whether these share a single auth system or use separate auth projects is **[unconfirmed]**.

### Auth Technology

- **Supabase Auth** is the default for Supabase-native stacks and supports multi-role JWT claims. It would cover member + employer auth naturally [inferred/unconfirmed].
- Supabase Auth uses JWT tokens with configurable expiry; it stores user records in the `auth` schema in Postgres (not accessible by default to application queries) [source: Supabase Auth docs].
- Provider auth may use a separate flow if providers are employed/contracted staff with different identity management requirements [unconfirmed].
- No evidence of a third-party IdP (Okta, Auth0, Clerk) in public materials, though RocketReach's tech stack list is not exhaustive.

### Member Identity Model

- Members authenticate via email/password or social login (typical Supabase Auth flows).
- Dependents are linked to the primary member account (implied by "add and manage dependents" app feature).
- HIPAA requires audit logging of PHI access — Supabase's High Compliance Mode includes database audit logs [source: Supabase HIPAA docs].

---

## PHI Handling & BAA Boundary

### HIPAA Role Clarification

Vitable's privacy policy explicitly states: Vitable acts as a **business associate** when members access services through employer group health plans. The employer's health plan is the covered entity; Vitable is the BA. The Medical Group delivering clinical care operates under its own Notice of Privacy Practices [source: vitablehealth.com/privacy].

This creates a multi-layer BAA structure:
- **Employer (covered entity)** ↔ Vitable BAA
- **Vitable** ↔ Supabase BAA (if using Supabase HIPAA add-on) [inferred]
- **Supabase** ↔ AWS BAA [confirmed — Supabase HIPAA docs]
- **Vitable** ↔ Vercel BAA (if Vercel is in PHI path; Enterprise only) [unconfirmed]
- **Vitable** ↔ Finch BAA (HRIS data may include PHI adjacency) [unconfirmed]

### Encryption

- Supabase HIPAA projects: AES-256 encryption at rest (AWS-managed), TLS in transit [source: Supabase + AWS shared responsibility].
- Finch: AES-256 at rest, TLS 1.2+ in transit, SOC 2 Type II [source: Finch security page].
- Vitable's privacy policy acknowledges "administrative, technical, and physical safeguards" but does not specify encryption standards [source: vitablehealth.com/privacy].

### Audit Logging

- Supabase High Compliance Mode includes comprehensive audit logs: "Every data access, every modification, every login is logged" [source: supabase.com/solutions/healthcare].
- Supabase undergoes annual combined HIPAA + SOC 2 Type II audits [source: Supabase HIPAA compliance docs].

### Analytics / Tracking Risk Surface

Vitable's privacy policy confirms use of Google Analytics, Facebook Pixel, HubSpot analytics, and Google Ads on their marketing surfaces. These tools process IP addresses and device identifiers. If any of these analytics tags fire on authenticated member pages they would represent a PHI leakage risk — this is a known HIPAA compliance concern for web-based health apps. Whether Vitable gates these tags to unauthenticated surfaces only is **[unconfirmed]**.

---

## AI in the Data Flow

### Confirmed AI Features

- **AI-powered administration**: Vitable claims "AI-powered systems handling all ongoing administration" and that they've "eliminated roughly 25 percent of healthcare costs typically wasted on administration" [source: Liferaft acquisition press release, May 2025].
- **AI benefits navigation**: The HHAeXchange partner page describes "advanced benefits management platform and mobile app, with the AI assistants" as part of Vitable's offering [source: hhaexchange.com/partner-connect/vitable].
- **Care navigation tool**: A lookup tool in the app helps members find recommended specialist providers with cost transparency [source: Zendesk support article].

### Where AI Sits in the Data Flow

AI appears to operate primarily in:
1. **Administrative automation layer** — eligibility processing, ICHRA quoting (the instant broker quoting tool launched Oct 2025), compliance checks.
2. **Member-facing navigation** — provider lookup / care navigation assistant.
3. **Benefit design and claims estimation** — the Liferaft "claims engine" for plan design automation.

The underlying AI infrastructure (LLM provider, whether PHI transits AI endpoints, BAA coverage for AI subprocessors) is **not publicly disclosed** [unconfirmed].

---

## Modernization & Status

### Funding & Runway

- **Total raised:** ~$25M across 4 rounds [source: Crunchbase].
- **Series A:** $16M closed July 2024, led by Cherryrock Capital; participants include First Round Capital, Newark Venture Partners, Citi Impact Fund (Citigroup), Commerce Ventures, Y Combinator [source: MedCity News, July 2024].
- **Earlier rounds:** $7.2M (Oct 2021), $1.6M SoftBank Opportunity Fund (Oct 2020) [source: Forbes, Business Insider].
- No public evidence of a Series B as of May 2026 [unconfirmed gap].

### Recent Strategic Moves (2025)

| Date | Event |
|---|---|
| May 2025 | Acquired Liferaft ICHRA platform — first vertically integrated ICHRA + DPC offering |
| May 2025 | DPC plan expands to all 50 states [source: Business Wire] |
| May 2025 | Partnership with Apaly for enterprise APC marketplace [source: Business Wire] |
| Jan 2025 | Health In Tech + MARPAI tripartite deal for self-funded plans [source: PR Newswire] |
| Oct 2025 | Launched instant ICHRA quoting tool for brokers [source: Vitable news page] |
| Dec 2025 | Partnership with DirectShifts for clinician access to DPC memberships [source: Business Wire] |

### Known Issues / Complaints

- No public data breach reports found in OCR/HHS breach portal or news coverage as of May 2026.
- No significant public complaint patterns identified.
- The Supabase case study URL (404) suggests either a site restructuring or the case study was unpublished — this limits the primary technical evidence available.

### Operational Scale Indicators

- Serves small to medium employers, average $30/employee/month.
- Target market: blue-collar / hourly workers, homecare agencies.
- Geographic coverage: all 50 states for DPC (as of May 2025); ICHRA products launched in PA, TX, FL, OH with broader expansion in progress.
- DirectShifts partnership gives potential reach to 100,000+ clinicians.

---

## Public APIs / Partner Surface

### Vitable Connect API

Vitable has a **public developer portal** at `developer.vitablehealth.com` (overview accessible; full API reference docs returned 404 during research). The documented capabilities include:

- **REST API** for employer and employee management: roster syncing, onboarding, eligibility management.
- **Embeddable enrollment widget**: a pre-built UI component that partners and employers can embed in their own applications. Handles plan selection, compliance, e-signatures, and carrier integrations. Vitable tracks all downstream events via webhooks.
- **Webhook system**: real-time events for eligibility changes, enrollment events, and payroll deductions.
- **Benefits products exposed via API**: Direct Primary Care, MEC (ACA-compliant), MVP (employer-sponsored), Dental & Vision, ICHRA with premium reimbursement.
- Documentation references: quickstart guide (claimed "5-minute integration"), employer onboarding walkthrough, and API reference.

The authentication method for the Connect API (OAuth2 client credentials, API keys, or JWT) is **[unconfirmed]** — the API reference page returned 404.

### Liferaft Platform (Acquired)

Post-acquisition, Liferaft's "modular, API-driven system" enables "launch of out-of-the-box HRA solutions or fully custom, self-branded benefits programs" [source: Liferaft acquisition press release]. This adds a second API surface for ICHRA administration and plan design, now integrated into Vitable's platform.

### Partner Integrations (Inbound)

- **HHAeXchange**: Homecare agencies using HHAeXchange can activate Vitable benefits through the HHAeXchange Partner Connect marketplace — implying an outbound integration from HHAeXchange to Vitable's enrollment API.
- **Apaly marketplace**: Vitable is listed as a provider in Apaly's Advanced Primary Care marketplace for enterprise employers — implies Apaly calls Vitable's enrollment/eligibility API.
- **Health In Tech eDIYBS platform**: Self-funded plan quoting integrates Vitable DPC as a bundled benefit option.

---

## Sources

### Vitable & named partners (Documented)

1. [Vitable Health Blog: Series A Announcement](https://www.vitablehealth.com/blogs/closing-the-healthcare-gap-vitable-raises-16m-series-a-to-revolutionize-access-to-quality-primary-care-for-underserved-communities)
2. [Vitable Health Blog: Celebrating $16M Series A](https://www.vitablehealth.com/blogs/celebrating-a-milestone-vitable-healths-16m-series-a)
3. [Philadelphia Inquirer: Vitable and Joseph Kitonga (Dec 2021)](https://www.inquirer.com/business/health/vitable-philadelphia-primary-care-joseph-kitonga-first-round-capital-20211226.html)
4. [Finsmes: Vitable Health Raises $16M in Series A](https://www.finsmes.com/2024/07/vitable-health-raises-16m-in-series-a-funding.html)
5. [MedCity News: Vitable Secures $16M for Small Employers](https://medcitynews.com/2024/07/vitable-secures-16m-to-provide-primary-care-to-small-employers/)
6. [TechCrunch: SoftBank $1.6M into Vitable (Oct 2020)](https://techcrunch.com/2020/10/21/softbanks-100-million-diversity-and-inclusion-fund-makes-its-first-bet-in-health-vitable-health/)
7. [Citi Impact Fund: Interview with Joseph Kitonga (2024)](https://www.citigroup.com/global/news/perspective/2024/building-solutions-to-expand-healthcare-access-founder-of-vitable)
8. [Invent Penn State: Q&A with Vitable Founder](https://invent.psu.edu/stories/where-are-they-now-qa-with-vitable-health-founder-joseph-kitonga/)
9. [Mercury Memory Bank: Joseph Kitonga](https://mercury.com/blog/memory-bank-joseph-kitonga-vitable-health)
10. [PRNewswire: Vitable Acquires Liferaft ICHRA (2025)](https://www.prnewswire.com/news-releases/vitable-health-acquires-ichra-provider-liferaft-expanding-affordable-health-coverage-to-small-business-owners-nationwide-302448343.html)
11. [HIT Consultant: Vitable Acquires Liferaft Platform (May 2025)](https://hitconsultant.net/2025/05/07/vitable-health-acquires-liferafts-hra-platform/)
12. [BusinessWire: Vitable DPC Expands to All 50 States (May 2026)](https://www.businesswire.com/news/home/20250521297120/en/Vitable-Healths-Direct-Primary-Care-Plan-Expands-to-All-50-States-Bringing-Quality-Care-to-Millions-of-Uninsured-Americans)
13. [AIJourn: Vitable ICHRA Quoting Tool Launch](https://aijourn.com/vitable-health-eliminates-wait-times-with-instant-ichra-quoting-tool-for-brokers/)
14. [Vitable Developer Portal](https://developer.vitablehealth.com/)
15. [Vitable Health Status Page](https://status.vitablehealth.com/)
16. [Vitable Health GitHub Organization](https://github.com/Vitable-Health)
17. [RocketReach: Vitable Health Technology Stack](https://rocketreach.co/vitable-health-technology-stack_b400171bfc03e6d9)
18. [Y Combinator: Vitable Health Company Profile](https://www.ycombinator.com/companies/vitable-health)
19. [Vitable Health Employers Page](https://www.vitablehealth.com/employers)
20. [Vitable Health About Page](https://www.vitablehealth.com/about)
21. [Vitable Webflow Occupational Health Page](https://vitable-db.webflow.io/occupational-health)
22. [Google Play: Vitable Health App](https://play.google.com/store/apps/details?id=com.vitablehealth.vitable_health)
23. [Vitable Health — For Members](https://www.vitablehealth.com/for-members)
24. [Vitable Health — Privacy Policy](https://www.vitablehealth.com/privacy)
25. [Vitable Health — News](https://www.vitablehealth.com/news)
26. [Vitable Health — Occupational Health (Lab Partners)](https://www.vitablehealth.com/occupational-health)
27. [Vitable Health — Supported HRIS Providers (Zendesk)](https://vitablehealth-cs.zendesk.com/hc/en-us/articles/47585952264340-Supported-HRIS-Providers) — 403 at time of fetch, but named in search snippets
28. [Vitable Health App — Apple App Store](https://apps.apple.com/us/app/vitable-health/id1540830769)
29. [Vitable Health — HHAeXchange Partner Connect](https://www.hhaexchange.com/partner-connect/vitable)
30. [Vitable + Mishe Health Partnership — PR Newswire (Jan 2024)](https://www.prnewswire.com/news-releases/vitable-health-and-mishe-health-unite-to-expand-access-to-specialty-care-for-philadelphia-302030662.html)
31. [Vitable + Apaly Partnership — Business Wire (May 2025)](https://www.businesswire.com/news/home/20250529584885/en/Vitable-Health-Becomes-Nationwide-Virtual-Primary-Care-Partner-for-Apaly-Expanding-Advanced-Primary-Care-Access-for-Enterprise-Employees)
32. [Vitable + DirectShifts Partnership — Business Wire (Dec 2025)](https://www.businesswire.com/news/home/20251209273587/en/Vitable-Health-and-DirectShifts-Partner-to-Expand-Clinicians-Access-to-Care-and-Coverage)
33. [Health In Tech + MARPAI + Vitable — PR Newswire (Jan 2025)](https://www.prnewswire.com/news-releases/health-in-tech-announces-innovative-collaboration-with-marpai-and-vitable-dpc-to-offer-competitive-quotes-in-enhanced-self-funded-solutions-302357907.html)
34. [Finch API — Employee Benefits Solutions](https://www.tryfinch.com/solutions/employee-benefits)
35. [Finch API — ICHRA Benefits Integrations](https://www.tryfinch.com/lp/benefits-individual-coverage-hra-ichra)

### Vercel + Supabase + cloud HIPAA docs (Reference pattern)

36. [Supabase — HIPAA Projects Documentation](https://supabase.com/docs/guides/platform/hipaa-projects)
37. [Supabase — HIPAA Compliance Guide](https://supabase.com/docs/guides/security/hipaa-compliance)
38. [Supabase — Healthcare Solutions Page](https://supabase.com/solutions/healthcare)
39. [Supabase — Row Level Security Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
40. [Supabase — customers/vitable (404 as of May 2026)](https://supabase.com/customers/vitable) — primary case study, currently unavailable
41. [Vercel — Security & Compliance (HIPAA section)](https://vercel.com/docs/security/compliance)
42. [Vercel — Secure Compute](https://vercel.com/docs/networking/secure-compute)
43. [AWS — HIPAA Eligible Services Reference](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/)
44. [Google Cloud — HIPAA Compliance](https://cloud.google.com/security/compliance/hipaa)
45. [HHS OCR — Online Tracking Technologies Guidance](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html)
