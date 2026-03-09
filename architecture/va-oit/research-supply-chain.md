# VA Supply Chain, Logistics & Pharmaceutical Distribution — Architecture Research

## 1. VA Supply Chain Organization — OPAL

The **Office of Procurement, Acquisition and Logistics (OPAL)** sits under the **Office of Acquisition, Logistics, and Construction (OALC)**, headed by an Executive Director. OPAL consists of these major components:

- **National Acquisition Center (NAC)** — Hines, IL. Manages healthcare procurement: Federal Supply Schedule contracts, national contracts, and blanket purchase agreements for pharmaceuticals and healthcare products.
- **Strategic Acquisition Center (SAC)** — Manages complex non-IT enterprise-wide acquisitions, including the Medical/Surgical Prime Vendor (MSPV) program.
- **Technology Acquisition Center (TAC)** — Eatontown, NJ. IT lifecycle management and enterprise-wide technology acquisitions.
- **Denver Logistics Center (DLC)** — Prosthetics, hearing aids, sensory aids distribution.
- **Logistics Support Service** — Washington, DC. Freight management, employee relocations, publications, small package delivery.
- **Category Management Support Office** — Washington, DC. Department-wide category management initiatives and data analytics.
- **Front Office Operations** — Acquisition advocacy, vendor/customer support, senior acquisition staff resolving complex issues.

VA has one of the largest acquisition functions in the federal government, with **over $34 billion obligated in FY2021** (per GAO). VA acquisition management has been on the **GAO High-Risk List** due to longstanding challenges.

**Sources:**
- [OPAL Main Page](https://www.va.gov/OPAL/index.asp)
- [OPAL About Us](https://www.va.gov/opal/about/index.asp)
- [NAC](https://www.va.gov/opal/nac/index.asp)
- [SAC](https://www.va.gov/opal/sac/index.asp)
- [GAO High Risk - VA Acquisition Management](https://www.gao.gov/highrisk/va-acquisition-management)

---

## 2. VistA Supply Chain Modules

VistA's supply chain capability is spread across several interconnected MUMPS/M-based packages:

### IFCAP (Integrated Funds Distribution, Control Point Activity, Accounting and Procurement)
The core procurement and financial module. Automates functions across Acquisition & Materiel Management (A&MM) and Fiscal Service. Sub-modules include:

| Module | Function | Primary Users |
|--------|----------|---------------|
| Funds Distribution | Budget allocation to control points | Accounting/Budget |
| Control Point Activity | Internal fund accounting at service level | Control Point Users |
| Procurement | Purchase order creation, RFQs | Acquisitions |
| Accounting | Obligation and payment processing | Accounting |
| Inventory | Stock management at warehouses | Logistics |
| RFQ | Request for Quotes | Acquisitions |
| Purchase Card | Government purchase card transactions | Control Point Users, Accounting |
| Delivery Orders | Order fulfillment tracking | Acquisitions |

IFCAP was designed to eliminate physical paper flow between departments. When funds are placed in a Control Point by the budget office, IFCAP automatically adjusts balances as spending requests are approved.

### GIP (Generic Inventory Package)
A module within the IFCAP system for inventory operations. Provides tiered control with standardized national, VISN, and VAMC business rules. The interface between GIP and supply stations is real-time — all transactions are sent immediately. Secondary inventory point storerooms are maintained at end-user areas as points of distribution.

### AEMS/MERS (Automated Engineering Management System / Medical Equipment Reporting System)
Shared between OAL and Engineering/Facilities Management Service. Manages non-expendable equipment from "cradle to grave."

### Prosthetics Inventory Package (PIP)
Manages prosthetics-specific inventory within the VistA ecosystem. Works alongside PSAS (Prosthetic and Sensory Aids Service) for ordering, tracking, and distribution.

### Key Integration Points
All these modules share VistA's FileMan database architecture. IFCAP integrates with FMS (Financial Management System) for obligation recording and with GIP for inventory transactions.

**Sources:**
- [IFCAP - VA Financial Services Center](https://www.fsc.va.gov/IFCAP.asp)
- [IFCAP Technical Manual (PDF)](https://www.va.gov/vdl/documents/Financial_Admin/IFCAP/PRC_TM.pdf)
- [GIP User Manual (PDF)](https://www.va.gov/vdl/documents/financial_admin/ifcap/ifcp5_1pou_manual.pdf)
- [VHA Directive 1761 - Supply Chain Inventory Management (PDF)](https://www.navao.org/wp-content/uploads/2016/11/VHA-Directive-1761-Supply-Chain-Inventory-Mgmt-10-24-16.pdf)

---

## 3. Pharmaceutical Operations

### Pharmacy Benefits Management Services (PBM)
PBM oversees the VA's national drug plan for **over 9.1 million enrolled veterans**. Manages the **VA National Formulary** (established May 1997, consolidating 170+ individual facility formularies). The VA's pharmacy operation is the largest integrated pharmacy system in the U.S.

Pharmaceutical spending has grown substantially: from approximately **$1 billion in FY1996** to over **$3 billion by FY2003**, with continued growth since. The VA FSS program reported **$21 billion in pharmaceutical sales in FY2024**, up from $19B in FY2023, $16B in FY2022, and $13B in FY2018.

### Consolidated Mail Outpatient Pharmacy (CMOP)
Seven highly automated mail-order pharmacies that fill **~80-84% of all VA outpatient prescriptions** — over **117 million prescriptions per year** (FY2024/2025 data):

| CMOP Location | Region Served |
|---------------|---------------|
| Chelmsford, MA | Northeast |
| Hines, IL | Midwest |
| Leavenworth, KS | Central |
| Murfreesboro, TN | Southeast |
| North Charleston, SC | Mid-Atlantic |
| Lancaster, TX | South Central |
| Tucson, AZ | Southwest (~23.2M Rx in FY2023, projected 23.8M in FY2024) |

CMOPs employ automated robotic dispensing systems, conveyor systems, and human pharmacist verification. Every prescription is checked by a VA pharmacist before shipping via USPS, UPS, FedEx, or DHL.

The **CMOP VistA software package (version 2.0)** interfaces with the local pharmacy VistA system — prescriptions are electronically transmitted from VA medical centers to the assigned CMOP for fulfillment.

### National Acquisition Center (NAC) — Pharmaceutical Contracts
Located in Hines, IL. Manages two tiers of pharmaceutical pricing:

1. **Federal Supply Schedule (FSS)** — Multi-year, multiple-award contracts using "most favored customer" pricing. Over 1,574 contracts with ~$19B in annual sales across all categories. Pharmaceutical pricing data updated on the 2nd and 16th of each month.
2. **National Contracts** — Requirement-type contracts offering additional pricing concessions beyond FSS, used for VA standardization. Prices are lower than FSS.
3. **Contract Catalog Search Tool (CCST)** — Online catalog of all healthcare products available via NAC contract vehicles.

### Pharmaceutical Prime Vendor (PPV) Program
Mandatory for all VA ordering activities. Established in 1991 when VHA transitioned from depot/warehouse to prime vendor model (depots closed by Secretary in July 1993). **McKesson Corporation** is the current prime pharmaceutical supplier, servicing **750+ customers** including all VA medical centers, outpatient clinics, and CMOPs across the U.S., Philippines, Puerto Rico, Saipan, and the Virgin Islands. Uses just-in-time inventory processes and a proprietary web-ordering system.

### Federal Supply Schedule Pricing Advantage
The **Veterans Health Care Act of 1992 (Public Law 102-585)** requires pharmaceutical manufacturers to offer the VA prices no higher than the Federal Ceiling Price (FCP), which is 76% of the non-federal average manufacturer price (non-FAMP). This gives VA significantly lower drug prices than most other purchasers. A **GAO report (GAO-21-111)** found VA paid approximately half as much as Medicare Part D for common brand-name drugs.

**Sources:**
- [VA PBM Home](https://www.pbm.va.gov/)
- [VA National Formulary](https://www.pbm.va.gov/nationalformulary.asp)
- [CMOP Wikipedia](https://en.wikipedia.org/wiki/Consolidated_Mail_Outpatient_Pharmacy)
- [VA Mail Order Pharmacy](https://www.pbm.va.gov/pbm/cmop/va_mail_order_pharmacy.asp)
- [VA OIG Audit of CMOP Program](https://www.vaoig.gov/reports/audit/audit-vhas-consolidated-mail-outpatient-pharmacy-program)
- [NAC Pharmaceutical Prices](https://www.va.gov/opal/nac/fss/pharmprices.asp)
- [PPV Program](https://www.va.gov/opal/nac/ncs/ppv.asp)
- [GAO-21-111: VA Drug Pricing (PDF)](https://www.gao.gov/assets/gao-21-111.pdf)

---

## 4. Defense Logistics Agency (DLA) Integration

### DLA Troop Support — Medical Supply Chain
DLA Troop Support (headquartered in Philadelphia) partners with VA through several mechanisms:

- **Medical/Surgical Prime Vendor Program**: Uses a "just-in-time" commercial distribution model. A single prime vendor buys from numerous suppliers, manages warehouse inventory, and ships directly to VA hospitals on electronic order.
- **Pharmaceutical Value Engineering Partnership**: Since **2013**, DLA and VA have jointly negotiated pharmaceutical pricing. In **FY2024**, this partnership achieved approximately **$1 billion in cost avoidance** off commercial pricing. Cumulative cost avoidance since inception: approximately **$8.1 billion**. Individual drug savings can be dramatic — one acid reflux medication saw a 99.97% reduction from retail price.
- **Capital Equipment Joint Contract Program**: DLA Troop Support Medical and VA jointly contract for medical capital equipment, with results described as exceeding expectations.

**Sources:**
- [DLA-VA Pharmaceutical Value Engineering - $1B FY24](https://www.dla.mil/About-DLA/News/News-Article-View/Article/3937800/dla-troop-support-medical-pharmaceutical-value-engineering-partnership-with-va/)
- [DLA-VA Capital Equipment Joint Contract](https://www.dla.mil/About-DLA/News/News-Article-View/Article/3938200/troop-support-medical-va-capital-equipment-joint-contract-program-exceeds-expec/)
- [VA-DLA Centralized Procurement (Supply Chain Dive)](https://www.supplychaindive.com/news/va-defense-logistics-centralize-medical-procurement-cost/560991/)

---

## 5. Modernization Efforts

### Phase 1: DMLSS Deployment and Failure (2019-2022)
In **March 2019**, VA directed deployment of DoD's **Defense Medical Logistics Standard Support (DMLSS)** system to replace up to 12 legacy systems. Expected cost: **$2.2 billion over 15 years** (later reported as a **$2.6 billion interagency agreement** with DoD).

First pilot at **Jesse Brown VA Medical Center (Chicago)** deployed **August 4, 2020**. The VA OIG found it **failed to meet more than 40% of high-priority essential business requirements**. In **February 2022**, lawmakers urged cancellation. In **December 2022**, VA officially canceled future DMLSS deployments.

### Phase 2: Enterprise Supply Chain Modernization (2023-Present)
VA launched a new effort to replace **58 separate logistics and ordering systems** across VHA, VBA, and NCA with a single integrated platform. Key details:

- **Contract Vehicle**: Single-award IDIQ, initially estimated at **$5 billion** (later congressional estimates ranged **$9-15 billion** over 10 years).
- **MSPV Gen-Z V1**: In 2024, VA awarded 6 companies positions on a potential **$15 billion, 10-year IDIQ** (Medical/Surgical Prime Vendor Generation-Z Version 1) for distribution and supply management.
- **Congressional Scrutiny**: Rep. Matt Rosendale noted "there does not seem to be any approved budget." Cost estimates have been called "stratospheric."

**Sources:**
- [VA Cancels DMLSS Deployments (Nextgov)](https://www.nextgov.com/digital-government/2022/12/va-cancels-future-deployments-new-supply-chain-management-system/380841/)
- [VA Pivots from $2.6B DMLSS (Federal News Network)](https://federalnewsnetwork.com/contracting/2022/12/va-pivoting-away-from-2-6-billion-logistics-system-that-failed-to-meet-user-needs/)
- [$15B MSPV Gen-Z Award (GovCon Wire)](https://www.govconwire.com/articles/va-awards-6-spots-on-15b-medical-supply-management-support-idiq)
- [Cost Estimate "Stratospheric" (Stars and Stripes)](https://www.stripes.com/veterans/2024-04-10/veterans-affairs-multibillion-dollar-supply-management-system-13526283.html)

---

## 6. Denver Logistics Center (DLC)

Now called the **Denver Logistics Center (DLC)**, operating under NAC/OPAL. Manages holistic supply chain operations for:

### Commodities Distributed
- Hearing aids and accessories
- Cochlear implants
- Assistive listening devices
- Batteries (hearing aid)
- Prosthetic socks
- Orthotic soft goods
- Aids for the visually impaired
- Telehealth messaging hubs and peripherals

### Services
- **Hearing Aid Repair Program**: VA's only centralized repair facility
- **Direct-to-Veteran Shipping**: Veterans can order many items directly for home delivery
- **National Hearing Aid Program**: Centralized acquisition and distribution
- **National Telehealth Program**: Distribution of telehealth equipment

**Sources:**
- [Denver Logistics Center (DLC)](https://www.va.gov/opal/nac/dlc/index.asp)
- [About NAC DLC](https://www.va.gov/opal/about/nacdlc.asp)
- [PSAS Hearing Aids](https://www.prosthetics.va.gov/psas/hearing_aids.asp)

---

## 7. Medical/Surgical Prime Vendor (MSPV) Program

### Program Structure
A collection of contract vehicles managed by the **Strategic Acquisition Center (SAC)**. Uses a "just-in-time" logistics model combined with strategic sourcing and volume buying.

### Scale and Coverage
- **Over 38,000 approved products** available via Supply BPAs
- Annual purchases: approximately **$700-800 million**, representing ~15% of VHA's **$5 billion annual medical supplies and equipment spend**
- **Current prime vendors**: Medline Industries (19 of 20 VISNs), Cardinal Health 200 LLC, Cardinal Health PR 220 LLC, Concordance Healthcare Solutions LLC, McKesson Medical-Surgical Government Solutions LLC
- **MSPV Gen-Z V1** (2024): Next-generation contract, 6 awardees on a **$15B potential 10-year IDIQ** with 5-year base + 5-year option

### OIG Findings
VA OIG found **"Ineffective Use and Oversight of Medical/Surgical Prime Vendor Program Led to Increased Spending"** — facilities were not properly using the program, and oversight of distribution fee invoicing was inadequate.

**Sources:**
- [MSPV Program (OPAL)](https://www.va.gov/opal/sac/mspv.asp)
- [OIG: Ineffective MSPV Use](https://www.vaoig.gov/reports/audit/ineffective-use-and-oversight-medicalsurgical-prime-vendor-program-led-increased)

---

## 8. Spend Analysis

### Overall Procurement
- **$34+ billion obligated in FY2021** (GAO)
- **$46 billion from FY2013-FY2015** on goods and services
- VA's total budget authority: **$307.31 billion in FY2024** (57% mandatory, 43% discretionary)

### Top Procurement Categories
| Category | Approximate Annual Spend |
|----------|-------------------------|
| Pharmaceuticals (FSS sales) | ~$21B (FY2024) |
| Medical/Surgical Supplies (MSPV) | ~$700-800M |
| Total Medical Supplies & Equipment | ~$5B |
| IT & Technology | Multi-billion (TAC-managed) |

### Cost Savings Mechanisms
- Federal Supply Schedule pricing (most-favored-customer basis)
- National Contracts (additional concessions beyond FSS)
- DLA pharmaceutical value engineering: **$1B cost avoidance in FY2024**, **$8.1B cumulative since 2013**
- VA pays approximately **half** what Medicare Part D pays for common brand-name drugs (GAO-21-111)

---

## 9. eCommerce / eProcurement Systems

### Electronic Contract Management System (eCMS)
VA's primary procurement IT platform. Components include:
- **AAMS** (Automated Acquisition Management System)
- **FORCE** (Federal Ordering and Requirements Certification Environment)
- **OOM** (Online Order Management)
- **eCERT** / **eCOR** (electronic certification and COR management)
- **Vendor Portal (VP)** — external-facing portal for vendors
- **ATOMS** (Acquisition Tracking and Operations Management System)
- **EPIC** (Enterprise Procurement Information Center)

**OIG Audit Finding**: eCMS is "not used effectively and procurement information in eCMS is incomplete."

**Sources:**
- [VA OIG: Audit of eCMS](https://www.vaoig.gov/reports/audit/audit-va-electronic-contract-management-system)
- [NAC Contract Catalog Search Tool](https://www.vendorportal.ecms.va.gov/nac)

---

## 10. Inventory Management Challenges

### GAO High-Risk Designation
- VA **lacks a comprehensive supply chain management strategy**
- **22 open GAO recommendations** remained unaddressed (as of 2023)
- VA does not have complete data on its **acquisition workforce**

### COVID-19 Pandemic Exposure
- OIG found VHA could not accurately report PPE inventory levels
- None of 16 assessed facilities used MSPV emergency supply strategies before the pandemic
- When prime vendors could not fulfill orders, staff bought on the open market at higher prices
- VA responded by establishing **central storage facilities** for critical medical supplies

### Systemic Issues
- **58 separate logistics and ordering systems** across VHA, VBA, and NCA
- No single system of record for supply chain data
- Manual workarounds remain common at facility level

**Sources:**
- [GAO: VA Acquisition Management High Risk](https://www.gao.gov/highrisk/va-acquisition-management)
- [GAO-21-445T: Comprehensive Strategy Needed](https://www.gao.gov/products/gao-21-445t)
- [GAO-21-280: COVID Procurement / Supply Chain Modernization](https://www.gao.gov/products/gao-21-280)
- [OIG: PPE Inventory During Pandemic](https://vaoig.gov/reports/review/reporting-and-monitoring-personal-protective-equipment-inventory-during-pandemic)
