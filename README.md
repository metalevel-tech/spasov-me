# Spasov.me home page

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/25a5b655a9ce437aa5867df55352e90c)](https://app.codacy.com/gh/metalevel-tech/spasov-me/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## References

- <https://nextjs.org/docs>
- <https://next-intl-docs.vercel.app/docs/next-13>
- <https://www.npmjs.com/package/slugify>
- [***Setting the properties in an object parameter to optional > Set the entire object parameter to optional***](https://bobbyhadz.com/blog/typescript-function-optional-parameters#setting-the-properties-in-an-object-parameter-to-optional)
- <https://pagespeed.web.dev/analysis/https-promptopia-metalevel-tech/n0pcgydmgq?form_factor=mobile>

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Use Vercel CLI

```bash
npx vercel link
npx vercel env pull
```

## UseForm

```bash
npm i react-hook-form
```

- <https://mui.com/material-ui/react-text-field/#complementary-projects>
- **<https://react-hook-form.com/get-started>**
- <https://codesandbox.io/s/react-hook-form-with-ui-library-ts-forked-qjgkx?file=/src/index.tsx:582-594>
- <https://codevoweb.com/form-validation-react-hook-form-material-ui-react/>

## Shadcn-UI

Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source. **Re-usable components built using *Radix UI* and *Tailwind CSS*.** This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps.

- <https://youtu.be/7MKEOfSP2s4> - An example how to implement the [`<Skeleton />`](./app/components/ui/skeleton.tsx) component, while fetch data from the [RAWG](https://rawg.io/) API. This example illustrate also ho to use Next.js 13 App Router [`loading.tsx`](./app/%5Blocale%5D/games/loading.tsx) component.
- <https://ui.shadcn.com/>
- <https://www.radix-ui.com/>

### CLI

**Use the CLI to add components to your project.** Use the `init` command to initialize dependencies for a new project. The `init` command installs dependencies, adds the cn util, *configures `tailwind.config.js`*, and CSS variables for the project.

```bash
npx shadcn-ui init slugify
```

Use the `add` command to add components to your project and installs all required dependencies.

```bash
npx shadcn-ui add [component]
```

Run the add command without any arguments to view a list of all available components:

```bash
npx shadcn-ui add
```

## TailWind CSS

- <https://tailwindcss.com/docs/align-items>
- <https://marketplace.visualstudio.com/items?itemName=dimitribarbot.tailwind-styled-components-extractor>
- <https://github.com/ben-rogerson/twin.macro>
- (<https://dev.to/dbshanks/an-efficient-react-tailwindcss-styled-components-workflow-458m>)

Plugins:

- [Flowbite (quick start)](https://flowbite.com/docs/getting-started/quickstart/) used for the [radio buttons](https://flowbite.com/docs/forms/radio/).

## Promptopia additional packages

```bash
npm i bcrypt mongodb mongoose next-auth
```

## NextAuth (GoogleProvider) and Google OAuth

- <https://next-auth.js.org/getting-started/example>
- <https://next-auth.js.org/configuration/initialization#route-handlers-app>
- <https://next-auth.js.org/getting-started/typescript>
- <https://next-auth.js.org/providers/google>
- <https://youtu.be/wm5gMKuwSYk?t=4800>
- **<https://www.youtube.com/watch?v=w2h54xz6Ndw>**
- <https://console.cloud.google.com/apis/credentials/>
- <https://next-auth.js.org/configuration/options#options> (`NEXTAUTH_SECRET`)
- **<https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/>**
  - <https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/#implement-the-nextauth-authentication-code>
  - <https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/#different-ways-to-protect-routes>
- **<https://next-intl-docs.vercel.app/docs/routing/middleware#example-auth-js>**

...Access blocked: This app’s request is invalid:

- <https://youtu.be/wm5gMKuwSYk?t=6217>
- <https://next-auth.js.org/getting-started/rest-api#getpost-apiauthcallbackprovider>
  `/api/auth/callback/:provider` > `/api/auth/callback/google` > In the google's OAuth2.0 configuration
- <https://console.cloud.google.com/apis/credentials/oauthclient/>

## MongoDB

See my dedicated to **Next.js and MongoDB integration** exercise repository:

<https://github.com/metalevel-tech/exc-nextjs-2023-with-mongodb-example>

More references:

- [How to Integrate Vercel & MongoDB Step-by-Step: YouTube](https://youtu.be/JIlYroSsInU)
- <https://www.mongodb.com/atlas>
- <https://youtu.be/wm5gMKuwSYk?t=5285>
