# VistA: Detailed History and Evolution — Research Findings

## 1. Origins (1978–1982): The Underground Railroad

**The Spark (1977–1978):** In late 1977, **Ted O'Neill** and **Marty Johnson** — two key players in the standardization of MUMPS at the National Bureau of Standards — moved into a small office called "CASS" (Computer Assisted System Staff) within the VA's Department of Medicine and Surgery. They had the vision that MUMPS could be brought into the VA to automate hospital operations.

O'Neill and Johnson began recruiting programmers already working at individual VA hospitals in places such as St. Petersburg, Florida; Lexington, Kentucky; and San Francisco. Meanwhile, **Tom Munnecke**, a computer specialist for the VA from 1978 to 1986, and colleague **George Timson** sketched out a circular "Onion Diagram" on a paper placemat in 1978 — a design for what would become the Decentralized Hospital Computer Program (DHCP). The diagram placed the MUMPS language at the center, surrounded by a kernel of shared programs, with applications floating around the fringes "like electrons in an atom."

**The Underground Railroad (1979):** An informal network dubbed the "Underground Railroad" formed in 1979, with participants self-describing as "conspirators against the enemy." Programmers at individual VA medical centers initiated decentralized efforts to automate clinical and administrative processes, operating informally and at personal risk. Their approach directly defied VA central office management, which favored centralized, top-down IT procurement.

**Reprisals:** In 1979, Ted O'Neill was fired. He drove a cab for a while and later became a real estate agent. Marty Johnson found refuge at the Washington D.C. VA, though the computer he worked on was destroyed by a fire of suspicious origin a couple of years later. Despite these setbacks, the movement continued.

**Official Recognition (1981–1982):** In 1981, VA Chief Medical Director Donald Custis visited the Washington VA medical center and found administrators and practitioners actively using the "unauthorized" software. In June 1981, the project was formally named the Decentralized Hospital Computer Program (DHCP). In February 1982, VA Administrator Robert P. Nimmo issued an Executive Order describing how DHCP was to be organized and managed within the VA's Department of Medicine and Surgery — effectively legitimizing what the Underground Railroad had built.

**Key Dates:**
- Ted O'Neill died in March 2011
- Marty Johnson died in April 2020

Sources: [History of the Hardhats](https://www.hardhats.org/history/hardhats.html), [Hardhats History](https://www.hardhats.org/history/HSTmain.html), [Tom Munnecke VistA Interview (Internet Archive)](https://archive.org/details/Munnecke-TomMunneckeDHCPInterview245), [A 40-year conspiracy at the VA – Politico](https://healthcarereimagined.net/2017/03/26/a-40-year-conspiracy-at-the-va-politico/), [Remembering an IT Hero – Modern Healthcare](https://www.modernhealthcare.com/article/20110510/BLOGS02/305109999/remembering-an-it-hero), [VistA History – WorldVistA](https://worldvista.org/AboutVistA/VistA_History)

---

## 2. DHCP to VistA Transition (1996) and CPRS

**The Kizer Transformation:** In 1994, Dr. **Kenneth Kizer** was appointed Under Secretary for Health of the VA. He launched a sweeping transformation of the VA healthcare system focused on management accountability, care coordination, quality improvement, and information management. Between 1995 and 1999, the VA was reengineered.

**Rebranding:** Under Kizer, DHCP was renamed **VistA** (Veterans Health Information Systems and Technology Architecture) around 1994–1996. (Sources differ on whether the official name change was 1994 or 1996; 1996 is the commonly cited date for the full transition.)

**CPRS Development:** The **Computerized Patient Record System (CPRS)** was released in 1997. Written in Borland **Delphi** (Object Pascal), CPRS was the VA's first concerted effort at client-server programming with a GUI. It introduced a three-tiered architecture:
- **Tier 1:** CPRS GUI client (Delphi) on the clinician's workstation
- **Tier 2:** RPC Broker middleware handling communication
- **Tier 3:** M/MUMPS server with FileMan database and business logic

CPRS provided unified access to order entry, clinical documentation, consults, notes, clinical reminders, and clinical decision support. It also integrated with **Bar Code Medication Administration (BCMA)**, which the VA pioneered to reduce medication errors.

**Quality Results:** By 2000, the VA demonstrated significantly better quality of care than the Medicare fee-for-service program, with pneumococcal and influenza vaccination rates more than doubling during 1997–2000. A landmark study published in the *New England Journal of Medicine* documented these improvements.

Sources: [VistA – Wikipedia](https://en.wikipedia.org/wiki/VistA), [NEJM – Effect of Transformation on Quality of Care](https://www.nejm.org/doi/full/10.1056/nejmsa021899), [PIIM Research – AHLTA/VistA History Timeline](http://piim.newschool.edu/_media/pdfs/PIIM-RESEARCH_AHLTA_VISTA_History.pdf), [Lessons from the Rise and Fall of VA Healthcare – PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5215162/)

---

## 3. The MUMPS/M Language

**Origins:** MUMPS (Massachusetts General Hospital Utility Multi-Programming System) was developed in 1966–1967 by **Neil Pappalardo**, **Robert A. Greenes**, and **Curt Marble** in Dr. Octo Barnett's lab at Massachusetts General Hospital. It grew out of frustration with assembly language development on a time-shared PDP-1. Pappalardo went on to found **MEDITECH** in 1969.

**ANSI Standardization:** MUMPS was one of the earliest languages to receive an ANSI standard. The name was officially changed to "M" on December 8, 1995 with the approval of ANSI X11.1-1995, though "MUMPS" remains widely used.

**Why MUMPS Was Chosen for the VA:**
- **Vendor-neutral:** The language was standardized and didn't belong to any vendor
- **Built-in multi-user concurrency:** The language explicitly allowed multiple processes to manipulate the same data
- **Extreme performance:** Designed to run on minimal hardware of the 1960s–70s, so it is exceptionally fast on modern hardware
- **Integrated database:** No separate database engine or query language needed

**Unique Properties:**

1. **Hierarchical globals (persistent sparse arrays):** Variables prefixed with `^` are automatically persisted to disk. A MUMPS global "sticks around on a server, accessible at any given time." Programmers can give items "children," creating hierarchical data structures that can be extended on the fly. The syntax for accessing local (in-memory) and global (persistent) variables is identical — no separate query language.

2. **Built-in persistence:** There is no impedance mismatch between the programming language and storage. The database is implicitly "opened" for every MUMPS application. This predated the NoSQL movement by many decades; MUMPS globals have the characteristics of a document-oriented database.

3. **Interpretive execution:** MUMPS is interpreted, enabling rapid development cycles and runtime flexibility. Code can be stored in and executed from globals, enabling meta-programming patterns used throughout VistA.

4. **Terse syntax:** Famously compact — commands can be abbreviated to single characters, and the entire language specification is concise enough to fit on a few pages.

Sources: [MUMPS – Wikipedia](https://en.wikipedia.org/wiki/MUMPS), [Meet MUMPS – Vice](https://www.vice.com/en/article/meet-mumps-the-archaic-health-care-programming-language-that-predicted-big-data-2/), [MUMPS Overview – VistApedia](https://vistapedia.net/index.php/MUMPS_Overview), [MUMPS FAQ – VistApedia](https://www.vistapedia.com/index.php/MUMPS_FAQ), [Introduction to MUMPS – vista-book (GitHub)](https://github.com/shabiel/vista-book/blob/master/manuscript/intro_to_mumps1.md)

---

## 4. FileMan

**Creator:** FileMan was written by **George Timson** (affectionately known as the "Father of FileMan") beginning in June 1978 as a set of generalized routines — lookup, input, output, etc.

**The Self-Describing Data Dictionary:** FileMan's central innovation is its **active data dictionary**. Unlike passive schema definitions, FileMan's data dictionary can invoke the full interpretive power of the MUMPS language from within a data reference. This means:

- Setting a value in a file may change values elsewhere in the database, create new records, send mail messages, send HL7 messages to external systems, or encrypt stored data
- The data dictionary stores not just field definitions but validation rules, cross-references, computed fields, input transforms, and output transforms
- User-defined data definitions govern all data elements, and these definitions are themselves stored as FileMan data (self-describing/metacircular)

**Hybrid Data Model:** FileMan can store data in both a relational manner (like SQL) and a hierarchical manner (like XML), with metadata embedded in the data structure itself governing behavior. It functions as a complete database management system providing:
- File/record/field definitions
- Cross-references (indexes)
- Input validation and transformation
- Screen-based form editing
- Report generation
- Security and access control
- Menu management

**Architectural Significance:** FileMan allowed VistA applications to be built with minimal direct MUMPS coding. Developers defined data structures, and FileMan generated the user interface, validation, and storage logic. This metadata-driven approach made VistA extraordinarily extensible — new clinical applications could be rapidly assembled by defining data dictionaries rather than writing code from scratch.

Sources: [FileMan – Wikipedia](https://en.wikipedia.org/wiki/FileMan), [George Timson – VistApedia](https://www.vistapedia.net/index.php/George_Timson), [VA FileMan 22.2 Developer's Guide](https://www.va.gov/vdl/documents/Infrastructure/Fileman/fm22_2dg.pdf), [OSDB Tutorial – FileMan Overview](https://tutorials.worldvista.org/open-source-databases-tutorial/FileMan/Overview.html), [VistA Architecture – Vista Expertise Network](https://vistaexpertise.net/vista/architecture/)

---

## 5. Open Source Era

**FOIA Releases:** VistA source code has been periodically released to the public via the **Freedom of Information Act (FOIA)**. Because VistA was developed by federal employees, it is in the public domain and not subject to copyright restrictions.

**WorldVistA (2003):** WorldVistA was incorporated in March 2003 as a non-profit corporation dedicated to extending VistA for use outside the VA, both domestically and internationally. It was established to allow formal activities — obtaining grants, creating contracts, and making formal alliances — that an informal organization could not pursue.

**OSEHRA (2011–2020):** By 2010, the VA recognized that VistA's rate of innovation had slowed and the codebase was unnecessarily isolated from private-sector contributions. In 2011, the **Open Source Electronic Health Record Agent (OSEHRA)** was established in cooperation with the VA as a mechanism to open broadly based public- and private-sector contributions to VistA. OSEHRA enhanced FOIA releases into a curated, community-maintained open-source distribution ("OSEHRA VistA").

OSEHRA ceased operations on **February 14, 2020**. Most of its assets — web content, training materials, and journal content — were transferred to WorldVistA, which continues to maintain the open-source VistA distribution on [GitHub](https://github.com/WorldVistA/VistA).

Sources: [OSEHRA – Open Health News](https://www.openhealthnews.com/content/open-source-electronic-health-record-alliance-osehra), [OSEHRA to Shut Down – HCI Innovation Group](https://www.hcinnovationgroup.com/clinical-it/electronic-health-record-electronic-medical-record-ehr-emr/news/21124994/open-source-electronic-health-record-alliance-to-shut-down), [WorldVistA/VistA – GitHub](https://github.com/WorldVistA/VistA), [About WorldVistA](https://worldvista.org/WorldVistA)

---

## 6. International Adoption

VistA and its derivatives have been deployed in numerous countries:

| Country/Region | Details |
|---|---|
| **Jordan** | Entire national healthcare system runs on a VistA derivative |
| **Finland** | Major hospitals were the first institutions outside the US to adopt VistA, adapting it to Finnish in the early 1980s |
| **India** | RPMS (Resource and Patient Management System) derivatives; the Indian Health Service (IHS) deployed RPMS built on and augmenting DHCP throughout its Federal and Tribal facilities |
| **Mexico** | Instituto Mexicano del Seguro Social |
| **Egypt** | National Cancer Institute of Cairo University |
| **Other countries** | American Samoa, Kurdistan, Iraq, Germany, Kenya, Nigeria, Malaysia, Brazil, Pakistan, Denmark |

VistA and its derivatives (including CHCS, RPMS, and OpenVistA) are used by public and private sector healthcare facilities across Asia and the Pacific Rim, India, and Central Asia.

Sources: [VistA – Wikipedia](https://en.wikipedia.org/wiki/VistA), [VistA Adopters – Hardhats.org](https://www.hardhats.org/adopters/vista_adopters.html), [VistA and Open EHR Systems Spreading Across Asia & Pacific Rim – Open Health News](https://www.openhealthnews.com/hotnews/vista-and-open-ehr-systems-spreading-across-asia-pacific-rim-nations), [Case Studies of VistA Implementation (JB Learning)](https://samples.jblearning.com/0763739251/39251_CH09_223_284.pdf)

---

## 7. VistA vs. Commercial EHRs: User Satisfaction

**Medscape EHR Surveys:**
- **2014:** VA-CPRS received the **highest rating** of any EHR system with a score of **3.9 out of 5**, regarded as "one of the best overall" by physician respondents
- **2016:** VA-CPRS again received the **top overall rating** at **3.7 out of 5**. VistA ranked #1 for Connectivity and Usefulness as a Clinical Tool; #3 for Satisfaction and Ease of Use; #4 for Vendor Support

**Why Clinicians Preferred VistA:**
- **Clinician-designed:** Built by and for healthcare providers, not administrators or billing departments
- **Integrated clinical workflow:** CPRS unified orders, notes, labs, imaging, medications, and clinical reminders in a single interface
- **Bar Code Medication Administration:** VA pioneered BCMA, reducing medication errors
- **Clinical Decision Support:** Built-in clinical reminders and order checking
- **Comprehensive data access:** Clinicians could view a patient's complete record across all VA facilities

**Context:** Despite these high satisfaction ratings, VistA's CPRS GUI (Delphi-based) became increasingly dated in appearance compared to modern commercial EHRs, even as its underlying clinical logic remained highly valued.

Sources: [VistA Retains Top Spot – Medscape EHR Survey (Medsphere)](https://www.medsphere.com/blog/vista-retains-top-spot-in-most-recent-medscape-ehr-survey/), [Medscape EHR Report 2016](https://www.medscape.com/features/slideshow/public/ehr2016), [Medscape EHR Report 2014](https://www.medscape.com/features/slideshow/public/ehr2014)

---

## 8. Evolution of the GUI

**Phase 1 — Roll-and-Scroll (late 1970s–late 1980s):** VistA's original user interface was designed for dumb terminals ("green screen" devices). Users interacted through scrolling text prompts, entering commands and data line by line. This was the technology of the era, and all DHCP applications used this interface.

**Phase 2 — List Manager / VALM (late 1980s–1990s):** List Manager provided a structured terminal-based interface where users could review lists of information and choose from a variety of actions. It served as the interface for applications like the Text Integration Utility (TIU). This was an improvement over pure roll-and-scroll but still terminal-based.

**Phase 3 — CPRS GUI (1997–present):** The Computerized Patient Record System GUI, written in **Borland Delphi** (Object Pascal), was released in 1997. It was the VA's first major graphical user interface, introducing a Windows-based client-server model. CPRS communicated with the M server via the RPC Broker. It remained the primary clinical interface for over 25 years.

**Phase 4 — Web-Based Attempts (2010s–present):** Multiple efforts attempted to modernize VistA's interface using web technologies:
- **EWD.js** prototypes demonstrated translating FileMan roll-and-scroll interfaces to browser-based GUIs
- Various community-driven web front-end projects
- The style of client/server "thick client" architecture used by CPRS has been largely replaced in the IT industry by browser-based thin-client approaches
- However, CPRS's Delphi technology is now "effectively obsolete" and no fully successful web replacement has been deployed

Sources: [OSEHRA 2014: Modernizing the VistA GUI – Open Health News](https://www.openhealthnews.com/articles/2014/osehra-2014-modernizing-vista-gui), [VistA Evolution: What's Wrong with this Picture? – EWD Files](https://robtweed.wordpress.com/2014/07/24/vista-evolution-whats-wrong-with-this-picture/), [What is VistA Really – VistApedia](https://vistapedia.net/index.php/What_is_VistA_Really), [Delphi/Essay/Why I Choose Delphi – VistApedia](https://www.vistapedia.com/index.php/Delphi/Essay/Why_I_Choose_Delphi)

---

## 9. Failed Modernization Attempts

The VA has pursued **four separate modernization initiatives** since 2001, spending cumulatively toward an estimated **$2 billion** on the first three failed efforts alone:

### 9a. HealtheVet VistA (2001–2010)
- **Goal:** Replace VistA with a modernized architecture
- **Duration:** 10 years
- **Cost:** ~$600 million through FY2007, with an additional ~$535 million estimated for FY2008–2009. Total estimated development cost had ballooned to $11 billion with a projected completion date pushed from 2012 to 2018
- **Outcome:** Canceled in 2010. The only deliverable that survived was **My HealtheVet**, the VA's patient portal
- **Key contractor:** Nearly half of the $600 million went to Hewlett-Packard
- **Note:** The VA later told the GAO it no longer possessed spending records for HealtheVet

### 9b. iEHR — Integrated Electronic Health Record (2011–2013)
- **Goal:** Joint VA-DoD project to build a single, shared EHR replacing both VistA and the DoD's AHLTA
- **Launched:** February 2011
- **Cost:** Part of the $1.1 billion obligated to 138 contractors for iEHR and VistA Evolution during FY2011–2016
- **Outcome:** The joint effort collapsed; DoD chose to go with a commercial solution (Cerner) in 2013, and the VA followed suit later

### 9c. VistA Evolution (2013–2017)
- **Goal:** Incremental modernization of VistA after iEHR's collapse
- **Cost:** Combined with iEHR, ~$1.1 billion to 138 contractors (top 15 contractors accounted for ~$741 million)
- **Outcome:** Abandoned when VA decided in June 2017 to purchase a commercial solution instead

### 9d. EHRM — Electronic Health Record Modernization (2017–present)
- **Goal:** Replace VistA with the same commercial EHR (Cerner Millennium, now Oracle Health) that DoD selected
- **Original contract:** $10 billion signed with Cerner in May 2018
- **Cost escalation:** Initial $10B estimate revised to $16.1B over 10 years, then an independent life-cycle cost estimate found costs had more than doubled to **$33.6–$38.9 billion over 13 years**. Most recent estimate: ~$37 billion
- **Spending to date:** ~$5 billion spent to deploy at just 5 of 171 medical centers; ~$9.4 billion obligated since FY2018
- **Status:** Plagued by safety issues flagged by the VA Inspector General, system outages, and congressional criticism. Rollout paused ("reset") and only one new deployment in 2024 (Lovell Federal Health Care Center, joint VA-DoD). VA plans 13 new facility deployments in 2026
- **Congressional response:** GOP lawmakers threatened to "scrap" the $16B contract unless the "deeply flawed" EHR was fixed

Sources: [GAO-18-208 – VA Health IT Modernization: Historical Perspective](https://www.gao.gov/products/gao-18-208), [Veterans Affairs Wasted Closer to $2 Billion – Nextgov/FCW](https://www.nextgov.com/modernization/2018/01/veterans-affairs-wasted-almost-2-billion-failed-it-projects/145626/), [How VA Spent $1.1B in 6 Years – FedScoop](https://fedscoop.com/va-spent-1-1b-5-years-ehrs-now-trying-replace/), [VA Renegotiates $10B Oracle Cerner Contract – Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/va-renegotiates-10b-ehr-contract-stronger-performance-metrics-bigger-penalties), [GOP Lawmakers Ready to Scrap $16B Contract – Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/gop-lawmakers-ramp-pressure-va-and-oracle-cerner-fix-16b-ehr-project), [GAO-23-106785 – Electronic Health Records Challenges](https://www.gao.gov/assets/gao-23-106785.pdf)

---

## 10. Current State

**VistA Is Not Going Away:** As of 2024–2025, VistA remains the authoritative source of veteran health data. The VA successfully migrated VistA to the cloud in July 2024. VistA comprises **over 130 instances** supporting VA medical centers and outpatient clinics nationwide.

**VaaS (VistA as a Service):** The VA maintains VistA through a Software-as-a-Service model called VaaS, which provides cloud-hosted maintenance, operations, and hosting. This reduces costs compared to in-house maintenance and enables the VA to reallocate resources toward EHRM deployment.

**EHRM Deployment Status:** Oracle Health EHR is operational at only 5 VA sites. The remaining 166+ facilities continue running VistA. VA officials have characterized current EHRM budgets as "maintenance budgets" but emphasize that a single interoperable health record (communicating with DoD) remains the goal.

**Long-Term Outlook:** The VA acknowledged that VistA will remain in use for **up to 10 years** amid the paused Oracle Cerner rollout. Even at sites where Oracle Health is deployed, VistA continues to run alongside it during transition periods.

Sources: [VA to Use Legacy VistA EHR for Up to 10 Years – TechTarget](https://www.techtarget.com/searchhealthit/news/366578278/VA-to-Use-Legacy-VistA-EHR-for-Up-to-10-Years-Amid-Paused-Oracle-Cerner-EHRM), [VA Secretary: Oracle Health EHR Rollout to Resume – Healthcare IT News](https://www.healthcareitnews.com/news/va-secretary-oracle-health-ehr-rollout-resume-2025), [VA EHR Modernization Roadmap – Federal News Network](https://federalnewsnetwork.com/commentary/2025/04/the-va-ehr-modernization-roadmap-under-the-trump-administration/)

---

## 11. Key Technical Innovations

### RPC Broker (Remote Procedure Call Broker)
The RPC Broker is the middleware layer that enables client applications (like CPRS) to communicate with M servers. It bridges a Delphi GUI front-end on the client workstation to M-based data and business rules on the server, linking programs written in different languages. It includes security features such as "RPC Broker Context" options that govern which remote procedures an application can call.

### Kernel
VistA's **Kernel** provides the foundational operating environment for all VistA applications. It includes:
- **User management and authentication**
- **Device management** (printer routing, terminal handling)
- **Option/menu driver** (the hierarchical menu system for roll-and-scroll applications)
- **TaskMan** (background job scheduler)
- **MailMan** (built-in electronic mail system, operational since the early 1980s — before commercial email was common)
- **Alerts** and **Parameters** systems

### KIDS (Kernel Installation and Distribution System)
Introduced with Kernel 8.0, KIDS is VistA's package management system. It supports two functions — **distribution** and **installation**:
1. A developer creates **transport globals** from **build entries** stored in the BUILD (#9.6) file
2. KIDS writes the global to an HFS file in a KIDS-specific format
3. The file is distributed via FTP, diskette, or tape
4. On the receiving system, a user loads the distribution (creating an entry in the BUILD file and placing data into `^XTMP("XPDI",<IEN>)`), then installs the package

This provided a standardized, reproducible mechanism for distributing patches and updates across 130+ VA sites — essentially a package manager decades before `npm` or `apt`.

### HL7 Messaging
VistA uses **HL7** (Health Level Seven) for inter-system communication, both within VistA packages (event-driven messaging among modules participating in CPRS) and with external systems. VistA's HL7 implementation includes both the traditional HL7 engine and **HLO** (HL7 Optimized).

### VistA Application Scale
VistA consists of **over 180** integrated clinical, financial, and administrative applications, including pharmacy, radiology, laboratory, surgery, mental health, dietetics, prosthetics, engineering, fiscal management, and many more.

Sources: [RPC Broker 1.1 Technical Manual (VA)](https://www.va.gov/vdl/documents/Infrastructure/Remote_Proc_Call_Broker_(RPC)/xwb_1_1_tm.pdf), [VistA Kernel – Hardhats](https://www.hardhats.org/kernel/html/index.html), [KIDS – Vista Expertise Network](http://vistaexpertise.net/vista/whitepapers/kids-v9-2020/), [KIDS User Guide (VA)](https://www.va.gov/vdl/documents/Infrastructure/Kernel/krn_8_0_sm_kids_ug.pdf), [VistA Kernel – lloydm.net](https://www.lloydm.net/Kernel/reduced_VistA.html)

---

## 12. Cultural Significance

**Government Can Build World-Class Software:** VistA stands as perhaps the most significant example of a government-built software system that outperformed commercial alternatives. In July 2006, the VA received the **Innovations in American Government Award** from the **Ash Institute of the John F. Kennedy School of Government at Harvard University** for VistA's development.

**The Hardhats Community:** The original VistA developers called themselves the "Hardhats" — a name reflecting the construction metaphor of building something tangible and durable. The Hardhats virtual organization comprises many of the original VistA architects and experts who share their time, knowledge, and historical perspective. The community maintains the [Hardhats Google Group](https://groups.google.com/g/Hardhats) and [hardhats.org](https://www.hardhats.org), and continues to maintain technical fixes that are, when possible, sent back to the VA.

**A Programmer-Led Counter-Culture:** VistA was a programmer-led counter-culture within the VA. Programmers and administrators often risked their jobs — and some lost them — to develop a system that would satisfy clinical needs rather than bureaucratic requirements. This bottom-up, clinician-developer collaborative approach produced software that consistently ranked higher in user satisfaction than systems costing orders of magnitude more.

**Ecosystem Potential:** Analysts concluded that "if done correctly, the VistA software could form the basis of a thriving ecosystem that would drive down cost and unleash innovation in healthcare." The open-source releases proved this by spawning international deployments and private-sector adaptations.

**Enduring Irony:** The system that VA management tried to kill in the late 1970s became the foundation of what multiple studies identified as the best healthcare system in America by the early 2000s. And now, after spending an estimated $37 billion to replace it, VistA continues to run at 166+ VA facilities with no end date in sight.

Sources: [What is VistA Really – VistApedia](https://vistapedia.net/index.php/What_is_VistA_Really), [VistA Hardhats Organization – Open Health News](https://www.openhealthnews.com/content/vista-hardhats-organization), [VistA & the Underground Railroad – Open Health News](https://www.openhealthnews.com/hotnews/vista-underground-railroad), [VistA – Wikipedia](https://en.wikipedia.org/wiki/VistA), [History of IT at VA – DigitalVA](https://www.oit.va.gov/about/history.cfm)
