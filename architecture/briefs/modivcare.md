# Modivcare Architecture Research

Modivcare Inc. (formerly LogistiCare, formerly Providence Service Corporation) is America's largest Non-Emergency Medical Transportation (NEMT) broker — coordinating ~36.8 million Medicaid trips per year for ~34 million members across 48 states and D.C., on top of a multi-account AWS substrate inherited from a decade of acquisitions. Beyond NEMT (~70% of revenue), Modivcare operates Personal Care Services and Remote Patient Monitoring segments built largely through M&A. This brief combines two parallel research passes: a Structure & Systems pass covering the corporate footprint, segments, platforms, technology stack, and modernization status; and a Connections, Flows & Status pass covering end-to-end data flows, integration protocols, identity, compliance/PHI handling, and the public developer surface.

## Structure & Systems

## Corporate & Operating Structure

Modivcare Inc. (NASDAQ: MODV, now private) is the largest Non-Emergency Medical Transportation (NEMT) broker in the United States, operating across three reportable business segments: NEMT, Personal Care Services (PCS), and Monitoring. Headquartered in Denver, Colorado, the company employs approximately 20,160 people and generated $2.79 billion in service revenue in 2024.

The corporate lineage runs through three successive identities. The Providence Service Corporation — originally a provider of government-sponsored social services — acquired LogistiCare Solutions LLC in 2007 for $220 million, gaining a national NEMT broker. Providence then executed a rapid acquisitions push starting in 2020 to build a vertically integrated supportive care platform. On January 6, 2021, Providence became **Modivcare Inc.** and LogistiCare Solutions became **Modivcare Solutions LLC**, unifying transportation, personal care, and monitoring under a single brand. "Modiv" derives from the Latin for "way." In August 2025, the company filed a prepackaged Chapter 11 bankruptcy with approximately 90% of first-lien lender support, emerging as a **private company** on December 29, 2025, with $300 million in funded debt after eliminating $1.1 billion (85%+) through a debt-for-equity swap — former first-lien creditors now own 98% of the equity.

### Three Operating Segments

**NEMT Segment (~70% of revenue, ~$1.96B in 2024)** — The core business. Modivcare acts as a transportation broker/manager, not a direct fleet operator. It contracts with state Medicaid agencies and Medicare Advantage plans on capitated (per-member-per-month, or PMPM) or fee-for-service bases, then subcontracts trips to a network of 6,500+ independent transportation providers. Under full-risk contracts, Modivcare absorbs all trip cost variability; under shared-risk contracts, reconciliation corridors limit exposure. As of 2024, NEMT covered 29.4 million average monthly members and coordinated approximately 36.8 million paid trips annually across 48 states and Washington D.C., running over 120 transportation programs. Revenue from state Medicaid agencies and MCOs represents 100% of NEMT segment revenue.

**Personal Care Services Segment (~27% of revenue, ~$754M in 2024)** — In-home non-medical support (activities of daily living, ADL assistance), built almost entirely through acquisitions. Modivcare employs or contracts caregivers who deliver personal care directly, with reimbursement through Medicaid LTSS (Long-Term Services and Supports) programs at hourly rates set by each state or negotiated with MCOs. EVV (Electronic Visit Verification) compliance under the 21st Century Cures Act is a core operational requirement. Organic hourly growth was approximately 1.4% in 2024 with 2.6% reimbursement rate increases.

**Monitoring Segment (~3% of revenue, ~$84M in 2024)** — Remote patient monitoring (RPM), personal emergency response systems (PERS), vitals monitoring, and medication management. Monitoring margins have risen to approximately 37% and include technology-intensive services using wearable and home-based devices. This segment combines VRI's legacy PERS/vitals infrastructure with Higi's community kiosks and clinical network. Growth in 2024 was driven by Medicaid LTSS referral volumes and newly launched chronic conditions monitoring.

### Leadership (as of 2025)

- **Heath Sampson** — President and CEO
- **Jessica Kral** — Chief Information Officer (appointed June 2023, departed May 2025; CIO role eliminated; technology team operating without C-suite replacement as of May 2025)
- **Barb Gutierrez** — CFO (also departed May 2025; CFO role also eliminated)
- **Shane Ragland / Ed Hoffman** — Transportation division leadership
- **Chelsey Berstler** — Personal Care division leadership
- **Jeff Bennett** — Monitoring division leadership

The elimination of both CIO and CFO in 2025 was framed as "flattening the organization" to "embed automation, intelligent systems, and financial discipline across the business." The technology team continues modernization work under the existing department structure.

---

## Major Systems & Platforms

### 1. Mobility Access Platform (NEMT Core)

The overarching name Modivcare gives to its NEMT technology stack. It encompasses the back-end intelligent trip management engine, the member-facing mobile/web/voice interfaces, and the provider-facing dispatch tools. The platform supports:

- **AI-powered trip scheduling** and route optimization
- **Standing order management** (40–50% of NEMT trip volume is recurring/standing orders)
- Real-time ride visibility and GPS tracking across the entire trip lifecycle
- Multi-modal transport: commercial NEMT vehicles, rideshare platforms, mileage reimbursement, mass transit
- Integration with 4,000+ active facility (hospital, dialysis center, clinic) partners
- Automated billing and claims submission via EDI 837P (claim) / 835 (remittance) / 270-271 (eligibility)

The platform was built on a hybrid of pre-Circulation LogistiCare infrastructure and Circulation's rideshare-style digital platform (acquired 2018), with progressive modernization from 2021 onward.

### 2. WellRyde (Provider/Driver Dispatch)

**Origin:** nuVizz, Inc.'s WellRyde transportation management system, acquired by Modivcare in May 2021 for an undisclosed sum and completed that same year. nuVizz had previously partnered with LogistiCare/Modivcare before the acquisition. WellRyde was categorized as an Advanced Transportation Management System (ATMS) — terminology borrowed from freight logistics.

**What it does:** Web-based SaaS dispatch platform for the 6,500+ transportation provider companies in Modivcare's network. Providers use WellRyde to receive trip assignments, optimize routes, auto-assign drivers, manage billing, and provide real-time ride visibility back to the Modivcare broker platform.

**Scale:** WellRyde processes approximately 16 million trips annually through its provider-facing portal, serves 2,000+ active customers, and is accessible via `portal.app.wellryde.com`. There is also a **WellRyde Driver** mobile app (Google Play: `com.modivcare.wellrydedriver`).

**Security certifications:** ISO 27001, ISO 27701, SOC 2 Type II (annual assessment), HIPAA certification, HITRUST CSF — all covering Modivcare's Transportation services tier.

**Integration pattern:** Third-party NEMT dispatch software (RoutingBox, RouteGenie, TobiCloud, Bambi, etc.) integrates with Modivcare via bidirectional API for trip data syncing. Trips can be sent up to 30 days prior to date of service; live GPS updates flow back to Modivcare in real time. Completed trips auto-submit to the provider's Modivcare portal. The integration requires mobile devices to log driver positions, collect client signatures, and handle Enroute / No Show status events.

### 3. Member App (Modivcare / MyModivcare)

**App Store IDs:** iOS — App ID 1560385849; Android — `com.modivcareriderapp`

The highest-rated app in the NEMT industry: 4.5+ stars, 5,900+ reviews, top 20 on Android medical apps, top 90 on Apple. Built with React Native (confirmed from job postings requiring "Expert in React Native"). The mobile client connects to the Mobility Access Platform back-end via REST APIs on AWS infrastructure.

**Features:**
- Book, modify, cancel, and real-time-track NEMT trips
- Dual-payer enrollment (Medicaid + Medicare Advantage on one account)
- Multi-beneficiary management (schedule rides for multiple people on one call/login)
- Ride accumulator (tracks trips remaining against plan benefit limits)
- Multilingual: English, Spanish; Polish, Mandarin, Cantonese, Russian in development
- Fraud-prevention geofencing for mileage reimbursement
- Instant payment and mileage reimbursement processing

**Performance impact:** App users see 35% fewer verified complaints and 14% fewer missed trips compared to phone-only members.

### 4. MARA (Modivcare Automated Reservation Assistant)

Modivcare's IVR/virtual agent system, accessible at `mymodivcare.com`. MARA is the primary self-service layer for the 2.2 million monthly inbound contacts handled by the 2,600-agent contact center.

**Capabilities:** Book, confirm, cancel, change, mileage reimbursement, and ride assistance — six primary member intents. Supports English and Spanish voice interaction, plus keypad (touch-tone) fallback. Includes a **Speaker ID** feature (Google voice biometrics integration) that recognizes members by voiceprint, eliminating the need to enter member IDs. The **Flashbook** feature allows reservation via SMS text. Chat bot interfaces extend MARA to web messaging channels.

**63% of members** now engage via digital channels (MARA + app + web), up from near-zero pre-2023.

**Technology backend:** MARA is built on **Genesys Cloud CX**, deployed via the AWS Marketplace (Modivcare's preferred procurement path), integrated with **Google Cloud** for voice/speaker ID capabilities, and connected to **Pega CRM** for member profile matching and data security. The voicebots and chatbots are built using Genesys Cloud Web Messaging with AppFoundry plug-ins. Agent Assist (AI-powered suggestions to live agents) was in planned deployment as of late 2024.

### 5. Integration Hub

Announced May 2024, the Integration Hub is Modivcare's first externally published **open API** layer — an "extensible modular mobility platform" exposing microservices to health plan clients, state Medicaid agencies, and facility partners. A pilot with charter health plans went live with API integrations in March 2024.

**What it enables:** Channel partners can embed NEMT trip booking, eligibility checks, ride accumulator, and tracking directly into their own member portals and apps without re-routing members to Modivcare's own interface. The API supports all modalities (mass transit, rideshare, mileage reimbursement, commercial NEMT).

**Architecture pattern:** Described as open API + microservices, though specific API protocols (REST/GraphQL/HL7 FHIR), authentication mechanisms, or SDK details are not publicly documented.

### 6. VRI (Valued Relationships, Inc.) — Monitoring Platform

**Acquired:** $315 million, closed September 2021.

VRI is the monitoring platform backbone: PERS (personal emergency response systems), vitals monitoring (blood pressure cuffs, other biometric devices), medication management, and data-driven patient engagement. At acquisition, VRI actively monitored 155,000 patients from two 24/7 care centers. The platform uses a **device-agnostic** approach supporting 250+ integrated devices.

**Clinical workflow:** Readings feed into VRI's care center system; abnormal values trigger 24/7 triaging and escalation reporting to the member's primary care provider. The **E3 Member Engagement System** provides dynamic, health-status-adaptive health education content.

**Guardian Medical Monitoring (GMM)** — Acquired May 2022 for undisclosed price. A Southfield, MI-based PERS provider (founded 1930) focused on MCO and state Medicaid payors. At acquisition GMM monitored approximately 50,000 patients, extending VRI's reach further into Medicaid LTSS-funded RPM.

### 7. Higi — Community Health Kiosk Network

**Acquired:** Completed March 29, 2023; price undisclosed.

Higi operates a national network of **6,000 FDA-cleared Smart Health Stations** — free, community-based kiosks (retail pharmacies, grocery stores) that measure blood pressure, BMI, pulse, and other biometrics. The network also includes web, mobile, email, and SMS tools, home-based biometric devices, and a nationally based clinical care team.

After joining Modivcare, Higi continues operating under its own brand as a Modivcare subsidiary, feeding community-collected health data into Modivcare's holistic member view. In September 2023, Higi selected ThoroughCare as a co-management partner for chronically ill patients, integrating Higi's kiosk data with ThoroughCare's care management platform.

### 8. Personal Care Platform (PCS Segment)

The PCS platform is the least publicly documented. It was assembled through acquisitions — Simplura Health Group (2020, $575M), CareFinders (2021, $340M), and organic growth. Prior to the product operating model consolidation in 2023-2024, each personal care entity ran its own scheduling, EVV compliance, and caregiver management systems.

**EVV compliance layer:** Modivcare has deployed statewide EVV (Electronic Visit Verification) systems meeting the 21st Century Cures Act CMS mandates. Caregivers use mobile apps for clock-in/clock-out with GPS verification. The specific EVV software vendor used by Modivcare's PCS segment is not publicly confirmed.

**Geographic footprint (PCS):** Primarily the Eastern Seaboard — New York, New Jersey, Pennsylvania, Connecticut, Massachusetts, Florida, West Virginia — plus additional markets post-CareFinders integration. Approximate 29.5 million members served (combined NEMT + PCS).

### 9. Circulation (Legacy — NEMT Tech Foundation, 2018)

Acquired by LogistiCare (pre-Modivcare) in September 2018 for $46 million. Circulation was a Boston-based startup (founded 2016) that built a HIPAA-compliant, rideshare-style digital platform for NEMT — automating benefit administration, ride scheduling, and trip assignment with a mobile-first approach. The strategic rationale was $25M+ in run-rate synergies through increased automation across reservations, trip assignment, customer support, and billing. Circulation's technology was the first major digital-native layer on top of LogistiCare's legacy broker infrastructure, providing the foundation for what became the Mobility Access Platform.

---

## Technology Stack

### Cloud Infrastructure

**Primary cloud: AWS.** Confirmed through multiple sources:
- Genesys Cloud CX procurement via **AWS Marketplace** ("purchasing via AWS Marketplace was a major benefit and allowed Modivcare to leverage other AWS investments") — [Genesys/Modivcare case study]
- Pulumi Insights deployed across a multi-account **AWS organization** with dozens of disconnected accounts from acquisitions — [Pulumi case study]
- Job postings require "AWS cloud-native environments including Lambda (Python) and API Gateway for backend services," "architecting AWS DynamoDB and SQL Server solutions," and "advanced proficiency in React applications via CloudFront and S3" — [Glassdoor/BuiltIn]

**Confirmed AWS services in use (from job postings and Pulumi case study):**
- AWS Lambda (Python) — serverless compute for data processing / integration
- AWS API Gateway — REST API management
- Amazon DynamoDB — NoSQL data store
- Amazon CloudFront — CDN / React app delivery
- Amazon S3 — object storage
- AWS Route 53 — DNS / subdomain management
- AWS Secrets Manager — secrets management
- AWS Systems Manager Parameter Store — configuration management
- AWS CloudFormation — IaC (some legacy accounts)

**Multi-account architecture:** By 2023, Modivcare's acquisition strategy produced a fragmented AWS environment with multiple accounts at "vastly different cloud maturity levels" — some running mature Terraform/Terragrunt IaC, some using AWS CDK, and some with only manually provisioned resources and PowerShell scripts. The platform engineering team (formed ~2023 under CIO Jessica Kral) deployed **Pulumi Insights** for inventory visibility, **Pulumi ESC** for centralized secrets/configuration management across all accounts, and **Pulumi Policy as Code** for governance enforcement without forcing migrations.

### Infrastructure as Code

- **Terraform + Terragrunt** — from mature acquired entities (e.g., WellRyde/nuVizz lineage)
- **AWS CDK** — from some acquired organizations
- **CloudFormation** — older legacy accounts
- **Pulumi** — new standard platform, deployed starting 2023-2024
- Developer portal: **Backstage** with scaffolder for repository and pipeline creation
- CI/CD: **GitLab** with CI/CD runners

### Application Stack

- **React Native** — mobile apps (member app, WellRyde Driver app)
- **React** — web portals (member portal, facility scheduler, WellRyde dispatch portal)
- **TypeScript / JavaScript** — confirmed frontend stack
- **Python** — backend serverless (Lambda); confirmed in job postings
- **SQL Server (MS SQL)** — relational database (legacy/core)
- **Oracle** — additional RDBMS in environment (job postings list Oracle + DB2 + SQL Server)
- **DB2** — IBM mainframe-era DB still present (likely from pre-Circulation LogistiCare core)

### Third-Party Platforms (Confirmed)

- **Genesys Cloud CX** — omnichannel contact center (CCaaS), launched April 2023, procured via AWS Marketplace. Modules in use: Genesys Cloud Web Messaging, Workforce Engagement Management (WEM), speech/text analytics, voicebot/chatbot platform
- **Pega CRM** — member profile management; integrated with Genesys for data security and member matching
- **Google Cloud (voice/AI)** — speaker identification/verification component of MARA
- **Figma** — UX/UI design tool (confirmed in job postings)
- **Git** (GitLab) — source control

### Compliance & Security Certifications

Modivcare is a **HIPAA Business Associate** of all state Medicaid agencies and MCOs it contracts with — meaning it signs Business Associate Agreements (BAAs) and must protect PHI under the HIPAA Security Rule. Certifications across the enterprise:

- **HITRUST CSF** — nationally recognized healthcare-specific security framework
- **ISO/IEC 27001:2022** — information security management
- **ISO/IEC 27701:2019** — privacy information management
- **SOC 2 Type II** — covers Transportation and Remote Monitoring product lines (annual assessment)
- **HIPAA** — third-party audited HIPAA attestation (HITECH breach notification alignment)
- **XDR Endpoint Security**, **Cloud-based Secure Web Gateway**, **Zero Trust Network Access** — endpoint/perimeter security tools named on Modivcare's security page (vendors unconfirmed)

Data is encrypted in transit and at rest; multisite architecture for business continuity; periodic system backups; 24/7 data center badging and surveillance.

---

## Scale & Footprint

### NEMT Segment

| Metric | Value | Source |
|--------|-------|--------|
| Annual paid trips (2024) | ~36.8 million (RouteGenie/Modivcare: "37 million") | [RouteGenie blog, Genesys case study] |
| Average monthly NEMT members (2024) | 29.4 million | [Q4 2024 earnings] |
| States served | 48 states + D.C. | [RouteGenie, modivcare.com] |
| Transportation programs | 120+ | [RouteGenie] |
| Transportation provider companies | 6,500+ | [modivcare.com NEMT page] |
| Active facility partners | 4,000+ | [modivcare.com Technology page] |
| Trip completion rate | ~98% | [hibambi.com] |
| App store rating | 4.5+ stars (5,900+ reviews) | [Modivcare press release, 2024] |
| Contact center volume | 2.2 million monthly contacts | [Genesys case study] |
| Contact center agents | 2,600 (in-house + outsourced) | [Genesys case study] |
| Monthly quality evaluations | 24,000 interactions (up from 6,000) | [Genesys case study] |
| NEMT segment revenue (2024) | ~$1.96 billion | [Q4 2024 earnings] |

### Personal Care Segment

| Metric | Value | Source |
|--------|-------|--------|
| PCS segment revenue (2024) | ~$754 million | [Q4 2024 earnings] |
| Service hours growth (2024) | +1.4% organic | [Q4 2024 earnings] |
| Reimbursement rate increase | +2.6% | [Q4 2024 earnings] |
| Primary geographies | NY, NJ, PA, CT, MA, FL, WV + expansion | [Modivcare news/SEC] |

### Monitoring Segment

| Metric | Value | Source |
|--------|-------|--------|
| Monitoring revenue (2024) | ~$84 million | [Q4 2024 earnings] |
| Monitoring gross margin | ~37% | [earnings call] |
| VRI patients at acquisition (2021) | 155,000 | [VRI acquisition announcement] |
| GMM patients at acquisition (2022) | ~50,000 | [Guardian acquisition announcement] |
| Higi Smart Health Stations | 6,000 nationwide | [Higi press release, 2023] |
| Integrated devices (VRI) | 250+ | [VRI acquisition announcement] |

### Company Overall (2024)

| Metric | Value |
|--------|-------|
| Total service revenue | $2,787.6 million |
| Adjusted EBITDA | $161.1 million (5.8% margin) |
| Employees | ~20,160 |
| Total members served | ~34 million (stated as "34 million members" in Genesys case study) |

---

## Acquisitions & Product Lineage

The entire Modivcare product architecture was assembled through acquisition, not greenfield development. Understanding the lineage explains why the AWS environment contains such heterogeneous infrastructure:

### NEMT Segment Lineage

**LogistiCare (1986 → 1991 → 2007)** — Founded as logistics software for ambulance industry; pivoted to NEMT broker in early 1990s; became solely NEMT-focused by mid-1990s. Providence Service Corporation acquired it in 2007 for $220 million. LogistiCare's legacy system included what job postings suggest was Oracle/DB2 core infrastructure — older relational RDBMS indicative of 1990s-2000s enterprise IT.

**Circulation (acquired September 2018, $46M)** — Boston startup (founded 2016) that built a HIPAA-compliant, rideshare-network-style digital dispatch layer for NEMT. At acquisition, Circulation's platform offered automated benefit administration, API-driven trip scheduling, real-time notifications, and integration with rideshare networks — capabilities LogistiCare lacked. The $46M price for a 2-year-old startup was specifically to buy the tech, not scale. Synergies targeted: automation of reservations, trip assignment, customer support, and billing. Circulation's tech became the first modern API/mobile layer over LogistiCare's legacy broker infrastructure, forming the core of what is now called the Mobility Access Platform.

**National MedTrans (acquired May 2020)** — Acquired from Specialty Benefits LLC; added ~$200M annual revenue, 5 million trips/year, 2 million members across 12 states, primarily capitated contracts. No significant technology acquisition — operational scale addition.

**WellRyde / nuVizz (acquired May–Summer 2021, price undisclosed)** — Advanced Transportation Management System (ATMS) SaaS originally built by nuVizz Inc. At acquisition, WellRyde was used by 1,200+ transportation provider companies and processed 16M trips/year. This was a strategic decision to own the provider-side dispatch layer rather than leave it with a third-party vendor. WellRyde brought its own ISO/HITRUST-certified cloud infrastructure into the Modivcare AWS organization. Its mature Terraform/Terragrunt IaC practices were some of the most advanced in the Modivcare portfolio.

### Personal Care Segment Lineage

**Simplura Health Group (acquired November 2020, $575M)** — Providence's first PCS acquisition; Simplura operated home health and personal care agencies across 7 Eastern Seaboard states (NY, NJ, PA, CT, MA, FL, WV). This established the PCS segment entirely. Technology was independent home care scheduling/EVV systems.

**CareFinders (acquired July 2021, $340M)** — Personal care provider in NJ, PA, CT; ~10M hours of care/year for 7,500+ patients through 6,200+ caregivers. Expanded PCS segment scale in the Northeast.

### Monitoring Segment Lineage

**VRI / Valued Relationships Inc. (acquired September 2021, $315M)** — Industry-leading PERS/vitals monitoring platform for Medicaid MCOs. VRI operated two 24/7 care centers, monitored 155,000 patients, supported 250+ device types. Brought proprietary monitoring platform and care center technology into Modivcare. This became the technological core of the Monitoring segment.

**Guardian Medical Monitoring (acquired May 2022, undisclosed)** — Founded 1930; Southfield, MI-based PERS provider serving MCOs and state Medicaid. Monitored ~50,000 additional patients. Added Medicaid payer relationships and scale.

**Higi SH LLC (acquired March 29, 2023, undisclosed)** — Consumer health engagement platform. Higi's 6,000 FDA-cleared Smart Health Stations (retail/pharmacy kiosks) collect blood pressure, weight, BMI, and pulse in the community. Modivcare uses Higi as a member engagement and risk stratification tool — community biometric readings feed into the integrated member health view, identifying at-risk members for proactive NEMT/PCS/Monitoring referrals. Higi continues to operate its established kiosk business. In September 2023, Higi added ThoroughCare (care management SaaS) as a chronic disease management layer on top of kiosk data.

---

## NEMT Industry Context: How Modivcare's Platform Fits

Modivcare operates as a **transportation benefit manager (TBM)** — equivalent to a pharmacy benefit manager (PBM) for transportation. The payer (state Medicaid agency or MCO) signs a PMPM or shared-risk contract; Modivcare handles eligibility, scheduling, provider dispatching, quality monitoring, claims adjudication, and attestation. Key domain-specific constraints:

- **Medicaid attestation:** Every trip requires eligibility verification (270/271 EDI transaction), completed trip attestation, and Medicaid claim submission (837P). Provider-side claims go through the 835 remittance loop. Fraud, waste, and abuse monitoring is built into the platform (geofencing in member app, GPS position logging in WellRyde).
- **Multi-tenancy:** Modivcare runs >120 separate transportation programs under a single platform, each with different benefit rules, eligibility sources, trip limits, and geographic coverage. The Integration Hub's microservices architecture enables per-client configuration.
- **PHI handling at scale:** 34 million members' transportation schedules, home addresses, appointment destinations, diagnoses codes (used for trip authorization), and biometric data (Monitoring segment) all flow through AWS. HITRUST + SOC 2 Type II + BAA cover this data footprint.
- **Prior authorization / trip authorization:** Depending on the state, NEMT trips require pre-authorization against diagnosis codes. Modivcare's scheduling platform includes authorization workflow and eligibility rule engines.
- **EVV for PCS:** CMS mandates Electronic Visit Verification for all Medicaid personal care visits. Modivcare's PCS segment must log caregiver clock-in/out with GPS verification and transmit EVV data to state aggregators.

---

## Platform Modernization Status (2023–2025)

Under CIO Jessica Kral (2023–2025), Modivcare executed a structural shift from federated (each segment with its own IT) to centralized Product & Technology organization. The key modernization initiatives:

1. **Genesys Cloud CX deployment** (April 2023) — Replaced legacy contact center infrastructure; procured via AWS Marketplace; reduced IT tickets by 50%; reduced average speed of answer by 31%; improved agent retention 86%.

2. **Pulumi IaC standardization** (2023–2024) — Deployed Pulumi Insights for cross-account AWS visibility, Pulumi ESC for centralized secrets/config, Pulumi Policy as Code for governance. The platform engineering team created dozens of infrastructure modules within the first year, enabling developer self-service. Infrastructure provisioning went from multi-day, multi-team bottlenecks to minutes.

3. **Integration Hub launch** (2024) — First public-facing open API layer for external health plan and state Medicaid agency integration. Microservices architecture.

4. **Mobility Access Platform app advances** (2024) — Agentic AI integration, IVA quality improvements, call center automation, member care automation, predictive and responsive decision-making systems.

5. **Legacy stack remediation** — The DB2/Oracle/SQL Server legacy databases inherited from LogistiCare's pre-2018 architecture are still present in job requirements. Full migration to cloud-native data stores is ongoing (unconfirmed completion timeline).

The company's 2025 Chapter 11 filing interrupted planned investments. Post-emergence with $100M in fresh capital, CEO Heath Sampson explicitly cited "aggressive investment in technology, analytics and service excellence" as a strategic priority for 2026.

---

## Sources

- SEC EDGAR: Modivcare 10-K FY2024 proxy: https://www.sec.gov/Archives/edgar/data/1220754/000122075425000026/a-modvannualreport12312024.pdf (403 but referenced via secondary sources)
- Modivcare Q4 2024 full year earnings: https://www.businesswire.com/news/home/20250306568933/en/Modivcare-Reports-Fourth-Quarter-and-Full-Year-2024-Financial-Results-Announces-Changes-to-the-Board-of-Directors
- Modivcare Technology page: https://www.modivcare.com/company/technology/
- Modivcare Security & Compliance: https://www.modivcare.com/company/security/
- Modivcare Data Protection page: https://www.modivcare.com/company/security/data-protection-and-availability/
- WellRyde Dispatch Software page: https://www.modivcare.com/who-we-serve/wellryde-dispatch-software/
- Modivcare NEMT offerings page: https://www.modivcare.com/offerings/nemt/
- Modivcare Remote Monitoring page: https://www.modivcare.com/offerings/remote-monitoring/
- Modivcare Integration Hub announcement (BusinessWire, May 2024): https://www.businesswire.com/news/home/20240516195169/en/Modivcare-Unveils-Integration-Hub-Revolutionizing-Access-to-NEMT-Benefits
- Modivcare Integration Hub (official press release): https://www.modivcare.com/news-releases/modivcare-unveils-integration-hub-revolutionizing-access-to-nemt-benefits/
- Modivcare member app press release (BusinessWire, March 2024): https://www.businesswire.com/news/home/20240306979962/en/Modivcares-NEMT-Mobility-App-for-Members-Sets-Best-in-Class-Rankings-and-User-Adoption-Pioneers-New-Advancements
- Modivcare Genesys Cloud case study: https://www.genesys.com/customer-stories/modivcare
- Genesys/Modivcare AI announcement (BusinessWire, October 2024): https://www.businesswire.com/news/home/20241015239646/en/Modivcare-Boosts-Health-Care-Experiences-with-Genesys-Cloud-AI
- Genesys drives service improvements for Modivcare (DestinationCRM): https://www.destinationcrm.com/Articles/CRM-Insights/Case-Studies/Genesys-Cloud-Drives-Service-Improvements-for-Modivcare-168969.aspx
- Modivcare omnichannel implementation press release (September 2023): https://www.modivcare.com/news-releases/modivcare-announces-successful-implementation-of-ai-automated-omnichannel-cloud-solution-to-improve-nemt-member-experience/
- Pulumi case study — Modivcare Self-Service and Governance: https://www.pulumi.com/case-studies/modivcare/
- CIO.com — Product operating model at Modivcare (Jessica Kral interview): https://www.cio.com/article/3834755/the-product-operating-model-thats-driving-transformation-at-modivcare.html
- Modivcare appoints Jessica Kral as CIO: https://www.modivcare.com/news-releases/modivcare-appoints-jessica-kral-as-chief-information-officer/
- Executive leadership transitions (May 2025): https://www.businesswire.com/news/home/20250505161905/en/Modivcare-Announces-Executive-Leadership-Transitions-as-Part-of-Strategic-Business-Model-Evolution
- Modivcare eliminates 2 C-Suite roles (Home Health Care News): https://homehealthcarenews.com/2025/05/modivcare-eliminates-2-c-suite-roles-in-push-for-modernization/
- Modivcare WellRyde acquisition: https://www.modivcare.com/news-releases/modivcare-announces-acquisition-of-wellryde-and-accelerated-strategy-to-create-the-largest-digitally-integrated-non-emergency-medical-transportation-nemt-network-in-the-united-states/
- WellRyde nuVizz acquisition completed (OPEN MINDS): https://openminds.com/market-intelligence/bulletins/modivcare-completes-acquisition-of-the-nuvizz-wellryde-technology-platform/
- VRI acquisition: https://www.modivcare.com/news-releases/modivcare-announces-acquisition-of-vri-a-leading-provider-of-remote-patient-monitoring-solutions-in-the-united-states/
- VRI acquisition completed (BusinessWire): https://www.businesswire.com/news/home/20210922005285/en/ModivCare-Completes-Acquisition-of-VRI
- Guardian Medical Monitoring acquisition: https://www.modivcare.com/news-releases/modivcare-announces-acquisition-of-guardian-medical-monitoring/
- Higi joins Modivcare: https://www.higi.com/press/2023/5/higi-joins-modivcare-platform-to-accelerate-clinical-connectivity-and-sdoh-impact
- Higi ThoroughCare partnership: https://www.businesswire.com/news/home/20230926958885/en/Higi-Selects-ThoroughCare-to-Assist-in-Managing-Chronically-Ill-Patients
- CareFinders acquisition: https://www.businesswire.com/news/home/20210726005212/en/ModivCare-Expands-Personal-Care-Segment-with-Acquisition-of-CareFinders
- Simplura Health Group acquisition: https://www.modivcare.com/news-releases/providence-expands-into-home-care-segment-with-accretive-acquisition-of-simplura-health-group/
- National MedTrans acquisition: https://www.modivcare.com/news-releases/logisticare-announces-acquisition-of-national-medtrans/
- LogistiCare acquires Circulation (GlobeNewswire): https://www.globenewswire.com/news-release/2018/09/17/1571594/0/en/LogistiCare-enters-into-agreement-to-acquire-circulation.html
- Circulation acquisition completed: https://www.modivcare.com/news-releases/logisticare-completes-acquisition-of-circulation/
- MobiHealthNews on Circulation acquisition: https://www.mobihealthnews.com/news/circulation-acquired-nemt-broker-logisticare-46-million (403 — referenced via secondary)
- Providence rebrands to Modivcare (GlobeNewswire): https://www.globenewswire.com/news-release/2021/01/06/2153997/0/en/Providence-Announces-New-Name-ModivCare.html
- Modivcare Chapter 11 filing and emergence: https://www.businesswire.com/news/home/20251229414980/en/Modivcare-Successfully-Completes-Financial-Restructuring-Reducing-Debt-by-More-Than-85
- Modivcare Chapter 11 overview (ElevenFlo): https://elevenflo.com/blog/modivcare-chapter-11-bankruptcy
- Modivcare exits bankruptcy as private entity: https://www.ad-hoc-news.de/boerse/news/ueberblick/modivcare-emerges-from-bankruptcy-as-private-entity-equity-wiped-out/68467833
- Post-bankruptcy technology recovery plan (Home Health Care News): https://homehealthcarenews.com/2025/10/modivcare-ceos-post-bankruptcy-recovery-plan-aligning-people-advancing-technology/
- MARA virtual assistant details: https://www.mymodivcare.com/meet-mara/
- NEMT broker profile — RouteGenie: https://routegenie.com/blog/meet-the-broker-modivcare/
- NEMT software integration with Modivcare (NEMT Platform): https://nemtplatform.com/blogs/how-to-choose-nemt-software-that-works-with-modivcare-mtm-and-more
- ModivCare API integration (RoutingBox/IntelligentBits): https://help.intelligentbits.com/modivcare-api-integration
- Bambi NEMT broker profile: https://www.hibambi.com/blog/nemt-broker-modivcare
- Modivcare Monitoring — VRI + Higi (HealthTechMagazines): https://www.healthtechmagazines.com/modivcare-monitoring-vri-pers-vitals-monitoring-plus-higis-community-platform-clinical-network/
- Modivcare predictive analytics blog: https://www.modivcare.com/blog/how-predictive-analytics-ensures-a-smooth-ride-for-patients/
- Modivcare healthcare security certifications blog: https://www.modivcare.com/blog/healthcare-information-security-and-the-relevance-of-security-certifications/
- Senior React Native Engineer job posting (Himalayas): https://himalayas.app/companies/modivcare/jobs/senior-react-native-engineer
- Senior Integrations Software Engineer job (BuiltIn): https://builtin.com/job/senior-integrations-software-engineer/3331393
- WellRyde Route Workbench PDF: https://tp.modivcare.com/hubfs/WellRyde%20Dispatch%20Portal_Route%20Workbench_Overview.pdf

## Connections, Flows & Status

**Focus:** Connections, Data Flows & Status
**Companion brief:** modivcare-structure.md (Structure & Systems — parallel agent)
**Research date:** May 2026

---

## Overview

Modivcare (formerly LogistiCare, NASDAQ: MODV until December 2025) is the largest U.S. NEMT broker, coordinating approximately 35 million trips per year across a network of 6,500+ contracted transportation providers in 30+ states. The company operates on a classic broker model: a state Medicaid agency or MCO contracts Modivcare to manage the NEMT benefit; Modivcare authorizes trips, dispatches providers, tracks rides, and adjudicates claims; providers bill Modivcare rather than the state directly. Beyond NEMT, Modivcare operates a Personal Care Services (PCS) segment (~25 million hours of home care annually) and a Remote Patient Monitoring (RPM) segment (~50,000 monitored patients via the Guardian Medical Monitoring acquisition).

As of December 29, 2025, Modivcare emerged from Chapter 11 bankruptcy as a privately-held company (owner: consortium of former first- and second-lien creditors), having shed $1.1 billion of its ~$1.4 billion funded debt load. This brief covers what is publicly known about the data flows, integration patterns, compliance posture, and technology substrate of this company.

---

## End-to-End Data Flows

### 1. Member Trip Request Flow

The canonical path when a Medicaid member needs a ride:

1. **Request initiation** — Member contacts Modivcare through one of four channels:
   - **IVR / voicebot**: Genesys Cloud voicebot (deployed April 2023) handles trip scheduling, confirmation, cancellation, and mileage reimbursement requests via phone. Member speaks or uses keypad. Genesys Cloud connects to the back-end trip management engine in real time.
   - **Mobile app** (`member.modivcare.com`, Android package `com.modivcareriderapp`): Native app for trip booking and real-time ride tracking.
   - **Web portal** (`member.modivcare.com/en/login`): Browser-based member portal.
   - **SMS** (for members without smartphones): Available as a booking/notification channel.
   - **Facility scheduler (TripCare)**: Healthcare facilities book on behalf of patients via `tripcare.modivcare.com`. Handles standing orders (recurring appointments) — stated to represent 40–50% of trip volume.

2. **Eligibility check** — Before authorizing a trip, Modivcare verifies the member is an active Medicaid beneficiary and that the trip meets NEMT coverage criteria. In FFS (fee-for-service) state contracts, this involves querying the state MMIS via EDI X12 **270/271** (Health Care Eligibility/Benefit Inquiry and Response). In MCO-contracted states, Modivcare checks against the MCO's eligibility roster or via the MCO's API/portal. The member must provide their Medicaid ID (on the purple Medicaid card in most states), pickup address, destination, appointment date/time, and any special needs (wheelchair, stretcher).

3. **Trip authorization** — Modivcare's back-end intelligent trip management engine (referenced on the technology page as a proprietary platform) validates:
   - Benefit limits (trip accumulator / ride counter enforced via Integration Hub data)
   - Medical necessity (appointment type appropriate for NEMT coverage)
   - Geographic coverage (provider network coverage in that zip code)
   - Mode eligibility (ambulatory vs. wheelchair accessible vs. stretcher)
   
   If authorized, a trip record is created and enters the dispatch queue.

4. **Dispatch** — The back-end routes the trip to a contracted transportation provider. Modivcare operates both its own WellRyde-enabled network and rideshare providers (Lyft, Uber Health). For standard scheduled trips, assignments can be sent to providers up to 30 days in advance. For same-day/on-demand trips, the system auto-assigns based on provider availability, location proximity, and vehicle type.

5. **GPS tracking** — Once a driver accepts a trip in the WellRyde Driver app (Android package `com.modivcare.wellrydedriver`, iOS App Store ID 1621667485), the app begins transmitting GPS telemetry in real time. The third-party NEMT software guide describes Modivcare's requirement for GPS updates at **30-second intervals** (unconfirmed as exact protocol, but standard NEMT SLA). Geofencing triggers "Enroute," "Arrived," "Pickup," and "Drop-off" status events.

6. **Proof-of-service capture** — At pickup, the driver captures the rider's electronic signature in the WellRyde Driver app. GPS breadcrumbs, timestamps, mileage, and the signature are bundled into a trip completion record.

7. **Status updates to member** — Real-time ETA and trip status flow back to the member via the mobile app. SMS notifications are sent at key status changes (driver assigned, en route, arrived, completed).

8. **Claims generation** — WellRyde creates a claim from captured trip data: GPS track, timestamps, mileage, and electronic signature. Providers review claims in their WellRyde billing module within 24 hours. Clean claims use **HCPCS codes** (T2002 for NEMT; T2003 for wheelchair van; S0215 for non-emergency taxi; A0130 for wheelchair van non-emergency) with appropriate modifiers (RH: residential care, HE: mental health).

9. **Claims submission to Modivcare** — Providers operating WellRyde submit claims via the WellRyde portal (or through third-party dispatch platforms integrated via Modivcare's API, using bidirectional JSON over HTTPS). Modivcare scrubs claims against a rules engine before approving payment.

10. **Modivcare bills the MCO/state** — Modivcare aggregates trip costs and submits billing to the state Medicaid agency or MCO. This uses **EDI X12 837P** (professional claim) or its state-specific variant. Some states use batch file exchange with the MMIS; others use real-time or near-real-time API calls. Payment remittance back from the payer to Modivcare uses **EDI 835** (Electronic Remittance Advice).

11. **Provider payment** — Modivcare pays providers via EFT within **15–30 days** for clean claims, 30–45 days for claims requiring corrections.

---

### 2. MCO / Health Plan Client Integration Flow

MCOs (UnitedHealth Community Plan, Humana Medicaid, Centene/WellCare, Molina Healthcare, HMSA, PacificSource, etc.) contract Modivcare to manage the NEMT benefit on their behalf. The data flow:

1. **Eligibility roster exchange** — MCO transmits member eligibility files to Modivcare on a scheduled basis (typically daily or weekly). Format: EDI 834 (Benefit Enrollment and Maintenance) or proprietary flat files via SFTP. Modivcare loads this roster into its trip management engine. Real-time eligibility checks during trip requests use 270/271 transactions against the roster.

2. **Authorization / benefit limit data** — MCO provides trip limit configurations (e.g., "10 trips per year" or "unlimited medically necessary"). Modivcare's Integration Hub exposes a **Ride Accumulator** API that lets MCO portals and member apps query real-time remaining benefit counts.

3. **Reporting and analytics** — Modivcare provides MCO clients reporting dashboards with trip metrics, completion rates, cost per trip, and quality data. Access is through Modivcare's client portal (distinct login context from member portals).

4. **Integration Hub APIs (launched May 2024)** — Modivcare's Integration Hub is described as an "extensible modular mobility platform" exposing **open RESTful APIs via microservices** to MCO clients, state Medicaid agencies, and facility partners. Documented capabilities:
   - **Eligibility Verification API**: Real-time NEMT benefit eligibility check.
   - **Trip Management API**: Book, modify, cancel, track trips. Embeddable in MCO member portals and mobile apps.
   - **Ride Accumulator API**: Current trip count vs. limit.
   - **Ride History API**: Full trip history for a member.
   - Multi-modal dispatch: API can route to commercial NEMT, rideshare (Lyft/Uber), mass transit, or mileage reimbursement.
   
   Authentication method for the Integration Hub APIs is not publicly documented; expected to be OAuth 2.0/JWT-based (unconfirmed).

5. **Claims reconciliation** — MCO receives 837P claims from Modivcare; 835 remittance flows back. Some MCO contracts cap Modivcare's administrative fee as a percentage of trip cost, requiring regular financial reconciliation.

---

### 3. State Medicaid Agency Integration Flow

In FFS (fee-for-service) states where Modivcare contracts directly with the state agency:

1. **MMIS connectivity** — Modivcare connects to each state's Medicaid Management Information System (MMIS) — operated by vendors like Gainwell Technologies, DXC Technology, Deloitte, or HP Enterprise depending on the state. Connection is typically via state-defined trading partner agreement with X12 EDI transactions over a VAN (Value-Added Network) or state SFTP gateway. Transaction sets used: 270/271 (eligibility), 837P (claims), 835 (remittance), and potentially 820 (premium payment) or 277 (claim acknowledgment) in some states.

2. **Provider enrollment** — Modivcare must be enrolled as a NEMT broker in each state's MMIS as a billing entity. Individual transportation providers in Modivcare's network are credentialed through Modivcare's Complicore-powered credentialing portal (not directly registered in the state MMIS).

3. **Prior authorization** — NEMT trips in some states require PA through the MMIS PA module. In others, Modivcare itself serves as the authorization entity under its broker contract.

4. **Claims adjudication** — State MMIS adjudicates Modivcare's 837P claims; 835 remittance informs Modivcare of approved and denied trips.

---

### 4. Transportation Provider / Driver Data Flow

Transportation providers (ambulatory sedan companies, wheelchair van companies, stretcher companies) interact with Modivcare through:

1. **WellRyde Driver app** — Real-time trip assignments, GPS tracking, status updates, signature capture. Offline mode available (on-device trip data). Version 6.0.38 (iOS) / 6.0.30 (Android) as of mid-2024.

2. **WellRyde Dispatch Portal** (`portal.app.wellryde.com`) — Web-based dispatcher view: trip board, route optimization, auto-assignment, billing/claims module, reporting dashboards, document uploads. Accessible by any modern browser.

3. **Transportation Provider Portal** (`transportationco.logisticare.com`) — Older portal, still operational as of 2026 under the legacy LogistiCare domain. Handles billing, claims, ride reservations, and driver safety training booking.

4. **Third-party dispatch software API** — Providers using third-party NEMT software (RoutingBox, RouteGenie, NEMT Platform, etc.) can integrate via the Modivcare API. The integration uses **bidirectional JSON exchange** over **secure HTTPS endpoints** for real-time trip imports and status updates. Trip data transmitted includes driver/vehicle assignments, GPS location, timestamps, and trip status. Billing submissions are automated batch or real-time via the API. Data transmission: GPS updates sub-30-second; status updates sub-15-minute per SLA.

5. **Complicore credentialing** — Providers must upload compliance documents (vehicle inspection certificates, driver background checks, insurance certificates, HIPAA attestations) to their **Complicore** account (`complicore.co`). Complicore is a third-party SaaS platform for healthcare provider credentialing and compliance. Modivcare mandates annual compliance attestation. Compliance documents are stored and monitored by Complicore, which handles expiry alerts and audit reporting.

---

### 5. Rideshare Integration (Lyft / Uber Health)

- **Lyft Healthcare partnership** — Original partnership established 2017 between LogistiCare and Lyft. Extended nationwide in 2020. LogistiCare/Modivcare was Lyft's largest NEMT broker partner. The integration uses the **Lyft Healthcare API** (REST/JSON), which allows Modivcare to dispatch Lyft rides as part of multi-modal trip routing within the Mobility Access Platform. Covers on-demand and scheduled trips. Per the partnership announcement, the API integration serves riders across 48 states.

- **Uber Health partnership** — Modivcare also has an integration with **Uber Health** (REST API, HIPAA-compliant mode). Uber Health's API allows Modivcare to request door-to-door rides and wheelchair vehicles directly from the platform or API dashboard without requiring the member to have an Uber account.

- **Multi-modal dispatch logic** — The Integration Hub routes trips based on member mobility needs, cost, and provider availability: standard NEMT provider → Lyft → Uber Health → mass transit → mileage reimbursement. The Ride Accumulator tracks utilization across all modalities.

---

### 6. Remote Patient Monitoring Data Flow (RPM Segment)

Modivcare's RPM segment (acquired Guardian Medical Monitoring in 2022, adds to VRI PERS and Higi capabilities) operates a separate technology stack:

- **Care Everyday platform** — Guardian Medical Monitoring's proprietary RPM platform. Monitors ~50,000 aging/chronically ill patients. Features: PERS (Personal Emergency Response Systems), medication management, vitals monitoring (biometric devices).

- **E3 Engagement Platform** — Modivcare's proprietary "Engage, Educate, Empower" platform. Multi-modal engagement: phone, SMS, app, portal. Continuous data collection feeding care management workflows. 50-state clinical network. Targets MCOs and state Medicaid payors.

- **RPM → MCO data flow** — Vitals data and alert events from biometric devices flow through the Care Everyday platform to care managers and payors. Clinical interventions and care management notes are documented in the platform and shared with MCO care coordinators via reporting exports or API (specific integration protocol not publicly documented).

- **FHIR / HL7** — No public documentation of FHIR or HL7 integration for any Modivcare segment. Given the NEMT nature of the business (transportation, not clinical records), HL7 FHIR is less critical than EDI X12 transactions. RPM segment may use HL7 2.x for device data or clinical notes — unconfirmed.

---

## Integration Protocols and Patterns

| Direction | Standard / Protocol | Use Case |
|---|---|---|
| Modivcare → State MMIS | EDI X12 837P (HIPAA 5010) | NEMT claims submission |
| State MMIS → Modivcare | EDI X12 835 | Remittance / payment advice |
| Modivcare ↔ MMIS | EDI X12 270/271 | Member eligibility inquiry/response |
| MCO → Modivcare | EDI 834 / SFTP flat files | Member enrollment roster |
| Provider → Modivcare | JSON over HTTPS | Trip status, GPS telemetry, claims |
| Modivcare → Provider | JSON over HTTPS | Trip assignments, schedule updates |
| Rideshare (Lyft/Uber) | REST JSON (Lyft Healthcare API, Uber Health API) | On-demand ride dispatch |
| MCO Partner | REST APIs (Integration Hub) | Eligibility, trip booking, accumulator |
| Facility partner | REST APIs (TripCare or Integration Hub) | Trip scheduling for patients |
| Contact center | Genesys Cloud (SaaS) | IVR, voicebot, chat, SMS, email, fax |
| Provider credentialing | Complicore API/portal | Compliance document management |
| Member app ↔ backend | HTTPS REST (Django/AWS) | Trip management, tracking |

**EDI specifics:** Modivcare must comply with HIPAA 5010 transaction standards for all X12 EDI with state MMIS and MCO systems. Each state has a Companion Guide specifying local extensions (segment requirements, code values, valid modifier combinations). Trading Partner Agreements are required for each state MMIS connection.

**Batch vs. real-time:** Legacy state MMIS connections tend to be batch (nightly file exchange); MCO integrations are increasingly moving to real-time API calls. The Integration Hub (2024) represents a strategic push toward real-time REST APIs replacing batch EDI with MCO partners.

---

## External Integrations

### State Medicaid / MMIS Vendors
Modivcare operates in 30+ states, each with a different MMIS vendor and connection protocol. Known MMIS vendors in Modivcare states include Gainwell Technologies (Mississippi, DC), DXC Technology (Virginia), and others. Each state connection requires a separate trading partner agreement and companion guide implementation.

### MCO Partners
Modivcare's largest MCO clients include (based on contract geography evidence):
- UnitedHealth Community Plan (multiple states)
- Humana (multiple states)
- Centene / WellCare
- Molina Healthcare
- HMSA (Hawaii)
- PacificSource Community Solutions (Oregon; branded as **PacificSource Ride**, accessible at `pacificsourceride.modivcare.app`)
- San Francisco Health Plan (California)
- AmeriHealth Caritas (multiple states)

The PacificSource Ride integration is notable as a white-labeled version of Modivcare's platform under the MCO's brand — transportation providers access it via the standard provider portal at `transportationco.modivcare.com`.

### Rideshare
- **Lyft Healthcare** — Lyft's HIPAA-compliant ride API. Integration active since 2017 (LogistiCare era), extended nationwide 2020. Modivcare was Lyft's largest NEMT broker partner as of 2020.
- **Uber Health** — HIPAA-compliant Uber Health API integration (active, date of initial integration not publicly confirmed).

### Contact Center
- **Genesys Cloud CX** — Deployed April 2023, purchased via **AWS Marketplace** (allowing Modivcare to leverage AWS committed spend). Handles 2.2 million monthly contacts (calls + digital). Replaces an unstable legacy workforce management and virtual agent platform. Capabilities deployed: inbound voice, voicebots (6 primary member intents: schedule/modify/cancel trip, ride assistance, mileage reimbursement, general inquiry), chatbots, web messaging (embedded in 3 apps with 2 more pending), SMS, email, fax, Workforce Engagement Management, speech/text analytics.
- **Google Cloud** voice services — Integrated within Genesys Cloud for speaker identification (regulatory compliance use case — likely for call recording consent and identity verification).

### CRM
- **Pega CRM** — Modivcare uses Pega for member and interaction data management. Genesys Cloud is integrated with Pega CRM to maintain seamless data security during contact center interactions. Pega is the system of record for member case and interaction history.

### Provider Credentialing
- **Complicore** (`complicore.co`) — Third-party SaaS platform for credentialing, compliance document management, audit center, and ongoing monitoring. Modivcare mandates all transportation providers upload annual compliance documentation to Complicore. The platform provides "always-on monitoring" of credential status.

### Modivcare Connect (Circulation)
- **Circulation** — Healthcare transportation platform acquired by LogistiCare in September 2018. Now operates as **Modivcare Connect** (`app.circulation.com`). Serves a broader payer/facility mix than the Medicaid-focused core platform (~3,000 healthcare facilities across 45 states). HIPAA-compliant digital platform connecting patients, facilities, and a diverse transportation network including rideshare and accessible vehicles. This is the platform used for non-Medicaid (commercial health plan, hospital, direct-pay) transportation management.

### Monitoring Devices (RPM)
- **Guardian Medical Monitoring / Care Everyday platform** — PERS devices, medication management systems, biometric monitoring devices (specific device manufacturers not publicly disclosed). Platform connects to MCO care management workflows via exports/reports.

---

## Authentication and Identity Flows

### Member Authentication
- **Member portal** (`member.modivcare.com`) — Username/password. The portal explicitly warns that "existing Member Services Website accounts will not work logging into the Modivcare app," indicating a platform migration that created separate identity stores (unconfirmed whether both have been consolidated since).
- **Mobile app** — Standard credential login; no documented SSO. App communicates with backend over HTTPS.
- **IVR / voicebot (Genesys Cloud)** — Members authenticate by Medicaid member ID and date of birth (or similar PII verification) via voice. Google voice services (via Genesys) support speaker identification for regulatory compliance.
- **MFA** — Two-factor authentication is referenced for member accounts in security-facing materials, but specific implementation (TOTP, SMS OTP) is not documented publicly.
- **SSO** — The Modivcare corporate/operations login (`investors.modivcare.com` login page) uses a Single Sign-On system (username/password + 2FA setup). No evidence of SSO for member-facing portals; MCO partners may have SSO for their embedded Integration Hub widgets.

### Provider Authentication
- **Transportation Provider Portal** (`transportationco.logisticare.com`) — Username/password, no documented SSO.
- **WellRyde Dispatch Portal** (`portal.app.wellryde.com`) — Separate credential system from provider portal.
- **WellRyde Driver app** — Driver-level authentication (likely email/password with sessions). No documented SSO or MFA for drivers.

### Facility Authentication
- **TripCare** (`tripcare.modivcare.com`) — Facility users have separate credentials. Chat support available in-portal without additional authentication.

### MCO / State Partner Authentication
- **Integration Hub API access** — Authentication mechanism not publicly documented. REST APIs typically use OAuth 2.0 client credentials or API key auth for server-to-server integrations (unconfirmed for Modivcare specifically).
- **Reporting portals** — Likely username/password with possible SSO for large MCO clients (unconfirmed).

---

## HIPAA and PHI Handling

### Certifications and Attestations
Modivcare maintains the following as of 2025:
- **HITRUST certified** (Health Information Trust Alliance CSF) — Healthcare-specific security framework.
- **ISO/IEC 27001:2022** — Information security management certification (globally recognized).
- **ISO/IEC 27701:2019** — Privacy information management extension to ISO 27001.
- **AICPA SOC 2 Type II** — Available for Transportation and Remote Monitoring segments; requires NDA to access. Implies annual third-party audit of security controls.
- **Third-party audited HIPAA attestation** — Covers Security Rule and HITECH breach notification requirements.

### Data Protection Technical Controls (Publicly Disclosed)
- Data encrypted **in transit and at rest**
- **XDR Endpoint Security Technology** deployed
- **Cloud-based Secure Web Gateway**
- **Zero Trust Network Access**
- **Multisite architecture** for resilience
- **SIEM software** (vendor not named) for security event monitoring
- Vulnerability assessments performed by independent third-party
- Badging/surveillance for physical security

### PHI Scope
Modivcare handles the following categories of PHI:
- Member name, address, Medicaid ID, DOB
- Medical appointment details (destination = specific clinical facility, implying condition)
- Mobility/disability status (wheelchair, stretcher needs)
- Trip history (creates a longitudinal record of medical facility visits)
- Biometric data (RPM segment: vitals, PERS alerts)
- Caregiver visit records (PCS segment)

Business Associate Agreements (BAAs) are in place with MCO and state clients. Modivcare in turn holds BAAs with key subprocessors (Genesys Cloud, Complicore, and likely Lyft Healthcare / Uber Health, which are themselves HIPAA-covered platforms). SOC 2 Type II reports are available under NDA.

### Breach History
No confirmed public data breach notifications found for Modivcare or LogistiCare in the HHS OCR Breach Portal or major breach reporting databases. The NowSecure Mobile Application Risk Checker flagged the Modivcare Android app (`com.modivcareriderapp`, version 175) for:
- 11+ dangerous permission requests (precise/approximate location, biometric, external storage, network sockets)
- Collection of Build Fingerprint data (classified as sensitive device information)
- Network connections to Akamai, Amazon, Cloudflare, Fastly, Google, and Microsoft CDN/cloud endpoints

These are common mobile app patterns, not confirmed breaches. No PHI exposure or breach is indicated by the NowSecure findings.

---

## Modernization Status and Known Issues

### Financial Distress (2022–2025)
Modivcare's financial decline was driven by:
1. **Acquisition-driven leverage** — The company executed an aggressive acquisition strategy (Circulation 2018, Simplura $575M 2020, WellRyde 2021, GuardianMedical 2022, CareFinders 2022), accumulating ~$1.4B in debt.
2. **Labor cost inflation** — Driver wages and personal care worker wages rose sharply post-pandemic, while Medicaid reimbursement rates were slow to adjust.
3. **Floating-rate debt exposure** — ~$1.1B of debt was at variable rates tied to SOFR; Federal Reserve rate increases from 2022 dramatically increased interest expense.
4. **Contract mispricing** — The securities class action (class period: Nov 3, 2022 – Sep 15, 2024) alleges Modivcare misrepresented that NEMT contracts negatively impacted free cash flow, and that the company had insufficient liquidity. A motion to dismiss was filed March 2026; case pending in D. Colorado.

**Chapter 11 timeline:**
- Filed: August 20, 2025 (prepackaged, 71 debtor entities, Southern District of Texas)
- Confirmed: December 15, 2025
- Emerged: December 29, 2025 (117 days total)
- Post-emergence: ~$300M funded debt, $100M new capital, privately held by former creditors

### Service Quality Complaints
- **Maine (2024)**: Modivcare was awarded all eight NEMT regions in Maine, but the contract was challenged by nonprofits and appealed in Maine Business and Consumer court. Maine DHHS data shows Modivcare had the highest complaint rate among NEMT brokers in 2024 (0.07% per month).
- **Mississippi (2023–2024)**: Division of Medicaid replaced former broker MTM with Modivcare Solutions LLC; MTM protested the award, delaying Modivcare's start until June 8, 2024.
- **Lawmakers (October 2025)**: After Modivcare's Chapter 11 filing, lawmakers questioned the propriety of awarding or continuing a $750M NEMT transportation contract to a bankrupt company.

### Technology Modernization Narrative
- **Legacy contact center**: Before April 2023, Modivcare operated "unstable contact center and workforce management technology" causing 65% of IT tickets. Replaced by Genesys Cloud.
- **ModivCare 2.0**: Secondary sources describe a "2024 rollout of ModivCare 2.0" that "migrated legacy systems to a unified, cloud-native platform enabling cross-division data sharing and improved predictive analytics" — this phrasing appears in AI-generated summaries and may not reflect verified company announcements. Treat as **[unconfirmed]**. The 2024 Genesys Cloud announcement and Integration Hub launch (May 2024) are the confirmed modernization milestones.
- **Agentic AI roadmap**: Modivcare's technology page references "agentic AI integration," "Interactive Voice Agent (IVA) quality improvements," "call center automation," and "member care automation" as forward-looking capabilities. Post-bankruptcy CEO statement: "ability to invest more aggressively in technology, analytics and service excellence."
- **Catalyte engagement**: Modivcare hired Catalyte-trained apprentice developers to build a Ride Flow data centralization tool, automate vendor integrations, improve API documentation, and address a system migration issue — confirming the Django/Redis/AWS stack listed below.

---

## Public APIs and Developer Surface

Modivcare does not publish a public developer portal. API access is restricted to:

1. **Premier Partner API** — A limited-access API for designated third-party NEMT dispatch software vendors (Modivcare documentation refers to "Premier Partners" — reportedly only three designated partners as of early 2024). Features: automated trip import up to 30 days ahead, bidirectional trip status/GPS/billing data, automated batch billing. Contact: GoDigital@modivcare.com or 1-800-597-2049, Option 2.

2. **Integration Hub APIs (since May 2024)** — REST API/microservices platform for MCO clients, state Medicaid agencies, and facility partners. Not a public API; requires contractual relationship with Modivcare. Documented capabilities: eligibility check, trip book/modify/cancel/track, ride accumulator, ride history. Enables white-labeling of NEMT benefits within MCO member apps.

3. **Circulation platform APIs** — The Circulation acquisition (2018) brought a technology-first digital transportation platform with a HIPAA-compliant API used by 3,000+ healthcare facilities. This API surface is separate from the broker API and focuses on direct-to-facility trip ordering. Contact via `app.circulation.com`.

4. **WellRyde as a SaaS product** — WellRyde is sold as a separate SaaS dispatch platform to transportation companies outside the Modivcare network. Contact for SaaS integration: standard WellRyde portal onboarding.

No public API documentation, Swagger/OpenAPI specs, or developer sandbox are discoverable via public search.

---

## AWS Substrate Detail

Modivcare's AWS footprint is confirmed and significant, though specific service-by-service architecture is not publicly documented.

### Confirmed
- **AWS (primary cloud provider)** — Confirmed via Catalyte case study (explicitly names AWS as the cloud platform used).
- **Genesys Cloud purchased via AWS Marketplace** — Modivcare specifically chose AWS Marketplace purchase to "leverage existing AWS investments," indicating AWS is the primary cloud spend vehicle and Genesys Cloud CX SaaS runs on AWS.
- **Amazon** CDN/services — NowSecure mobile app scan shows the Modivcare member app communicates with Amazon endpoints (consistent with AWS API Gateway, CloudFront, or S3).

### Confirmed Tech Stack (via Catalyte case study)
- **Backend framework: Django** (Python) — Modivcare's internal services include Django-based applications.
- **Caching: Redis** — Used alongside Django for session/data caching.
- **Monitoring: Datadog** — Application performance monitoring.
- **Communications API: Twilio** — Used for SMS/voice communications (likely the SMS notification channel for trip alerts).
- **QA automation: Selenium** — Browser-based end-to-end testing.

### Confirmed External SaaS with Cloud Dependencies
- **Genesys Cloud CX** — SaaS contact center platform purchased via AWS Marketplace; runs on AWS infrastructure. Integrates with Google Cloud voice services (ASR/TTS) for voicebots.
- **Pega CRM** — Enterprise CRM platform integrated with Genesys for member case management.
- **Complicore** — Third-party SaaS for provider credentialing.
- **Akamai, Cloudflare, Fastly** — CDN/edge network endpoints seen in mobile app network connections; consistent with using multiple CDN/WAF layers.
- **Google Cloud** — Used for Genesys voice services (speaker identification, ASR). Indicates a multi-cloud pattern (AWS primary, Google for voice ML).
- **Microsoft** — Microsoft endpoints in mobile app connections, possibly Microsoft Teams (Glassdoor reviews mention Teams video calls), or Azure AD for internal identity (unconfirmed).

### Likely AWS Services (Unconfirmed / Inferred)
Given the Django/Python stack on AWS and typical healthcare SaaS patterns:
- **Amazon EC2 / ECS / EKS** — Container or VM hosting for backend services
- **Amazon RDS (PostgreSQL or Aurora)** — Primary relational database (Django ORM typically paired with PostgreSQL)
- **Amazon S3** — Document storage (compliance documents, trip data exports, audio recordings)
- **Amazon CloudFront** — CDN for web portals and mobile app assets
- **AWS Lambda** — Possible for event-driven processing (trip status webhooks, batch billing)
- **Amazon SQS / SNS** — Message queuing for asynchronous trip dispatch events
- **AWS API Gateway** — Likely fronts the Integration Hub and provider API

**No evidence found** of Modivcare using AWS HealthLake, Comprehend Medical, or Amazon Bedrock. These are possible future candidates for the "agentic AI" and analytics roadmap, but nothing is confirmed.

### Azure Presence (Unconfirmed but Suggested)
The Modivcare Workday job board lists a "DevOps Engineer III — Azure" role, indicating an Azure footprint. This may be related to:
- The PCS (Personal Care) segment running on Azure (potentially inherited from acquisitions like Simplura or CareFinders)
- Microsoft 365 / Azure AD for internal IT
- A specific workload migration or hybrid cloud pattern

The coexistence of AWS DevOps and Azure DevOps job postings suggests a multi-cloud environment, possibly with division-level cloud fragmentation from the acquisition strategy.

---

## Sources

- [Modivcare Integration Hub announcement](https://www.modivcare.com/news-releases/modivcare-unveils-integration-hub-revolutionizing-access-to-nemt-benefits/) — Integration Hub capabilities, open API microservices
- [Modivcare Technology page](https://www.modivcare.com/company/technology/) — Mobility Access Platform, IVR, member channels, agentic AI roadmap
- [Modivcare Portal Logins page](https://www.modivcare.com/login/) — All portal URLs and user types
- [Modivcare Security page](https://www.modivcare.com/company/security/) — HITRUST, ISO 27001, SOC 2, HIPAA certifications
- [Modivcare Data Protection page](https://www.modivcare.com/company/security/data-protection-and-availability/) — XDR, Zero Trust, SIEM, encryption controls
- [Modivcare Security Certifications blog](https://www.modivcare.com/blog/healthcare-information-security-and-the-relevance-of-security-certifications/) — CISO perspective on ISO 27001 / SOC 2 / HIPAA
- [Genesys Modivcare customer story](https://www.genesys.com/customer-stories/modivcare) — Genesys Cloud deployment details, Pega integration, AWS Marketplace, metrics
- [Genesys Modivcare AI announcement (October 2024)](https://www.genesys.com/company/newsroom/announcements/modivcare-boosts-health-care-experiences-with-genesys-cloud-ai) — 34M members, voicebot capabilities, WEM
- [BusinessWire Genesys Modivcare October 2024](https://www.businesswire.com/news/home/20241015239646/en/Modivcare-Boosts-Health-Care-Experiences-with-Genesys-Cloud-AI) — Contact center implementation scale
- [Catalyte Modivcare case study](https://www.catalyte.io/client-story/modivcare/) — Django, Redis, AWS, Datadog, Twilio, Selenium stack confirmation
- [NEMT Platform broker integrations guide](https://nemtplatform.com/blogs/what-broker-integrations-are-and-why-they-matter) — Bidirectional JSON, HTTPS, real-time vs. batch patterns
- [NEMT Platform ModivCare software selection guide](https://nemtplatform.com/blogs/how-to-choose-nemt-software-that-works-with-modivcare-mtm-and-more) — SLA requirements, GPS tracking, 30-second updates, billing automation
- [Intelligent Bits ModivCare API integration guide](https://help.intelligentbits.com/modivcare-api-integration) — Trip import, driver/vehicle data, GPS, status updates, mileage, batch billing
- [Elite Med Financials NEMT Broker Billing Guide 2026](https://elitemedfinancials.com/nemt-broker-billing-guide-2026/) — WellRyde billing workflow, HCPCS codes, payment timelines, EDI 837P
- [WellRyde acquisition announcement (May 2021)](https://openminds.com/market-intelligence/bulletins/modivcare-completes-acquisition-of-the-nuvizz-wellryde-technology-platform/) — WellRyde ATMS platform, 1,200+ providers, nuVizz origin, Circulation/LCAD integration
- [WellRyde Driver on Google Play](https://play.google.com/store/apps/details?id=com.modivcare.wellrydedriver) — Android app package ID, features (offline mode, e-signature, real-time tracking)
- [LogistiCare–Lyft partnership (2020)](https://investors.modivcare.com/news-and-media/news-releases/news-details/2020/The-Providence-Service-Corporation-and-LogistiCare-Extend-Partnership-with-Lyft-to-Improve-Access-to-Care-for-Millions-Across-the-Country/default.aspx) — Lyft largest NEMT broker partnership, 48 states, API-based
- [Modivcare Guardian Medical Monitoring acquisition (2022)](https://www.businesswire.com/news/home/20220518005248/en/Modivcare-Announces-Acquisition-of-Guardian-Medical-Monitoring) — RPM platform, 50,000 patients, E3 engagement platform, MCO/Medicaid payors
- [Complicore platform overview](https://www.complicore.co/) — Provider credentialing SaaS, always-on monitoring
- [Modivcare Chapter 11 restructuring (elevenflo.com)](https://elevenflo.com/blog/modivcare-chapter-11-bankruptcy) — Financial details, segment breakdown, restructuring timeline
- [Modivcare bankruptcy emergence (BusinessWire Dec 2025)](https://www.businesswire.com/news/home/20251229414980/en/Modivcare-Successfully-Completes-Financial-Restructuring-Reducing-Debt-by-More-Than-85) — Emergence confirmed, $300M debt, $100M capital, private ownership
- [Modivcare CEO post-bankruptcy plan (HHCN October 2025)](https://homehealthcarenews.com/2025/10/modivcare-ceos-post-bankruptcy-recovery-plan-aligning-people-advancing-technology/) — Technology investment priority, AI and analytics focus
- [Kessler Topaz ModivCare securities fraud class action](https://www.ktmc.com/new-cases/modivcare-inc) — Class period Nov 2022–Sep 2024, NEMT contract cash flow allegations, D. Colorado
- [Maine Monitor: Modivcare contract concerns](https://themainemonitor.org/modivcare-riders-raise-concerns/) — Complaint rates, service issues
- [Lawmakers questioning Modivcare $750M contract](https://homehealthcarenews.com/2025/10/lawmakers-question-modivcares-750m-transportation-contract-after-bankruptcy/) — Post-bankruptcy contract scrutiny
- [NowSecure Modivcare Android app assessment](https://www.nowsecure.com/marc-app/modivcare-android/) — Permissions, network connections (Akamai, Amazon, Cloudflare, Fastly, Google, Microsoft), sensitive data findings
- [PacificSource Ride (Modivcare white-label)](https://pacificsourceride.modivcare.app/transportation-providers/overview/) — MCO white-label portal, provider portal URL
- [Modivcare Workday job postings](https://modivcare.wd1.myworkdayjobs.com/careers) — Senior Integrations Engineer, Data Engineer III, DevOps Engineer III AWS, DevOps Engineer III Azure roles
- [RouteGenie ModivCare broker overview](https://routegenie.com/blog/meet-the-broker-modivcare/) — RouteGenie auto-sync with ModivCare, trip import workflow
- [Bambi NEMT broker overview](https://www.hibambi.com/blog/what-to-know-about-modivcare-nemt-broker) — Two-factor auth mention, WellRyde features, trip management
- [Modivcare Circulation acquisition](https://www.modivcare.com/news-releases/logisticare-completes-acquisition-of-circulation/) — 2018, 45 states, 3,000 facilities, Modivcare Connect heritage
- [PortersFiveForce: How Modivcare works](https://portersfiveforce.com/blogs/how-it-works/modivcare) — 6,500+ providers, 35M trips/year, 98% completion rate
