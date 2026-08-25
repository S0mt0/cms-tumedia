# TU Media CMS — Technical Architecture & Implementation Specification

## 0. Purpose

This document defines a private TU Media CMS and public content API for the completed TU Media marketing frontend.

The CMS is a **content control plane**, not a no-code page builder.

### CMS owns

- important page copy
- page media references
- ordered/repeatable content
- FAQs
- projects
- blogs
- legal content
- global header/footer/site copy
- brand inquiries
- creator applications
- media metadata
- admin access
- operational logs/settings

### Frontend owns

- route/page layout
- visual styling
- responsive behaviour
- animations
- existing section components
- frontend interactivity
- SEO rendering based on CMS values
- server-side consumption of CMS APIs

---

# 1. Business context

TU Media connects technology product manufacturers with social-media creators. The business is two-sided but commercially brand-led.

The current website exposes distinct brand and creator journeys:

- `/contact` for brand/general business inquiries
- `/join` for creator applications

Creator applications are part of a broader creator pool; TU Media may also source creators outside the website. The CMS therefore stores creator applications in a structure that can later support a broader creator database without prematurely building a full campaign-management platform.

The CMS scope now is:

- website content management
- project/blog publishing
- lead/application intake administration
- integrations/media/auth

It is **not** yet a full CRM or end-to-end campaign operations platform.

---

# 2. Existing frontend routes and rendered sections

## Routes

```text
/
├── /about
├── /blogs
├── /contact
├── /industries
├── /join
├── /privacy
├── /projects
├── /services
└── /terms
```

## Landing

Current frontend composition:

```text
hero
positioning
process
creatorFlowCta
industriesPreview
videoShowcase
whyTuMedia
blogPreview
faq
finalCta
```

## About

```text
hero
pointOfView
roles
howWeWork
finalCta
```

## Services

```text
hero
overview
system
deepDives
process
industries
faq
finalCta
```

## Industries

```text
hero
introduction
details
```

## Projects listing

```text
hero
collection
campaignStages
faq
invitation
```

## Blogs listing

```text
hero
grid
```

## Contact

```text
hero
form
nextSteps
```

## Join

```text
hero
form
nextSteps
faq
```

## Privacy / Terms

Controlled legal rich text.

CMS routes and public API DTOs should mirror these rendered sections.

---

# 3. High-level architecture

```text
┌───────────────────────────────────────────────────────────┐
│                 TU MEDIA CMS - Next.js                    │
│                                                           │
│  Protected dashboard                                     │
│  ├─ Server Component pages                               │
│  ├─ Client editor/form islands                           │
│  ├─ Server Actions                                       │
│  └─ Better Auth                                          │
│                                                           │
│  Public Route Handlers                                   │
│  ├─ GET page DTOs                                        │
│  ├─ POST brand inquiry                                   │
│  └─ POST creator application                             │
└────────────┬─────────────────────────────┬────────────────┘
             │                             │
             ▼                             ▼
          MongoDB                     Upstash Redis
        canonical DB                  public cache
             │
      ┌──────┼───────────────┐
      ▼      ▼               ▼
     R2   Google Sheets    Mail provider
   media   submission      magic links
           mirror

             ▲
             │ server-to-server GET/POST
             │
┌────────────┴──────────────────────────────────────────────┐
│                  TU MEDIA FRONTEND                        │
│ Server pages fetch complete CMS page payloads and pass    │
│ section objects to existing route-local components.       │
└───────────────────────────────────────────────────────────┘
```

---

# 4. Required technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB
- Upstash Redis
- Better Auth
- Tiptap
- dnd-kit
- Cloudflare R2
- Google Sheets API

Supporting packages may include:

- Zod
- React Hook Form
- Sonner
- date-fns
- AWS SDK v3 S3 client + request presigner configured against R2
- Google API auth/client package
- transactional mail provider package

Use actual compatible package versions in the CMS repository. Do not copy old versions blindly from the portfolio CMS.

---

# 5. CMS information architecture

```text
Dashboard

Website
├── Landing
├── About
├── Services
├── Industries
├── Projects
├── Blogs
├── Contact
├── Join
├── Privacy
├── Terms
└── Site / Global

Submissions
├── Brand inquiries
└── Creator applications

Assets
└── Media

Admin
├── Logs
└── Settings
```

Recommended routes:

```text
/
├── landing
├── about
├── services
├── industries
├── projects
│   ├── manage
│   ├── new
│   └── [slug]/edit
├── blogs
│   ├── manage
│   ├── new
│   └── [slug]/edit
├── contact
├── join
├── privacy
├── terms
├── site
├── submissions
│   ├── brand-inquiries
│   └── creator-applications
├── media
├── logs
└── settings
```

---

# 6. Recommended repository structure

```text
tu-media-cms/
├── README.md
├── AGENTS.md
├── auth.ts
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── proxy.ts
├── tsconfig.json
├── app/
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── (auth)/
│   │   └── auth/
│   │       ├── layout.tsx
│   │       ├── _components/
│   │       │   ├── auth-shell.tsx
│   │       │   ├── google-login-button.tsx
│   │       │   └── magic-link-form.tsx
│   │       ├── error/page.tsx
│   │       └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   ├── _components/
│   │   │   ├── dashboard-shell.tsx
│   │   │   └── dashboard-page-header.tsx
│   │   ├── landing/
│   │   ├── about/
│   │   ├── services/
│   │   ├── industries/
│   │   ├── projects/
│   │   │   ├── manage/
│   │   │   ├── new/
│   │   │   └── [slug]/edit/
│   │   ├── blogs/
│   │   │   ├── manage/
│   │   │   ├── new/
│   │   │   └── [slug]/edit/
│   │   ├── contact/
│   │   ├── join/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── site/
│   │   ├── submissions/
│   │   │   ├── brand-inquiries/
│   │   │   └── creator-applications/
│   │   ├── media/
│   │   ├── logs/
│   │   └── settings/
│   └── api/
│       ├── auth/[...all]/route.ts
│       └── public/
│           ├── site/route.ts
│           ├── landing/route.ts
│           ├── about/route.ts
│           ├── services/route.ts
│           ├── industries/route.ts
│           ├── projects/
│           │   ├── route.ts
│           │   └── [slug]/route.ts
│           ├── blogs/
│           │   ├── route.ts
│           │   └── [slug]/route.ts
│           ├── contact/route.ts
│           ├── join/route.ts
│           ├── privacy/route.ts
│           ├── terms/route.ts
│           └── newsletter/route.ts
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── ui/
├── docs/
│   └── TU_Media_CMS_Technical_Implementation_Spec.md
└── lib/
    ├── actions/
    ├── api/
    │   ├── public-response.ts
    │   └── assemblers/
    ├── auth/
    ├── cache/
    ├── constants/
    ├── db/
    │   ├── config.ts
    │   ├── redis-client.ts
    │   └── repositories/
    ├── schemas/
    ├── services/
    │   ├── google-sheets.service.ts
    │   ├── mail.service.ts
    │   └── r2.service.ts
    ├── types/
    └── utils/
```

Each dashboard route may contain `_components` and `_lib` as needed.

---

# 7. Public API contract

The frontend should not perform one request per section.

Required:

```text
GET  /api/public/site
GET  /api/public/landing
GET  /api/public/about
GET  /api/public/services
GET  /api/public/industries
GET  /api/public/projects
GET  /api/public/projects/[slug]
GET  /api/public/blogs
GET  /api/public/blogs/[slug]
GET  /api/public/contact
POST /api/public/contact
GET  /api/public/join
POST /api/public/join
GET  /api/public/privacy
GET  /api/public/terms
POST /api/public/newsletter
```

Generic response:

```ts
interface PublicPageResponse<TSections> {
  success: true;
  data: {
    page: string;
    seo: {
      title: string;
      description: string;
      ogImage?: string;
    };
    sections: TSections;
    updatedAt: string;
  };
}
```

Error:

```ts
interface PublicErrorResponse {
  success: false;
  message: string;
  code?: string;
}
```

Use explicit DTO assemblers. Never return raw repository documents.

---

# 8. MongoDB data strategy

Use a single document for each fixed frontend page, plus dynamic resource collections.

Recommended collections:

```text
siteContent
landingContent
aboutContent
servicesContent
industriesContent
projectsPageContent
projects
blogsPageContent
blogPosts
contactPageContent
joinPageContent
privacyContent
termsContent
brandInquiries
creatorApplications
newsletterSubscribers
mediaAssets
adminAllowlist
adminLogs
integrationLogs
settings
```

### Type-safety rule

Every MongoDB collection must be parameterized with its document type.

Every repository method must declare:

- typed parameters
- typed filters
- typed update payloads
- typed return values

Public DTOs must be separate from persistence models.

Do not allow `any`, raw `Document`, or untyped collection access in repository code.

Better Auth will also use its required auth collections.

Base:

```ts
interface CmsDocumentBase {
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}
```

Reusable:

```ts
interface SeoFields {
  title: string;
  description: string;
  ogImage?: string;
}

interface CtaContent {
  label: string;
  href: string;
}

interface MediaRef {
  url: string;
  key?: string;
  alt?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}
```

---

# 9. Landing model

```ts
interface LandingContent extends CmsDocumentBase {
  key: "landing";
  seo: SeoFields;

  hero: {
    eyebrow: string;
    title: string;
    emphasis?: string;
    description: string;
    primaryCta: CtaContent;
    secondaryCta: CtaContent;
    backgroundMedia: MediaRef;
    scrollLabel: string;
  };

  positioning: {
    eyebrow?: string;
    title: string;
    description: string;
    cta?: CtaContent;
    stats: Array<{
      id: string;
      value: string;
      label: string;
      order: number;
    }>;
    marqueeItems: Array<{
      id: string;
      label: string;
      iconKey?: string;
      order: number;
    }>;
  };

  process: {
    eyebrow: string;
    title: string;
    description?: string;
    steps: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
      order: number;
    }>;
  };

  creatorFlowCta: {
    eyebrow?: string;
    title: string;
    description: string;
    cta: CtaContent;
    media: MediaRef[];
  };

  industriesPreview: {
    eyebrow: string;
    title: string;
    description?: string;
    items: Array<{
      id: string;
      title: string;
      description?: string;
      iconKey?: string;
      href?: string;
      order: number;
    }>;
    cta?: CtaContent;
  };

  videoShowcase: {
    eyebrow: string;
    title: string;
    description?: string;
    youtubeUrl?: string;
    poster?: MediaRef;
    cta?: CtaContent;
  };

  whyTuMedia: {
    eyebrow: string;
    title: string;
    description?: string;
    media?: MediaRef;
    items: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
    }>;
  };

  blogPreview: {
    eyebrow: string;
    title: string;
    cta: CtaContent;
    featuredCount: number;
  };

  faq: {
    eyebrow: string;
    title: string;
    description?: string;
    items: FaqItem[];
  };

  finalCta: {
    eyebrow: string;
    title: string;
    emphasis?: string;
    description: string;
    primaryCta: CtaContent;
    reassurance?: string;
  };
}
```

`GET /api/public/landing` returns all sections in one object.

`blogPreview.items` is assembled from published `blogPosts`; do not duplicate blog post content inside the Landing document.

---

# 10. About model

```ts
interface AboutContent extends CmsDocumentBase {
  key: "about";
  seo: SeoFields;

  hero: {
    eyebrow: string;
    title: string;
    emphasis?: string;
    description: string;
    media?: MediaRef;
  };

  pointOfView: {
    eyebrow: string;
    title: string;
    description: string;
  };

  roles: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
  }>;

  howWeWork: {
    eyebrow: string;
    title: string;
    description: string;
    media?: MediaRef;
  };

  finalCta: {
    title: string;
    brandCta: CtaContent;
    creatorCta: CtaContent;
  };
}
```

---

# 11. Services model

Frontend contract:

```text
hero
overview
system
deepDives
process
industries
faq
finalCta
```

Initially keep service data in the fixed `servicesContent` document because the current site has a compact fixed service set.

Use dnd-kit for ordered arrays such as:

- services
- system/capability items
- deep dives
- process steps
- industries
- FAQ items

If independent service detail routes are added later, migrate service items to their own collection.

---

# 12. Industries model

Frontend contract:

```text
hero
introduction
details
```

Industry detail items may contain:

- stable id
- title
- code/slug if needed
- description
- supporting copy
- media
- YouTube URLs/ids where the frontend renders them
- enabled flag
- order

Do not create a public section based solely on unused files in the frontend repository.

---

# 13. Projects

## Projects page

```text
hero
collection
campaignStages
faq
invitation
```

The page document stores section copy/filter metadata. `collection.items` is assembled from published project records.

## Project record

```ts
interface ProjectContent extends CmsDocumentBase {
  slug: string;
  title: string;
  summary: string;
  industry?: string;
  services: string[];
  platforms: string[];
  heroMedia?: MediaRef;
  gallery: Array<MediaRef & { id: string; order: number }>;
  videoUrls?: string[];
  challenge?: RichTextDocument;
  strategy?: RichTextDocument;
  creatorApproach?: RichTextDocument;
  execution?: RichTextDocument;
  results?: Array<{
    id: string;
    label: string;
    value: string;
    verified: boolean;
    order: number;
  }>;
  testimonial?: {
    quote: string;
    name: string;
    role?: string;
    verified: boolean;
  };
  featured: boolean;
  published: boolean;
  publishedAt?: Date | null;
  seo: SeoFields;
}
```

Never permit placeholder/unverified results to appear as verified public claims.

---

# 14. Blogs

## Blogs page

```text
hero
grid
```

Grid stores section-level text/filter/empty-state/category configuration. Published posts are injected into `grid.items`.

## Blog post

```ts
interface BlogPostContent extends CmsDocumentBase {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: RichTextDocument;
  banner: MediaRef;
  readTime?: string;
  featured: boolean;
  published: boolean;
  publishedAt?: Date | null;
  tags: string[];
  seo: SeoFields;
}
```

Public list/slug APIs return only published posts.

The Landing preview uses this same blog collection.

When completed, remove the frontend hard-coded `lib/content/blog-posts.ts` if nothing else uses it.

---

# 15. Contact + brand inquiries

Frontend page contract:

```text
hero
form
nextSteps
```

CMS can edit approved:

- hero copy
- form intro
- field labels/placeholders
- select option labels/values
- consent text
- submit/success copy
- next-step copy

Keep field keys/types controlled by code.

Current fields:

```text
fullName
email
company
website
market
product
objective
timeline
budget
message
consent
```

Routes:

```text
GET  /api/public/contact
POST /api/public/contact
```

Suggested record:

```ts
interface BrandInquiry extends CmsDocumentBase {
  fullName: string;
  email: string;
  company: string;
  website?: string;
  market: string;
  product: string;
  objective: string;
  timeline: string;
  budget?: string;
  message: string;
  consent: true;
  status: "new" | "reviewing" | "contacted" | "closed";
  source: "frontend";
  sheetSync: SheetSyncState;
}
```

---

# 16. Join + creator applications

Frontend contract:

```text
hero
form
nextSteps
faq
```

Current creator fields:

```text
fullName
email
country
niche
platform
languages
followers
averageViews
topRegion
categories
about
primarySocialLink
secondarySocialLink
mediaKitUrl
consent
```

Suggested:

```ts
interface CreatorApplication extends CmsDocumentBase {
  fullName: string;
  email: string;
  country: string;
  niche: string;
  platform: string;
  languages?: string;
  followers: string;
  averageViews: string;
  topRegion: string;
  categories?: string;
  about?: string;
  primarySocialLink: string;
  secondarySocialLink?: string;
  mediaKitUrl?: string;
  consent: true;
  status: "new" | "reviewing" | "shortlisted" | "approved" | "declined";
  source: "frontend";
  sheetSync: SheetSyncState;
}
```

This can later seed a broader creator database.

---

# 17. Privacy / Terms

Use controlled Tiptap rich text.

Suggested fixed data:

```text
title
lastUpdated
body
contactEmail?
seo
```

Display a CMS warning that legal copy should not be casually changed and should be reviewed appropriately.

---

# 18. Site/global API

Route:

```text
GET /api/public/site
```

Suggested:

```ts
interface SiteContent {
  navigation: {
    servicesLabel: string;
    industriesLabel: string;
    projectsLabel: string;
    blogsLabel: string;
    aboutLabel: string;
    creatorsLabel: string;
    contactLabel: string;
  };
  footer: {
    positioning: string;
    contactEmail: string;
    socialLinks: Array<{
      id: string;
      label: string;
      url: string;
      order: number;
    }>;
    newsletter?: {
      enabled: boolean;
      title: string;
      description: string;
    };
  };
  organisation: {
    name: string;
    email: string;
  };
  defaultSeo: SeoFields;
}
```

Keep route destinations code-controlled.

---

# 19. Repositories

Recommended:

```text
lib/db/repositories/
├── base.repository.ts
├── site.repository.ts
├── landing.repository.ts
├── about.repository.ts
├── services.repository.ts
├── industries.repository.ts
├── projects-page.repository.ts
├── project.repository.ts
├── blogs-page.repository.ts
├── blog.repository.ts
├── contact-page.repository.ts
├── join-page.repository.ts
├── legal.repository.ts
├── brand-inquiry.repository.ts
├── creator-application.repository.ts
├── media.repository.ts
├── admin-allowlist.repository.ts
├── admin-log.repository.ts
└── integration-log.repository.ts
```

Repositories own persistence. Services own external systems. Actions coordinate authenticated mutations.

---

# 20. Redis caching

Recommended helpers:

```text
lib/cache/
├── keys.ts
├── public-content-cache.ts
└── invalidation.ts
```

Keys:

```text
tu-media-cms:v1:site
tu-media-cms:v1:page:landing
tu-media-cms:v1:page:about
tu-media-cms:v1:page:services
tu-media-cms:v1:page:industries
tu-media-cms:v1:page:projects
tu-media-cms:v1:project:{slug}
tu-media-cms:v1:page:blogs
tu-media-cms:v1:blog:{slug}
```

Use Redis as the public API cache. Initially have the frontend use server fetch with `cache: "no-store"` so there is one primary cache/invalidation layer instead of stacked CMS + frontend caches.

TTL may be 10–30 minutes as a safety expiration; explicit invalidation is the primary freshness mechanism.

---

# 21. Public DTO assemblers

Do not expose raw DB docs.

Recommended:

```text
lib/api/
├── public-response.ts
└── assemblers/
    ├── site.ts
    ├── landing.ts
    ├── about.ts
    ├── services.ts
    ├── industries.ts
    ├── projects.ts
    ├── blogs.ts
    ├── contact.ts
    └── join.ts
```

Assemblers:

- join dynamic records
- remove internal fields
- generate rich-text HTML if the public contract uses it
- convert dates to ISO
- preserve stable section keys
- return only frontend-needed values

---

# 22. Better Auth

Methods:

- Google
- magic link

No username/password and no GitHub.

Use MongoDB adapter.

Allowlist:

- env `DEFAULT_ADMIN_EMAILS`
- MongoDB additions
- lowercase normalisation
- env admins immutable
- remove/revoke DB admins carefully
- revoke sessions after access removal when practical

Auth files:

```text
auth.ts
lib/auth/
├── allowlist.ts
├── client.ts
├── guards.ts
├── routes.ts
└── server.ts
```

Dashboard layout calls `requireAdminSession()`.

---

# 23. Google Sheets integration

MongoDB is canonical; Sheets mirrors incoming operational data.

Use a dedicated service account. Keep it separate from Better Auth Google OAuth.

Recommended tabs:

```text
Brand Inquiries
Creator Applications
Newsletter Subscribers
```

## Brand columns

```text
Submission ID
Created At
Full Name
Email
Company
Website
Market
Product
Objective
Timeline
Budget
Message
Status
```

## Creator columns

```text
Submission ID
Created At
Full Name
Email
Country
Niche
Primary Platform
Languages
Followers/Subscribers
Average Views
Top Engagement Region
Preferred Categories
About
Primary Social Link
Secondary Social Link
Media Kit URL
Status
```

Integration service:

```text
lib/services/google-sheets.service.ts
```

Submission:

```text
validate/rate-limit
        ↓
insert MongoDB (pending)
        ↓
append Google Sheets
     ↙        ↘
 synced       failed
   ↓             ↓
update DB    update DB + log
```

User submission remains accepted once canonical MongoDB write succeeds even if Sheets later fails.

Admin sees a failed-sync badge and can retry via authenticated Server Action.

---

# 24. Cloudflare R2

Use R2 for media.

It supports an S3-compatible client pattern.

Suggested client config:

```ts
const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
```

Upload sequence:

1. authenticated action validates metadata
2. generate unique key
3. return short-lived signed PUT URL
4. browser uploads directly
5. action/repository records asset metadata
6. content references public URL/key

Use `R2_PUBLIC_BASE_URL` for public delivery.

---

# 25. Media library

Route:

```text
/media
```

Suggested record:

```ts
interface MediaAsset {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  folder: "media" | "blogs" | "projects" | "pages";
  createdBy: string;
  createdAt: Date;
}
```

Admin features:

- upload
- preview
- copy URL
- alt editing
- search/filter
- delete confirm
- reference check where feasible

---

# 26. Tiptap

Canonical rich document:

```ts
type RichTextDocument = {
  json: Record<string, unknown>;
  html?: string;
};
```

Use primarily:

- blogs
- project case-study rich sections
- privacy
- terms

Controlled toolbar:

```text
Undo / Redo
Paragraph
H2 / H3 / H4
Bold / Italic / Underline
Bullet / Ordered List
Blockquote
Link
Horizontal Rule
Image
YouTube
```

No arbitrary HTML, fonts, sizes or colours.

Tiptap image uploads use R2.

Editor is client-side; public frontend does not need to install Tiptap if CMS generates trusted HTML from the same controlled schema.

---

# 27. dnd-kit

Appropriate for:

- process steps
- FAQ ordering
- services/deep dives
- industries
- gallery/media ordering
- selected homepage arrays

Requirements:

- stable ids
- keyboard + pointer sensor support
- visible drag handles
- server-action persistence
- accessible fallback
- do not make all fixed page sections reorderable

---

# 28. CMS UI

Light theme only.

Suggested layout:

```text
┌───────────────┬────────────────────────────────────────────┐
│ Sidebar       │ Page title               View frontend ↗  │
│               │ Description                                │
│ Dashboard     ├────────────────────────────────────────────┤
│ Website       │                                            │
│ Submissions   │ Module/editor cards                        │
│ Media         │                                            │
│ Logs          │                                            │
│ Settings      │                                            │
└───────────────┴────────────────────────────────────────────┘
```

Use a mobile Sheet for navigation.

Module cards should use section-level Save rather than one giant page form.

Palette:

```text
Ink      #0B0D17
Canvas   #F7F8FC
Blue     #3178FF
Violet   #7047EB
Pink     #FF3D8D
Lavender #EEE9FF
```

White editing surfaces; subtle borders/shadows; no unnecessary gradients/glass.

---

# 29. Dashboard

Operational cards:

- brand inquiries awaiting action
- creator applications awaiting action
- failed Sheets syncs
- draft blogs
- published blogs
- draft projects
- published projects
- recent admin logins
- recent content updates

Avoid vanity metrics and fake data.

---

# 30. Submission admin

## Brand inquiries

- pagination
- search
- status/date filter
- detail
- `new | reviewing | contacted | closed`
- Sheets sync badge
- retry
- optional internal note
- archive/status rather than casual hard delete

## Creator applications

- pagination
- search
- filter niche/platform/country/status
- detail
- social links
- `new | reviewing | shortlisted | approved | declined`
- Sheets sync badge
- retry
- optional internal note

---

# 31. Settings / logs

## Settings

- admin allowlist
- integration status
- frontend URL
- CMS URL
- Mongo connectivity
- Redis connectivity
- R2 connectivity
- Google Sheets connectivity
- mail connectivity

Never display raw secrets.

## Logs

At minimum:

- login/logout
- access grant/revoke
- integration failures

Paginate/filter.

---

# 32. Frontend client structure

Add to frontend:

```text
lib/cms/
├── client.ts
├── types.ts
├── site.ts
├── landing.ts
├── about.ts
├── services.ts
├── industries.ts
├── projects.ts
├── blogs.ts
├── contact.ts
└── join.ts
```

Generic server fetch:

```ts
export async function cmsFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${process.env.CMS_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  const payload = await response.json();

  if (!payload.success) {
    throw new Error(payload.message || "CMS request failed");
  }

  return payload.data;
}
```

Keep `CMS_BASE_URL` server-only for page GETs.

---

# 33. Frontend form submissions

Preferred:

```text
Client form
    ↓
Frontend Server Action
    ↓
CMS public POST endpoint
    ↓
MongoDB canonical insert
    ↓
Google Sheets mirror
```

Benefits:

- no browser CORS requirement
- CMS URL stays server-side
- frontend retains good pending/error UX
- frontend does not couple directly to CMS database

Do not write directly from the frontend into CMS MongoDB.

---

# 34. SEO

Every fixed page has CMS-managed:

- title
- description
- optional OG image

Projects/blogs have resource SEO.

Public DTO puts SEO next to `sections`.

Frontend uses it in `generateMetadata()`.

Avoid unnecessary duplicate CMS requests between `generateMetadata` and page render where a safe per-request deduplication pattern is available.

---

# 35. Initial data migration

Seed CMS fixed-page documents from the current frontend copy.

A fixed-page repository may:

1. query MongoDB
2. if missing, create default document from current content
3. return it

Do not let the frontend go blank solely because the CMS DB has not yet been seeded.

After frontend route is successfully integrated, remove duplicated hard-coded content.

There should be one content source of truth.

---

# 36. Environment variables

CMS:

```text
BASE_URL=
FRONTEND_BASE_URL=

MONGODB_URI=
MONGODB_DB=tu_media_cms

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
DEFAULT_ADMIN_EMAILS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

MAIL_FROM=
RESEND_API_KEY=                 # if Resend is selected

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=

GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_SHEETS_BRAND_RANGE="Brand Inquiries!A:M"
GOOGLE_SHEETS_CREATOR_RANGE="Creator Applications!A:Q"
GOOGLE_SHEETS_NEWSLETTER_RANGE="Newsletter Subscribers!A:D"
```

Frontend:

```text
CMS_BASE_URL=
```

Do not prefix server-only values with `NEXT_PUBLIC_`.

---

# 37. Public submission security

At minimum:

- per-IP Redis throttle
- basic per-email throttle
- honeypot
- body-size limits
- strict validation
- URL normalisation for submitted links
- safe server error response

Never store arbitrary unvalidated request JSON.

---

# 38. Accessibility

Target WCAG 2.2 AA.

CMS:

- semantic forms
- label/error relationships
- visible focus
- keyboard navigation
- accessible dnd-kit keyboard flow
- real table headings
- non-colour-only status
- destructive action confirmation
- accessible dialog/sheet primitives
- practical 44px touch targets
- usable responsive forms/tables
- accessible Tiptap toolbar

Frontend integration must preserve current frontend accessibility.

---

# 39. Styling

Tailwind is the default.

Use `globals.css` for:

- Tailwind setup
- design tokens
- base styles
- Tiptap nested/prose rules
- necessary browser selectors/keyframes

Do not move ordinary dashboard/page styling into global semantic CSS classes.

Use shadcn only when actively needed. Remove unused installed primitives.

---

# 40. Implementation order

## Phase 1 — Foundation

- Next.js CMS repository
- MongoDB
- repositories/base types
- Redis
- Better Auth Google + magic link
- allowlist
- dashboard shell
- light design tokens
- public response helpers
- R2 client/presign base
- Google Sheets service skeleton

## Phase 2 — Site + Landing vertical slice

- Site/global editor + API
- Landing schema/repository/editor/actions/cache/API
- frontend site/header/footer integration
- frontend Landing integration

This phase proves the complete architecture.

## Phase 3 — About

Complete full CMS/API/frontend slice.

## Phase 4 — Services

Complete slice.

## Phase 5 — Industries

Complete slice.

## Phase 6 — Projects

- projects-page content editor
- project dynamic records
- manager/new/edit
- public list/slug
- frontend listing
- frontend detail route when implemented

## Phase 7 — Blogs

- blogs-page editor
- blog manager/new/edit
- Tiptap
- list/slug API
- frontend integration
- remove hard-coded blog array

## Phase 8 — Contact

- contact page CMS
- POST endpoint
- MongoDB
- Sheets
- admin inquiry table
- frontend real submission

## Phase 9 — Join

- join page CMS
- POST endpoint
- MongoDB
- Sheets
- creator applications admin
- frontend real submission

## Phase 10 — Legal

Privacy + Terms + Tiptap + frontend.

## Phase 11 — Operations

Media, dashboard metrics, logs, settings/integration health.

## Phase 12 — QA

- auth/access
- cache hit/miss/fallback
- invalidation
- API contracts
- rate limiting
- submissions
- Sheets failure/retry
- R2 upload/delete
- Tiptap output
- CMS responsiveness/accessibility
- frontend regression
- dead-code/dependency cleanup

---

# 41. Definition of done

A CMS-managed page is done only when:

- types/schema exist
- repository exists
- default/seed content exists
- CMS loads content
- CMS editing is authenticated
- validation works
- mutation persists
- cache invalidates
- public GET returns full section DTO
- API strips internal fields
- frontend Server Component fetches it
- existing frontend section components consume props
- hard-coded content is removed
- SEO is connected where applicable
- loading/error states are sensible
- frontend visuals/responsiveness are preserved
- accessibility remains correct
- lint/typecheck/build pass
- unused files/components/dependencies are removed

---

# 42. Architectural restraint

Do not turn this into a page builder.

Admins should not edit:

- arbitrary Tailwind classes
- CSS
- grid layouts
- font sizes
- animation timings
- React component names
- raw route paths
- API keys/secrets
- arbitrary HTML

The CMS edits content; the frontend controls presentation.
