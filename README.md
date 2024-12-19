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

If you have any questions, suggestions, need further assistance, feel free to reach out to me. I'm always happy to help!

- Email: [zachriane01@gmail.com](mailto:zachriane01@gmail.com)
- GitHub: [@blurridge](https://github.com/blurridge)
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
│  │  ├─ 01
│  │  │  └─ 03b1f6808c0e2a9b6f061786393fd686338aeb
│  │  ├─ 02
│  │  │  ├─ 285eae7fbdc9ba02f87ab202fbafa1932bf8c6
│  │  │  └─ 7af40c4bd34bf5c758905e9f62f43d9390063a
│  │  ├─ 05
│  │  │  └─ 8b9a3795b3e7ead9765054be7ec8dfefe95452
│  │  ├─ 08
│  │  │  ├─ a946f1af38bf4c8722e336d99eb617a5e7d821
│  │  │  └─ b34150e58be89d4215c1c94e5f773b98dee700
│  │  ├─ 09
│  │  │  ├─ 6e8701248534b4970ccc0432cad7cf74d2c126
│  │  │  ├─ 9244c37784a846b3728b5fd21304c17574bca9
│  │  │  └─ a5381a66f4a78698ddf3fe263398dbc5a07da5
│  │  ├─ 0b
│  │  │  └─ d92cb1b7eff38e5fa6940568551cbcd073ee7b
│  │  ├─ 0f
│  │  │  ├─ 219b6030ca2453ae66bf00c8ee36561ca32893
│  │  │  └─ a2a8745e4814a4da09bbc2726d99bdd225da67
│  │  ├─ 14
│  │  │  └─ 15d37daaf454bc1632c2a997eb81836243250a
│  │  ├─ 15
│  │  │  ├─ c4c66bff69770470396511c603d76bc5380011
│  │  │  └─ ff78e2ede9412eb5d08a14208addd07f27453d
│  │  ├─ 18
│  │  │  └─ 38449fe968ffcb79ce2bda73715017f28164b7
│  │  ├─ 19
│  │  │  ├─ 14c3be6e76072b69b376b99d76f075c333d1a8
│  │  │  └─ 995159c90431d2f0dd6f1fae0f7411643a0bdc
│  │  ├─ 1c
│  │  │  ├─ 33ba7b3372e5d41eb3c4575c4e375868bbf0e6
│  │  │  └─ 631261d9faa473d406f451fe549c9d20be1e82
│  │  ├─ 1d
│  │  │  └─ 08d2739003c060b441f9062d4420202e3601dc
│  │  ├─ 1f
│  │  │  ├─ 1b32689c718aa9903a89da963c37e752eb1fd9
│  │  │  └─ 80b03ccbaae5906b18e302356443aa89d8bfbb
│  │  ├─ 20
│  │  │  ├─ b27ef18b9d61ef0e1ca641ed906e61c63af6b3
│  │  │  └─ c79ce11b07a088acdcd9a79cfdbefc1ceadc7e
│  │  ├─ 21
│  │  │  └─ 49af7972051ab3b3b03ae301272cb48df81640
│  │  ├─ 22
│  │  │  └─ 4abaaef245d788e49681de618074579142d736
│  │  ├─ 23
│  │  │  └─ bc54d285c0fff3b84ccef02e245ea70d7c5d80
│  │  ├─ 24
│  │  │  └─ ea941e2412e117f065319e79f5f31c9cd81cca
│  │  ├─ 25
│  │  │  └─ 716a8d99d230628fc8a42cf235d8abf2b26129
│  │  ├─ 26
│  │  │  └─ 86eb07383f7bf31db7a5e91ad13f103161bf4d
│  │  ├─ 27
│  │  │  ├─ b09f2a68fd75f937dc7b429f4fc74161900fb1
│  │  │  └─ c20341f0c24c3bd776671ebe64f71972cc7bf8
│  │  ├─ 29
│  │  │  ├─ 177b0e06a961450039ba48cd8a100a19d966bd
│  │  │  ├─ e799ea44e2b235ae0ea51c7177e1f7b3d65179
│  │  │  └─ f4bab01e55e5164d9e7fe04404b42a4979e5a9
│  │  ├─ 2b
│  │  │  └─ 451962262a6361694d42af999d92060be1ea3a
│  │  ├─ 2c
│  │  │  ├─ 021ed29a759b8a15745e89944c8e1320df38e1
│  │  │  └─ f98c8b3f052acec56f1e26e04aa0281e02848a
│  │  ├─ 2e
│  │  │  ├─ af76353f489dd33013c5bf40f3c0b956823980
│  │  │  └─ b75b33cca1812db603b9feaaec42d8572a80cd
│  │  ├─ 31
│  │  │  └─ 670870ba84d63c2ae011404662284fbe853488
│  │  ├─ 35
│  │  │  └─ cd5e883a2665d4590b23bdb20576582e0b383f
│  │  ├─ 3b
│  │  │  ├─ 934c0462c7786419f6aa82320f0b35aa16698f
│  │  │  └─ 94140b74b30a3d7019a2814375ab1f490c73ae
│  │  ├─ 3c
│  │  │  └─ 4e37d71f2e37836bf5e6e790651ed4d621b610
│  │  ├─ 3d
│  │  │  └─ 49612de993fee9a7de56986d8e3b5371276f67
│  │  ├─ 3f
│  │  │  └─ b65e2ce987f3910c4a902e820cef5982ad1cbf
│  │  ├─ 41
│  │  │  ├─ bc18f1e358b6f4025750fa878347e97eb93a68
│  │  │  └─ d4119eabbb510c6a2fc0cca936899598191aea
│  │  ├─ 45
│  │  │  └─ 44d5e6dc1811e982a4385311b3c2d669bbb0b8
│  │  ├─ 46
│  │  │  └─ c111ba51dfa3859e2bffd437111a69b688e180
│  │  ├─ 48
│  │  │  └─ 5dc5b31b76f1deb3847cc06a97765a048d92c0
│  │  ├─ 4a
│  │  │  ├─ 65e9b51cdd4bcd436703a5b44b7bfff9dcdf2f
│  │  │  └─ e60854c8557f9affc649e92470d3f441b1f1b5
│  │  ├─ 4d
│  │  │  ├─ 57a17377a528b6e52aabdf52d89bbd6d0f2cd2
│  │  │  └─ f08fc85d5a2e32975afe202bbbda787e9d39e4
│  │  ├─ 4f
│  │  │  └─ 53f432a572e88451fd982d3ce42bf8598311f6
│  │  ├─ 50
│  │  │  └─ 79d948460c66a2cdc2fad0c3195dfbb3d4145a
│  │  ├─ 53
│  │  │  └─ 460d3d1d784fd7f720448f39560ef847e9f485
│  │  ├─ 58
│  │  │  └─ 4b56d0bce7f5f737f31e48419fd05abf4870e1
│  │  ├─ 59
│  │  │  └─ 3e048dbe07d001094dca0192ec83606321a1a8
│  │  ├─ 5b
│  │  │  ├─ 9eb998858995ad2145c584fbe87ab3d6f0065b
│  │  │  └─ b918840f300a13a6ecffb0e96c2ae4eec466f5
│  │  ├─ 61
│  │  │  └─ 45f94e277182300a9ca274ca98c463ce98b5c5
│  │  ├─ 62
│  │  │  └─ 60d7458d35982f85956d918b7d941ef053b077
│  │  ├─ 65
│  │  │  └─ 6ad9f71cdcc7b99167b8c1c8c3b7fa24385bfb
│  │  ├─ 67
│  │  │  └─ a70e175a357f3184d655cc21c21fce88646259
│  │  ├─ 68
│  │  │  ├─ 24a0f39b5ddbda37b71a86b113d551f785c173
│  │  │  ├─ 95e11e5be85c97a3474b1f1e4b100b1f03af58
│  │  │  ├─ cfbbab6778924fcd54e6bdc4484c00ebe3cc9e
│  │  │  └─ f379c493c1b4e878ce2889e9686292d1306054
│  │  ├─ 6a
│  │  │  └─ f7e1ea500122139b64b930c70ed4765d829dc0
│  │  ├─ 6f
│  │  │  └─ db96619d4194881b4299f3894267d399368fdc
│  │  ├─ 70
│  │  │  ├─ 12b8e213b84440cb0de5c2f542898436bb1ec3
│  │  │  ├─ 2883f2373be7f2fd22e7bfa0a769d74a00f063
│  │  │  ├─ 3de2033a278ee56ffde235be5396a4b3e28dd8
│  │  │  ├─ 68ba3f84e47fbdc58d4267f75bf241622a9ca2
│  │  │  └─ 89587fbe8b6796841aa44acffba1a57fde5d58
│  │  ├─ 71
│  │  │  └─ d4c83e6e21288f835804ef64500be8a707c8d6
│  │  ├─ 72
│  │  │  ├─ 5dd8ad2a7100dccf9ce46017137e2ed3b41a3f
│  │  │  └─ a7b4f351c3e572094613d87a88802a8ffe05e7
│  │  ├─ 74
│  │  │  └─ 7b54e7f135dc86f884c267d0afea240be2f21b
│  │  ├─ 75
│  │  │  └─ 0d144ead15042b1943ddc70c0a277f4889111a
│  │  ├─ 76
│  │  │  └─ b3c66e60b5af15374bb898c73b6a6b73e50c6d
│  │  ├─ 77
│  │  │  ├─ 21c55f8d8f68118bf8d34912afac486512af8a
│  │  │  ├─ a53d875583b52e886b5a8399955b8a10fbde1f
│  │  │  └─ f17d43f89e91678b0f4fdd5adb8ae2a4a5f5e9
│  │  ├─ 79
│  │  │  ├─ 07e37d671de5e0b270c1686226f43f4ef8bcd5
│  │  │  └─ e66c0bcac335fac1930b6f0cac2f33f45cff74
│  │  ├─ 7a
│  │  │  └─ d42ff9c9cdf50dd745ec5be80ddaed672c927e
│  │  ├─ 7f
│  │  │  ├─ b39652d2748b6ab73f2fa49dbd69fa8fd87c49
│  │  │  └─ f172f621fa0fd6cb9a830036d82c7163dea30a
│  │  ├─ 80
│  │  │  └─ 810ff43af857a15e6aae7074ab71950488ba7f
│  │  ├─ 81
│  │  │  └─ 6c009ac605222cc8fbd50b1cf7491f637d4f3f
│  │  ├─ 83
│  │  │  ├─ b275354f1b3a9286326eb3df98834d872844a7
│  │  │  └─ c8335d8ab17c29a08a02159284856489493b86
│  │  ├─ 86
│  │  │  ├─ 486d6f924072e5ed5f45c92aac2ae7046418bd
│  │  │  └─ ec1b1df185cf267ceabf2535e23aaa647e7883
│  │  ├─ 87
│  │  │  └─ c4c0bf78c8d7a825a9a4a47f6f2b2f25ba0708
│  │  ├─ 88
│  │  │  └─ e82d02a3e2fd71391e9a9a9ed057e168ff118a
│  │  ├─ 89
│  │  │  └─ c0df752f068b247d6e5ebc39e73fa936d03c14
│  │  ├─ 8a
│  │  │  └─ 0c92029799dab1a8b0b474b84e0c10effb9453
│  │  ├─ 8b
│  │  │  └─ 54c67f97426abf859dd4dca1d06302c84db7a6
│  │  ├─ 8f
│  │  │  ├─ 59cdf30c5f63e5308f85572fa5e00d88d7ee26
│  │  │  ├─ 9fa230d11b5734a97ffbc969037f2e9ff475da
│  │  │  └─ ab345a7e1e3b84e4bd595ab4836a0598602dd8
│  │  ├─ 91
│  │  │  ├─ 492d23069d8868c1adca2ffdf7a8808982069a
│  │  │  └─ c3efd6492a352d25857e49985f18a833811347
│  │  ├─ 92
│  │  │  ├─ 68f3afa6545bb7cfb2abc1de02de09ee945971
│  │  │  └─ e217759a1ea905b17d94dc545ea5f68382a877
│  │  ├─ 93
│  │  │  └─ 098fef357ab8b99b66ff7ce6287eff8de5882c
│  │  ├─ 95
│  │  │  ├─ 560d1f310da2ae6450c9dd02c6c0f046e92fb0
│  │  │  ├─ 5a1fddcac3d4c3a5d016db3f0663024e26b839
│  │  │  └─ e92f4fbd61ba40eced85297f0466bd3fa41b54
│  │  ├─ 96
│  │  │  ├─ 80ac0d8c46d26f6186f88bb63e816a98bcb5cb
│  │  │  └─ 974b5f8e791345f49f369eaa1df93cae94cf1a
│  │  ├─ 99
│  │  │  ├─ 4fb4a631a971011a3c38da4a4fd1deb4ba855b
│  │  │  ├─ 52764e247ad3764dfca7d9747d307468cec1df
│  │  │  ├─ b74b6d6cb77b1c1dd62173c865e31e2fe25fa1
│  │  │  └─ f89a0af36d259a8212cd446bcfd96a4e678737
│  │  ├─ 9d
│  │  │  └─ 3c9f1fbf9d52e977a5c312eb33e467a98d063c
│  │  ├─ 9f
│  │  │  ├─ 3c783231bb2d2d6cfd48bd8c07e41ce4c2be8f
│  │  │  └─ 8735a501df4b4e7c576e8735b4e6010bfc029e
│  │  ├─ a0
│  │  │  ├─ 858698c78e207958dffa3dfd64d97ebe3b34da
│  │  │  └─ bc224202386ac2364d9656b166eeae84da3e6f
│  │  ├─ a1
│  │  │  ├─ 826a85762f81ae8412e76c6df2cde7e38045ea
│  │  │  └─ a10ad6b462b5e75b86c574a7a14db369817686
│  │  ├─ a2
│  │  │  ├─ 7403c05eb81a8f58ded90435ff956a9b642cf3
│  │  │  └─ dc3edcb9f189b01e63b67bc6ba3469a01122b6
│  │  ├─ a4
│  │  │  └─ f3ebe29f27791b1a2309b2909f444a3cc73347
│  │  ├─ ab
│  │  │  └─ 5ffc388e6103028d545f7082a1e51089039897
│  │  ├─ ae
│  │  │  └─ a7d0152040e739fbb461bb0487c99c89d44511
│  │  ├─ af
│  │  │  └─ ea4f1e9c8f1720d592fa2dbd848ec62d89c9cd
│  │  ├─ b0
│  │  │  ├─ 75e8b41f261504c664f076955d524bcfda9910
│  │  │  └─ fcde80900aa8a5dbab550a9b4a505866dc03af
│  │  ├─ b1
│  │  │  ├─ 0f54b97165b44a693e8daf681a168735324389
│  │  │  ├─ 859c95e217de3d39c30edb2b3b7779022bab83
│  │  │  └─ 94106b8f10787fe5f7527739e4659ff75fd2e1
│  │  ├─ b2
│  │  │  └─ f5e970ed95054b3ed63defc20532b9e2d6c52b
│  │  ├─ b6
│  │  │  └─ 7a794236383729884b26a450eaf0286d062773
│  │  ├─ b7
│  │  │  ├─ 070964cceb3f0c6001a2432a9e7097118b6e04
│  │  │  └─ aa70913bda21f0ed6393589e4e0a4c6d33eeaf
│  │  ├─ b9
│  │  │  └─ f4cbf9186f21c3d4035e0964701342cabe5a3e
│  │  ├─ ba
│  │  │  └─ b07d57de1e2f7256bc190d68c78fa4c5d4fc9c
│  │  ├─ bc
│  │  │  └─ ccafa4b68133830632eb70f2a50bad37d1f895
│  │  ├─ bd
│  │  │  └─ 260e6af7c4f0ffccd02218fc465a5cadecad98
│  │  ├─ c0
│  │  │  └─ e39721ce814680c55d9d2fa6b41eb30e9e33e1
│  │  ├─ c2
│  │  │  └─ b6b488c3ecc4a3be91e961c91c55e0ad9000d7
│  │  ├─ c4
│  │  │  └─ 70832866abaf26d2eb274d721466df4b40d02c
│  │  ├─ c5
│  │  │  └─ 95faa1180b454fc1da14fafb88ae879b28e501
│  │  ├─ c6
│  │  │  └─ 8618d8f73acf5db125b3df1b7ad84af3dd4d16
│  │  ├─ c7
│  │  │  └─ f89ab66807047f0d4492e5e08ef2efe8fd6bad
│  │  ├─ c8
│  │  │  └─ 97338074d662b9df254c3d6c6647a8e20617c2
│  │  ├─ cc
│  │  │  └─ e5b35ddc88d085e38ef76764e7abd1f566c4c3
│  │  ├─ d0
│  │  │  ├─ 0a400e0e3f59f0fd75f5a0d9fa851f0619d619
│  │  │  ├─ 241055fbd1674fb0825f5e941e85e3e3bfcaa1
│  │  │  └─ 749444669c6330d70eebe85b46ec16b92d37d5
│  │  ├─ d1
│  │  │  ├─ 9be37aeb587efb7400ce7a7ea083905bea7233
│  │  │  └─ bbee911035baa4f0f520cba91052d5ddb86ced
│  │  ├─ d3
│  │  │  ├─ 444e738aa4dcafbca8f61943066035785f3cf1
│  │  │  ├─ 7ded175a8e0a02d16691311ad13434a4ebe805
│  │  │  └─ 93ba35621b623d9f5c051a8ea5a713f83c10a7
│  │  ├─ d8
│  │  │  └─ 4063cc58d1a780aea05da66bba374e6d83e60c
│  │  ├─ d9
│  │  │  └─ f7d58f59584e244dae1133c2494e09a4c50756
│  │  ├─ da
│  │  │  └─ 5a6eb3cc923f9056c631a130bad213ef875ecc
│  │  ├─ e0
│  │  │  └─ 2badba0cabb442c4122d33b2a7fb8a1e52ef7d
│  │  ├─ e1
│  │  │  ├─ 4088be85be66c14e0b1cf2bc8b0dd4957478fa
│  │  │  ├─ 50e1cc2562d709b3b750875e6b4174216b42ea
│  │  │  └─ bb1606f7b75d3d819b32a3b72545ac3dd9a898
│  │  ├─ e4
│  │  │  └─ 6c88a383acd3c5322ce259b6876cc9f9df3f20
│  │  ├─ e5
│  │  │  ├─ 7867e6f06e3022068e920bbef5a9aefa74825b
│  │  │  └─ f0586dc3a126a06de96e9cf52093283fc2c0ac
│  │  ├─ e6
│  │  │  ├─ 362d28aaa3b78fa419c668f6b4b71e60c846f7
│  │  │  └─ cb8458838e84a048495e956da5e74bd118aa86
│  │  ├─ e7
│  │  │  └─ 13bb42621c3cb0936a29b307b14ec758b82010
│  │  ├─ e9
│  │  │  └─ dbc0547f9a3a3b4453c60a38425c61438e3dd4
│  │  ├─ ed
│  │  │  └─ 7a65241b55f4d9233aa4a841d399b3436409a6
│  │  ├─ ee
│  │  │  └─ 63af1623c816d43b0c63c03156f5118992932e
│  │  ├─ f0
│  │  │  └─ ce708696df81fbef53d9e220abefe1a4ae336b
│  │  ├─ f2
│  │  │  ├─ 3f9cd01c253fb2dd8801ca68ca9b177162ed0c
│  │  │  └─ aeeeee7ed7d89c3e25d1fff374609c7714e46c
│  │  ├─ f3
│  │  │  ├─ 893972afc7a3b2fdbb0a2cafdc4801543dee78
│  │  │  └─ 904a15c9be78181bd7f8f27b8276124ea45588
│  │  ├─ f4
│  │  │  ├─ 6b76e5bb568b7db97a606f12618219085b23ef
│  │  │  └─ a23161d2db337803b72d72f222cbbf0686032f
│  │  ├─ f6
│  │  │  ├─ 5e51688685519c047a635599953af4421697f1
│  │  │  └─ 7110e17cbbdb0392df6456db81c2b3ee42b06e
│  │  ├─ f7
│  │  │  ├─ 96d25893ff87c2d6fe41171f6d0fe6b392202d
│  │  │  └─ b88daa4fe79a24aaa4086058f7b90987413e53
│  │  ├─ f8
│  │  │  └─ c5638fe4129cb2b8177edd862a82c1dd4821c4
│  │  ├─ fd
│  │  │  ├─ 40ac404518cd559e73f96ad36906172b36a525
│  │  │  └─ b304024fdcb61cbe4232c3d5b03f4a3de1a243
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