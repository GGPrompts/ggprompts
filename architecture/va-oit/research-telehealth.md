# VA Telehealth & Connected Care — Research Findings

## 1. VA Video Connect (VVC) — Pexip-Based Video Platform

**Platform Architecture:** VVC is built on Pexip Infinity, a software-defined video conferencing platform. Pexip provides the underlying video engine; VA's Office of Connected Care developed VVC as a custom telehealth application on top of it.

**Deployment model:** Pre-pandemic, VVC was hosted on-premises within VA data centers. During COVID-19, VA stood up a duplicate cloud environment to handle demand, and the cloud-based deployment became the primary production environment. Pexip Infinity can be deployed on any compatible server — from air-gapped on-premises data centers to sovereign, private, or public clouds, or hybrid configurations.

**Scale:** At peak pandemic usage (2020), VVC reached approximately 170,000 weekly video visits — a 1,000% increase from pre-pandemic levels. By FY2019 (pre-COVID), there were only ~294,000 total VVC appointments for the entire year (~99,000 unique veterans), with 235% year-over-year growth. By FY2025, over 2.1 million veterans received care through more than 11.7 million video-to-home visits.

**How appointments work:** Providers schedule via Virtual Care Manager (VCM), which integrates with both VistA and Oracle Health (Federal EHR) credentials. Veterans receive up to five email notifications (at scheduling, 14 days, 7 days, 1 day, and day-of) from `video.appointment@va.gov`. The day-of email contains a clickable link that opens VVC in-browser (Windows, macOS, Android) or the native iOS/Android app. An "VVC Now" mode allows providers to immediately text/email a link for ad-hoc visits.

**Security & compliance:** Pexip Government Cloud received FedRAMP Authority to Operate (ATO) at Moderate Impact level (April 2023). Encryption uses CMVP-validated FIPS 140-2 suite, with IPsecv3 between system nodes and TLS v1.2 / DTLS at the transport layer. Minimum bandwidth: 3G/4G cellular with at least 2 connection bars.

**VA TRM status:** Pexip Infinity, Pexip Infinity Connect (Desktop), Pexip Infinity Connect Mobile, Pexip Teams Connector, and Pexip Screensharing Extension are all listed in VA's Technical Reference Model (TRM) at `oit.va.gov/Services/TRM/`.

**Sources:**
- [Pexip Customer Story: VA Video Connect](https://www.pexip.com/customer-stories/veteran-affairs-va-video-connect-application)
- [VA Mobile: VA Video Connect](https://mobile.va.gov/app/va-video-connect)
- [FedTech: Upgraded Videoconferencing Equipment](https://fedtechmagazine.com/article/2022/10/upgraded-videoconferencing-equipment-helps-va-provide-services-distance)
- [Pexip Government Cloud FedRAMP Authorization](https://www.pexip.com/blog/government-cloud-achieves-fedramp-authorization)
- [VA TRM: Pexip Infinity](https://www.oit.va.gov/Services/TRM/ToolPage.aspx?tid=9051)
- [VA Video Connect Web User Guide (Feb 2025)](https://mobile.va.gov/sites/default/files/documents/VA%20Video%20Connect%20for%20Veterans%20Web%20User%20Guide.pdf)

---

## 2. Telehealth Expansion Post-COVID — Growth Statistics

**Pre-COVID baseline (FY2019):**
- 2.6 million total telehealth episodes of care
- ~900,000 unique veterans used telehealth
- 294,847 VVC video-to-home encounters
- ~99,000 veterans used VVC

**Pandemic surge (FY2020-2021):**
- Video-to-home encounters surged 3,147% from 294,847 (FY2019) to 9,575,958 (FY2021)
- In-person visits collapsed from 81% of all visits (Feb 2020) to 23% (May 2020)
- Telehealth peaked at 79.6% of all visits (April 2020)
- FY2021: 11.2 million telehealth episodes for 2.3 million veterans (98% increase over FY2020)

**Post-pandemic sustained levels (FY2023-2025):**
- FY2023: 11.6 million telehealth encounters, 2.4 million unique veterans (~40% of all veterans served)
- FY2025: 14.6 million episodes for 2.9 million veterans (10% year-over-year increase)
- Video visits stabilized at 11-13% of all visits (vs. 0.5% pre-pandemic) — a 2,300% increase over baseline
- Mental health: 34.5% of visits via video; primary care and subspecialty: ~3.5-3.7% via video (Aug 2023)
- 91.7% veteran satisfaction rate with VA telehealth
- Combined audio-only + video declined from peak of 79.6% (April 2020) to 36.7% (April 2023) as in-person resumed

**Three VA telehealth modalities:**

| Modality | Type | Description |
|----------|------|-------------|
| **Clinical Video Telehealth (CVT)** | Synchronous | Real-time video between patient (at CBOC or home) and provider at VA medical center |
| **VA Video Connect (VVC)** | Synchronous | Video-to-home via personal device; subset of CVT |
| **Store-and-Forward (SFT)** | Asynchronous | Images/data captured at one site, transmitted for specialist review elsewhere. Key programs: TeleRetinal Imaging, TeleDermatology, TelePathology |
| **Home Telehealth (HT)** | Remote monitoring | Chronic disease management via in-home devices with care coordinator oversight |

**Store-and-forward volumes:** 360,000 asynchronous eye and dermatology encounters from Oct 2022 to Sept 2023. TeleDermatology grew 279% over three years to 45,000 patients in FY2013. SFT programs (teleretinal, teledermatology) launched in 2005.

**Sources:**
- [TechTarget: Veterans' Use of Video-Based Telehealth 2,300% Higher](https://www.techtarget.com/virtualhealthcare/news/366596813/Veterans-Use-of-Video-Based-Telehealth-2300-Higher-Than-Pre-Pandemic)
- [VA Connected Care: FY2019 Telehealth Increase](https://connectedcare.va.gov/whats-new/technology/veterans-use-va-telehealth-services-increased-significantly-fiscal-year-2019)
- [VA News: VA Reports Significant Increase in Telehealth](https://news.va.gov/press-room/va-reports-significant-increase-in-veteran-use-of-telehealth-services/)
- [VHA 2023 Annual Report on Connected Care](https://connectedcare.va.gov/whats-new/technology/vha-2023-annual-report-shines-spotlight-connected-care)
- [VA Connected Care: Telehealth Used By More Than 2.2 Million](https://connectedcare.va.gov/whats-new/technology/va-telehealth-used-more-22-million-veterans)
- [VA Telehealth Types](https://telehealth.va.gov/types-telehealth)
- [PMC: 20 Years of Telehealth in VHA](https://pmc.ncbi.nlm.nih.gov/articles/PMC10937874/)
- [VA News: 91.7% Satisfaction](https://news.va.gov/144279/91-7-veterans-use-va-telehealth-are-satisfied/)

---

## 3. Office of Connected Care — Organizational Structure

**Parent organization:** Veterans Health Administration (VHA), under the Department of Veterans Affairs.

**Mission:** Improving health care through technology, overseeing VA's patient-facing digital health capabilities.

**Three major program areas:**
1. **VA Telehealth Services** — CVT, VVC, SFT, Home Telehealth/RPM
2. **My HealtheVet** — VA's patient portal
3. **VA Mobile** — Mobile app portfolio (VA Health and Benefits app, VVC app, etc.)

**Key leadership:**
- **Chief Officer:** Neil C. Evans, M.D. — oversees all Connected Care programs
- **Executive Director, Telehealth Services:** Kevin Galpin, M.D. — responsible for telehealth implementation and coordination across VA (currently also serving as Acting Chief Officer)
- **Additional roles:** Acting Executive Director for Connected Health; Deputy Director for Clinical Services for Telehealth Services

Both Dr. Evans and Dr. Galpin received FY2024 Presidential Rank Awards for their work.

**Legislative authority:** The VA MISSION Act of 2018 (S.2372, 115th Congress) created authority for VA providers to deliver telehealth regardless of provider or patient location, preempting state licensing restrictions. Approximately 10,000 VA providers gained authority to provide out-of-state telehealth services.

**Sources:**
- [VA Connected Care: About](https://connectedcare.va.gov/about)
- [Neil C. Evans, M.D. Biography](https://connectedcare.va.gov/biography/neil-c-evans-md)
- [Kevin Galpin, M.D. Biography](https://connectedcare.va.gov/biography/kevin-galpin-md)
- [2024 Presidential Rank Awards](https://connectedcare.va.gov/whats-new/awards/two-connected-care-executive-leaders-recognized-2024-presidential-rank-awards)
- [Federal Register: Authority of Health Care Providers to Practice Telehealth (May 2018)](https://www.federalregister.gov/documents/2018/05/11/2018-10114/authority-of-health-care-providers-to-practice-telehealth)
- [ABA: VA Mission Act and Telehealth Law](https://www.americanbar.org/groups/health_law/publications/aba_health_esource/2020-2021/march-2021/mis-tel/)

---

## 4. VA ATLAS (Accessing Telehealth through Local Area Stations)

**What it is:** Community-based telehealth access points where veterans without broadband or suitable home environments can conduct VVC video appointments in private, equipped rooms.

**Partner locations:** American Legion posts, VFW posts, and Walmart clinical services rooms. Each site has a private room with internet access, telehealth technology (monitor, camera, speakers), and an on-site attendant who helps veterans connect.

**Scale and challenges (GAO-24-106743):** GAO found that 14 of 24 active ATLAS sites in FY2022-2023 had zero veteran visits. As of April 2024, the Office of Connected Care proposed deactivating six sites at the request of their affiliated medical centers, including five Walmart sites that only offered four available appointment times per week.

**GAO recommendations:** (1) Develop performance goals and measures reflecting leading practices; (2) Use those goals and measures to assess ATLAS effectiveness and efficiency.

**Where it works:** For the sites that did have visits, VA medical center officials reported ATLAS helped veterans who lacked broadband access and avoided long travel distances to VA medical centers.

**Facility locator:** Available at `telehealth.va.gov/facility-locator`

**Help desk:** 833-VA-ATLAS (833-822-8527), Monday-Friday, 8 a.m.-8 p.m. ET

**Sources:**
- [VA Telehealth: ATLAS](https://telehealth.va.gov/atlas)
- [ATLAS and VHRC Facility Locator](https://telehealth.va.gov/facility-locator)
- [GAO-24-106743: VA's Video Telehealth Access Program](https://www.gao.gov/products/gao-24-106743)
- [GAO Report PDF](https://www.gao.gov/assets/880/870386.pdf)
- [VA Connected Care: Two New ATLAS Locations](https://connectedcare.va.gov/whats-new/technology/va-launches-two-new-atlas-locations)

---

## 5. Remote Patient Monitoring (RPM) — Home Telehealth

**Program name:** Remote Patient Monitoring — Home Telehealth (RPM-HT), formerly known as Care Coordination/Home Telehealth (CCHT). The program launched in 2003.

**Enrollment numbers:**
- 2010-2017 (study period through Dec 2019): Over 400,000 veterans engaged in HT services; over half remained enrolled longer than 8 months
- 2022: 132,000 veterans utilized RPM/HT services
- Approximately 20,000 additional enrollments per year
- March 2020 to May 2021: 23,500 veterans used RPM specifically for COVID-19 monitoring

**How it works:** Each enrolled veteran is assigned a Care Coordinator (typically an RN or social worker) who monitors biometric data transmitted from in-home devices, provides case management, and escalates to providers when needed. Disease management protocols are evidence-based and expert-vetted.

**Eligible conditions:** Heart failure, COPD, hypertension, hypotension, chronic kidney disease, diabetes, multiple sclerosis, and other chronic conditions.

**Devices:** Veterans receive monitoring equipment for home use (blood pressure monitors, pulse oximeters, weight scales, glucometers) that transmit data back to VA. The specific vendor integration includes Medtronic RPM-HT systems (per VA Privacy Impact Assessment, FY2025).

**Health outcomes:**
- 41% reduction in hospital admissions
- 70% reduction in bed days of care
- 89% patient satisfaction score

**Digital Divide / Connected Device Program:** Since 2016, VHA has provided tablets to over 180,000 veterans. From April 2020 to February 2023, 119,926 veterans received loaned video-capable tablets with internet service through the Digital Divide Consult (introduced nationally in 2020). Tablet recipients had nearly 3x the likelihood of having a video visit within a month compared to the general VHA population.

**Sources:**
- [VA Connected Care: RPM-HT](https://connectedcare.va.gov/Remote-Patient-Monitoring)
- [VA Lexington: RPM-HT Program](https://www.va.gov/lexington-health-care/programs/remote-patient-monitoring-home-telehealth-rpmht/)
- [PMC: Home Telehealth in VHA, 2010-2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC8886698/)
- [Tenovi: VA Remote Patient Monitoring Results](https://www.tenovi.com/va-remote-patient-monitoring/)
- [VA Home Telehealth Brochure (2023)](https://www.va.gov/files/2023-11/Home%20Telehealth%20Program%20brochure-%20V3.pdf)
- [PMC: Digital Divide Consult Cohort Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11420580/)
- [VA Telehealth: Bridging the Digital Divide](https://telehealth.va.gov/digital-divide)

---

## 6. Technical Infrastructure — VVC Network Integration, HIPAA, Bandwidth

**Encryption:** FIPS 140-2 validated (CMVP) encryption suite. IPsecv3 for network-layer security between Pexip nodes. TLS v1.2 and DTLS for transport-layer security. End-to-end encrypted video sessions.

**FedRAMP:** Pexip Government Cloud achieved FedRAMP ATO at Moderate Impact level (April 2023).

**HIPAA:** VA/VHA is subject to HIPAA under the Health Insurance Portability and Accountability Act. VHA's Health Care Information Security program, implemented through VHA directives, serves as compliance with the HIPAA Security Rule (technical, physical, and administrative safeguards for electronic PHI). VVC sessions are considered protected health information.

**Bandwidth requirements:** Minimum 3G/4G cellular connection with at least 2 bars signal strength. VVC works in standard web browsers (Chrome, Edge, Safari, Firefox) on desktop and via native apps on iOS/Android.

**Deployment topology:** Pexip Infinity can run as:
- On-premises nodes within VA data centers (original deployment)
- Cloud-based nodes (current primary — migrated during COVID-19)
- Hybrid configurations with on-premises + cloud
- Supports air-gapped environments for highest-security needs

**VA network integration:** VVC integrates with VA's identity and access management through VistA login credentials or Federal EHR (Oracle Health) credentials via Virtual Care Manager. The Office of Connected Care Help Desk provides 24/7 support at (866) 651-3180.

**Sources:**
- [Pexip: Encryption in the Pexip Ecosystem](https://www.pexip.com/blog/video-meeting-encryption-in-the-pexip-ecosystem)
- [Pexip: Deploying in Secure Mode](https://docs.pexip.com/admin/secure_mode.htm)
- [VA OGC: HIPAA Information](https://www.va.gov/ogc/hipaa.asp)
- [VA Mobile: VVC Technical Requirements](https://mobile.va.gov/app/va-video-connect)
- [Pexip Government Cloud](https://www.pexip.com/products/pexip-government-cloud)

---

## 7. Telehealth Scheduling — VistA / VSE GUI / Oracle Health Appointment Flow

**VistA Scheduling Enhancements (VSE) GUI:**
- Project kicked off May 2014 to replace the legacy MS-DOS-based VistA scheduling interface with a modern GUI (calendar-grid style, similar to Outlook/Google Calendar)
- VSE GUI provides appointment management for in-person and telehealth visits at VistA-based sites
- Current version documented: VS GUI Release 1.7.53.0 (per VA VDL technical manual)
- A VA OIG report noted VSE was "almost complete" just as it was being superseded by the Oracle Health EHR rollout

**Virtual Care Manager (VCM):**
- VA's dedicated telehealth scheduling and management tool
- Allows providers to view all appointments (video, phone, in-person) in a unified schedule
- Supports creating and launching VVC video visits
- Providers can immediately email or text a VVC link to patients
- **Key limitation:** VCM does not place appointments directly into VistA; providers must work with clinic schedulers to book future video visits in VistA
- Accepts both VistA credentials and Federal EHR (Oracle Health) credentials

**Oracle Health (Cerner) integration:**
- VA contracted with Cerner (now Oracle Health) in 2018 to build a unified EHR across 170+ medical centers, integrated with DoD's MHS GENESIS system
- Users encountered issues with scheduling, prescriptions, and workflow from early deployments, slowing further rollouts
- As of January 2025, VA targeted 2026 for relaunch of Oracle Health EHR rollout
- GAO-26-108812 (2026) found "critical actions needed to support accelerated system deployments"
- GAO-25-108091 found VA "making incremental improvements, but much more remains to be done"

**Appointment flow (typical VVC visit):**
1. Veteran or provider requests video visit (via Secure Messaging, phone, or during prior visit)
2. Clinic scheduler creates appointment in VistA (VSE GUI) or Oracle Health with telehealth stop code
3. VCM generates VVC appointment link
4. System sends automated email notifications at: scheduling, 14 days, 7 days, 1 day, and day-of appointment
5. Day-of email contains clickable VVC link
6. Veteran clicks link, opens VVC in browser or app, enters virtual waiting room
7. Provider launches visit from VCM dashboard
8. Visit documentation recorded back in VistA/Oracle Health EHR

**Sources:**
- [VA VDL: VSE GUI User Guide](https://www.va.gov/vdl/documents/Clinical/Scheduling_Archive/VSE_GUI_1_6_User_Guide.pdf)
- [VA VDL: VSE GUI Technical Manual](https://www.va.gov/vdl/documents/Clinical/Scheduling/vs_gui_release_1_7_53_0_technical_manual.pdf)
- [VA Mobile: Virtual Care Manager](https://mobile.va.gov/app/virtual-care-manager)
- [FedScoop: VA VistA Scheduling Enhancement IG Report](https://fedscoop.com/va-vista-scheduling-enhancement-ig-report/)
- [Military.com: VA Sets Sights on 2026 for Oracle Cerner Relaunch](https://www.military.com/daily-news/2025/01/02/va-sets-sights-2026-relaunch-of-oracle-cerner-electronic-health-record-rollout.html)
- [GAO-26-108812: VA EHR Modernization Critical Actions](https://files.gao.gov/reports/GAO-26-108812/index.html)
- [GAO-25-108091: VA EHR Incremental Improvements](https://files.gao.gov/reports/GAO-25-108091/index.html)

---

## Key Public Source Documents for Further Reference

- GAO-24-106743 — ATLAS program performance assessment
- GAO-26-108812 — EHR Modernization critical actions
- GAO-25-106874 — EHR cost estimate and schedule updates
- VA OIG-21-02805 — Review of Access to Telehealth and Provider Productivity
- CRS Report R45834 — Department of Veterans Affairs: A Primer on Telehealth
- VA Connected Care Telehealth Manual (procurement document D.17)
