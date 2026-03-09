# VA Disability Claims Appeals Pipeline & Caseflow System — Architecture Research

## 1. Appeals Modernization Act (AMA) — Three Review Lanes

The Veterans Appeals Improvement and Modernization Act of 2017 (Public Law 115-55) was signed into law on August 23, 2017, and officially implemented on **February 19, 2019**. It replaced the legacy linear appeals process with three concurrent "review lanes":

### Lane 1: Supplemental Claim
- Veteran submits **new and relevant evidence** not previously considered
- Processed by the **Agency of Original Jurisdiction (AOJ)** — typically a VA Regional Office
- **Goal: 125 days** average completion
- **Actual (2025): ~5-6 months** average; some resolved faster (~68 days reported in Jan 2026 for certain categories)
- Veterans can file unlimited supplemental claims with new evidence
- PACT Act claimants denied before the Act must use the supplemental claim pathway

### Lane 2: Higher-Level Review (HLR)
- De novo review by a **senior technical expert** (more experienced adjudicator) within the AOJ
- **No new evidence** may be submitted
- Option to request an **informal conference** to identify factual or legal errors
- **Goal: 125 days** average completion
- **Actual (2025): 3-6 months**; trending faster as backlog capacity frees up

### Lane 3: Board Appeal (Notice of Disagreement / NOD)
- Appeal filed directly to the **Board of Veterans' Appeals (BVA)**
- Veteran must select one of **three dockets**:
  - **Direct Review**: No new evidence, no hearing. Goal: 365 days
  - **Evidence Submission**: Veteran may submit new evidence within 90 days
  - **Hearing Request**: Veteran requests hearing with a Veterans Law Judge (VLJ); evidence allowed at hearing or within 90 days post-hearing. Goal: 730 days
- **Actual Direct Review (Dec 2024)**: Average days to complete peaked at 1,049 days (July 2024), decreased to **722 days** by December 2024; average days pending dropped from ~640 to ~500 days

Key AMA feature: Veterans can **switch lanes** after receiving a decision in any lane (e.g., file a supplemental claim after an HLR denial, or appeal to Board after supplemental denial).

## 2. Legacy Appeals System

### How It Differed
The pre-AMA legacy system was a **linear, single-path process** with these characteristics:
- **Continuous evidence gathering**: Veterans could submit new evidence at any point, causing repeated delays and restarts
- **Split jurisdiction** between VA's three administrations and BVA
- **No lane choice**: All appeals followed the same path (NOD -> Statement of the Case -> Form 9 -> BVA)
- **Average resolution: 3-7 years** for a final decision
- Tracked in **VACOLS** (Veterans Appeals Control and Locator System), a ~40-year-old system

### Backlog History
- **Peak**: Nearly **500,000** pending legacy appeals in November 2017
- **2020**: ~102,000 legacy appeals pending
- **Q1 FY 2023**: 83,734 pending legacy appeals Department-wide
- **Q1 FY 2025**: **35,494** pending legacy appeals (58% reduction from Q1 FY 2023)
- **FY 2024**: Board reduced pending legacy hearing requests by **76%** (from 1,054 to 249)

### AMA vs. Legacy Performance Comparison
- AMA remand rates are consistently **~20% lower** than legacy
- AMA grant rates are consistently **~7-10% higher** than legacy
- AMA appeals are fully resolved approximately **5 years faster** than legacy appeals

### Transition Timeline
- It took **5 years** (Feb 2019 to Feb 2024) to shift from 99% Legacy / 1% AMA decisions to a 50/50 ratio
- It took only **7 more months** to reach ~87% AMA / 13% Legacy by end of FY 2024

## 3. Caseflow — Open-Source Rails Application

**Repository**: `github.com/department-of-veterans-affairs/caseflow` (public, open-source)

Caseflow is the web-based system built to **replace VACOLS** as the system of record for appeals. Development began in partnership with the **U.S. Digital Service (USDS)** and contractor **Nava PBC**, with Truss contributing integration work.

### Technical Stack
| Component | Technology |
|-----------|------------|
| Backend | **Ruby on Rails** |
| Frontend | **React** (via `react_on_rails` gem, Webpack for asset compilation) |
| Primary Database | **PostgreSQL** |
| Legacy Database | **Oracle** (for VACOLS connection) |
| Caching | **Redis** (e.g., POA names cached 30 days, addresses cached 24 hours) |
| Asset Bundling | **Webpack** |
| Video Conferencing | **Pexip** API (virtual hearings) |
| Local Dev | **Docker Compose** + **Colima** (not Docker Desktop, due to licensing) |
| Documentation | Graphviz diagrams, generated via Python scripts (`gen_ttdocs.py`) |
| Design System | USWDS (U.S. Web Design System) |

### Key Modules

#### Intake
- The "virtual front door" of the disability appeals process
- Automatically matches input from appeals forms to existing decision records or creates new ones
- Development began **September 2017**; MVP deployed **late October 2017** (before AMA's Nov 1 launch)
- Validates rules and processes paper appeals

#### Queue
- **Task management system** for BVA judges, attorneys, and staff
- Uses **algorithmic assignment** (Automatic Case Distribution / ACD) to route cases to decision-makers based on veteran and appeal data
- Task architecture uses **parent-child tree relationships** with Organization-level and User-level tasks
- **Docket-type levers** give the Board flexibility for workload management
- Supports preferential distribution (e.g., return AMA hearing cases to the judge who held the hearing)
- Push priority job ensures advanced-on-docket appeals are automatically pushed to judges

#### Reader
- Document review interface for BVA attorneys and judges
- Retrieves documents from **VBMS eFolders**
- Enables navigation of thousands of documents per case
- Supports **annotations, notes, and tags** for document categorization
- Designed specifically for Board attorney/judge workflow needs

#### Hearing Scheduling
- Manages four hearing modalities: **Central** (in-person at BVA), **Video** (RO to central), **Virtual** (any location via Pexip), and Travel Board
- Database tables: `hearings`, `legacy_hearings`, `hearing_days`, `virtual_hearings`, `virtual_hearing_establishments`, `sent_hearing_email_events`
- Request type codes: `R` (virtual), `V` (video), `C` (central)
- Task workflow: `HearingTask` -> `ScheduleHearingTask` -> `AssignHearingDispositionTask` -> `TranscriptionTask` + `EvidenceSubmissionWindowTask` (90-day window) -> `DistributionTask`
- `HearingAdminActionTask` can block scheduling until resolved (missing data, veteran situations)

#### Dispatch
- Creates **EndProducts in VBMS** from completed cases
- Users: VBA Office of Administrative Review (OAR) employees
- Presents VACOLS cases that have received a decision and need routing to correct VBA entity
- Uploads final BVA decisions to VBMS as system of record
- Known challenge: VACOLS uses SSN while VBMS uses claims file numbers as identifiers

#### Certification (earlier module)
- Launched **April 2016** (predates AMA)
- Automatically verifies required documents are attached to appeals before sending from AOJ to BVA

#### eFolder Express
- Downloads all files in a claimant's VBMS eFolder in chronological order

### Task Tree Architecture
Tasks are organized hierarchically across six appeal phases:
1. **Regional Office Phase**: VSO tracking (`TrackVeteranTask`)
2. **Intake Phase**: Distribution and evidence submission
3. **Hearing Phase**: Scheduling and disposition
4. **Decision Phase**: Judge and attorney review (`JudgeAssignTask` -> `AttorneyTask` -> `JudgeDecisionReviewTask`)
5. **Quality Review Phase**: Multi-level QA
6. **Dispatch Phase**: BVA dispatch and returns

Task states flow: `Intake -> Distribution -> Hearing/Evidence -> Decision -> Quality Review -> Dispatch`

Specialized task types include 15+ **ColocatedTask** subtypes for attorney support (FOIA, translation, transcription) and **MailTask** routing to VLJ Support, AOD, Privacy, and Litigation Support teams.

## 4. Board of Veterans' Appeals (BVA)

### Structure
- **Chairman**: Appointed by the President, confirmed by Senate, 6-year term
- **Vice Chairman**: Appointed by VA Secretary with Presidential approval
- **Senior Deputy Vice Chairman** + **four Deputy Vice Chairmen**
- **Executive Director for Appellate Support**
- **Chief Counsel**
- **Veterans Law Judges (VLJs)**: Must be lawyers in good standing; salary equivalent to Administrative Law Judges
  - FY 2018: 92 VLJs
  - FY 2022: 125 VLJs
  - FY 2023: Largest judge expansion in BVA's 90-year history
- **Decision-writing attorneys**: ~195 hired in FY 2023, ~155 hired in FY 2024

### Decision Flow
1. Appeal arrives at BVA (via NOD) and is placed on selected docket
2. **Automatic Case Distribution (ACD)** assigns case to a VLJ
3. VLJ assigns case to a **decision-writing attorney**
4. Attorney reviews the record (using Caseflow Reader), drafts a decision
5. VLJ reviews the draft, may send back for revision
6. VLJ signs the decision
7. **Quality Review** checks the decision
8. **Dispatch** uploads final decision to VBMS and creates EndProducts
9. Decision outcomes: **Granted**, **Denied**, or **Remanded** (sent back to AOJ for further development)

### FY 2024 Performance
- **111,000 total decisions** issued (Legacy + AMA)
- **70,000+ AMA decisions** — more than FY 2022 and FY 2023 AMA decisions combined
- AMA decision output increased **118% over FY 2023**
- **FY 2025 production goal**: 118,000 decisions

## 5. Decision Review Backlog — Current Numbers

### VBA (Regional Office) Level
| Lane | Goal | Actual (2025) |
|------|------|---------------|
| Supplemental Claim | 125 days | ~5-6 months avg |
| Higher-Level Review | 125 days | 3-6 months avg |

### BVA Level
| Docket | Goal | Actual (Dec 2024) |
|--------|------|--------------------|
| Direct Review | 365 days | 722 days avg to complete (down from 1,049 peak) |
| Evidence Submission | — | Longer than Direct |
| Hearing Request | 730 days | Longest queue |

### Pending Inventory (FY 2024)
- **69,403 pending AMA appeals** with hearing requests (down 2,008 / ~3% from FY 2023)
- **249 pending Legacy hearing requests** (down 76% from 1,054)
- **35,494 total pending Legacy appeals** Department-wide (Q1 FY 2025)

### PACT Act Impact
- **4,414,334 claims** received over two fiscal years (FY 2023-2024), 29.8% more than prior two years
- **1,774,158** of those included PACT Act conditions
- FY 2023: 2,433,729 claims applications (all-time record, 39% increase over FY 2022)
- PACT Act backlog (claims >125 days): 330,000 as of April 2024; projected to decrease to 50,000 by December 2025
- Overall backlog fell consistently below 100,000 for first time since May 2020

## 6. Integration Points

### VBMS (Veterans Benefits Management System)
- Central electronic claims file repository; stores all documents related to a veteran's compensation claim
- Caseflow reads documents from VBMS eFolders (via Reader)
- Dispatch creates EndProducts in VBMS
- Uses **claims file numbers** as identifiers
- Cloud-based (VBMS Cloud has a FY25 PIA on record)

### BGS (Benefits Gateway Services)
- Provides bulk claims processing functionality not related to document storage
- Common security framework for authentication and authorization
- Caseflow accesses CorpDB through BGS
- POA data fetched from BGS and cached in Redis

### VACOLS (Veterans Appeals Control and Locator System)
- Legacy system being replaced by Caseflow
- **Oracle database** accessed directly by Caseflow
- Uses **SSN** as identifier (vs. VBMS claims file number — a known integration pain point)
- Still active for remaining ~35,000 legacy appeals
- Local development simulates VACOLS via Oracle in Docker (takes several minutes to initialize)

### CorpDB (VA Corporate Database)
- Central VA data repository
- Accessed by Caseflow **through BGS** (not directly)
- Higher-Level Reviews and Supplemental Claims data lives in VBMS/BGS/CorpDB

### VVA (Virtual VA)
- Additional document source
- Caseflow collects data from VVA as needed for appeals workflows

### VA.gov / Appeals Status API
- Public-facing API for veterans to check appeal status
- Caseflow provides data to the Appeals Status API (V3)

## 7. Appeals Data Flow — End to End

```
1. VETERAN FILES CLAIM
   └─> VA Regional Office (AOJ) makes initial rating decision
       └─> Decision stored in VBMS/BGS/CorpDB

2. VETERAN DISAGREES WITH DECISION
   └─> Chooses one of three AMA lanes:
       ├── Supplemental Claim (new evidence) ─> AOJ re-adjudicates
       ├── Higher-Level Review (no new evidence) ─> Senior reviewer at AOJ
       └── Board Appeal (NOD) ─> Enters Caseflow

3. CASEFLOW INTAKE
   └─> Form data matched to existing decision records in VBMS/BGS
   └─> Appeal record created in Caseflow (PostgreSQL)
   └─> Veteran selects docket: Direct / Evidence / Hearing

4. DISTRIBUTION (ACD)
   └─> Automatic Case Distribution assigns to VLJ
   └─> Docket-type levers manage workload balance
   └─> Priority cases (AOD, remands) pushed automatically

5. HEARING PHASE (if Hearing docket)
   └─> ScheduleHearingTask created
   └─> Coordinator schedules hearing day
   └─> Virtual: Pexip API creates conference, emails sent to veteran/rep/VLJ
   └─> Hearing held; disposition recorded
   └─> 90-day evidence submission window opens

6. DECISION PHASE
   └─> JudgeAssignTask ─> Attorney reviews eFolder via Reader (VBMS docs)
   └─> Attorney drafts decision
   └─> JudgeDecisionReviewTask ─> VLJ reviews and signs

7. QUALITY REVIEW
   └─> QualityReviewTask chain (Org ─> User ─> Judge ─> Attorney)

8. DISPATCH
   └─> BVADispatchTask ─> Final decision uploaded to VBMS
   └─> EndProduct created in VBMS for downstream processing
   └─> If REMAND: case returns to AOJ for further development
   └─> If GRANT/DENY: veteran notified; can pursue further review in any lane

9. COURT REVIEW (optional)
   └─> Veteran may appeal BVA decision to U.S. Court of Appeals for Veterans Claims (CAVC)
```

## 8. Virtual Tele-Hearings — Pexip Integration

### Implementation
- Launched **March 2020**, one week after COVID shelter-in-place orders
- Built into Caseflow's hearing scheduling module
- When a hearing is converted to virtual, Caseflow:
  1. Calls the **Pexip API** to create a video conference
  2. Stores conference ID in the `virtual_hearings` table
  3. Sends automated emails to veteran, representative, and VLJ with conference links
  4. Conference job (`VirtualHearingConferenceJob`) runs asynchronously
- Pexip URL migrated from `vc.va.gov` to `care.va.gov`

### Adoption
- **June 2020**: 25% of hearings converted to virtual
- **July 2020**: 33% of hearings virtual
- **2021**: Capacity to hold **1,000+ hearings per week**
- Saves VA staff approximately **10-15 minutes per hearing scheduled** (reduced from multi-step to two-step process)
- Email history display added so coordinators can see all sent emails, recipients, and timestamps

### Hearing Types Supported
- Central (in-person at BVA Washington DC)
- Video (Regional Office to BVA via videoconference)
- **Virtual** (veteran at any location with internet — the Pexip-powered modality)
- Travel Board (judge travels to RO; not currently Caseflow-supported)

## 9. Recent Improvements

### Automation & AI (2024-2026)
- **CCPS (Claims Classification and Processing System)**: First ML API deployed; reads disability descriptions and auto-classifies contentions. In first week, 48% of claims (3,994/8,368) established automatically vs. prior 2% rate
- **Automated Decision Support (ADS)**: ML tool automating up-front development tasks like information retrieval for PACT Act claims
- **AICES**: Agentic AI tool indexing structured, semi-structured, and unstructured veteran health/service records from eFolders, extracting diagnosis, severity, and service connection evidence
- **Ratings Summarization Tool**: AI reduces time sorting through documentation for claimed issues
- **VA AI Inventory**: 367 AI use cases as of January 2025; 215 classified as "high-impact"; 28 focused on benefits processing (majority pre-deployment)
- VA strategy goal: deliver benefits in **"minutes not months"**

### Caseflow Platform Improvements
- **Automatic Case Distribution (ACD) enhancements**: Docket-type levers for workload management flexibility
- **Preferential distribution**: Returns AMA hearing cases and Court remands to the original judge
- **Push priority job updates**: Ensures all advanced-on-docket appeals ready for review are pushed automatically (no manual requests)
- **MST (Military Sexual Trauma) indicator**: Caseflow identifies MST appeals and attaches tracking indicators to contentions

### VA OIG Audit Findings (2024)
The VA OIG found governance gaps in Caseflow program management:
- Lacked enterprise-wide governance structure, limiting oversight during development
- Contractor development involved lengthy timelines and limited communication with users
- Contractor staffing inconsistent with contract requirements
- Some VA offices questioned or declined to use Caseflow
- **Recommendations**: Establish enterprise-wide governance, develop future development roadmap, enforce contract requirements

### Workforce Expansion
- ~195 decision-writing attorneys hired FY 2023; ~155 hired FY 2024
- Largest VLJ expansion in BVA's 90-year history occurred in FY 2023
- VA hired aggressively across VHA (5.5% workforce increase in 2023) to handle PACT Act claims surge

---

## Sources

- [Appeals Modernization - Veterans Benefits Administration](https://benefits.va.gov/benefits/appeals.asp)
- [VA News: Appeals Modernization simplifies complex process](https://news.va.gov/59396/appeals-modernization-simplifies-complex-process-veterans-can-choose-one-of-three-lanes/)
- [VA celebrates five years of appeals modernization](https://news.va.gov/130857/va-celebrates-five-years-of-appeals-modernization/)
- [BVA: Workload Challenges of Two Separate Appeals Systems](https://department.va.gov/board-of-veterans-appeals/decision-wait-times/workload-challenges/)
- [BVA: AMA Appeals System Shows Improvements Over Legacy](https://department.va.gov/board-of-veterans-appeals/decision-wait-times/ama-appeals-system-shows-improvements-over-the-older-legacy-system/)
- [BVA: More Board Personnel Address Pending AMA Appeals](https://department.va.gov/board-of-veterans-appeals/decision-wait-times/more-board-personnel-address-pending-ama-appeals-wait-times/)
- [Board of Veterans Appeals Annual Report FY 2024 (PDF)](https://www.bva.va.gov/docs/Chairmans_Annual_Rpts/bva2024ar.pdf)
- [CRS: The Board of Veterans' Appeals: A Brief Introduction](https://www.congress.gov/crs-product/IF12680)
- [Board of Veterans' Appeals - Wikipedia](https://en.wikipedia.org/wiki/Board_of_Veterans%27_Appeals)
- [VA Decision Reviews](https://www.va.gov/decision-reviews/)
- [Caseflow GitHub Repository](https://github.com/department-of-veterans-affairs/caseflow)
- [Caseflow Task Trees Documentation](https://department-of-veterans-affairs.github.io/caseflow/task_trees/trees/tasks-overview.html)
- [Caseflow FY25 Privacy Impact Assessment (PDF)](https://department.va.gov/privacy/wp-content/uploads/sites/5/2024/11/FY25CaseflowAssessingPIA.pdf)
- [Truss VA Case Study](https://truss.works/va-case-study)
- [Nava PBC: Supporting Veterans with Virtual Tele-Hearings](https://www.navapbc.com/case-studies/supporting-veterans-virtual-tele-hearings)
- [VA OIG: Caseflow Program Management Audit](https://www.vaoig.gov/reports/audit/va-can-strengthen-appeals-processing-and-tracking-improving-caseflow-program)
- [Nextgov: VA increasingly looking to AI for claims processing (March 2026)](https://www.nextgov.com/artificial-intelligence/2026/03/va-increasingly-looking-ai-enhance-claims-processing/411900/)
