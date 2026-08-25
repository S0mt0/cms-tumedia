# AGENTS.md

## 1. Mission

You are working on the private TU Media CMS and its public content API.

The CMS manages the completed TU Media frontend. It is a **content control plane**, not a visual page builder. The frontend keeps ownership of layout, styling, responsiveness, animation and component composition. The CMS owns editable content, ordered content entities, public API delivery, submissions, media and administration.

Throughout this repository, **frontend** means the public TU Media website.

Before non-trivial work, read:

- `docs/TU_Media_CMS_Technical_Implementation_Spec.md`

When a task changes an API contract, also inspect the matching current frontend route/components before coding.

Do not invent CMS fields or page sections that the current frontend does not use unless the task explicitly adds them.

---

## 2. Approved architecture

Use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- MongoDB as canonical database
- Upstash Redis as public-content cache
- Better Auth
- Google authentication
- magic-link authentication
- Tiptap
- dnd-kit
- Cloudflare R2
- Google Sheets API
- Server Actions for authenticated CMS mutations
- Route Handlers for public frontend-facing APIs

Do not implement:

- username/password CMS login
- GitHub CMS login
- public CMS registration
- AWS S3 as the storage service
- dark theme/theme toggle
- arbitrary page-builder layout editing

Using AWS SDK v3 S3-compatible client packages configured against Cloudflare R2 is acceptable; the storage provider remains R2.

Installed package versions are the source of truth. Inspect `package.json` before using version-sensitive framework/library APIs.

---

## 3. Source-of-truth hierarchy

When instructions conflict:

1. Current user/task request
2. `AGENTS.md`
3. `docs/TU_Media_CMS_Technical_Implementation_Spec.md`
4. Current frontend implementation/API contract
5. Deliberate existing repository conventions
6. Framework/library defaults

Do not treat placeholder/experimental code as a stronger convention.

---

## 4. Vertical-slice rule: CMS + API + frontend

Do not develop the CMS in isolation.

For every CMS-managed frontend page/content area, finish the vertical slice before moving to the next:

1. Define/update TypeScript types.
2. Define/update validation schema.
3. Implement repository/data access.
4. Add defaults/seed content if needed.
5. Implement authenticated CMS Server Actions.
6. Build the CMS editing UI.
7. Implement Redis caching/invalidation.
8. Implement public API endpoint.
9. Update frontend CMS client/types.
10. Make frontend route page fetch the complete endpoint on the server.
11. Pass section data into existing frontend section components.
12. Remove replaced hard-coded data.
13. Verify frontend SEO/loading/error/accessibility/responsiveness.
14. Remove dead code and dependencies.

A CMS form saving to MongoDB is **not** a complete task if the corresponding frontend still uses old hard-coded content.

---

## 5. Frontend server-rendering rule

All main frontend route pages remain Server Components.

Frontend `page.tsx` files should:

- fetch the complete CMS page payload server-side
- orchestrate page sections
- pass serialisable section data down to existing child components
- remain small/compositional rather than monolithic

Preferred:

```tsx
export default async function HomePage() {
  const page = await getLandingPage();

  return (
    <>
      <HeroSection data={page.sections.hero} />
      <PositioningSection data={page.sections.positioning} />
      <ProcessSection data={page.sections.process} />
    </>
  );
}
```

Do not use `useEffect` for initial CMS page data.

Do not fetch initial CMS page content in frontend Client Components when the server page can do it.

Client Components are for genuinely client-only behaviour: forms, local state, Tiptap, drag/drop, browser APIs and animation.

---

## 6. Public API policy

One GET request returns one complete frontend page payload.

Do **not** create one public request per section.

Required page GET endpoints:

```text
/api/public/site
/api/public/landing
/api/public/about
/api/public/services
/api/public/industries
/api/public/projects
/api/public/projects/[slug]
/api/public/blogs
/api/public/blogs/[slug]
/api/public/contact
/api/public/join
/api/public/privacy
/api/public/terms
```

Submission POST endpoints:

```text
POST /api/public/contact
POST /api/public/join
POST /api/public/newsletter   # only if enabled
```

Response contract:

```ts
type PublicPageResponse<TSections> = {
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
};

type PublicErrorResponse = {
  success: false;
  message: string;
  code?: string;
};
```

Rules:

- return explicit public DTOs, never raw Mongo documents
- convert Dates to ISO strings
- map internal ids intentionally to `id`
- never expose Better Auth/session data
- never expose Redis keys
- never expose admin emails/IP/user-agent logs
- never expose integration credentials/errors verbatim
- coordinate breaking API changes with frontend changes in the same task

---

## 7. Current frontend page contracts

Use these stable section keys unless the frontend itself changes in the same task.

### Landing

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

### About

```text
hero
pointOfView
roles
howWeWork
finalCta
```

### Services

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

### Industries

```text
hero
introduction
details
```

Do not expose an `industryVideoGallery` section solely because an unused component file exists. Follow what the frontend route actually renders.

### Projects listing

```text
hero
collection
campaignStages
faq
invitation
```

Dynamic project records are separate resources.

### Blogs listing

```text
hero
grid
```

Published blog records are injected into `grid.items`.

### Contact

```text
hero
form
nextSteps
```

Form field names/types remain controlled by code; CMS may edit approved labels, placeholders, option labels/values and supporting/success copy.

### Join

```text
hero
form
nextSteps
faq
```

Creator field names/types remain code-controlled.

### Privacy / Terms

Controlled rich-text/legal content.

---

## 8. MongoDB

MongoDB is canonical.

Use a repository layer. React components must never import the MongoDB client.

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

Better Auth owns its own required collections.

Rules:

- one fixed page document per fixed page
- dynamic project/blog/submission/media records use dedicated collections
- repositories own queries
- add indexes for unique slugs, emails, statuses, timestamps and common filters
- use transactions only for truly atomic multi-Mongo writes
- do not wrap external Google/R2/mail calls inside Mongo transactions
- use narrow projections for large admin tables where possible

---

## 9. Repository pattern

Recommended:

```text
lib/db/
├── config.ts
├── redis-client.ts
└── repositories/
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

Do not create empty/pass-through abstractions with no value.

Fixed-page repositories should expose only useful operations such as `get`, `updateSection`, `updateSeo`.

---

## 10. Validation

Validate all external boundaries server-side.

Use the repository's established validation library (prefer Zod if already chosen).

Validate:

- Server Action inputs
- public POST bodies
- public query params
- slugs
- upload metadata
- sortable order arrays
- content length limits
- CMS option arrays
- integration mapping input where useful

Do not trust browser validation.

Suggested schema organisation:

```text
lib/schemas/
├── auth.schema.ts
├── site.schema.ts
├── landing.schema.ts
├── about.schema.ts
├── services.schema.ts
├── industries.schema.ts
├── project.schema.ts
├── blog.schema.ts
├── contact.schema.ts
├── creator.schema.ts
├── legal.schema.ts
└── media.schema.ts
```

Use sensible copy-length limits so CMS authors cannot accidentally destroy frontend layouts.

---

## 11. Upstash Redis

Redis caches assembled public GET DTOs, not admin editing state.

Prefix:

```text
tu-media-cms:v1:
```

Example keys:

```text
tu-media-cms:v1:site
tu-media-cms:v1:page:landing
tu-media-cms:v1:page:services
tu-media-cms:v1:page:projects
tu-media-cms:v1:project:{slug}
tu-media-cms:v1:page:blogs
tu-media-cms:v1:blog:{slug}
tu-media-cms:v1:auth:allowlist
```

Read:

1. Redis
2. on hit, return cached DTO
3. on miss, assemble from MongoDB
4. write serialisable DTO with TTL
5. return DTO

Mutation:

1. validate/authenticate
2. update MongoDB
3. invalidate exact affected key(s)
4. invalidate dependent page keys
5. revalidate CMS path if needed

Examples:

- Landing update -> invalidate landing
- Blog publish/update -> invalidate blogs list, blog slug and landing because Landing has blog preview
- Project publish/update -> invalidate projects list, project slug and any page embedding it

Redis errors must be non-fatal. Log and fall back to MongoDB.

Never cache submission POST writes.

---

## 12. Better Auth

Auth is private and allowlist-based.

Allowed providers:

- Google
- magic link

Forbidden:

- password/username
- GitHub
- public registration

Use Better Auth MongoDB adapter.

Admin allowlist:

- `DEFAULT_ADMIN_EMAILS` seeds environment admins
- DB allowlist supports additional admins
- normalise emails to lowercase
- reject non-allowlisted identities
- environment admins cannot be removed through CMS
- removing a DB admin should revoke active sessions where practical

Protection:

- proxy/middleware may perform a quick cookie-presence redirect
- protected dashboard layout still calls authoritative server `requireAdminSession()`
- cookie presence alone is never authorisation

Google OAuth credentials for CMS login are separate from Google Sheets service-account credentials.

Magic-link email is sent through a server mail service abstraction.

Safe callback URLs must remain same-origin.

---

## 13. Logs

Record meaningful auth/security events:

```text
login
logout
admin_access_granted
admin_access_revoked
```

Fields may include:

- user/admin id
- name/email
- provider
- non-sensitive session reference
- IP
- user agent
- timestamp/event type

Do not expose logs publicly.

`/logs` requires pagination and basic filters.

Integration failures such as Sheets/R2/Redis failures may be logged separately.

Do not audit every keystroke.

---

## 14. Server Actions

Use Server Actions for authenticated CMS mutations:

- fixed-page section updates
- SEO updates
- project/blog create/update/publish/archive/delete
- reorder operations
- admin allowlist changes
- Google Sheets retry sync
- R2 presign/media metadata actions
- settings updates

Every CMS mutation must:

1. `requireAdminSession()`
2. validate input
3. call repository/service
4. invalidate relevant Redis keys
5. `revalidatePath()` for affected CMS UI where appropriate
6. return predictable result
7. never expose stack traces/secrets

Do not put public frontend mutations into protected Server Actions; frontend consumers use the public Route Handler boundary.

---

## 15. Public Route Handlers

GET handlers:

- cache lookup
- load/assemble public DTO
- strip internal fields
- return consistent JSON

POST handlers:

- body-size control
- rate-limit
- honeypot/bot check where implemented
- validate/normalise
- persist canonical MongoDB record
- invoke integration services
- return safe response

Never allow public endpoints to update CMS page content.

---

## 16. Contact + creator submission reliability

MongoDB persistence comes first.

Flow:

1. validate
2. rate-limit
3. insert Mongo record with `sheetSync.status = "pending"`
4. append Google Sheet row
5. update Mongo record to `synced` or `failed`
6. record integration error when failed
7. return success after canonical Mongo persistence

Use:

```ts
type SheetSyncState = {
  status: "pending" | "synced" | "failed";
  attemptedAt?: Date;
  syncedAt?: Date;
  rowRange?: string;
  lastError?: string;
};
```

If Sheets fails, **do not lose or reject the canonical submission solely for that reason**.

Admin submission views show sync badge and an authenticated `Retry sync` action.

Persist returned sheet row/range/reference where useful to reduce duplicate retry risk.

---

## 17. Google Sheets

Use server-to-server Google Sheets integration with a dedicated service account.

Do not use administrator Google OAuth tokens for Sheets.

Suggested tabs:

```text
Brand Inquiries
Creator Applications
Newsletter Subscribers
```

Secrets live only in env:

```text
GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_SHEETS_BRAND_RANGE
GOOGLE_SHEETS_CREATOR_RANGE
GOOGLE_SHEETS_NEWSLETTER_RANGE
```

The spreadsheet must be shared with the service-account email.

Own the integration in:

```text
lib/services/google-sheets.service.ts
```

That service handles auth, row mapping, append and normalised errors.

Never call Google APIs from React components or repositories.

---

## 18. Cloudflare R2

Use Cloudflare R2 rather than an AWS S3 bucket.

R2 is S3-compatible, so AWS SDK v3 S3 client/presigner packages may be used against the R2 endpoint.

Environment:

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_BASE_URL
```

Presigned upload flow:

- authenticated Server Action
- validate MIME, max size and folder
- create unique key such as `media/{uuid}-{safeName}`
- short-lived presigned PUT
- sign expected content type
- browser uploads directly
- store media metadata in MongoDB
- persist public URL/key in content

Do not leak R2 credentials.

Public content uses a configured R2 public/custom-domain URL, not a presigned upload URL.

Media deletion:

- require confirmation
- check references where possible
- delete R2 object
- remove/archive media record
- invalidate dependent page caches

---

## 19. Media library

Provide `/media`.

The media library is a first-class visual CMS feature, not a raw URL registry. Every page/blog/project media editor should integrate with upload and preview controls. Administrators should normally upload a file or choose an existing R2 asset rather than type a URL.

Suggested record:

```ts
type MediaAsset = {
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
};
```

Features:

- upload
- preview
- copy URL
- edit alt
- search/filter
- delete confirmation
- avoid deleting known referenced assets

Do not build an enterprise DAM.

---

## 20. Tiptap usage

Use Tiptap only for content needing rich formatting:

- blog body
- project/case-study rich text if needed
- privacy
- terms
- truly long editorial blocks

Use normal inputs/textareas for:

- headings
- eyebrows
- CTA labels
- short descriptions
- FAQ questions/answers unless rich answer is explicitly needed
- form labels/placeholders

Tiptap is a Client Component. In SSR/Next environments, configure editor creation to avoid incorrect immediate server rendering.

Controlled features:

- paragraph
- H2/H3/H4
- bold
- italic
- underline
- bullet/ordered lists
- blockquote
- link
- horizontal rule
- R2 image upload
- YouTube embed when needed
- undo/redo

Avoid:

- body H1
- arbitrary fonts
- arbitrary font sizes
- arbitrary colours
- arbitrary backgrounds
- arbitrary raw HTML
- arbitrary inline CSS

Prefer Tiptap JSON as canonical content. API may expose generated trusted HTML from the same approved extension set.

If HTML is exposed:

- generate it server-side from approved schema
- never enable arbitrary HTML nodes
- restrict links to safe protocols
- never render public-user supplied HTML

---

## 21. Tiptap/CMS styling

The editor must visually fit TU Media while remaining an admin tool:

- soft neutral canvas
- white editor surface
- ink body text
- violet/blue active/focus state
- pink used sparingly
- Manrope UI
- subtle borders/shadows
- rich-text reading measure about 720–820px
- responsive toolbar
- accessible touch targets

Do not copy frontend oversized marketing typography into admin UI.

Preview typography should approximately resemble the frontend article/project rendering so editors understand content rhythm.

---

## 22. dnd-kit

Use only where order has real meaning:

- process steps
- FAQ items
- industries
- service deep dives
- selected homepage lists
- project/gallery media

Do not make fixed frontend page section order draggable unless the frontend also supports dynamic section ordering.

Requirements:

- stable ids
- Pointer + Keyboard sensors
- explicit drag handle
- accessible non-pointer operation
- optimistic local order
- final ordered ids saved through Server Action
- avoid whole-card drag activation when controls exist inside the card

---

## 23A. CMS visual quality bar

The CMS must look and feel like a polished commercial SaaS product.

Use the interaction quality and visual restraint of products such as Linear, Vercel, Notion, modern editorial CMS products, and the supplied dashboard references as the benchmark. Do not copy any product literally. Translate that quality bar into TU Media's own design system.

The CMS must feel:

- professional
- premium
- modern
- visually alive
- highly structured
- easy to scan
- comfortable to use for long editing sessions
- clearly branded as TU Media
- sophisticated without feeling flashy
- dense enough to be productive without feeling cramped

"Professional" and "calm" must never be interpreted as plain, lifeless, sterile, or visually undifferentiated.

Avoid a raw admin/database aesthetic.

Do not build pages that are simply:

```text
label
textarea
label
textarea
raw JSON
save button
```

The CMS must model the human editing task, not expose the persistence shape.

### Visual hierarchy

Use hierarchy intentionally:

- strong page titles
- restrained supporting descriptions
- clear section titles
- compact eyebrow/status labels where useful
- grouped field clusters
- visual separation between primary and secondary actions
- quiet metadata
- prominent but tasteful primary actions
- polished hover/focus/selected states
- useful status badges
- subtle dividers
- restrained shadows
- generous but efficient spacing

Important content fields such as page headings may receive a stronger input treatment than metadata fields.

Do not make every field look equally important.

### Branding

Use TU Media's palette deliberately:

```css
--ink: #0B0D17;
--canvas: #F7F8FC;
--blue: #3178FF;
--violet: #7047EB;
--pink: #FF3D8D;
--lavender: #EEE9FF;
```

Recommended use:

- `ink` for primary text and dark UI regions
- `canvas` for application background
- white for editing surfaces
- violet for active navigation, primary CMS accents and selected state
- blue for links, focus and secondary action emphasis
- pink only for restrained highlights, notification emphasis or destructive attention
- lavender for selected/soft contextual surfaces

Do not reduce the application to grey-on-white.

Do not overuse colour either. The visual identity should feel controlled.

### Sidebar

Desktop CMS navigation uses a collapsible sidebar.

Expanded state should show:

- TU Media identity/logo
- section grouping labels
- icons
- navigation labels
- relevant count badges
- authenticated-user area near the bottom

Collapsed state should:

- remain fully usable
- show icons
- show accessible tooltips for hidden labels
- preserve active state
- not shift content unpredictably
- remember the user's preference when practical

Desktop sidebar requirements:

- fixed or sticky to the viewport
- full viewport height
- must not scroll away when page content scrolls
- sidebar's own navigation area may scroll internally if necessary
- collapse/expand affordance must be obvious and keyboard accessible
- width transition should be subtle and performant
- content layout must account for the current sidebar width without horizontal overflow

Mobile/tablet:

- use a Sheet/Drawer rather than a compressed desktop sidebar
- preserve section grouping
- maintain touch targets of approximately 44px

### Header

The dashboard header/top bar must remain visible while the main page scrolls.

Use a fixed or sticky header that:

- stays attached to the viewport
- respects sidebar width on desktop
- does not cover page content
- has an appropriate z-index
- uses subtle backdrop/background separation
- remains compact rather than oversized

Header may contain:

- current page title/breadcrumb context where useful
- search or command access if implemented
- notification/integration indicator if useful
- `View website`/`Preview` actions
- authenticated user profile control

Do not let the header scroll out of view.

### Authenticated user profile

The CMS must have a visible authenticated-user profile affordance.

At minimum show:

- avatar/profile image when available
- fallback initials/avatar
- user name
- user email in the profile menu
- authentication provider where useful

User profile menu should provide appropriate actions such as:

- Profile / Account
- User preferences
- Admin settings when authorised
- View website
- Sign out

Do not create fake profile-editing functionality when Better Auth or the current account model does not support it.

Use an accessible DropdownMenu/Popover pattern.

### User settings and preferences

Provide a lightweight user-preferences experience where it adds real value.

Suitable preferences include:

- sidebar collapsed/expanded preference
- default page/table density if implemented
- rows-per-page preference if implemented
- optional editor preferences

Do not add theme selection; the CMS is light theme only.

User preferences should not expose security-sensitive auth/session controls casually.

### Dashboard pages

Dashboard/home pages should use a considered information layout.

Good patterns:

- operational metric cards
- recent activity
- recent submissions
- failed integration states
- content publishing status
- quick actions
- compact tables
- useful empty states

Avoid fake analytics, decorative charts, or meaningless cards.

All dashboard metrics must come from real data.

### Page editor composition

Each CMS page should visually resemble a structured editing workspace.

For long pages, use:

- page title + concise description
- status/last-updated area
- `View frontend` action
- compact sticky section navigation where useful
- individual section module cards
- grouped fields
- visual media controls
- section-level save feedback
- clear dirty/pending/saved states where practical

Do not render one uninterrupted vertical wall of controls.

### Structured domain values

Never expose ordinary structured application data as raw JSON textareas.

For example, do not make admins edit this:

```json
{
  "label": "Connect with us",
  "href": "/contact"
}
```

Instead use dedicated controls:

```text
Primary CTA

Label
[ Connect with us ]

Destination
[ /contact ]
```

Likewise:

- CTA -> grouped label + destination fields
- media -> visual media picker/uploader
- arrays -> repeatable item cards/managers
- boolean -> Switch
- enum -> Select
- date -> date/date-time control
- URL -> URL-specific input
- long plain text -> Textarea
- rich content -> Tiptap
- list ordering -> dnd-kit where appropriate

The editor must hide persistence complexity from the user.

### Repeatable content

Repeatable content must use polished item-management interfaces.

Examples:

- FAQ items
- process steps
- statistics
- services
- industries
- gallery assets
- social links

Recommended item interface:

- drag handle when sortable
- title/summary
- status where applicable
- edit action
- delete/archive action
- optional thumbnail
- clear Add item action

Use dnd-kit only when order matters.

### Feedback and states

Every user-triggered mutation must provide visible feedback.

Provide:

- pending/disabled save state
- success confirmation
- validation errors
- integration failure state where relevant
- empty states
- skeleton/loading states where appropriate
- confirmation dialogs for destructive actions

Do not leave users wondering whether a save happened.

### Motion

CMS motion should be restrained and functional.

Use motion for:

- sidebar collapse/expand
- dropdown/sheet/dialog transitions
- list insertion/removal
- drag feedback
- success/validation feedback

Do not use marketing-style scroll effects in the CMS.

Respect `prefers-reduced-motion`.

---

## 23B. Media upload and preview UX

The CMS must never require administrators to manually type a media URL as the primary media-management workflow.

Media fields must provide actual upload and preview functionality.

### Required media-field experience

For every CMS field representing an image or video, provide an appropriate media control with:

- current asset preview
- filename
- file type
- useful dimensions/size metadata where available
- alt text for meaningful images
- upload/replace action
- choose-from-media-library action where the library exists
- remove action where removal is valid
- clear upload progress/pending state
- clear upload success/failure state

A manual URL field may exist only as an advanced/fallback option if there is a legitimate external-media use case. It must not be the primary control for R2-managed media.

### File upload flow

Use the approved Cloudflare R2 presigned-upload architecture:

```text
Admin browser
    ↓ request signed upload target
Authenticated Server Action
    ↓ validate filename/MIME/size/folder
Generate short-lived presigned PUT URL
    ↓
Admin browser uploads directly to R2
    ↓
Persist MediaAsset metadata in MongoDB
    ↓
Attach MediaRef to page/project/blog content
```

Do not proxy large media bytes through ordinary Next.js Server Actions unless there is a specific technical reason.

### Upload validation

Before signing/uploading, validate:

- MIME type
- extension where useful
- maximum file size
- media category/folder
- filename sanitisation
- image/video type compatibility with the destination field

Use unique object keys.

Never trust the browser-reported filename or MIME type without server-side validation rules.

### Image fields

Image controls should show:

- aspect-ratio-aware thumbnail
- object-fit representation close to expected frontend usage
- alt text input
- Replace
- Choose from library
- Remove where permitted

When a frontend area has a known aspect ratio, communicate that in helper text or preview frame.

### Video fields

Video controls should show:

- poster/thumbnail preview
- filename and type
- playback preview where practical
- Replace
- Remove where permitted
- optional poster-image selector where the frontend needs it

Do not autoplay video in the CMS unless muted and intentionally previewed.

### External YouTube/Vimeo fields

If a frontend section intentionally uses a third-party video URL, provide a dedicated URL/embed field with validation and a preview.

Do not treat YouTube/Vimeo URLs as R2 file uploads.

### Media library integration

Where `/media` exists, media fields should support selecting an existing asset rather than forcing repeated uploads.

The media picker should provide:

- thumbnails
- search
- basic filters
- selected state
- confirm selection
- accessible keyboard interaction

### Accessibility

Media controls must:

- be keyboard accessible
- have labelled upload buttons
- expose meaningful error messages
- allow alt text entry where required
- not rely on drag-and-drop alone for file selection

Drag-and-drop upload is an enhancement; a normal file chooser must remain available.

## 24. Page editor UX

Each page editor follows frontend section order.

For long pages:

- optional sticky/compact section index
- one clear module card per section
- section-level Save
- success/error feedback
- media preview
- View frontend link
- concise descriptions/help copy
- no giant undifferentiated single form

CMS authors edit content, not arbitrary frontend classes/layouts.

---

## 25. shadcn/ui

Use shadcn when a suitable accessible primitive exists.

Likely useful:

- Button
- Card
- Input
- Textarea
- Field/Label
- Select
- Checkbox
- Switch
- Accordion
- AlertDialog
- Dialog
- DropdownMenu
- Sheet
- Tabs
- Table
- Badge
- Tooltip
- Skeleton
- toast/Sonner if adopted

Before installing:

1. inspect `components.json`
2. inspect `components/ui`
3. inspect dependency graph
4. confirm need
5. confirm no equivalent exists

Do not bulk-install components.

Delete unused shadcn files/variants.

---

## 26. Tailwind CSS

Tailwind utilities are the default styling approach.

Use utilities for layout, spacing, sizing, typography, colour, borders, states, responsive behaviour and ordinary transitions.

`globals.css` is for:

- Tailwind import
- design tokens
- base/reset
- Tiptap/prose nested selectors
- browser selectors utilities cannot express cleanly
- limited shared keyframes

Do not move normal route/component styling into global semantic CSS classes.

---

## 27. File organisation

Route-only UI:

```text
app/(dashboard)/landing/_components
```

Route-only helpers:

```text
app/(dashboard)/landing/_lib
```

Shared:

```text
components/
├── common
├── forms
├── layout
└── ui
```

Server/domain:

```text
lib/
├── actions
├── api
├── auth
├── cache
├── constants
├── db
├── schemas
├── services
├── types
└── utils
```

Keep `page.tsx` as Server Components and primarily compositional.

Do not promote components to shared folders before real reuse exists.

---

## 28. Dashboard

Show operational information, not vanity numbers:

- new/reviewing brand inquiries
- new/reviewing creator applications
- failed Sheets syncs
- draft/published blogs
- draft/published projects
- recent admin logins
- recent content updates

All values must be real.

---

## 29. Submission administration

### Brand inquiries

- paginated
- searchable
- date/status filters
- detail view
- status: `new | reviewing | contacted | closed`
- Sheets sync badge
- retry sync
- optional internal notes
- prefer archive/status over casual deletion

### Creator applications

- paginated
- searchable
- filters for niche/platform/country/status
- detail view
- social links
- status: `new | reviewing | shortlisted | approved | declined`
- Sheets sync badge
- retry sync
- optional internal notes

Never expose these admin data sets through content GET APIs.

---

## 30. Blogs

Blogs are dynamic records, not duplicated page arrays.

Suggested:

```ts
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: RichTextDocument;
  image: MediaRef;
  imageAlt: string;
  readTime?: string;
  featured: boolean;
  published: boolean;
  publishedAt?: Date | null;
  tags: string[];
  seo?: SeoFields;
  createdAt: Date;
  updatedAt: Date;
};
```

Requirements:

- unique slug
- create/edit
- publish/unpublish
- Tiptap body
- R2 media
- public APIs return published posts only
- landing blog preview pulls from same repository
- remove old hard-coded frontend blog array when no longer used

Blog publish/update invalidates blog list + slug + landing.

---

## 31. Projects

Dynamic project records support:

- draft/published
- slug
- title
- summary
- industry/category
- services
- platforms
- hero media
- gallery/video
- challenge
- strategy
- creator approach
- execution
- verified results only
- verified testimonial only
- SEO
- order/featured data when useful

Never fabricate clients, metrics or testimonials.

---

## 32. Site/global content

`/site` manages shared frontend content such as:

- navigation labels
- footer copy
- social links
- primary contact email
- default SEO/OG image
- shared CTA labels where genuinely global
- legal footer links

Keep actual route paths controlled by code unless routing becomes an explicit feature.

---

## 33. Settings

Safe admin-facing settings:

- admin allowlist
- integration health
- configured frontend/CMS URL display
- Redis status
- R2 status
- Sheets status
- mail-service status

Never show secrets/tokens/private keys in the browser.

---

## 34. Rate limiting

Public POST endpoints require abuse controls:

- Redis-backed per-IP limit
- basic per-email limit
- honeypot or equivalent low-friction bot check
- body-size limit
- strict schema validation

Do not persist arbitrary request bodies.

---

## 35. Accessibility

Target WCAG 2.2 AA.

CMS:

- semantic forms
- labels/errors
- visible focus
- keyboard navigation
- accessible dnd-kit keyboard flow
- proper table headers
- textual status badges
- accessible dialogs/sheets
- destructive confirmation
- approx. 44px practical touch targets
- no colour-only state communication

Frontend integration must not regress existing accessibility.

---

## 36. Testability

Prefer semantic selectors.

Stable attributes where needed:

```tsx
data-automated-test-id="landing-hero-form"
data-section-editor="landing-hero"
data-submission-table="creator-applications"
data-sync-status="failed"
```

Use kebab-case.

Never put PII, email addresses or tokens in data attributes.

---

## 37. Error/security response policy

Server Action result:

```ts
type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };
```

Public APIs use correct HTTP status codes and safe response messages.

Never expose:

- stack traces
- Mongo URI
- Redis credentials
- R2 keys
- Google private key
- Better Auth secret
- raw third-party errors

---

## 38. Content integrity

Never fabricate:

- client brands
- partnerships
- campaign results
- testimonials
- awards
- creator counts
- offices
- guaranteed creator jobs
- guaranteed compensation

Seed CMS data from legitimate current frontend copy, or use explicit dev placeholders.

---

## 39. Dependency/dead-code policy

Before adding a dependency:

1. inspect `package.json`
2. inspect existing implementation
3. confirm active need
4. prefer existing/native functionality
5. install the minimum package set

Approved technology families do not mean every related package must be installed.

Remove unused:

- components
- files
- exports
- imports
- CSS
- assets
- packages
- old copies/backups
- abandoned prototypes

Git is history.

When CMS data replaces hard-coded frontend content, remove the old source when no longer referenced.

---

## 40. Definition of done

A page vertical slice is done only when:

- schema/type exists
- repository exists
- initial/default content exists
- CMS loads current content
- CMS mutation is authenticated + validated
- data persists
- cache invalidates
- public endpoint returns full section DTO
- internal fields are stripped
- frontend server page fetches API
- existing section components receive props
- old hard-coded source is removed
- SEO is wired where applicable
- loading/error states are sane
- responsive layout is unchanged
- accessibility is preserved
- lint/typecheck/build pass
- dead code/dependencies are removed

---

## 41. Validation

Run actual scripts in `package.json`.

Typical:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run tests if configured.

Do not claim commands passed unless actually run successfully.

For every vertical slice verify both CMS and frontend.

---

## 42. Safety

Do not:

- discard unrelated user changes
- reset unrelated files
- rewrite Git history
- hard-code credentials
- expose secrets
- silently change production URLs
- change lockfile without dependency reason

Keep diffs focused and reviewable.

---

## 43. Priority

When trade-offs occur:

1. correctness/data integrity
2. security/auth
3. accessibility
4. stable API contract
5. maintainability
6. frontend integration correctness
7. performance
8. CMS usability
9. visual polish
10. animation

The CMS is an operational tool first.
