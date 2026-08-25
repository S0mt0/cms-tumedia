# TU Media CMS

Private content-management studio and public content API for the TU Media marketing website.

The CMS allows authorised TU Media administrators to manage the important copy, media, repeatable lists, FAQs, projects, blog content, legal content and shared site settings used by the public TU Media frontend. It also receives and stores brand inquiries and creator applications submitted from the frontend.

## Core goals

- Make the public website editable without changing its established visual/component architecture.
- Keep the CMS professional, calm, easy to learn and light-theme only.
- Expose one complete public payload per frontend page, grouped by that page's rendered sections.
- Persist brand inquiries and creator applications to MongoDB and mirror them to Google Sheets.
- Keep the frontend server-rendered: frontend Server Components fetch CMS data and pass section data to existing child components.
- Use Upstash Redis to cache assembled public content responses.
- Use Cloudflare R2 for CMS-managed media.
- Preserve the frontend's accessibility, content integrity and design direction.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui where useful
- MongoDB
- Upstash Redis via `@upstash/redis`
- Better Auth
  - Google login
  - magic-link login
  - no username/password login
  - no GitHub login
- Tiptap for rich-text editing
- dnd-kit for sortable content
- Cloudflare R2 for media storage
- Google Sheets API for submission mirroring
- Server Actions for authenticated CMS mutations
- Route Handlers for public frontend-facing APIs

Installed versions in `package.json` are always the source of truth.

## CMS routes

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

CMS page editors mirror the public frontend section order rather than acting as a free-form page builder.

## Public API

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
POST /api/public/newsletter        # only when newsletter UI is enabled
```

A normal page response:

```json
{
  "success": true,
  "data": {
    "page": "landing",
    "seo": {},
    "sections": {},
    "updatedAt": "2026-08-09T00:00:00.000Z"
  }
}
```

Public DTOs must not leak raw auth records, Redis details, Mongo implementation fields or integration secrets.

## Submission flow

For brand inquiries and creator applications:

1. Frontend validates the form for UX.
2. Frontend Server Action sends the payload to the CMS public endpoint.
3. CMS validates again server-side and rate-limits the request.
4. CMS stores the submission in MongoDB first.
5. CMS appends a row to the configured Google Sheet.
6. MongoDB stores Google-Sheets sync status.
7. If Sheets fails, the MongoDB submission remains accepted and the CMS exposes an admin retry action.

**MongoDB is canonical. Google Sheets is an operational mirror.**

## Caching

Public page payloads are cached in Upstash Redis.

```text
Redis hit -> return DTO
Redis miss -> MongoDB -> assemble DTO -> Redis -> return DTO
```

CMS mutations update MongoDB first and then invalidate the exact affected cache keys. Redis failure must degrade gracefully to MongoDB. Submission writes are never cached.

## Cloudflare R2

R2 stores CMS-managed images and video assets.

Recommended flow:

1. Authenticated Server Action validates requested upload metadata.
2. Server creates a short-lived presigned PUT URL.
3. Browser uploads directly to R2.
4. CMS stores media metadata in MongoDB.
5. Page/project/blog content stores the R2 public URL/key.

Use unique object keys. Never overwrite unrelated files by filename alone.

## Authentication

The CMS is private and allowlist-based.

Allowed methods:

- Google
- magic link

Only allowlisted administrator emails may access protected dashboard routes. Environment-seeded admins must not be removable through the CMS.

## Design direction

- light theme only
- white editing surfaces on a soft neutral canvas
- TU Media ink, violet, blue and pink used sparingly
- Manrope as primary UI font
- clear hierarchy and generous spacing
- no unnecessary gradients or glassmorphism
- no visually noisy dashboard effects
- accessible, predictable controls

The CMS should feel like a polished internal professional tool, not a marketing site.

## Rich text

Tiptap is used only where formatting has real value:

- blog bodies
- project/case-study rich content where needed
- privacy/terms
- longer editorial content

Simple headings, labels, short descriptions, FAQs and CTA copy use normal inputs/textareas.

The editor schema is controlled so CMS authors cannot introduce arbitrary typography/HTML that breaks the frontend design system.

## Frontend integration

CMS work is completed vertically.

For each page:

1. Schema/types
2. Repository/default content
3. CMS Server Actions
4. CMS editor
5. Cache + invalidation
6. Public GET endpoint
7. Frontend CMS client/types
8. Frontend Server Component fetch
9. Section props wired into existing components
10. Old hard-coded copy/data removed
11. SEO/error/loading/accessibility verified
12. Dead code/dependencies removed

Do not build the whole CMS first and postpone frontend integration.

## Repository conventions

Route-only components belong in the route's `_components`; route-only server helpers may live in `_lib`. Shared UI belongs in `components/common`, `components/forms`, `components/layout` or `components/ui`. Server/domain code belongs in `lib/`.

Do not leave unused components, assets, exports, CSS or dependencies.

## Documentation

- `AGENTS.md` — mandatory engineering and agent directives.
- `docs/TU_Media_CMS_Technical_Implementation_Spec.md` — detailed architecture, page contracts and delivery plan.
