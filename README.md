# Accred - Event E-Certificate Generator Web App 🎖️

![Accred Logo](https://i.imgur.com/gKwYMID.png)
![Commit Shield](https://img.shields.io/github/last-commit/blurridge/Accred?style=for-the-badge)
![License](https://img.shields.io/github/license/blurridge/Accred?style=for-the-badge)
## Context

I developed Accred as a side project due to the struggles I faced in managing e-certificate generation for the Google Developer Student Clubs at the University of San Carlos. Our existing process of generating and storing certificates in our drive was time-consuming and required constant work from the core team. Additionally, it was taking up a significant amount of storage space.

To overcome these challenges, I created Accred to automate the certificate generation process and eliminate the need for storing them in the cloud. My app generated certificates on-demand, ensuring that no unnecessary data was stored and saving valuable storage space.

Additionally, developing Accred served as an opportunity for me to gain hands-on experience and enhance my knowledge of Next.js and its app router. Throughout the development process, I delved into the intricacies of Next.js, leveraging its powerful features to create a seamless and efficient user experience.

By working on Accred, I not only addressed the pressing issue of e-certificate management but also utilized it as a practical learning experience. Exploring the capabilities of Next.js and its app router allowed me to expand my skill set and deepen my understanding of web development frameworks. This project served as a valuable stepping stone in my journey to becoming a proficient developer, providing me with practical insights and expertise that I can apply to future projects.

## Tech Stack

**Client:**

<p> <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" alt="next.js" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> </p>

**Server:**

<p><a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="firebase" width="40" height="40"/> </a> </p>

## Screenshots
![Admin Page](https://i.imgur.com/xGOdUq9.png)
![Add Event Modal](https://i.imgur.com/Nf2vfAr.png)
![Event Page](https://i.imgur.com/VOlzLUU.png)
![Certificate Verification Page](https://i.imgur.com/2agmPCl.png)

## Run Locally

Clone the project

```bash
  git clone https://github.com/blurridge/Accred
```

Go to the project's directory

```bash
  cd Accred/
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
├─ .env.example
├─ .eslintrc.json
├─ .gitignore
├─ LICENSE
├─ README.md
├─ app
│  ├─ admin
│  │  ├─ home
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ contact
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ docs
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ event
│  │  └─ [id]
│  │     ├─ certificate
│  │     │  └─ [certId]
│  │     │     └─ page.tsx
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mdx-components.tsx
│  └─ page.tsx
├─ assets
│  ├─ accred_logo.svg
│  ├─ accred_ls.svg
│  ├─ accred_sq.svg
│  └─ gdsc_logo.png
├─ components
│  ├─ AddEvent.tsx
│  ├─ AdminGuide.mdx
│  ├─ AdminLoginButton.tsx
│  ├─ Certificate.tsx
│  ├─ CertificateVerifier.tsx
│  ├─ ContactMe.mdx
│  ├─ DataTable.tsx
│  ├─ EventCard.tsx
│  ├─ EventCardContent.tsx
│  ├─ EventDropdown.tsx
│  ├─ EventForm.tsx
│  ├─ FeatureCards.tsx
│  ├─ Footer.tsx
│  ├─ GuestLoginButton.tsx
│  ├─ LoginCard.tsx
│  ├─ Navbar.tsx
│  ├─ RingLoader.tsx
│  └─ ui
│     ├─ avatar.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ columns.tsx
│     ├─ dialog.tsx
│     ├─ dropdown-menu.tsx
│     ├─ form.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ navigation-menu.tsx
│     ├─ popover.tsx
│     └─ table.tsx
├─ context
│  ├─ AuthContext.tsx
│  ├─ EventDataContext.tsx
│  └─ ThemeContext.tsx
├─ firebase
│  └─ config.ts
├─ lib
│  └─ utils.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ tailwind.config.js
├─ tsconfig.json
└─ utils
   ├─ compressBanner.ts
   ├─ deleteFromFirebase.ts
   ├─ fetchImageSize.ts
   ├─ generateLinkedInShareURL.ts
   ├─ parseCSV.ts
   ├─ uploadToFirestore.ts
   └─ uploadToStorage.ts
```

## Acknowledgements

I would like to acknowledge the work of [Ned Palacios](https://github.com/nedpals) and [GDSC University of Immaculate Conception](https://github.com/gdsc-uic) as the inspiration for this project's concept of certificate generation which was originally done in Vue for [LAWIG - a GDSC Philippines Info Session](https://github.com/gdsc-uic/lawig-cert-gen).

## Stay in touch

If you have any questions, suggestions, need further assistance, or would like to avail of Accred for your organization, feel free to reach out to me. I'm always happy to help!

- Email: [zachriane01@gmail.com](mailto:zachriane01@gmail.com)
- GitHub: [@blurridge](https://github.com/blurridge)
- Twitter: [@zachahalol](https://twitter.com/zachahalol)
- Instagram: [@zachahalol](https://www.instagram.com/zachahalol)
- LinkedIn: [Zach Riane Machacon](https://www.linkedin.com/in/zachriane)

## Contributors
<a href="https://github.com/blurridge/accred/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=blurridge/accred" />
</a>

```
uitmkt-certificate-generator
├─ .eslintrc.json
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           ├─ HEAD
│  │           └─ main
│  ├─ objects
│  │  ├─ 0f
│  │  │  └─ a2a8745e4814a4da09bbc2726d99bdd225da67
│  │  ├─ 15
│  │  │  └─ ff78e2ede9412eb5d08a14208addd07f27453d
│  │  ├─ 18
│  │  │  └─ 38449fe968ffcb79ce2bda73715017f28164b7
│  │  ├─ 1d
│  │  │  └─ 08d2739003c060b441f9062d4420202e3601dc
│  │  ├─ 20
│  │  │  └─ c79ce11b07a088acdcd9a79cfdbefc1ceadc7e
│  │  ├─ 24
│  │  │  └─ ea941e2412e117f065319e79f5f31c9cd81cca
│  │  ├─ 29
│  │  │  ├─ 177b0e06a961450039ba48cd8a100a19d966bd
│  │  │  └─ f4bab01e55e5164d9e7fe04404b42a4979e5a9
│  │  ├─ 2c
│  │  │  └─ 021ed29a759b8a15745e89944c8e1320df38e1
│  │  ├─ 2e
│  │  │  └─ b75b33cca1812db603b9feaaec42d8572a80cd
│  │  ├─ 3d
│  │  │  └─ 49612de993fee9a7de56986d8e3b5371276f67
│  │  ├─ 3f
│  │  │  └─ b65e2ce987f3910c4a902e820cef5982ad1cbf
│  │  ├─ 46
│  │  │  └─ c111ba51dfa3859e2bffd437111a69b688e180
│  │  ├─ 4a
│  │  │  └─ 65e9b51cdd4bcd436703a5b44b7bfff9dcdf2f
│  │  ├─ 59
│  │  │  └─ 3e048dbe07d001094dca0192ec83606321a1a8
│  │  ├─ 68
│  │  │  ├─ 95e11e5be85c97a3474b1f1e4b100b1f03af58
│  │  │  └─ f379c493c1b4e878ce2889e9686292d1306054
│  │  ├─ 70
│  │  │  └─ 3de2033a278ee56ffde235be5396a4b3e28dd8
│  │  ├─ 72
│  │  │  └─ 5dd8ad2a7100dccf9ce46017137e2ed3b41a3f
│  │  ├─ 74
│  │  │  └─ 7b54e7f135dc86f884c267d0afea240be2f21b
│  │  ├─ 79
│  │  │  └─ 07e37d671de5e0b270c1686226f43f4ef8bcd5
│  │  ├─ 83
│  │  │  └─ b275354f1b3a9286326eb3df98834d872844a7
│  │  ├─ 86
│  │  │  └─ 486d6f924072e5ed5f45c92aac2ae7046418bd
│  │  ├─ 91
│  │  │  ├─ 492d23069d8868c1adca2ffdf7a8808982069a
│  │  │  └─ c3efd6492a352d25857e49985f18a833811347
│  │  ├─ 99
│  │  │  └─ 4fb4a631a971011a3c38da4a4fd1deb4ba855b
│  │  ├─ a0
│  │  │  └─ 858698c78e207958dffa3dfd64d97ebe3b34da
│  │  ├─ a1
│  │  │  └─ 826a85762f81ae8412e76c6df2cde7e38045ea
│  │  ├─ a2
│  │  │  └─ dc3edcb9f189b01e63b67bc6ba3469a01122b6
│  │  ├─ a4
│  │  │  └─ f3ebe29f27791b1a2309b2909f444a3cc73347
│  │  ├─ b7
│  │  │  └─ 070964cceb3f0c6001a2432a9e7097118b6e04
│  │  ├─ bd
│  │  │  └─ 260e6af7c4f0ffccd02218fc465a5cadecad98
│  │  ├─ c6
│  │  │  └─ 8618d8f73acf5db125b3df1b7ad84af3dd4d16
│  │  ├─ c7
│  │  │  └─ f89ab66807047f0d4492e5e08ef2efe8fd6bad
│  │  ├─ d0
│  │  │  ├─ 0a400e0e3f59f0fd75f5a0d9fa851f0619d619
│  │  │  ├─ 241055fbd1674fb0825f5e941e85e3e3bfcaa1
│  │  │  └─ 749444669c6330d70eebe85b46ec16b92d37d5
│  │  ├─ d9
│  │  │  └─ f7d58f59584e244dae1133c2494e09a4c50756
│  │  ├─ e0
│  │  │  └─ 2badba0cabb442c4122d33b2a7fb8a1e52ef7d
│  │  ├─ e4
│  │  │  └─ 6c88a383acd3c5322ce259b6876cc9f9df3f20
│  │  ├─ ee
│  │  │  └─ 63af1623c816d43b0c63c03156f5118992932e
│  │  ├─ fd
│  │  │  └─ 40ac404518cd559e73f96ad36906172b36a525
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-640b5fcc5bd99a97e0b75658dd634c58e0311bb1.idx
│  │     ├─ pack-640b5fcc5bd99a97e0b75658dd634c58e0311bb1.pack
│  │     └─ pack-640b5fcc5bd99a97e0b75658dd634c58e0311bb1.rev
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ app
│  ├─ admin
│  │  ├─ home
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
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
│  │     └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ mdx-components.tsx
│  └─ page.tsx
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
│  ├─ CertificateVerifier.tsx
│  ├─ ClubDropdown.tsx
│  ├─ ClubForm.tsx
│  ├─ ContactMe.mdx
│  ├─ DataTableClub.tsx
│  ├─ DataTableEvent.tsx
│  ├─ EventCard.tsx
│  ├─ EventCardContent.tsx
│  ├─ EventDropdown.tsx
│  ├─ EventForm.tsx
│  ├─ FeatureCards.tsx
│  ├─ Footer.tsx
│  ├─ GuestLoginButton.tsx
│  ├─ LoginCard.tsx
│  ├─ Navbar.tsx
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
│     ├─ popover.tsx
│     └─ table.tsx
├─ context
│  ├─ AuthContext.tsx
│  ├─ ClubDataContext.tsx
│  ├─ EventDataContext.tsx
│  └─ ThemeContext.tsx
├─ firebase
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
   ├─ generateLinkedInShareURL.ts
   ├─ getTextColor.ts
   ├─ parseCSV.ts
   ├─ uploadToFirestore.ts
   └─ uploadToStorage.ts

```