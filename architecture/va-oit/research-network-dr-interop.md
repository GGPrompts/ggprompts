# VA Network Infrastructure, DR/COOP & Interoperability — Architecture Research

## 1. VA Wide Area Network (WAN)

The VA operates one of the largest WANs in the federal government, connecting over 1,200 facilities including 146 VA Medical Centers (VAMCs), 772+ Community Based Outpatient Clinics (CBOCs), 56 Regional Offices, and 155 national cemeteries across 19 Veterans Integrated Service Networks (VISNs).

The WAN backbone has historically relied on MPLS circuits provided by major carriers. In **June 2021**, AT&T was awarded a **$725 million, 12-year task order** under the GSA Enterprise Infrastructure Solutions (EIS) contract to modernize VA's IP-based data network with WAN, VPN, and managed network services.

VA infrastructure standards specify **1 GbE connectivity** to desktops and end-user devices, with end-to-end latency from user desktops to data centers of **90ms or less**. The VA has been systematically replacing legacy **T-1 circuits** with **Metro-Ethernet (Metro-E) fiber optic** connections, starting with NCA facilities in 2020.

**Sources:**
- [AT&T Selected for $725M Agreement to Modernize VA Data Network](https://www.prnewswire.com/news-releases/att-selected-for-725-million12-year-agreement-to-modernize-us-dept-of-veterans-affairs-data-network-301309048.html)
- [VA Awards $725M EIS Contract to AT&T - FedScoop](https://fedscoop.com/va-att-eis-task-order/)
- [NCA Infrastructure Modernization - DigitalVA](https://digital.va.gov/general/nca-infrastructure-modernization-series-data-network-circuits-gaining-momentum/)

---

## 2. SD-WAN Migration

In **May 2023**, Verizon was awarded a **$448.3 million, 9-year Enterprise Mobile Devices and Services (EMDS 2) contract** that includes wider adoption of **Mobile Edge Compute (MEC) and SD-WAN** technology for VA facilities. This complements the AT&T EIS contract for the core WAN backbone.

The AT&T $725M EIS task order (2021) also encompasses modernization from legacy MPLS to IP-based networking with SD-WAN capabilities. All three major U.S. wireless carriers now provide devices and services to VA medical centers, CBOCs, field offices, and remote users.

**Sources:**
- [Verizon Lands $448.3M Veterans Affairs Contract](https://www.verizon.com/about/news/verizon-lands-4483m-veterans-affairs-contract)
- [AT&T Wins Big with Veterans Agency - Network World](https://www.networkworld.com/article/2302829/at-t-wins-big-with-veterans-agency.html)

---

## 3. TIC 3.0 (Trusted Internet Connections)

VA's TIC compliance is governed by **VA Directive 6513** and **VA Handbook 6513** (Secure External Connections), which require all external network connections to route through VA TIC Gateways. Under **TIC 3.0** (per OMB M-19-26, September 2019), agencies gained flexibility to adopt modern security concepts including zero trust architecture. CISA's TIC 3.0 core guidance comprises five volumes: Program Guidebook, Reference Architecture, Security Capabilities Catalog, Use Case Handbook, and Overlay Handbook.

**Sources:**
- [VA Directive 6513 - Secure External Connections](https://www.va.gov/vapubs/viewPublication.asp?Pub_ID=884&FType=2)
- [TIC 3.0 Core Guidance Documents - CISA](https://www.cisa.gov/resources-tools/resources/trusted-internet-connections-tic-30-core-guidance-documents)

---

## 4. VA Network and Security Operations Centers

**VA Cybersecurity Operations Center (CSOC):** 24/7/365 monitoring and response. In **October 2023**, Maveris (veteran-owned small business) won a **$333.1 million task order** to operate the VA CSOC.

**VA Integrated Operations Center (IOC):** The Department's "fusion point" — single office responsible for collecting, analyzing, planning, and disseminating information to stakeholders. Exchanges information with federal, state, and local partners via the **Homeland Security Information Network (HSIN)**.

**Sources:**
- [VA Integrated Operations Center - OSP](https://www.osp.va.gov/Integrated_Operations_Center.asp)
- [VA Awards $331M Cyber Center Task Order - Washington Technology](https://www.washingtontechnology.com/contracts/2023/10/veterans-affairs-awards-331m-cyber-center-task-order/391075/)

---

## 5. Facility Connectivity

VA facilities connect through a tiered architecture:
- **VAMCs** (146 medical centers): Primary hubs within each of the 19 VISNs, with high-bandwidth Metro-E/fiber connections
- **CBOCs** (772+ clinics): Connected back to their parent VAMC; historically via T-1 lines, now being upgraded to Metro-Ethernet
- **Regional Benefit Offices** (56): Connected via the enterprise WAN for benefits processing
- **National Cemeteries** (155): Actively being upgraded from T-1 to Metro-E fiber circuits (2020-ongoing)
- **Vet Centers** (~300): Smaller outpatient locations connected via the WAN

---

## 6. VPN / Remote Access

VA provides three primary remote access methods:

- **Cisco AnyConnect VPN (RESCUE):** For Government Furnished Equipment (GFE) only. Pre-installed on all GFE laptops. Establishes an encrypted SSL VPN tunnel.
- **Citrix Access Gateway (CAG):** For users without GFE. Provides access to general applications such as email and chat via a browser-based virtual desktop.
- **Azure Virtual Desktop (AVD):** A newer option providing cloud-based virtual desktop infrastructure.

Security requirements include PIV card authentication. Telework is governed by **VA Handbook 5011/26/31 Part II Chapter 4**, requiring **VA Form 0740** Telework Agreement and TMS training completion.

**Sources:**
- [VA Remote Access - Employee Resource Center](https://digital.va.gov/employee-resource-center/remote-access/)
- [Steps to Log into the VA Network via Remote Access (PDF)](https://www.va.gov/files/2023-08/Steps%20to%20log%20into%20the%20VA%20network%20via%20Remote%20Access.pdf)

---

## 7. Wi-Fi Infrastructure

VA facilities operate separate wireless networks:

- **Veterans Guest Internet Access (VGIA):** Public Wi-Fi for patients and visitors. Separate from the enterprise OIT network and does not carry patient healthcare information.
- **Clinical/Enterprise Wi-Fi:** Secured network for staff and clinical devices, managed under OIT governance per **VA Directive 6512**.
- **Technical Standards:** Facilities use **802.11ac Wave 2** access points with integrated virtual Bluetooth LE and IoT capabilities.

Orlando VA deployed Juniper/Mist AI-driven wireless infrastructure. The Atlanta VA Medical Center is receiving a new Wi-Fi system as part of 2025 infrastructure improvements.

**Sources:**
- [Orlando VA Case Study - Juniper Networks](https://www.juniper.net/us/en/customers/orlando-veterans-administration-va-case-study.html)
- [VA RFI: Public WiFi Refresh - FedHealthIT](https://www.fedhealthit.com/2021/12/va-rfi-public-wifi-network-equipment-refresh-upgrade/)

---

## 8. Enterprise Transport System (ETS) / Core Network Backbone

The VA's core network backbone is managed under the **AT&T EIS task order** ($725M/12yr). Key backbone nodes include:
- **Austin Information Technology Center (AITC)** - Primary data center hub in Austin, TX
- **Hines, IL** - Benefits delivery center with OC-3 backup connection to Austin
- **Philadelphia, PA** - Benefits delivery center with OC-3 backup connection to Austin
- **Culpeper, VA** and **Martinsburg, WV** - Additional data center facilities

---

## 9. Continuity of Operations Plan (COOP)

VA's COOP framework is governed by **VA Handbook 0320**, managed by the **Office of Operations, Security, and Preparedness (OSP)**, specifically the Office of Emergency Management and Resilience (OEMR). Key elements:

- **Activation Timeline:** COOP plan must sustain mission essential functions within **12 hours** and for up to **30 days** before returning to normal operations.
- **Recovery Objectives:** Establishes Maximum Tolerable Downtimes (MTDs), Recovery Point Objectives (RPOs), Recovery Time Objectives (RTOs), and Work Recovery Times (WRTs) for all VA information systems.
- **DR-COOP Team:** OIT's Disaster Recovery team travels nationwide responding to any disaster threatening vital VA operations.
- **Testing Requirements:** Quarterly testing of COOP communications capabilities; annual testing of primary and backup infrastructure at alternate facilities.

**Sources:**
- [VA Handbook 0320 - COOP](https://www.va.gov/vapubs/viewPublication.asp?Pub_ID=77&FType=2)
- [VA's IT Emergency Response Teams - VA News](https://news.va.gov/141735/emergency-response-teams-are-always-at-the-ready/)

---

## 10. Data Center Strategy

**Primary Facilities:**
- **Austin Information Technology Center (AITC)**, Austin, TX: One of VA's largest core data centers. Houses the Corporate Data Warehouse (CDW).
- **Hines, IL:** VBA benefits delivery center with OC-3 remote data vaulting connection to Austin.
- **Philadelphia, PA:** VBA benefits delivery center with OC-3 backup to Austin.
- **Martinsburg, WV:** Standalone data center site.
- **Culpeper, VA:** Additional data center facility.

**Consolidation Efforts:** VA evaluated **376 nationwide data centers** for consolidation, closed 24 in less than a year, and was on track to close **92 data centers total by end of FY2018**. A VA OIG report found "lost opportunities for efficiencies and savings."

**Sources:**
- [Data Center Consolidation - 2017 Year in Review - DigitalVA](https://www.oit.va.gov/reports/year-in-review/2017/index.cfm?v=modernization&project=dcc)
- [Lost Opportunities During Data Center Consolidation - VA OIG](https://www.vaoig.gov/reports/audit/lost-opportunities-efficiencies-and-savings-during-data-center-consolidation)

---

## 11. VistA Instance Resilience

Enterprise VistA is deployed across VHA at more than **1,500 sites of care**. Each VAMC historically runs its own VistA instance with local databases.

**Cloud-Based Resilience:** VistA is being hosted in the VAEC-AWS environment with both **production and Disaster Recovery instances** (FY2025 PIA).

**Emergency Procedures:** When a VAMC's VistA system goes down, VISN and VAMC emergency managers activate continuity protocols. **Alternate Care Sites** can be established when access to VA clinics is impeded. Downtime procedures include paper-based fallback processes.

**Sources:**
- [VistA VAEC-AWS PIA (FY2025)](https://department.va.gov/privacy/wp-content/uploads/sites/5/2025/03/FY25VistAVAECAWSPIA.pdf)
- [Enterprise VistA PIA (FY2024)](https://department.va.gov/privacy/wp-content/uploads/sites/5/2024/04/FY24EnterpriseVeteransHealthInformationSystemsandTechnologyArchitectureEnterpriseVistAPIA.pdf)

---

## 12. Cloud DR (VAEC)

The **VA Enterprise Cloud (VAEC)** uses two FedRAMP High-authorized Cloud Service Providers:
- **Amazon Web Services (AWS)** — including AWS GovCloud and AWS Commercial
- **Microsoft Azure** — Commercial and Government offerings across **5 regions** in Texas, Arizona, and Virginia

**Scale:** Over **757 agency applications and systems** hosted in VAEC. Over 410 systems in various stages of migration.

**Disaster Recovery:** AWS GovCloud enables DR via **AWS Elastic Disaster Recovery** and **AWS Backup**. Multi-region deployment provides inherent redundancy.

**Sources:**
- [VAEC GovCloud Deployment Model (PDF)](https://digital.va.gov/wp-content/uploads/2023/01/CCAEDP_GovCloud_v1.pdf)
- [Cloud-Based Solutions to Better Serve Veterans - DigitalVA](https://digital.va.gov/operational-excellence/cloud-based-solutions-to-better-serve-veterans/)

---

## 13. Pandemic COOP Lessons

COVID-19 stress-tested VA's continuity plans at unprecedented scale:

- **Telework Surge:** VA went from **30,000-40,000** daily remote workers to **~140,000 per day**. Remote access capacity expanded from **120,000 to 240,000 users** in two months. Over **415,000 staff and contractor personnel** shifted to telework.
- **Equipment Deployment:** VA shipped **16,000+ laptops** and **7,500 iPhones**.
- **Telehealth Explosion:** Video visits surged from **~2,000/day to 20,000/day** — a **3,000% growth**.
- **Lessons Learned:** Prior telehealth experience, provider training, and staff champions were key facilitators.

**Sources:**
- [Telework Capacity Quadruples During Pandemic - Federal News Network](https://federalnewsnetwork.com/veterans-affairs/2020/05/telework-capacity-quadruples-during-pandemic-va-says/)
- [VA's Digital Transformation Helped Quick Pivot - Nextgov/FCW](https://www.nextgov.com/modernization/2020/06/vas-digital-transformation-efforts-helped-it-quickly-pivot-increased-remote-work/165884/)

---

## 14. Backup Communications

The VA's **DR-COOP team** deploys:
- **Satellite Technology:** Geostationary satellite links for emergency phone and internet
- **Mobile Hotspots:** Devices providing network access for **up to 30 computers** per unit
- **Emergency Equipment Kits:** Laptops, satellite communications equipment, and wireless routers
- **Satellite Phones:** VA maintains an inventory (though a 2021 OIG finding noted VA could not locate **$700K worth of satellite phones**)
- **Testing Cadence:** COOP comms tested **quarterly**; DR infrastructure tested **annually**

**Sources:**
- [OIT Provides Temporary Emergency Communications - DigitalVA](https://digital.va.gov/general/oit-provides-temporary-emergency-communications-in-disaster-situations/)
- [VA Can't Locate $700K Worth of Satellite Phones - Nextgov/FCW](https://www.nextgov.com/cio-briefing/2021/09/va-cant-locate-700k-worth-satellite-phones/185420/)

---

## 15. Joint Health Information Exchange (JHIE/JLV)

The **Joint HIE**, formerly VLER HIE, was launched in **April 2020** by the **Federal Electronic Health Record Modernization (FEHRM)** office. Connects DoD, VA, USCG, and NOAA health systems.

**Data Shared:** Prescriptions, allergies, illnesses, lab/radiology results, immunizations, procedures, clinical notes.

**Joint Longitudinal Viewer (JLV):** Primary tool for cross-agency providers to view shared data.

**Scale:** Over **46,000 community partners**. Expanded in **October 2024** to include CommonWell Health Alliance adding **15,000+ hospitals and clinics**.

**Sources:**
- [Joint Health Information Exchange - FEHRM](https://www.fehrm.gov/joint-health-information-exchange/)
- [VA Expands HIE to 15,000 More Facilities - FedScoop](https://fedscoop.com/electronic-health-records-va-dod-additions/)

---

## 16. Federal Health Information Exchange (FHIE)

Completed in **2004** as a one-way electronic transfer from DoD EHR to VA for all separated service members. Evolved into **BHIE** (Bi-Directional) with XML-based protocol adapters. Largely superseded by the modern joint HIE (2020).

---

## 17. SSA/IRS Interfaces

VA maintains data exchange interfaces for **means testing and income verification**:

- **Legal Authority:** Title 26 U.S.C. 6103(l)(7) and 38 U.S.C. 5317
- **Process:** The **Health Eligibility Center (HEC)** in Atlanta conducts computer matches with IRS and SSA
- **Purpose:** Determines eligibility, copayment status, and enrollment priority group
- **Governance:** VHA Directive 1909(1) governs the Income Verification Match (IVM) program

**Sources:**
- [IB 10-439 Income Verification Fact Sheet (PDF)](https://www.va.gov/HEALTHBENEFITS/resources/publications/IB10-439_Income_Verification.pdf)
- [VHA Directive 1909(1)](https://www.va.gov/vhapublications/ViewPublication.asp?pub_ID=8867)

---

## 18. VHIE (Veterans Health Information Exchange)

Rebranded from VLER Health. Provides secure electronic health information sharing:

- Connected to **314+ eHealth Exchange members**
- Connected to **483 Direct Secure Messaging partners**
- Joined **CommonWell Health Alliance** (15K+ hospitals/clinics)
- Pursuing **Carequality** interoperability framework
- Anticipating **TEFCA** (Trusted Exchange Framework) early adoption

Two channels: **VA Exchange** (organizational) and **VA Direct Messaging** (provider-to-provider).

**Sources:**
- [VHIE Home](https://www.va.gov/vhie/vhie_participating_partners.asp)
- [VHIE Successes and Challenges - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6371252/)

---

## 19. Carequality / CommonWell Participation

- **eHealth Exchange:** VA is a longstanding member (314+ members)
- **CommonWell:** Added October 2024 (15K+ hospitals)
- **Carequality:** Active work with DoD on participation
- **TEFCA:** VA expressed intent to be an early adopter

---

## 20. FHIR Adoption

VA has adopted **HL7 FHIR R4** through the **Lighthouse API Platform** (launched March 2018):

- **Patient Health API (FHIR):** Conforms to Argonaut FHIR standards; aggregates CDW, VistA, HDR, MPI, Oracle Health data
- **21st Century Cures Act Compliance:** Open API and FHIR standards
- **Challenges:** Converting legacy data to FHIR required resolving medication workflow differences, mapping VA-specific vocabularies, managing different access constraints

**Sources:**
- [VA API Platform - developer.va.gov](https://developer.va.gov/)
- [Patient Health API Documentation](https://developer.va.gov/explore/api/patient-health/docs)
- [Lighthouse FHIR API PIA (FY2025)](https://department.va.gov/privacy/wp-content/uploads/sites/5/2025/02/FY25LighthouseFastHealthcareInteroperabilityResourcesAPIPIA.pdf)
