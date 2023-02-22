# Jones (Jordan Ones) Shoe Store

### A Seamless E-Commerce Marketplace

Jones is an SEO-friendly, responsive, mobile-first online store for purchasing Nike Jordan Ones.

The website features real-time product filters, a pop-up search option (AJAX live search), AJAX add-to-cart and wishlist options, a guest shopping cart, a newsletter form, an announcement banner for live updates, a product review section and a slideshow on product hover.

## Table of Content

1. [Technologies Used](#technologies-used)
2. [Design Decisions](#design-decisions)
3. [Issues Encountered](#issues-encountered)
4. [What I've Learned](#what-ive-learned)
5. [Setup Instructions](#setup-instructions)
6. [Getting Started](#getting-started)
7. [Todo](#todo)
8. [Credits & Attributions](#credits--attributions)
9. [Learn More](#learn-more)
10. [Deploy on Vercel](#deploy-on-vercel)

## Technologies Used

- **Next.JS** &mdash; React Framework - Used for server-side rendering and RESTful APIs
- **Typescript** &mdash; Static typing, type Inference, narrowing & type guarding
- **Iron Session** &mdash; Session utility using cookies to store data.
- **BCrypt** &mdash; Password hashing & comparison
- **Yup** &mdash; Schema validation & form validation
- **PostgreSQL** &mdash; A Relational Database Management System
- **Prisma** &mdash; ORM for PostgreSQL (Data Modeling, Query Building, Migration System & GUI to Access Database)
- **Cloudinary** &mdash; Used as cloud image store for product images
- **Stripe** &mdash; Used Stripe as primary payment gateway & npm library for accessing their API
- **Micro** &mdash; Used for parsing raw incoming requests body
- **Sass** &mdash; Preprocessor used for styling
- **React Icons** &mdash; SVG icon library
- **Next Share** &mdash; Button icons for sharing to social media
- **React Toastify** &mdash; Toast popup library used for notifications
- **Probe Image Size** &mdash; Gets width & height of remote images
- **React Spinners** &mdash; Loading animation components
- **nProgress** &mdash; Progressbar for navigation indication
- **Moment** &mdash; Format dates
- **Friendly Username Generator** &mdash; Generates random usernames for new users
- **ESLint** &mdash; Code linter
- **Prettier** &mdash; Enforces a consistent code format
- **Figma** &mdash; UI design application
- **Adobe Photoshop** &mdash; For design & image editing
- **TinyPng** &mdash; Image optimization
- **Postman** &mdash; Testing API routes (on Auth and Product routes)
- **Chrome & Firefox Dev Tools**

## Design Decisions

- Considering that this is an e-commerce website, SEO plays a significant factor in its success, but using standard client-side rendered React would seriously hinder search engines from properly crawling each page. So I chose Next.JS for this project as it provides a quick and simple way for writing performant, server-side rendered react applications without much overhead.

- ~~React's `useState` & `useReducer` hooks coupled with the Context API provided a sufficient means for managing and centralizing state in this application as there wasn't much information that needed to be kept in memory on the client that would demand a complex library like Redux. The pages are frequently refreshed, and the data is already being rendered onto the pages from the server(using `getServerSideProps`), further reducing the need for alternate state management strategies. Additionally, user preferences are being persisted through cookies for server-side rendering.~~

  - **Important Note** &mdash; In hindsight, it would have been better to have used a purpose-built state management library like redux, as I didn't anticipate how much the state would have grown in this application. I also learned that an individual Context would force a re-render of all the components subscribed to it irrespective of whether their part of the state has updated, which could hinder performance. There are some ways to circumvent this issue, but the results will not be as ideal as what libraries like redux can offer. Furthermore, the Context API is better suited for storing static values that infrequently update (like UI themes or locale preferences) or more local state.

- For managing the user state, I switched from using multiple `useState` hooks to a single `useReducer` as it's a more convenient option for working with state objects holding multiple sub-values(like the wishlist and cart fields on the user object.)

- Used Postgres trigger functions for updating cart total whenever a cart item gets added or removed.

- After recognizing a repeating pattern in how API routes were being written and wanting to improve the process, I built a method routing function, `RouteHandler`. It allows for arranging request handlers in a similar fashion to Express.js routers. Now all handlers can be composed within a custom error catcher and have session middlewares for authentication and role-based access control (via protected routes). This abstraction reduced boilerplate code inside the API routes and made writing async code in the handlers much cleaner.

- The website UI diverted from the original Figma design in several different areas.

- I created a product context for managing state on the products page to gain more control over how products are sorted and filtered and to reduce querying the database each time the page refreshes upon selecting a different criterion.

- For the product page, I used `next/dynamic` to lazy-load tab panels until the user selects a tab panel's corresponding tab. This approach was particularly useful for suspending the loading of the size chart and product reviews component until requested by the user.

- There were several changes made to the database throughout this project. The details can be observed in the `prisma/migrations` folder where schema migrations are tracked.

## Issues Encountered

- Programmatically setting a focusable element as the active element inside the document is a bit buggy for some reason.

- No way to add custom constraints onto table columns inside Prisma, so I had to resort to handwritten SQL commands.

- The Sass team is deprecating the `@import` statement in favour of `@use`, which forced me to import (with `@use()`) all variables, functions, placeholders and mixins into all sass files that depend on them.

- Learning to work with `next/image` was a bit difficult, especially when trying to resize images.

- While implementing the slideshow feature on the product component, I encountered a problem where the state wasn't updating as intended. After some point, I realized that the callback being passed to `setInterval` was using an outdated value of state held inside its closure &mdash; the value assigned during the first render. I later discovered a different way of updating state by passing a callback to `setState` instead of some value. The callback accepts the current value of the state to calculate and return a new state. [Further details by Dan Abramov...](https://overreacted.io/making-setinterval-declarative-with-react-hooks/#second-attempt)

- I made some changes to UI in sections that were not accounted for during the design phase for layout and stylistic improvements.

- After a series of bugs, I eventually realized that I needed to `await` all Prisma DB queries for them to execute successfully.

- The price range component came with more challenges than I would have anticipated:

- I found out that the `.getBoundingClientRect` method gives details about an element's rendering dimensions that may be incongruent with its layout dimensions in the case where CSS transformations are applied, which caused a few visual bugs on the range's progress bar. So I had to update my calculations.

- My naive attempt at making the price range a controlled component made the code increasingly complicated and harder to manage. The main issue stemmed from trying to trigger state updates in response to changing props. I ran into a condition where, in some cases, the change handlers and the component's `useEffect()` would cause the state to be perpetually updated. One update after the other due to stale values, so I had to rethink my approach. The solution was simple, set a key prop on the component that would trigger a reset whenever certain values change.

- Trying to aggregate the average ratings for each product resulted in multiple Prisma clients being instantiated, which caused errors in Vercel. So to resolve this, in the database query, I included all reviews related to the products and then used that to map through and programmatically calculate the average ratings of each product.

## What I've Learned

- Further developed my intuition for writing custom hooks.

- Dynamic routing strategies through Next JS

- `:focus-visible` selector for keyboard tabbing focus, and `:focus-within` for elements with an actively focused descendant.

- Better approaches to BEM naming and component design.

- Canonical tag to signal the main version of (near) duplicate pages to search engines.

- Native internationalization(`Intl`) class - API that provides many tools for internationalization purposes has a method for formatting currency.

- It's probably best not to program the database using triggers or procedures since they tend to become invisible (may forget or not be aware of them during development), so it's probably best to perform calculations on the server instead.

- Alternative way to update state `setState(state => ...)`

- For future projects, prefer a test-driven approach - Write tests to specify the purpose of each module before coding. This way, I can check to ensure that adding new code doesn't trigger hidden side effects or break prior features before shipping to production.

- Use `ResizeObserver` to check if an element layout dimensions changes.

## Setup Instructions

1. Create a `touch .env` file in the root directory and set the following keys:

   ```python
   # Database string for PostgreSQL
   DATABASE_URL="postgres://{user}:{password}@{hostname}:{port}/{database_name}"

   # 32+ character long string for session cookie encryption [https://1password.com/password-generator/]
   SECRET_COOKIE_PASSWORD="complex_password_at_least_32_characters_long"

   # DOMAIN ADDRESS
   DOMAIN="http(s)://example.org"

   # STRIPE INFO
   STRIPE_PUBLISHABLE_KEY="pk_..."
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_ENDPOINT_SECRET="whsec_..."

   # authorization key for cron task
   CRON_ACTION_KEY="random_string"

   # From google analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
   ```

2. You may edit the following variables inside the `./src/lib/config.ts` file:

   ```js
   // name for the session cookie
   export const sessionOptions: IronSessionOptions = {
     cookieName: "<site_name>/user",
     // ...
   };

   // name of the domain
   export const DOMAIN_NAME = "";

   // https://cloudinary.com upload preset & cloud name
   export const CLOUDINARY_UPLOAD_PRESET = "";
   export const CLOUDINARY_CLOUD_NAME = "";

   // handles for social media pages
   export const SocialHandles = {
     facebook: "",
     instagram: "",
     youtube: "",
     twitter: "",
     pinterest: "",
     tiktok: "",
   };
   ```

3. Run `npm install` to install all dependencies for the project.

4. Then run `npx prisma db push`. It will use the schema (from `./prisma/schema.prisma`) to add the relevant tables to your `jonesdb` database.

5. If you make any changes to `schema.prisma`, run `npm run db:migrate -- <name_of_migration>` to further maintain a history of each update to the database. You may also run `npx prisma generate` to manually sync `@prisma/client` with the database after updating the table schemas. Use `npx prisma studio` to launch the prisma client to observe and manipulate the database.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Todo

- [ ] Internationalize - Allow multiple ~~currencies~~ and languages
- [ ] Build Admin Dashboard
- [ ] Improve Accessibility.
- [ ] Password Recovery Feature
- [ ] Order Tracking Feature
- [ ] Web scraper for products Info.
- [ ] Use SMTP to email users after sign-up and product purchases.
- [ ] Add Google Auth
- [ ] Add Structured Data to Product Pages Using [JSON-LD](https://nextjs.org/learn/seo/rendering-and-ranking/metadata)
- [ ] Add An [XML Sitemap](https://nextjs.org/learn/seo/crawling-and-indexing/xml-sitemaps)
- [ ] Cache BlurData urls.
- [ ] Show only available colours inside the filter options.
- [ ] Find a way to elegantly hide the pinned header when the user scrolls back up.
- [ ] Image Drag n Drop feature when uploading profile avatar
- [ ] Images Drag n Drop feature for `/api/add-products` when adding product images.
- [ ] Show products count per filter item constraint on the products page.
- [ ] Integrate Paypal as a second payment gateway.
- [ ] Add a captcha to the sign-up and login forms.
- [x] Create a size chart UI (almost there.)
- [ ] Animate Menu Button.
- [ ] Skeleton Loading Animation.
- [ ] Add transition animation to the product component when navigating to the product page, so the product's image transitions to the gallery.
- [ ] Paginate Products List
- [x] Make certain UI updates optimistic (like add to cart feature)

## Credits & Attributions

- Banner background image by [Jos Hoppenbrouwers](https://www.joshoppenbrouwers.com/) - Image was then manipulated using Photoshop.

- Website design Inspired By [8theme XStore](https://xstore.8theme.com/elementor/demos/sneakers/).

- [Pexels](https://www.pexels.com/) for Stock images

- Nike.com for ["Jumpman" Logo](https://www.nike.com/jordan)

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`npx create-next-app@latest . --ts`](https://github.com/vercel/next.js/blob/canary/docs/basic-features/typescript.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Install Command: `npm install && npx prisma db push`
