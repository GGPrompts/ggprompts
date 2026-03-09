# VA Health and Benefits Mobile App — Architecture Research

## 1. App Overview

- **Name**: VA: Health and Benefits
- **Launch date**: July 13, 2021
- **Platforms**: iOS (App Store) and Android (Google Play)
- **Downloads**: Surpassed **3 million** unique downloads as of June 2025
- **Active users**: ~1.4 million active users (earlier milestone reports cited 880,000 monthly active users)
- **App Store ratings**: **4.8 stars** on Apple App Store; **4.6 stars** on Google Play Store
- **Bundle ID**: `gov.va.mobileapp` (Android); App Store ID `1559609596` (iOS)
- **Built by**: Ad Hoc (prime subcontractor), with Liberty IT Solutions as prime contractor and Digital Foundry as an additional subcontractor, under the VA's Office of the CTO (OCTO)
- **Tagline on GitHub**: "If VA were a company, it would have a flagship mobile app."

**Sources:**
- [VA health and benefits app reaches 3 million downloads (VA News)](https://news.va.gov/press-room/va-health-and-benefits-app-reaches-3-million-downloads/)
- [Building the VA Health and Benefits App (DigitalVA)](https://digital.va.gov/vision-driven-execution/building-the-va-health-and-benefits-app/)
- [Creating a flagship mobile app (Ad Hoc)](https://adhoc.team/2022/01/26/creating-flagship-mobile-app-to-meet-veterans-needs/)

---

## 2. Technical Stack

- **Frontend framework**: React Native (TypeScript). The team evaluated multiple frameworks and chose React Native because (a) it allows a single codebase for iOS and Android, and (b) VA already had existing React expertise from va.gov.
- **Backend**: The mobile app calls **vets-api**, the same Ruby on Rails monolith that powers va.gov. The app does not have its own separate backend — it shares the vets-api endpoints. The domain `platform-api.va.gov` exposes the vets-api endpoints, while `api.va.gov` routes through Apigee to Lighthouse APIs.
- **Infrastructure**: AWS cloud hosting, Docker/Kubernetes containerized platform, Jenkins CI pipelines, GitHub as the code repository.
- **Authentication flow**:
  1. The Veteran authenticates via **Login.gov** or **ID.me** (as of March 5, 2025, My HealtheVet credentials are no longer accepted).
  2. These identity providers federate through **Okta** (which serves as an identity broker between the credential service providers and VA's Master Person Index / MPI).
  3. The mobile app uses the **OAuth 2.0 Authorization Code flow with PKCE** (Proof Key for Code Exchange), which is the recommended pattern for public/mobile clients that cannot securely store a client secret.
  4. The VA's **Sign-in Service (SIS)** within vets-api handles the token exchange and session management.
  5. Both Login.gov and ID.me require **multifactor authentication (MFA)** during setup.

**Sources:**
- [VA Sign-in changes (va.gov)](https://www.va.gov/initiatives/prepare-for-vas-secure-sign-in-changes/)
- [Vets-api authentication docs (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-vfs-teams/blob/master/DeveloperDocs/vets-api/authentication.md)
- [Removing Kong intermediary discussion (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-team/discussions/39753)
- [VA API Platform - Working with VA APIs](https://developer.va.gov/production-access/working-with-va-apis)

---

## 3. Features

**Health care tools:**
- **Secure messaging**: Send and receive messages with VA health care providers (over 525,000 secure messages sent as of earlier milestones; 298,000+ in another reporting period)
- **Appointments**: View upcoming VA appointments, add them to device calendar (~995,000 appointment views reported)
- **Prescriptions**: Refill and track VA prescriptions (~194,000 prescriptions refilled via the app)
- **Vaccine records**: View immunization history

**Benefits tools:**
- **Claims and appeals tracking**: Check status of disability claims and appeals, submit supporting evidence
- **Disability rating**: View combined and individual disability ratings
- **VA letters**: Download official VA letters and documents (over 2 million letters downloaded as of earlier milestones; 401,000+ in another reporting window)
- **Direct deposit**: View payment history and update direct deposit information

**Travel reimbursement (BTSSS):**
- Submit simple **mileage-only** travel reimbursement claims for past in-person VA appointments
- View submitted travel claim status and history
- This integrates with the **Beneficiary Travel Self-Service System (BTSSS)**

**Other features:**
- **Veteran status proof**: Show proof of Veteran status digitally
- **Facility locator**: Find nearby VA facilities and services
- **Veterans Crisis Line**: Quick-access button
- **Push notifications**: Receive notifications for appointments, prescription updates, and other events

**Sources:**
- [VA: Health and Benefits (mobile.va.gov)](https://mobile.va.gov/app/va-health-and-benefits)
- [Six essential facts (DigitalVA)](https://digital.va.gov/outreach-toolkits/long-form-content/va-health-and-benefits-mobile-app-six-essential-facts/)
- [VA: Health and Benefits (App Store)](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596)
- [VA: Health and Benefits (Google Play)](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US)

---

## 4. API Integration

- The mobile app primarily calls **vets-api** (the Rails backend), which in turn calls various upstream VA systems including **Lighthouse APIs**.
- Key Lighthouse APIs exposed at `developer.va.gov` that are relevant to mobile features:
  - **Benefits Claims API**: Claim status, evidence submission
  - **Veteran Service History and Eligibility API**: Service history, disability rating
  - **Veteran Confirmation API**: Veteran status verification
  - **Health APIs**: Appointments, prescriptions, secure messaging (many of these go through vets-api to VistA/Cerner systems)
- **How it differs from va.gov web**: The mobile app and va.gov share the same vets-api backend. The mobile app has dedicated mobile-specific API endpoints within vets-api (the `va-mobile-app` repo includes references to mobile API contracts). The web frontend is a React SPA while the mobile app is React Native, but both ultimately consume the same data layer.
- The `platform-api.va.gov` domain serves vets-api endpoints directly, while `api.va.gov` routes through **Apigee** (Google's API gateway) to Lighthouse-managed APIs.

**Sources:**
- [Lighthouse APIs (DigitalVA)](https://digital.va.gov/general/lighthouse-a-veteran-centered-api-program-at-va/)
- [Benefits Claims API (developer.va.gov)](https://developer.va.gov/explore/api/benefits-claims)
- [VA API Platform About](https://developer.va.gov/about)
- [Kong removal discussion (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-team/discussions/39753)

---

## 5. The va-mobile-app GitHub Repository

- **URL**: [https://github.com/department-of-veterans-affairs/va-mobile-app](https://github.com/department-of-veterans-affairs/va-mobile-app)
- **Open source**: Yes, publicly available under the Department of Veterans Affairs GitHub organization
- **Primary language**: TypeScript
- **Default branch**: `develop`
- **Documentation site**: [https://department-of-veterans-affairs.github.io/va-mobile-app/](https://department-of-veterans-affairs.github.io/va-mobile-app/)
- **Key architecture decisions documented in the repo**:
  - Cross-platform React Native was chosen over native iOS/Android development
  - The repo contains a `team` folder with background, discovery, planning, and architectural decision records (ADRs)
  - Uses the Mobile Application Platform (MAP) Docker solution for local development
  - QA documentation at the `/docs/QA/` path covers manual, automated, and accessibility testing approaches

**Sources:**
- [va-mobile-app GitHub repo](https://github.com/department-of-veterans-affairs/va-mobile-app)
- [VA Mobile App Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/)
- [QA Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/)

---

## 6. Biometric Authentication

- After initial login with Login.gov or ID.me credentials, Veterans can enable their device's **built-in biometric authentication** (Face ID / Touch ID on iOS; fingerprint / face unlock on Android) to access the app on subsequent launches.
- The implementation follows the standard React Native pattern of storing OAuth tokens in the **device Keychain** (iOS) or **Keystore** (Android), protected by biometric access controls.
- The biometric check is a **local device-level gate** — it unlocks the stored token rather than re-authenticating against VA's identity providers. The stored token is then used to make authenticated API calls to vets-api.
- The Keychain entry is typically protected with `.biometryCurrentSet` (iOS), meaning the token is invalidated if the enrolled biometric data changes.

**Sources:**
- [Authentication Methods for Mobile Apps and VA.gov (DigitalVA)](https://digital.va.gov/general/authentication-methods-for-mobile-apps-and-va-gov/)
- [Secure Logon Access Instructions (VA Mobile)](https://mobile.va.gov/login-information)

---

## 7. Accessibility

- The VA follows a **"beyond compliance"** approach to accessibility, going further than minimum legal requirements.
- The app is tested with **VoiceOver** (iOS) and **TalkBack** (Android) screen readers, with manual testing performed directly on devices.
- VA works to meet **WCAG 2.2 Level AA** standards across its digital properties, including the mobile app.
- The QA team conducts **manual, automated, and accessibility testing** as documented in the app's QA documentation.
- Specific accessibility improvements include making downloaded PDF letters readable by VoiceOver for blind Veterans.
- The VA's Office of Information and Technology conducts **feedback sessions with blind and low-vision Veterans** to iteratively improve the app's accessibility.
- The app must pass **Section 508 compliance** requirements, which are mandated for all VA mobile applications.

**Sources:**
- [VA Mobile App Compliance Requirements (Section 508)](https://mobile.va.gov/content/section-508-compliance)
- [Accessibility at VA](https://www.va.gov/accessibility-at-va/)
- [Veterans with Disabilities Help Modernize VA (DigitalVA)](https://digital.va.gov/delightful-end-user-experience/veterans-with-disabilities-help-modernize-va-gov/)

---

## 8. Offline Capabilities

- The VA mobile app currently has **limited offline capabilities**. There is an open GitHub issue ([#11739](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/11739)) titled "Offline Access - Maintenance Windows" acknowledging that Veterans lack clear offline access and maintenance messaging across key app sections.
- The issue notes that the current experience "creates confusion and errors when connectivity is lost or scheduled maintenance occurs."
- The epic aims to define **consistent offline behavior and maintenance window experiences** across the app.
- Given the app's architecture (React Native calling a remote Rails API), most features inherently require network connectivity. The app does not appear to implement a comprehensive offline-first caching strategy at this time.

**Sources:**
- [Offline Access issue #11739 (GitHub)](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/11739)

---

## 9. Push Notification Infrastructure

- Push notifications are delivered through **VANotify**, VA's centralized notification platform (originally built by ThoughtWorks, branched from the UK/Canadian Government Digital Services' "Notify" platform).
- VANotify supports **email, SMS, and push notifications** to the flagship mobile app.
- The push notification pipeline works with **VEText** for appointment-related notifications. Client teams must work with the VEText team to create push notification templates and mobile app notification preferences before messages can be sent.
- The underlying delivery uses **Firebase Cloud Messaging (FCM)** for Android and **Apple Push Notification service (APNs)** for iOS (with FCM acting as an intermediary wrapper for APNs).
- **Notification triggers** include: appointment reminders, prescription shipment tracking, benefits application receipt confirmations, account change notifications, and other VA service updates.
- Veterans do not need to sign up for VANotify — notifications are sent automatically based on VA service interactions, as long as contact information is current.

**Sources:**
- [VANotify README (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-notify/README.md)
- [VANotify Notification Guide (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-notify/notification-guide.md)
- [OIT Launches New Digital Notification Feature (DigitalVA)](https://digital.va.gov/general/oit-launches-new-digital-notification-feature/)
- [ThoughtWorks partners with VA to launch VANotify](https://www.thoughtworks.com/en-us/about-us/news/2021/vanotify)
- [VEText product documentation (GitHub)](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/vetext/product.md)

---

## 10. Release Cadence and CI/CD

- The app follows an **iterative release cycle** with automated CI/CD pipelines. The VA's Mobile Application Platform (MAP) documentation describes a structured deployment pipeline:
  1. Code is developed and pushed to the GitHub repository
  2. Automated builds deploy to a **staging environment** for integration testing
  3. Compliance Body reviews or self-certifications are completed
  4. MAP Verification and Validation (V&V) team reviews documentation
  5. OCC management approves V&V findings
  6. Business Owner provides final approval for national release
  7. App is submitted to Apple App Store and Google Play Store
- The CI/CD infrastructure uses **GitHub Actions** for workflow automation, with **Docker/Jenkins/Kubernetes** for the containerized build platform.
- The app ships updates regularly through the standard App Store and Google Play review processes. Based on App Store version history for similar VA apps, updates appear to ship roughly every **2-4 weeks**.
- The QA team conducts manual, automated, and accessibility testing before each release, as documented in the project's QA section.

**Sources:**
- [Mobile App Development Overview (VA Mobile)](https://mobile.va.gov/mobile-app-development-overview)
- [VA Mobile App Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/)
- [QA Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/)

---

## Summary of Key Numbers

| Metric | Value |
|--------|-------|
| Launch date | July 13, 2021 |
| Total downloads | 3+ million (as of June 2025) |
| Monthly active users | ~1.4 million |
| iOS App Store rating | 4.8 stars |
| Google Play rating | 4.6 stars |
| Secure messages sent | 525,000+ |
| Letters downloaded | 2+ million |
| Prescriptions refilled | 194,000+ |
| Appointment views | 995,000+ |
