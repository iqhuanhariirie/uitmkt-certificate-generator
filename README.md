
## What is UITM KT E-Certificate System?

The UITM KT E-Certificate System is a web application designed to streamline the process of securely generating and managing e-certificates for Social and Activity Clubs at Universiti Teknologi MARA, Kuala Terengganu campus. This system addresses challenges such as time-consuming processes, potential for errors, and lack of centralized verification, ensuring that e-certificates are issued with high standards of integrity, authenticity, and confidentiality.

Through the use of RSA digital signature algorithm, the system provides cryptographic mechanisms to guarantee that certificates are tamper-proof and verifiable by any recipient or third party. This user guide will walk you through the process of using the UITM KT E-Certificate System and offer instructions on how to maximize its features, ensuring that your e-certificates remain secure and reliable.

## Run Locally

Clone the project

```bash
  git clone https://github.com/iqhuanhariirie/uitmkt-certificate-generator.git
```

Go to the project's directory

```bash
  cd uitmkt-certificate-generator/
```

Install dependencies

```bash
  npm install
```

Create a `.env` file containing your Firebase variables. Use `.env.example` as a template.
```
NEXT_PUBLIC_FIREBASE_API_KEY              = <<your firebase api key here>>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN          = <<your firebase auth domain here>>
NEXT_PUBLIC_FIREBASE_PROJECT_ID           = <<your firebase project id here>>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET       = <<your firebase storage bucket here>>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  = <<your firebase messaging sender id here>>
NEXT_PUBLIC_FIREBASE_APP_ID               = <<your firebase app id here>>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID       = <<your firebase measurement id here>>
```

Start the server

```bash
  npm run dev
```

## Structure

```
📦 
├─ app
│  ├─ admin
│  │  ├─ home
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ api
│  │  └─ certificates
│  │     ├─ batch-sign
│  │     │  └─ route.ts
│  │     ├─ sign
│  │     │  └─ route.ts
│  │     └─ verify
│  │        └─ route.ts
│  ├─ club
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ contact
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ docs
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ event
│  │  └─ [id]
│  │     ├─ certificate
│  │     │  └─ [certId]
│  │     │     └─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     └─ participant
│  │        ├─ layout.tsx
│  │        └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mdx-components.tsx
│  ├─ page.tsx
│  └─ verify
│     └─ page.tsx
├─ assets
│  ├─ accred_logo.svg
│  ├─ accred_ls.svg
│  ├─ accred_sq.svg
│  ├─ gdsc_logo.png
│  └─ UiTM Logo Vector.svg
├─ components
│  ├─ AddClub.tsx
│  ├─ AddEvent.tsx
│  ├─ AdminGuide.mdx
│  ├─ AdminLoginButton.tsx
│  ├─ Certificate.tsx
│  ├─ CertificatePreview.tsx
│  ├─ CertificateVerifier.tsx
│  ├─ ClubDropdown.tsx
│  ├─ ClubForm.tsx
│  ├─ ContactMe.mdx
│  ├─ DataTableClub.tsx
│  ├─ DataTableEvent.tsx
│  ├─ DataTableParticipant.tsx
│  ├─ EventCard.tsx
│  ├─ EventCardContent.tsx
│  ├─ EventDropdown.tsx
│  ├─ EventForm.tsx
│  ├─ FeatureCards.tsx
│  ├─ Footer.tsx
│  ├─ GuestLoginButton.tsx
│  ├─ LoginCard.tsx
│  ├─ Navbar.tsx
│  ├─ ParticipantList.tsx
│  ├─ RingLoader.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ columns.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ navigation-menu.tsx
│     ├─ participant-columns.tsx
│     ├─ popover.tsx
│     └─ table.tsx
├─ context
│  ├─ AuthContext.tsx
│  ├─ ClubDataContext.tsx
│  ├─ EventDataContext.tsx
│  └─ ThemeContext.tsx
├─ firebase
│  ├─ admin.ts
│  └─ config.ts
├─ lib
│  └─ utils.ts
├─ LICENSE
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.js
├─ public
│  ├─ assets
│  │  └─ pdf
│  │     └─ pdf.worker.min.js
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ scripts
│  ├─ convertP12ToBase64.js
│  ├─ testP12Config.ts
│  ├─ testSignature.js
│  └─ verifyP12.js
├─ tailwind.config.js
├─ tsconfig.json
└─ utils
   ├─ compressBanner.ts
   ├─ createClub.ts
   ├─ deleteFromFirebase.ts
   ├─ fetchDominantColorFromImage.ts
   ├─ fetchImageSize.ts
   ├─ generateCertificatePDF.ts
   ├─ generateLinkedInShareURL.ts
   ├─ getTextColor.ts
   ├─ parseCSV.ts
   ├─ signCertificate.ts
   ├─ uploadToFirestore.ts
   ├─ uploadToStorage.ts
   └─ verifySignature.ts

```

## Acknowledgements

I would like to acknowledge the work of [Zach Riane Machacon](https://github.com/blurridge/Accred.git) as the inspiration for this project's concept of certificate generation.
