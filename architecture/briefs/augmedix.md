# Augmedix Architecture Research

**Subject:** Augmedix (now Commure Ambient) — ambient AI clinical scribe on Google Cloud
**Style Guide:** parchment
**Folder:** architecture/augmedix/

This brief consolidates the two parallel research passes that backed the Augmedix architecture map. The first pass (Structure & Systems) covers corporate history, products, GCP services, scale, model lineage, and the Commure acquisition. The second pass (Connections, Flows & Status) covers the end-to-end data flow per product tier, EHR integration mechanics, authentication, PHI handling on GCP, the multi-tenancy model, the human-in-the-loop scribe network, modernization status, and compliance posture. Both pass cite the same handful of high-signal public sources — chiefly the June 2024 Google Cloud Developer Community article, Augmedix's SEC filings, the HITRUST r2 announcement, and Commure's acquisition press releases.

---

## Part 1 — Structure & Systems

**Research domain:** Structure & Systems (parallel brief; Connections & Status covered separately)
**Primary interest:** GCP-based PHI/AI substrate analogue for multi-tenant healthcare AI

---

## Corporate & Operating Structure

### Founding and Early History

Augmedix was co-founded in **2012** at Stanford by **Ian Kazi Shakil** (Stanford MBA, Biomedical Engineering from Duke, former Edwards medical-device engineer) and **Pelu Tran** (Stanford medical student who paused his fourth year to pursue the startup). The founding insight was that physicians were spending roughly 35% of their day on EHR charting — Tran experienced this firsthand during his second-year clinical rotations. [Stanford GSB profile of Shakil; Stanford Medicine news, 2015]

The product concept grew from Google Glass: in 2012, when Google released its wearable, Shakil saw a path to stream a physician's point-of-view to remote scribes who could silently handle documentation. Ian, of Bangladeshi heritage, engaged his cousin in Dhaka to build an early operations team. [TBS News, Bangladesh article; TechCrunch 2014]

Commercial scribing operations launched in **2014** with a $3.2M seed round. By 2014–2015, physicians at Dignity Health, Sutter Health, and Catholic Health Initiatives were using Google Glass to stream encounters to Dhaka. [TechCrunch 2014; Becker's Hospital Review]

### IPO Trajectory

Augmedix reached Nasdaq via an unconventional route:
1. **2020**: Reverse merger with Malo Holdings Corp. (a SPAC), listing OTC
2. **December 2020**: Uplisted to Nasdaq under ticker **AUGX**, raising $40M at $4/share in a 10-million-share offering [MobiHealthNews IPO report; Renaissance Capital]

The S-1 / IPO documentation disclosed 2019 revenues just over **$14M** and noted that two customers — Sutter Health (26%) and Dignity Health (17%) — accounted for 43% of 2019 revenue. This customer concentration was a significant disclosed risk factor. [SEC S-1 filing EA131479, 2020]

### Leadership Team (Pre-Acquisition)

- **Manny Krakaris** — CEO (brought in post-founding to scale operations)
- **Ian Shakil** — Co-Founder, Chief Strategy Officer; retained through acquisition and into Commure role
- **Pelu Tran** — Co-Founder; departed earlier to found Ferrum Health (AI radiology)
- Leadership described the company's ambition as creating both a documentation layer and a **"conversational graph"** — time-stamped voice-to-note correlation data enabling future clinical services [Hospitalogy interview with Shakil, April 2023]

### Acquisition by Commure (October 2024)

On **July 19, 2024**, Augmedix announced a definitive agreement to be acquired by **Commure, Inc.** in an all-cash deal valuing Augmedix at **~$139 million in equity value** ($2.35/share). This represented a **169% premium** over the 30-day VWAP preceding the announcement. Augmedix stockholders approved the deal September 27, 2024; it closed **October 2, 2024**. Augmedix became a wholly-owned subsidiary of Commure. [HITConsultant; GlobeNewswire; Healthcare Dive]

Kirkland & Ellis advised Commure on the take-private. [Kirkland press release]

### Commure Parent Context

Commure is a General Catalyst-backed healthcare AI platform company. Key milestones:
- **October 2023**: Commure merged with **Athelas** (revenue cycle automation), receiving $70M from General Catalyst at a ~$6B combined valuation
- **October 2024**: Acquired Augmedix for $139M (ambient AI scribing)
- **December 2024**: Acquired Memora Health (digital care navigation)
- **Mid-2025**: Raised $200M from General Catalyst's Customer Value Fund
- **May 2026**: Raised $70M additional round, reaching **$7B post-money valuation** with Sequoia, Morgan Stanley, and Kirkland & Ellis participating [MobiHealthNews; Fierce Healthcare]

Commure CEO **Tanay Tandon** positioned the combined Commure+Athelas+Augmedix entity as "the single, AI-powered interface for providers." By 2025, Commure reported serving **130+ health systems**, **350,000+ clinicians**, **60+ EHR integrations**, and processing **$25B+ in annual claims** with 85%+ of revenue cycle work completed without human intervention. [Commure press releases; Hospitalogy analysis, October 2025]

Ian Shakil transitioned to **Chief Strategy Officer at Commure** post-acquisition, leading the HCA Healthcare integration effort.

### Geographic Footprint and Workforce

Augmedix operated across **five countries**: US (San Francisco HQ), Bangladesh (Dhaka, primary scribe workforce), India, Sri Lanka, and Dominican Republic. Bangladesh was the largest offshore center, employing **800+ people** at peak, of whom **500+ were scribes** (Medical Documentation Specialists, "MDS" or "scribes"). Augmedix Bangladesh operated as a subsidiary and had a 3-month paid MDS training program. Company leadership stated plans for a 7,000-person Bangladesh workforce over 5 years (as of ~2022). [TBS News Bangladesh; Daily Star Bangladesh; LinkedIn job postings]

---

## Product Portfolio

Augmedix evolved from a single scribe-assisted tool to a multi-tier ambient AI suite. The full product roster by the time of acquisition:

### Augmedix Live (Human-Centric Tier)

The original product and still the highest-touch offering. A dedicated Medical Documentation Specialist (MDS) — a remote scribe — observes the encounter in real time via audio/video stream and produces a **signature-ready note immediately post-visit**. MDS also provide two-way point-of-care chat support. Features include prior authorization assistance, referral letters, AVS drafting, CPT/E&M/HCC coding, and discrete EHR data entry. Claimed time savings: **2–3 hours per clinical day**. [Augmedix product page; HITRUST announcement 2023]

### Augmedix Notes / Notebuilder (Hybrid AI+Human Tier)

The original AI-assisted tier, where the MDS uses the proprietary **Notebuilder** tool. Notebuilder is Augmedix's core NLP platform: it applies ASR + NLP to extract clinical data from the real-time conversation, then presents dynamically filtered structured suggestions to the MDS, who selects or edits entries. The tool organizes notes into canonical clinical sections (HPI, ROS, PE, Assessment & Plan), using visit type, specialty, complaints, and symptoms as identifiers to filter relevant selections. External medication datasets (dosage, frequency, side effects) are integrated. [GlobeNewswire Notebuilder announcement, April 2021]

The HITRUST r2 certification (earned August 2023) explicitly covers **Augmedix Live and Augmedix Notes** plus their supporting cloud services. [GlobeNewswire HITRUST announcement]

### Augmedix Go (Fully Automated AI Tier)

Launched in **early access September 27, 2023**. A clinician-controlled iOS mobile app that generates a complete draft note within **moments** of the patient visit, using no human scribe. Core technologies: proprietary NLP + fine-tuned LLMs + Google Cloud MedLM + structured datasets. The system makes **multiple passes** to generate a natural-sounding note, with different LLM instances handling different note sections (multi-model approach). [HITConsultant launch article; GlobeNewswire Go announcement]

Key Go features by 2024:
- **Multi-recording capture**: over 50% of clinicians use this to stitch multiple sequential clips into one note
- **CareCues**: real-time care gap alerts and billing prompts during the encounter
- **ICD-10 code suggestions**: automated coding overlaid on the note
- **Problems Page**: problem-based HPI and A&P organization
- 32-language support
- iOS app (v3.13.1 as of February 2025), iOS 16.0+, 50.4 MB
- visionOS 1.0+ support

Claimed time savings: **~1 hour per clinic day**. Survey of 12+ healthcare organizations showed 94% of clinicians reported better patient focus. [Augmedix Go press release March 2024; App Store listing]

### Augmedix Go ED (Emergency Department Variant)

Announced **April 24, 2024** as the industry's first fully automated GenAI-powered medical documentation for emergency departments. Purpose-built for the ED challenge: multiple non-sequential interactions with a single patient over hours, high ambient noise, documentation of clinical reasoning across re-evaluations. Uses the same multi-LLM stack as Go. Piloted at **four HCA Healthcare hospitals** with a **99% patient consent acceptance rate**. [GlobeNewswire Go ED launch; HITConsultant]

### Augmedix Assist (Hybrid Mid-Tier)

Launched as a middle tier between Go and Live. Includes all Go AI capabilities plus hybrid human support: MDS handles note editing, coding (CPT, E&M, LOS, HCC), AVS drafting, referral letters, discrete data entry, lab/imaging orders. Notes delivered within **1 hour**. Claimed time savings: **1.5–2 hours per clinical day**. [Augmedix product overview]

### Augmedix Prep (Pre-Visit Chart Preparation)

Launched **September 2022**. A service that uses NLP + clinical datasets to prepare a patient note structure and pre-populate content before the visit, drawing on the patient's previous EHR records. Captures patient demographics, medication changes, medical history, imaging/labs/diagnostics, immunization records, and family/social history. The physician reviews the pre-built note structure before seeing the patient. Human MDS quality-assure the output. [GlobeNewswire Prep launch; McKesson Ventures announcement]

McKesson Ventures (a Augmedix investor) highlighted Prep as strategically important for physician efficiency.

### Structured Data Services

Beyond notes, Augmedix extracts structured data from encounters: symptoms, medications, lab results, treatments, diagnostic codes. This structured output is uploadable directly to a health system's data lake. The company described this as "highly structured data feeds as output, above and beyond core note output" — enabling health systems to run population analytics, surface trends, and generate care recommendations. [Hospitalogy Shakil interview; Google Developer forum article]

The Google Cloud integration brief (from Google Developer Forums) describes Augmedix exporting three elements: full encounter transcripts, clinical notes (pre- and post-physician edit), and structured data (with optional PHI de-identification). These flow into BigQuery via Pub/Sub for analytics.

### Post-Acquisition: Commure Ambient

After the October 2024 acquisition, Augmedix's technology was progressively integrated into Commure's platform under the **Commure Ambient** brand. Commure Ambient AI was embedded directly into **MEDITECH Expanse Now** (mobile) in 2025, and powers the HCA Healthcare ambient AI deployment announced as the "largest AI deployment in healthcare." Documentation generated via Commure Ambient flows directly into Commure's autonomous coding, CDI, and RCM workflows — linking the scribe layer to the revenue cycle. [Commure press releases; MobiHealthNews Vizient contract]

---

## Technology Stack (GCP Focus)

### Confirmed GCP Services

The richest single technical source is the **Google Developer Community article** ("The future of clinical data: building an intelligence engine with Augmedix & Google Cloud"), which describes Augmedix's data pipeline in detail. Confirmed services:

| GCP Service | Role in Augmedix Stack |
|---|---|
| **Google Cloud Speech-to-Text (STT)** | Converts clinician-patient audio recordings into transcripts (ASR layer) |
| **Vertex AI** | Platform for model fine-tuning, hosting, and inference; hosts MedLM |
| **MedLM on Vertex AI** | Suite of medically-tuned foundation models for note generation (see AI section) |
| **MedGemma** | Medical-specific language model for note generation (confirmed in Google dev article) |
| **Gemini** | Underlying LLM supporting multimodal processing |
| **Pub/Sub** | Messaging infrastructure; Augmedix publishes encounter data (JSON payloads) to enterprise topics |
| **Google Kubernetes Engine (GKE)** | Hosts the `encounter_service` that subscribes to Pub/Sub and processes data |
| **Cloud Spanner** | Relational database storing encounter table data with structured clinical information |
| **BigQuery** | Data warehouse combining Augmedix encounter data with longitudinal patient records for analytics |
| **Healthcare FHIR API** | Stores and manages FHIR-formatted patient records; provides RESTful patient data access |
| **Healthcare Data Engine (HDEv2)** | Aggregates and standardizes healthcare data in FHIR R4 format (private preview at time of article) |
| **Looker** | BI platform for population dashboards and visualization |
| **Vertex AI / Colab Enterprise** | Used by AI researchers for model development and data analysis |

[Google Developer Community article; Commure/SADA partnership announcement; MedLM launch article]

### Data Pipeline Architecture

The clinical intelligence pipeline flows in one direction (as described in the Google Developer article):

```
Clinician-patient encounter
        ↓
Augmedix app (Bluetooth mic + iOS)
        ↓ audio stream
Google Cloud STT → raw transcript
        ↓
NLP + multi-LLM pass (Vertex AI / MedLM)
        ↓ structured JSON
Pub/Sub (encounter_service publishes)
        ↓
GKE encounter_service (subscribes, processes)
        ↓
Cloud Spanner (structured encounter table)
        ↓
BigQuery (combined with longitudinal patient records)
        ↓
Looker dashboards / Vertex AI notebooks
```

Three exported elements per encounter: full transcript, clinical note (pre and post-physician edit), structured data. PHI de-identification available for the structured data export path. [Google Developer Community article]

### Google Cloud Marketplace

Augmedix has a listing on the **Google Cloud Marketplace** (`console.cloud.google.com/marketplace/product/augmedix-public/augmedix`), confirming the depth of the GCP partnership and enabling health systems to procure Augmedix through GCP billing. [Google Cloud Marketplace listing]

### EHR Integration Protocols

Augmedix supports **50+ EHR integrations** by the time of the Vizient contract (January 2025). Integration protocols vary by EHR:

- **Epic**: Uses HL7 to pull provider schedules; FHIR APIs to pull patient encounter data; uploads the generated note back to Smart Data Elements inside SmartLinks in Epic
- **Oracle Cerner**: HL7 + FHIR APIs for data exchange
- **athenahealth**: FHIR APIs to pull schedules and encounter data; uploads note sections (HPI/ROS/PE/AP) back to athenahealth
- **MEDITECH**: Bi-directional integration; Commure Ambient embedded natively in MEDITECH Expanse Now

[Elion Health integration guide; Oracle Marketplace listing; MEDITECH press release; Vizient contract announcement]

### Mobile Client Architecture

The Augmedix Go iOS app pairs with a **Bluetooth microphone** worn in a lab coat pocket, capturing the encounter audio hands-free. The app handles:
- Local audio capture and streaming
- Multimodal output control interface (reviewing and editing notes)
- Multi-recording management (stitch non-sequential clips)
- EHR scheduling integration (7-day appointment view)
- Rich text format note editing

The original Google Glass integration used Glass Enterprise Edition as the client device (streaming audio/video to remote scribes). When Google released Glass Enterprise Edition 2 in May 2019 (Qualcomm Snapdragon XR1, Android 8.0, 8MP camera, 640x360 display), Augmedix continued using it before eventually transitioning fully to smartphone + Bluetooth mic as the primary capture modality. [Glass Enterprise Edition 2 specs; App Store listing; HCA/Augmedix ER pilot article]

### Compliance Architecture

- **HIPAA BAA**: Signed with Google Cloud (Google Cloud covers HIPAA under its BAA for relevant services including Vertex AI, Healthcare API, Pub/Sub, GKE, Spanner, BigQuery, Cloud Storage)
- **HITRUST r2 Certification**: Achieved August 2023, covering Augmedix Live, Augmedix Notes, and their cloud services. The r2 (risk-based, 2-year) certification is the most rigorous HITRUST tier. [GlobeNewswire HITRUST announcement]
- **PHI de-identification**: Available as an option in the structured data export path; Google Cloud DLP is referenced in the GCP-Augmedix architecture context as a complementary de-identification and data loss prevention layer
- Patient consent: 99% acceptance rate in HCA ED pilot for ambient listening consent

---

## Scale & Footprint

### Financial Scale (Pre-Acquisition)

Revenue trajectory from IPO to acquisition:

| Year | Revenue | Notes |
|---|---|---|
| 2019 | ~$14M | Sutter Health 26%, Dignity Health 17% of revenue |
| 2020 | ~$16M (est.) | Q3 2020: $4.2M (16% YoY growth) |
| 2021 | ~$22M | Post-Nasdaq listing |
| 2022 | $30.9M | ARR exited year at $35M |
| 2023 | $44.9M | 45% YoY growth; ARR $51M exiting year |
| 2024 (guidance) | $60-62M | Not completed as public company (acquired Oct 2024) |

[Q4 2023 earnings release; S-1; quarterly 8-K filings]

Key 2023 metrics:
- **Average Q4 2023 clinicians in service**: 1,789 (44% YoY growth from 1,246 in Q4 2022)
- **Average annual revenue per clinician**: $28,200
- **Dollar-based net revenue retention**: 152% for Q4 2023 (enterprise customers)
- **Cash position** Dec 31, 2023: $46.2M
- **Net loss**: $19.2M for full year 2023 (improved from $24.4M in 2022)
- **R&D spend**: $11.2M (FY 2023)

### Notes and Coverage Scale

- **70,000 medical notes generated per week** (stated at time of MedLM partnership announcement, late 2023) [MedLM announcement; SADA partnership]
- **10 million+ high-quality notes** generated over 11 years of operations (stated March 2024) [Go performance announcement]
- **30+ medical specialties** at MedLM announcement; **50+ specialties** by Go ED launch (April 2024)
- **Subscription pricing** at IPO: ~$1,800/physician/month for full Live service

### Customer Footprint

Named or confirmed health system customers:
- **HCA Healthcare** — April 2023 partnership + $12M equity investment; ED pilot at 4 hospitals; expanded to full network ambient AI platform post-Commure acquisition
- **Sutter Health** — major customer from early days; 26% of 2019 revenue
- **Dignity Health** — 17% of 2019 revenue; used Google Glass
- **Catholic Health Initiatives** — early enterprise customer
- **Hillsdale Hospital** — athenahealth integration case study

At acquisition announcement (July 2024): Augmedix was serving **20+ major health systems** and **hundreds of care sites**. [Commure acquisition blog post]

**Vizient contract** (effective January 6, 2025): Augmedix awarded a contract by Vizient — the healthcare group purchasing organization representing **65%+ of acute care providers**, **97% of academic medical centers**, and **35% of non-acute market** — giving Augmedix access to Vizient's $140B+ annual purchasing network. Products covered: Go, Assist, and Live. [Commure press release]

### Post-Acquisition Scale (Commure)

By 2025-2026, Commure's combined platform (including Augmedix ambient AI):
- **130+ health systems**
- **350,000+ clinicians**
- **40 million+ ambient appointments** powered annually
- **$25B+ annual claims** processed
- **60+ EHR integrations**
- **3,000+ sites of care**
- KLAS Research named Commure **Market Leader in Ambient AI** for 2025

[Commure platform overview; Hospitalogy October 2025; MobiHealthNews $70M round]

---

## AI / Model Architecture

### ASR (Speech-to-Text) Layer

**Confirmed**: Google Cloud Speech-to-Text API is used for ASR — converting encounter audio to transcripts. [Google Developer Community article] The original deployment used Google STT; no evidence of Whisper or proprietary ASR. The mobile app captures audio via Bluetooth mic, streams to GCP for transcription.

### NLP / Note-Generation Pipeline

Augmedix uses a **multi-pass, multi-LLM architecture** rather than a single model:

1. **ASR pass**: Audio → raw transcript (Google STT)
2. **NLP extraction pass**: Proprietary NLP models identify clinical entities (complaints, symptoms, medications, diagnoses) and assign them to note sections
3. **LLM generation pass**: Section-specific LLMs (fine-tuned for specialty) generate natural-language prose for each section (HPI, ROS, PE, A&P)
4. **Cross-check pass**: Multiple models cross-check each other's outputs for quality assurance — "By utilizing multiple models that cross-check each other, Augmedix is delivering high quality notes that instill trust among clinicians"
5. **Structured data extraction pass**: Additional NLP models generate structured outputs (ICD-10 codes, medications, labs) separately from the narrative note

[Go performance announcement March 2024; SADA partnership; GlobeNewswire]

### Foundation Models

- **MedLM** (Google Cloud): Augmedix was an **early tester** of MedLM when Google announced it in December 2023. MedLM is built on Med-PaLM 2 (which achieved 86.5% on US medical licensing exam questions). Augmedix integrated MedLM into the Go product suite, specifically using it for note generation across specialties. They used Vertex AI to **fine-tune MedLM** using their proprietary training data from 70,000 notes/week across 30+ specialties. [MedLM launch announcement; Fierce Healthcare; Augmedix MedLM announcement]
- **MedGemma**: Confirmed in Google Developer Community article as the "medical-specific language model for note generation" — this is Google's subsequent generation after MedLM, based on Gemini. [Google Developer Community article]
- **Gemini**: Referenced as supporting multimodal processing in the stack. [Google Developer Community article]
- **Proprietary fine-tuned models**: Augmedix trains specialty-specific models using their own quality scoring rubrics and a feedback loop between AI-generated content and human subject matter experts across specialties. [Go performance announcement]

The use of **multiple models per note** (one per section) with cross-checking is Augmedix's key architectural differentiator from single-LLM approaches — this was explicitly cited as their approach to clinical accuracy and physician trust.

### Human-in-the-Loop Architecture

The hybrid human-AI model is central to Augmedix's design across product tiers:

**Notebuilder (Live/Notes tier)**:
- The MDS watches the encounter in real time
- Notebuilder's ASR + NLP surfaces dynamically filtered suggestions (section-appropriate phrases, medication lists with dosages)
- MDS selects/edits; AI assists rather than generates autonomously
- Human quality review before physician sees the note
- This human + AI hybrid was Augmedix's primary accuracy and liability advantage over pure-AI competitors pre-2023

**Go tier (2023+)**:
- No human scribe in the loop during generation
- AI generates draft autonomously within minutes
- Physician reviews, edits, approves before committing to EHR
- Specialty-specific fine-tuned models + cross-checking provide quality assurance
- Human oversight moves from MDS → physician (reduced cost tier)

**Coding (Assist/Live tiers)**:
- NLP identifies ICD-10 and CPT codes from the note
- Human MDS verifies codes before physician sees them
- HCC coding (hierarchical condition categories) for risk adjustment also supported

[Notebuilder announcement; product overview; HITRUST coverage; Hospitalogy interview]

### Clinical Intelligence Engine

In partnership with Google Cloud (announced at Google Cloud Next 2024), Augmedix and Google described a "Clinical Intelligence Engine" concept:
- Augmedix encounter data flows (via Pub/Sub → GKE → Spanner) into BigQuery
- BigQuery combines Augmedix data with a health system's longitudinal patient records
- Healthcare Data Engine (HDEv2) aggregates and standardizes to FHIR R4
- Looker surfaces population dashboards, care gap alerts, and clinical recommendations
- Vertex AI / Colab Enterprise used by health system AI researchers for custom model development on top of the encounter corpus

This architecture positions Augmedix as a **data substrate** for health system analytics — not just a documentation tool. [Google Developer Community article; Google Cloud Next blog]

---

## Acquisitions & Lineage

### Google Glass Era (2012–2018)

The original Augmedix was fundamentally a **wearable-enabled telehealth workflow**: physician wears Glass → streams live to Dhaka scribes → scribes chart in EHR. The AI was minimal; the value was human labor arbitrage (US physicians, Bangladesh wages) + always-on Glass streaming. This established the HIPAA-compliant remote audio/video infrastructure and the international scribe workforce that would later be augmented by AI. [Stanford GSB; Harvard Business School DIGIT case; TechCrunch 2014]

### Notebuilder Introduction (~2019–2021)

As NLP matured, Augmedix invested in Notebuilder to increase scribe efficiency — reducing the manual burden on MDS by automating suggestion-generation from the ASR transcript. This was the first "AI in the loop" stage. Revenue was ~$14M (2019) with a predominantly human-labor cost structure. The S-1 explicitly called out Notebuilder as central to their plan to "reduce the level of effort required by remote documentation specialists." [SEC S-1 2020; Notebuilder announcement April 2021]

### Augmedix Go Launch (September 2023) — The LLM Inflection

The arrival of capable LLMs in 2022-2023 enabled the Go product: fully automated note generation without an MDS. This was the architectural inflection — moving from AI-assisted scribes to AI-first documentation with physician review only. The HCA Healthcare partnership (April 2023) was partly a $12M equity investment that also funded the AI pipeline development for the ED use case. [HITConsultant Go launch; HCA partnership press release]

### Quark Acquisition (2024)

**Note: Research found no confirmed sources for a "Quark" acquisition by Augmedix.** The name does not appear in SEC filings, press releases, or news searches. This should be treated as unconfirmed. It is possible this refers to an internal project name or was confused with another company. The only confirmed pre-Commure acquisition was the company itself being acquired. [Unconfirmed — no sources found]

### Commure Acquisition (October 2024) — Platform Integration

The acquisition by Commure fundamentally changes Augmedix's architectural role. Rather than a standalone documentation company, Augmedix's ambient AI layer becomes the front end of Commure's full-stack healthcare platform:

- **Documentation layer** (Augmedix ambient AI) → generates structured notes
- **Coding layer** (Commure/Athelas autonomous coding) → codes from note content  
- **CDI layer** → clinical documentation improvement triggered from the same note
- **RCM layer** (Commure/Athelas) → claims generation, denial management
- **Agentic layer** (Commure Agents, launched June 2025) → automates referrals, scheduling, prior auth from the clinical context

This vertical integration is the strategic rationale: ambient documentation becomes the input to an end-to-end revenue cycle AI. Commure CEO Tanay Tandon explicitly framed it as "language models that transcribe appointments, autonomously code them, and supercharge back-office operations for billing teams." [Commure acquisition blog; Hospitalogy 2025 analysis; Commure Agents press release]

Ian Shakil remained as Chief Strategy Officer at Commure, leading the HCA Healthcare platform deployment — described in the press release as a collaboration between "Commure's engineers, the Augmedix team led by company founder Ian Shakil, HCA Healthcare's Care Transformation & Innovation department, and HCA Healthcare's physicians." [HCA/Commure press release]

---

## Sources (Structure & Systems pass)

- [Augmedix and Google Cloud MedLM Partnership (PR Newswire, Dec 2023)](https://www.prnewswire.com/news-releases/augmedix-partners-with-google-cloud-to-bring-medically-tuned-ai-technology-to-ambient-documentation-302014271.html)
- [The future of clinical data: building an intelligence engine with Augmedix & Google Cloud (Google Developer Community)](https://discuss.google.dev/t/the-future-of-clinical-data-building-an-intelligence-engine-with-augmedix-google-cloud/154902)
- [Introducing MedLM for the healthcare industry (Google Cloud Blog)](https://cloud.google.com/blog/topics/healthcare-life-sciences/introducing-medlm-for-the-healthcare-industry)
- [Augmedix S-1 IPO Prospectus (SEC EDGAR, 2020)](https://www.sec.gov/Archives/edgar/data/0001769804/000121390020042305/ea131479-s1_augmedixinc.htm)
- [Augmedix Form 10-K FY2023 (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/0001769804/000162828024013117/augx-20231231.htm)
- [Augmedix Q4 2023 Earnings Release (GlobeNewswire, March 2024)](https://www.globenewswire.com/news-release/2024/03/18/2848139/0/en/Augmedix-Delivers-45-Revenue-Growth-and-Expanded-Gross-Margins-for-Fourth-Quarter-of-2023.html)
- [Augmedix Exits Calendar 2023 with Expected $51M ARR (GlobeNewswire, Jan 2024)](https://www.globenewswire.com/news-release/2024/01/05/2804611/0/en/Augmedix-Exits-Calendar-2023-with-Expected-51-Million-in-Annual-Recurring-Revenue.html)
- [Commure Acquires Augmedix in $139M Deal (HITConsultant, July 2024)](https://hitconsultant.net/2024/07/19/commure-acquires-augmedix/)
- [Commure and Athelas Acquisition Blog Post (Commure)](https://www.commure.com/blog/commure-and-athelas-sign-deal-to-acquire-augmedix)
- [Augmedix Announces Partnership with HCA Healthcare (GlobeNewswire, April 2023)](https://www.globenewswire.com/news-release/2023/04/20/2650798/0/en/Augmedix-Announces-Partnership-with-HCA-Healthcare-to-Accelerate-the-Development-of-AI-enabled-Ambient-Documentation.html)
- [Inside the HCA and Augmedix Partnership with Ian Shakil (Hospitalogy, April 2023)](https://hospitalogy.com/articles/2023-04-26/inside-the-hca-augmedix-partnership-with-ian-shakil/)
- [Augmedix Launches Gen AI Mobile App for Automated Medical Notes (HITConsultant, Sept 2023)](https://hitconsultant.net/2023/09/27/augmedix-launches-gen-ai-mobile-app-for-automated-medical-notes/)
- [Augmedix Announces New Positive Data and Enhancements to Augmedix Go (GlobeNewswire, March 2024)](https://www.globenewswire.com/news-release/2024/03/12/2844383/0/en/Augmedix-Announces-New-Positive-Data-and-Enhancements-to-Its-Ambient-AI-Product-Augmedix-Go.html)
- [Augmedix Launches Go ED for Emergency Departments (GlobeNewswire, April 2024)](https://www.globenewswire.com/news-release/2024/04/24/2868458/0/en/Augmedix-Launches-Industry-s-First-Fully-Automated-GenAI-Powered-Medical-Documentation-Product-for-Emergency-Departments.html)
- [Augmedix and SADA Partnership (GlobeNewswire, April 2024)](https://www.globenewswire.com/news-release/2024/04/04/2857632/0/en/Augmedix-and-SADA-Forge-Partnership-to-Scale-Ambient-Documentation-and-Structured-Data-Products-to-Health-Systems-Nationwide.html)
- [Augmedix Achieves HITRUST Certification (GlobeNewswire, August 2023)](https://www.globenewswire.com/news-release/2023/08/24/2730991/0/en/Augmedix-Achieves-HITRUST-Certification-to-Further-Mitigate-Risk-in-Third-Party-Privacy-Security-and-Compliance.html)
- [Augmedix Awarded Vizient Contract (Commure press release, 2025)](https://www.commure.com/press-releases/augmedix-awarded-vizient-contract-for-ambient-ai-documentation-solutions)
- [Augmedix Notebuilder Tool Announcement (GlobeNewswire, April 2021)](https://www.globenewswire.com/news-release/2021/04/01/2203236/0/en/Augmedix-s-Proprietary-Notebuilder-Tool-Leverages-Intelligent-Automation-Technology-to-Efficiently-Deliver-Accurate-and-Timely-Medical-Notes.html)
- [Augmedix Launches Augmedix Prep (GlobeNewswire, September 2022)](https://www.globenewswire.com/news-release/2022/09/06/2510892/0/en/Augmedix-Launches-New-Service-Augmedix-Prep-to-Significantly-Reduce-Physician-Chart-Prep-Burden.html)
- [Augmedix Strategic Partnerships Open Network (GlobeNewswire, October 2023)](https://www.globenewswire.com/news-release/2023/10/05/2755251/0/en/Augmedix-Forging-Strategic-Partnerships-for-an-Open-Network-of-Digital-Health-Solutions.html)
- [Augmedix Humanizing Healthcare Through Google Glass (Harvard DIGIT, 2018)](https://d3.harvard.edu/platform-digit/submission/augmedix-humanizing-healthcare-through-google-glass/)
- [Ian Kazi Shakil: Building a Business from Google Glass (Stanford GSB)](https://www.gsb.stanford.edu/insights/ian-kazi-shakil-building-business-google-glass)
- [The Bangladeshi Scribes Who Keep the US Healthcare System Running (TBS News)](https://www.tbsnews.net/features/panorama/bangladeshi-scribes-who-keep-us-healthcare-system-running-614538)
- [Commure Raises $200M from General Catalyst (Fierce Healthcare)](https://www.fiercehealthcare.com/health-tech/commure-raises-200m-growth-financing-general-catalyst)
- [Commure Raises $70M, $7B Valuation (MobiHealthNews, May 2026)](https://www.mobihealthnews.com/news/commure-raises-70m-boosting-post-money-valuation-7b)
- [Inside Commure: The AI Platform Powering Healthcare Transformation (Hospitalogy, October 2025)](https://hospitalogy.com/articles/2025-10-22/inside-commure-the-ai-platform-powering-healthcare-transformation-today/)
- [Commure Ambient AI Embedded in MEDITECH Expanse Now (Commure)](https://www.commure.com/press-releases/commure-ambient-ai-embedded-in-meditech-expanse-now)
- [HCA and Commure Announce Largest AI Deployment in Healthcare (Commure)](https://www.commure.com/press-releases/hca-and-commure-announce-largest-ai-deployment-in-healthcare)
- [Google Unveils MedLM with HCA, Augmedix, BenchSci as Early Testers (Fierce Healthcare)](https://www.fiercehealthcare.com/ai-and-machine-learning/google-unveils-medlm-generative-ai-models-healthcare-hca-augmedix-and)
- [Augmedix Go App Store Listing (Apple)](https://apps.apple.com/us/app/augmedix-go/id6444724027)
- [Augmedix on Google Cloud Marketplace](https://console.cloud.google.com/marketplace/product/augmedix-public/augmedix)
- [Augmedix Product Overview (augmedix.com)](https://www.augmedix.com/product-overview)

---

## Part 2 — Connections, Flows & Status

**Companion brief:** the Structure & Systems section above
**Style Guide:** parchment
**Folder:** architecture/augmedix/

---

## End-to-End Data Flow

The Augmedix documentation lifecycle has five identifiable hops from audio capture to signed EHR note. The specific path differs by product tier (Go vs. Assist vs. Live), but the skeletal sequence is consistent.

### 1. Audio Capture at the Point of Care

Clinicians use one of three capture modes depending on the product:

- **Augmedix Live (legacy + current)**: Originally used Google Glass Enterprise Edition to stream a first-person audio/video feed to a remote Medical Documentation Specialist (MDS). Google discontinued Glass Enterprise on 2023-03-15 (support ended 2023-09-15), so the Live product now primarily uses a smartphone or tablet as the "Content Capture Device." The product schedule describes capture over a device meeting WPA2 PSK (AES) or WPA2 PEAP wireless authentication with a minimum -65 dBm RSSI signal, and QoS elevated to platinum/voice priority on the clinical network. [Source: Augmedix Live Product Schedule, augmedix.com/ax-live-product-schedule]

- **Augmedix Go (current primary product)**: An iOS app (iPhone 12+, iOS 15+) that the clinician runs during or after the patient encounter. Audio is captured via the phone microphone, optionally paired with a Bluetooth mic. Clinicians can trigger multiple recordings per encounter for multi-interaction visits; the platform stitches them into a single structured note. [Source: Augmedix Go Product Schedule, augmedix.com/ax-go-product-schedule; GlobeNewswire 2024-03-12]

### 2. Audio Ingestion and Speech-to-Text

Audio streams are transmitted to Augmedix's Google Cloud infrastructure. The Google Cloud Developer article (June 2024) confirms that Google Cloud's **Speech-to-Text** service is used to convert recordings into speaker-diarized transcripts — distinguishing clinician voice from patient voice. The output is a structured transcript with speaker labels and timestamps. [Source: discuss.google.dev/t/...augmedix-google-cloud/154902]

The Go product schedule confirms the app requires continuous internet connectivity during use; audio processing is server-side, not on-device.

### 3. NLP and LLM Note Generation

The transcript enters a multi-model NLP pipeline that Augmedix describes as "multiple models that cross-check each other." The confirmed components as of 2024:

- **Google Cloud Speech-to-Text** — diarized transcript from raw audio
- **MedLM** (on Vertex AI) — Google's medical-domain foundation model, built on Med-PaLM 2. Augmedix announced it began piloting MedLM in December 2023, integrating it across all documentation products through 2024. Confirmed early tester alongside HCA Healthcare and BenchSci. [Source: PRNewswire 2023-12-11; FierceHealthcare MedLM launch]
- **MedGemma** and **Gemini** — The Google Dev forum article (June 2024) lists these as active components in the Clinical Notes Engine pipeline, with MedGemma handling healthcare-specific language understanding and Gemini supporting multimodal/advanced note processing. [Source: discuss.google.dev]
- **Augmedix proprietary NLP** — Specialty-specific fine-tuned LLMs covering 50+ clinical specialties; 30+ language support. The NoteBuilder internal tool (pre-Go era) provided a structured template-assisted drafting interface for human scribes; now largely automated. [Source: GlobeNewswire 2021-04-01 NoteBuilder announcement; Augmedix product-overview page]

The pipeline generates two outputs: (a) an unstructured full-text note draft, and (b) structured data elements — complaints, HPI, medications, chronic conditions, labs, treatments, Assessment and Plan — extracted into discrete fields.

Per the Google Dev article, Augmedix retains encounter audio and note data **for one week after EMR transmission**, then permanently deletes. This contrasts with the general privacy policy's "up to six years after account closure" for user account data — the shorter window likely applies specifically to audio recordings and raw transcripts under the BAA. [Source: discuss.google.dev; augmedix.com/privacy-policy/current] **(Note: The one-week figure comes from the Google Dev community blog, not from a formally published Augmedix data retention policy; treat as unconfirmed for audio specifically.)**

### 4. Human Scribe Review Queue (Live and Assist tiers)

For **Augmedix Live**, the AI-generated draft is routed to a Medical Documentation Specialist (MDS) — a trained remote human scribe — who finalizes it in real time. The MDS observes the encounter via the clinician's device, uses Augmedix's internal documentation tooling (NoteBuilder/successor), and produces a ready-to-sign note. The MDS has direct credentialed access to the customer's EHR system to upload notes in "pending" status. [Source: Augmedix Live Product Schedule]

For **Augmedix Go Assist**, a support specialist handles post-encounter editing and administrative tasks (coding, orders, referrals); notes are promised within one hour of visit completion. This tier is the scaled successor to the older "Notes Assist" model that reduced scribe dependency per encounter.

For **Augmedix Go** (pure-AI tier), no human scribe reviews the draft. The clinician receives the draft directly.

### 5. EHR Write-Back and Clinician Sign-Off

Notes arrive in the EHR in **pending/preliminary status**. The clinician reviews, edits inline, and executes a digital signature, which changes the document status to final and triggers downstream billing and distribution workflows.

For Epic specifically, confirmed mechanisms include:
- **HL7 v2** used to pull provider schedules (ADT/SIU feed) and patient encounter context
- **FHIR APIs** used to pull encounter data and patient context
- Note upload uses **FHIR DocumentReference** resources or section-specific writes into Epic's SmartText/Smart Data Elements within Hyperspace/Hyperdrive [Source: search result citing Augmedix's athenahealth FHIR integration; tactionsoft.com SOAP notes write-back guide for Epic]

For **athenahealth**: "Augmedix uses FHIR APIs to pull provider schedules and patient encounter data from athenahealth, and then uploads the generated note back by section (HPI/ROS/PE/AP) to athenahealth." This is section-level write-back into athenahealth's encounter template fields. [Source: search results confirming this quote from Augmedix integration documentation]

The clinician retains sole authority to finalize and sign. Augmedix contractually prohibits pre-signing on the clinician's behalf. [Source: Augmedix product schedules, general design]

### 6. Enterprise Data Lake Export (Optional Add-On)

Post-EHR-transmission, customers can configure an enterprise data integration using **Google Cloud Pub/Sub**. Augmedix publishes a structured JSON payload to a Pub/Sub topic (customer-defined); a customer-operated `encounter_service` (containerized on GKE or Cloud Run) subscribes and stores structured encounter data into Cloud Spanner, which feeds BigQuery for analytics. An optional Healthcare Data Engine (HDE v2) layer harmonizes multi-source data into FHIR R4 for a longitudinal patient record store. [Source: discuss.google.dev Clinical Intelligence Engine article, June 2024]

---

## EHR Integrations

Augmedix supports bidirectional integration with five named EHR platforms:

| EHR | Integration Mechanism | Notes |
|---|---|---|
| Epic | HL7 v2 (schedule pull) + FHIR R4 APIs (encounter context) + FHIR DocumentReference / SmartText write-back | Listed in Epic Showroom (listing ID 1103) since at least 2024; Connection Hub tier |
| Oracle Health (Cerner) | Oracle Validated Integration (earned December 2024) | Certification covers Go, Assist, and Live; on-prem and cloud deployments; 10+ year relationship |
| athenahealth | FHIR APIs (pull) + section-level write-back (HPI/ROS/PE/A&P fields) | Listed in athenaConnect marketplace (requires login) |
| MEDITECH | Deep bidirectional integration with MEDITECH Expanse Now (embedded, September 2025) | Commure joined MEDITECH Alliance March 2025; notes uploaded into discrete EHR sections |
| Meditech (legacy) | Named in product literature as supported | No specific integration mechanism detail publicly confirmed |

**Epic Showroom**: Augmedix holds a listing at Epic Showroom (id=1103), the Connection Hub tier ($500/year annual listing fee). This confirms live interoperability with Epic but does not imply Workshop co-development tier status. [Source: showroom.epic.com/listing?id=1103]

**Oracle Validated Integration**: Earned December 2024. Oracle's validation process involves a rigorous technical review confirming the integration "performs as documented" with reduced deployment risk across all three Augmedix product tiers. [Source: GlobeNewswire 2024-12-04]

**MEDITECH Expanse embedding**: The September 2025 deployment describes notes flowing directly into patient records with no copy-paste required across ED, inpatient, and ambulatory settings. The press release describes "gold-standard technology to securely exchange data" without specifying FHIR vs. proprietary API. Given MEDITECH Expanse's support for HL7 FHIR R4, FHIR-based write-back is the most probable mechanism. **(Unconfirmed: specific API protocol.)**

**EHR-agnostic fallback**: When EHR integration cannot be configured (organizational or technical constraints), clinicians can manually copy-paste notes from the Augmedix Customer Portal into their EHR. This degrades feature availability (no automatic structured data upload, no pre-population from EHR context). [Source: Augmedix Go Product Schedule]

---

## Authentication & Identity

### Clinician Authentication

- Augmedix Go app: Access credentials (username/password) are delivered via email after contract execution. Credentials are non-transferable and user-specific; credential sharing is contractually prohibited. No specific MFA requirement is called out in the public product schedule, but the product is deployed inside health system networks that typically enforce hospital IdP SSO. **(MFA specifics unconfirmed from public sources.)**

- For EHR-embedded workflows (SMART on FHIR launch context): When the Augmedix app launches within Epic Hyperspace/Hyperdrive, it receives the encounter ID, patient ID, and clinician ID via the Epic-issued SMART launch token, along with OAuth 2.0 authorization scopes. This means the clinician authenticates once to Epic (via the hospital IdP, commonly Imprivata-backed) and Augmedix inherits that authenticated context. No separate Augmedix login is required in this flow. [Source: tactionsoft.com Epic integration guide; general SMART on FHIR launch flow]

### Medical Documentation Specialist (Scribe) Authentication

For the Live product, MDSs are granted credentials directly into the customer's EHR. Per the Live Product Schedule: "Customer must provide appropriate access and related credentials for use of the Customer EHR" within two weeks of activation. MDSs must comply with "all agreements between Customer and third parties relating to the use of the Customer EHR" — meaning they operate under the same credential governance policies as the host health system's own staff. **(Whether MFA is enforced for remote MDS EHR access is not publicly documented by Augmedix; this depends on the individual health system's EHR credential policy.)**

### Audit Logging

HIPAA requires covered entities and BAs to maintain audit logs of PHI access. Augmedix's HITRUST r2 certification (see Compliance section) covers these controls. Specific audit log architecture (e.g., Cloud Logging, BigQuery audit tables, SIEM integration) is not publicly documented by Augmedix. **(Unconfirmed.)**

---

## PHI Handling on GCP

### GCP Services Confirmed or Strongly Inferred

| GCP Service | Role | Evidence Level |
|---|---|---|
| Google Cloud Speech-to-Text | ASR: audio → diarized transcript | Confirmed (Google Dev blog) |
| Vertex AI | LLM inference (MedLM, MedGemma, Gemini) | Confirmed (PR Dec 2023, Google Dev blog) |
| MedLM on Vertex AI | Medical note generation | Confirmed (PRNewswire Dec 2023) |
| Cloud Pub/Sub | Asynchronous encounter data delivery to enterprise | Confirmed (Google Dev blog) |
| Cloud Spanner | Relational encounter storage at enterprise integration layer | Confirmed (Google Dev blog) |
| BigQuery | Analytics data warehouse for enterprise | Confirmed (Google Dev blog) |
| GKE / Cloud Run | Encounter service containerized workload | Confirmed (Google Dev blog) |
| Healthcare FHIR API | FHIR R4 longitudinal patient records | Confirmed (Google Dev blog, enterprise layer) |
| Healthcare Data Engine (HDEv2) | Multi-source FHIR harmonization | Mentioned (Google Dev blog, "private preview" as of June 2024) |
| Looker | BI/population dashboards at enterprise | Mentioned (Google Dev blog) |
| Google Analytics | Web analytics (listed as named subprocessor in privacy policy) | Confirmed (privacy policy) |

### PHI Containment and BAA Boundary

Google's HIPAA BAA covers Vertex AI as a HIPAA-eligible service. This is what allows Augmedix to process identifiable PHI (including audio with patient voices) through MedLM inference on Vertex AI. The BAA boundary means Google commits not to use customer data to train its foundation models — "Vertex AI does not utilize customer data, prompts, responses, or training data to improve or train the foundation models." [Source: discuss.google.dev, Google Cloud BAA documentation]

Augmedix itself signs a BAA with each covered entity (hospital/health system) customer. The privacy policy names a Privacy Officer (Daniel Brian, privacy@augmedix.com) and commits to HIPAA and California state medical records law compliance. [Source: augmedix.com/privacy-policy/current]

### Encryption and Data Controls

Augmedix's privacy policy states use of "authentication, encryption, backups, and access controls" but does not specify encryption protocols. HITRUST r2 certification (see below) requires AES-256 at rest and TLS 1.2+ in transit as baseline controls; compliance with these is implied. [Source: privacy policy; HITRUST framework requirements]

**Unconfirmed / not publicly documented:**
- Whether Augmedix uses Customer-Managed Encryption Keys (CMEK) per hospital tenant
- Whether VPC Service Controls are applied to isolate PHI workloads from the broader GCP project
- Whether Confidential Computing (Confidential VMs) is used for inference of sensitive audio data
- Whether Google Cloud DLP is applied to transcripts for automated PHI detection/scrubbing before analytics export

The Google Dev article recommends that enterprises use de-identified data export "if your data lake use cases do not require holding PHI," suggesting Augmedix does offer a de-identified export path. This implies some PHI scrubbing capability exists, but the mechanism (Cloud DLP, custom NER, or manual review) is not specified. **(Unconfirmed.)**

---

## Multi-Tenancy Model

### Logical vs. Physical Isolation

Augmedix's multi-tenancy model is not publicly documented in architectural detail. Based on available evidence:

- The enterprise data integration pattern (Pub/Sub → Cloud Spanner → BigQuery) is structured per customer: each customer defines their own Pub/Sub topic, and the `encounter_service` is deployed into the customer's own GCP project. This suggests a **bring-your-own-project** model for enterprise data integration customers, where Augmedix publishes into the customer's cloud environment rather than holding tenant data in a shared Augmedix-owned GCP project. [Source: discuss.google.dev]

- For non-enterprise (smaller) customers, the inference pipeline and audio processing are presumed to run in shared Augmedix-owned GCP infrastructure with logical tenant isolation (IAM-based, per-tenant service accounts and dataset-level permissions in BigQuery). **(Unconfirmed; inferred from standard GCP SaaS patterns and the 99.0% uptime SLA commitment.)**

- Augmedix's HITRUST r2 certification covers "core products and cloud services," implying the certification assessor reviewed tenant isolation controls as part of the access control domain. HITRUST requires demonstrating separation of customer data in shared infrastructure. [Source: GlobeNewswire HITRUST 2023]

### Tenant Identity

Each health system customer is onboarded with its own set of EHR credentials and Augmedix account credentials. The data export payload includes encounter-level identifiers (`_encounterID`, `_noteID`, timestamps) that can be attributed to tenant. Cloud IAM at the project or dataset level enforces that only the subscribing encounter service for that tenant can read that tenant's data. [Source: discuss.google.dev Cloud Spanner schema]

---

## Human-in-the-Loop Integration

### The Scribe Network

The human scribe workforce has been central to Augmedix since its 2013 founding. At peak (pre-acquisition), Augmedix Bangladesh employed 500+ scribes with 800+ total staff in Bangladesh, supporting US doctors in real time. Scribes in India (through vendors) were also reported, with approximately 70% of Remote Documentation Specialists (RDSs) residing in India at one point. [Source: TBS News; Nanalyze analysis (paywalled)]

Scribes operate from "HIPAA secure rooms" — dedicated facilities that meet physical security requirements for handling PHI, including controlled access, no personal devices, and clean-desk policies. This is the mechanism that enables offshore access to PHI under HIPAA: HIPAA does not prohibit offshore PHI access provided the Business Associate Agreement covers the subcontractor, and appropriate technical and physical safeguards are in place. Augmedix's BAA with each hospital covers the scribe operations as a downstream subcontractor relationship. [Source: HIPAA offshore PHI legal analysis; Augmedix BAA structure]

### Scribe Workflow Tooling

The internal tool used by scribes is the **NoteBuilder** platform (described in a 2021 press release). NoteBuilder provides:
- Dynamic templates filtered by specialty, visit type, and complaint
- Intelligent auto-completion that narrows selection options as the scribe types
- Integrated medication datasets with dosages and frequencies
- Customizable per-clinician or per-clinic templates
- Real-time AI assistance generating structured note sections (HPI, PE, A&P)

In the Live product, the MDS observes the encounter in real time via the clinician's device camera/microphone, uses NoteBuilder to finalize the note, and uploads it directly to the EHR in pending status via their EHR credentials. Two-way text communication between scribe and clinician is supported for clarifications during the encounter. [Source: GlobeNewswire 2021 NoteBuilder; Augmedix Live product overview]

### Shift from Full Human to Hybrid to AI-First

The product evolution reflects a deliberate reduction in per-note human labor:

1. **2013–2021**: Google Glass + full human scribe (Live model). Scribes watched the entire encounter and wrote the note from scratch with minimal AI assistance.
2. **2021–2023**: NoteBuilder AI assistance + human scribe. AI pre-drafts sections; scribes correct and finalize.
3. **2023–present**: Augmedix Go (fully automated, no human review) + Augmedix Assist (human polish on AI draft). The Go tier represents the shift from human-first to AI-first documentation.

The "Notes Assist" product referenced in pre-acquisition materials maps to what is now marketed as Augmedix Assist. This transition was partly driven by COVID-era constraints that made in-person scribing infeasible and pushed the company to accelerate remote and AI-first workflows.

As of the Commure acquisition (late 2024), three tiers remain: Go (pure AI, instant), Assist (AI + human, ~1 hour), Live (AI + real-time human, synchronous). Commure has stated all three product lines will continue to receive investment. [Source: Commure acquisition press release; Augmedix product-overview page]

---

## Modernization & Status

### Commure Acquisition

Commure (backed by General Catalyst) acquired Augmedix in an all-cash deal valued at approximately **$139 million** ($2.35/share), representing a 169% premium over Augmedix's 30-day VWAP. The deal closed in late Q3/early Q4 2024. Augmedix delisted from NASDAQ (ticker: AUGX) and became a wholly-owned subsidiary of Commure. [Source: HealthcareITNews; FierceHealthcare July 2024]

**Financial context pre-acquisition**: Augmedix was growing (~40% YoY revenue growth in Q1 2024) but not profitable. Full-year 2024 revenue guidance was cut to $52–55M from a prior higher estimate; shares had dropped 40% on the guidance cut. The 169% acquisition premium suggests Commure valued the technology and customer relationships well above the distressed public market price. The company had never reached profitability as a standalone entity. [Source: FierceHealthcare acquisition coverage]

### What Changed Post-Acquisition

Commure is integrating Augmedix ambient documentation with its Revenue Cycle Management (RCM) platform and PatientKeeper EHR extension product. The combined entity processes "tens of billions of dollars in annual claims" and serves 130+ large health systems. Augmedix's ambient AI is now marketed as "Commure Ambient AI" in MEDITECH Expanse contexts, though the Augmedix brand remains active on the augmedix.com domain. Key post-acquisition developments:

- **October 2024**: HCA Healthcare selected as exclusive development partner for multi-specialty ambient platform; 1,400+ physicians piloting across 50+ hospitals; clinical documentation F1 score >0.8.
- **January 2025**: Vizient contract awarded — Vizient serves 65%+ of US acute care providers and 97% of academic medical centers.
- **March 2025**: Commure joined MEDITECH Alliance for ambient AI integration with Expanse.
- **September 2025**: Commure Ambient AI embedded directly in MEDITECH Expanse Now mobile app.
- **April 2026**: Commure Dictation launched — speech-to-cursor ambient AI for any text field or desktop app, not just EHR-structured workflows.

### Google Glass Sunset

Augmedix was founded on Google Glass as the capture device. Google discontinued Glass Enterprise on 2023-03-15. Augmedix had already diversified to smartphone-based capture (the Go mobile app launched September 2023). The Glass sunset did not materially disrupt operations because the smartphone pivot was already underway. The "Content Capture Device" referenced in the Live product schedule is now a smartphone, not a wearable. [Source: CNBC Google Glass discontinuation; Augmedix Go launch announcement September 2023]

### Known Issues and Competitive Pressure

- **AI scribe accuracy**: HCA pilot results (F1 > 0.8) indicate clinical note accuracy is competitive but not perfect. The human review tier (Assist/Live) exists precisely because pure-AI output is not yet signature-ready for all specialties and clinicians.
- **Competitive landscape**: Augmedix competes with Nuance DAX (Microsoft), Suki, Nabla, Abridge, and Freed.ai. The ambient scribe market is crowded and rapidly commoditizing, which contributed to the acquisition urgency.
- **No documented data breaches**: A search of HIPAA Journal breach databases and public sources finds no reported Augmedix data breach or OCR enforcement action as of 2026.
- **No FTC issues documented.**

---

## Public APIs / Partner Surface

### No Public Developer API

Augmedix does not publish a public API or developer documentation for third-party integration. Their integration model is customer-contracted and implementation-assisted. The "open ecosystem" description on their website refers to outbound data export (Pub/Sub, structured data APIs) available to enterprise customers under commercial agreement, not a public API marketplace. [Source: augmedix.com partnerships page]

### EHR Marketplace Listings

- **Epic Showroom** (Connection Hub tier, listing id=1103): Confirms live integration; basic listing.
- **athenaConnect Marketplace**: Listed (requires athenahealth account login to view full details).
- **Oracle Health validated partner**: Oracle Validated Integration certification (December 2024).
- **MEDITECH Alliance member**: Formal alliance membership (March 2025).
- **Google Cloud Marketplace**: Augmedix has a listing (console.cloud.google.com/marketplace/product/augmedix-public/augmedix); indicates willingness to be discoverable to GCP enterprise buyers. Details behind GCP console login.

### Enterprise Data Integration API

For enterprise health system customers, Augmedix provides:
- A **Pub/Sub publish interface** where Augmedix pushes structured encounter JSON to a customer-defined topic after EHR transmission.
- The payload includes: full transcript, AI-generated note (full and by section), provider-edited note, structured clinical data elements (complaints, medications, conditions, labs), and optional PHI reduction mode.
- Encounter data is available within **30 minutes of EHR transmission**.
- Augmedix guarantees **99.0% uptime SLA** for this data export service.
- Bidirectional: customers can inject their own EHR/data lake insights back into Augmedix to improve note quality (e.g., feeding prior problem lists).

[Source: discuss.google.dev Clinical Intelligence Engine article]

### Partner / Reseller

Vizient contract (January 2025) provides a group purchasing vehicle for Vizient member health systems to acquire Augmedix products without individual competitive procurement. This is a distribution partnership rather than a technical integration.

---

## Compliance Posture

### HITRUST

Augmedix earned **HITRUST risk-based, two-year (r2) certified status** in August 2023, covering Augmedix Live, Augmedix Notes (now rebranded under Go/Assist), and supporting cloud services. HITRUST r2 is the most rigorous HITRUST tier and involves independent assessor verification. The certification validates:
- Privacy and security controls mapped to HIPAA, NIST, ISO 27001, and state regulations
- Risk management processes
- Physical, technical, and administrative safeguards

CEO Manny Krakaris described it as meeting "the most rigorous measures to ensure patient information is protected within our platform." [Source: GlobeNewswire 2023-08-24]

### HIPAA BAA Structure

- Augmedix signs a **Business Associate Agreement (BAA)** with each covered entity customer.
- Augmedix holds a BAA with **Google Cloud** covering Vertex AI and all HIPAA-eligible GCP services used in the pipeline. This is the legal basis for processing identifiable PHI through Vertex AI inference.
- The offshore scribe workforce (Bangladesh, India) operates under the downstream BAA subcontractor structure: Augmedix's BAA with the hospital chains covers Augmedix's subcontractors including offshore scribe operations. PHI access in offshore locations is HIPAA-permissible under this structure provided appropriate safeguards are maintained. [Source: augmedix.com/privacy-policy; HIPAA offshore analysis]

### SOC 2

No SOC 2 certification is mentioned in any public Augmedix source. HITRUST r2 is positioned as the company's primary third-party security assurance framework. **(Unconfirmed absence — possible SOC 2 exists under NDA or not yet public.)**

### GDPR

Not mentioned in public Augmedix materials. Customer base is US-focused. No evidence of EU deployments or GDPR applicability found. **(Likely not applicable to current operations.)**

### ISO 27001 / 27018

Google Cloud holds ISO/IEC 27001, 27017, and 27018 certifications, which apply to the GCP infrastructure layer. Augmedix's application-layer ISO status is not publicly documented separately from HITRUST. [Source: discuss.google.dev article noting Google certifications]

### Patient Consent Requirements

Augmedix contractually requires customers to obtain patient consent for audio recording prior to service use, "to the extent required under applicable law." State-specific wiretapping and recording consent laws vary (one-party vs. two-party consent states). Augmedix provides patient education materials but cannot guarantee legal sufficiency across all jurisdictions. [Source: Augmedix Live Product Schedule; Augmedix Go Product Schedule]

---

## Sources (Connections, Flows & Status pass)

1. [Augmedix Partners with Google Cloud — PRNewswire, December 2023](https://www.prnewswire.com/news-releases/augmedix-partners-with-google-cloud-to-bring-medically-tuned-ai-technology-to-ambient-documentation-302014271.html)
2. [The future of clinical data: building an intelligence engine with Augmedix & Google Cloud — Google Developer Community, June 2024](https://discuss.google.dev/t/the-future-of-clinical-data-building-an-intelligence-engine-with-augmedix-google-cloud/154902)
3. [Augmedix Achieves HITRUST Certification — GlobeNewswire, August 2023](https://www.globenewswire.com/news-release/2023/08/24/2730991/0/en/Augmedix-Achieves-HITRUST-Certification-to-Further-Mitigate-Risk-in-Third-Party-Privacy-Security-and-Compliance.html)
4. [Augmedix acquired by Commure for $139M — Healthcare IT News, July 2024](https://www.healthcareitnews.com/news/augmedix-acquired-commure-139m)
5. [Health tech company Commure to acquire Augmedix — FierceHealthcare, July 2024](https://www.fiercehealthcare.com/ai-and-machine-learning/augmedix-acquired-commure-valuation-139-mil)
6. [Commure and Athelas sign deal to acquire Augmedix — Commure Blog](https://www.commure.com/blog/commure-and-athelas-sign-deal-to-acquire-augmedix)
7. [Augmedix Announces New Positive Data for Augmedix Go — GlobeNewswire, March 2024](https://www.globenewswire.com/news-release/2024/03/12/2844383/0/en/Augmedix-Announces-New-Positive-Data-and-Enhancements-to-Its-Ambient-AI-Product-Augmedix-Go.html)
8. [Augmedix Achieves Oracle Validation — GlobeNewswire, December 2024](https://www.globenewswire.com/news-release/2024/12/04/2991456/0/en/Augmedix-Achieves-Oracle-Validation-with-Industry-Healthcare-Expertise-for-Delivering-Proven-Repeatable-Integration.html)
9. [Commure Ambient AI Embedded in MEDITECH Expanse Now — Commure, September 2025](https://www.commure.com/press-releases/commure-ambient-ai-embedded-in-meditech-expanse-now)
10. [Commure To Partner with HCA Healthcare on Ambient AI Platform — GlobeNewswire, October 2024](https://www.globenewswire.com/news-release/2024/10/23/2967783/0/en/Commure-To-Partner-with-HCA-Healthcare-on-Ambient-AI-Platform.html)
11. [Augmedix Awarded Vizient Contract — Commure Press Release, January 2025](https://www.commure.com/press-releases/augmedix-awarded-vizient-contract-for-ambient-ai-documentation-solutions)
12. [Introducing MedLM for the healthcare industry — Google Cloud Blog](https://cloud.google.com/blog/topics/healthcare-life-sciences/introducing-medlm-for-the-healthcare-industry)
13. [Google unveils MedLM with Augmedix as early tester — FierceHealthcare](https://www.fiercehealthcare.com/ai-and-machine-learning/google-unveils-medlm-generative-ai-models-healthcare-hca-augmedix-and-benchsci-as-early-testers)
14. [Augmedix Go Product Schedule — augmedix.com/ax-go-product-schedule](https://www.augmedix.com/ax-go-product-schedule)
15. [Augmedix Live Product Schedule — augmedix.com/ax-live-product-schedule](https://www.augmedix.com/ax-live-product-schedule)
16. [Augmedix Privacy Policy — augmedix.com/privacy-policy/current](https://www.augmedix.com/privacy-policy/current)
17. [Augmedix Product Overview — augmedix.com/product-overview](https://www.augmedix.com/product-overview)
18. [Augmedix NoteBuilder Tool — GlobeNewswire, April 2021](https://www.globenewswire.com/news-release/2021/04/01/2203236/0/en/Augmedix-s-Proprietary-Notebuilder-Tool-Leverages-Intelligent-Automation-Technology-to-Efficiently-Deliver-Accurate-and-Timely-Medical-Notes.html)
19. [Augmedix Bangladesh — TBS News (Bangladesh Business Standard)](https://www.tbsnews.net/features/panorama/bangladeshi-scribes-who-keep-us-healthcare-system-running-614538)
20. [AI SOAP Notes and FHIR Write-Back to Epic — Taction Software](https://www.tactionsoft.com/blog/soap-notes-write-back-epic-fhir/)
21. [EHR Integration drives ambient speech purchasing decisions — TechTarget](https://www.techtarget.com/searchhealthit/news/366614644/EHR-integration-drives-ambient-speech-purchasing-decisions)
22. [Google Cloud HIPAA BAA — cloud.google.com/terms/hipaa-baa](https://cloud.google.com/terms/hipaa-baa)
23. [Google ends enterprise sales of Google Glass — CNBC, March 2023](https://www.cnbc.com/2023/03/15/google-discontinues-google-glass-enterprise-end-to-early-ar-project.html)
24. [Augmedix Epic Showroom listing — showroom.epic.com/listing?id=1103](https://showroom.epic.com/listing?id=1103)
25. [Commure joins MEDITECH Alliance — HIT Consultant, March 2025](https://hitconsultant.net/2025/03/04/commure-joins-meditech-alliance-to-bring-ambient-ai-documentation-to-expanse-ehr/)
26. [Inside Commure: AI Platform Powering Healthcare — Hospitalogy, October 2025](https://hospitalogy.com/articles/2025-10-22/inside-commure-the-ai-platform-powering-healthcare-transformation-today/)
27. [Augmedix AI-Powered Clinical Documentation Vendor Snapshot — Health Management Academy](https://hmacademy.com/insights/AI-Catalyst/health-technology/augmedix-ai-powered-clinical-documentation-vendor-snapshot)
