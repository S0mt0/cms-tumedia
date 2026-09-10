import Link from "next/link";
import { ArrowUpRight, FilePenLine, FileText, Inbox, Newspaper, UserRoundPlus } from "lucide-react";

import { CmsPageHeader } from "@/components/common/cms-page-header";
import { ModuleCard } from "@/components/common/module-card";
import { requireAdminSession } from "@/lib/auth/guards";
import { blogPostRepository } from "@/lib/db/repositories/blog.repository";
import { contactSubmissionRepository } from "@/lib/db/repositories/contact.repository";
import { creatorSubmissionRepository } from "@/lib/db/repositories/join.repository";

const quickActions = [
  { href: "/contact/submissions", title: "Review brand enquiries", description: "Open the contact inbox and follow up on new opportunities.", icon: Inbox, tone: "bg-[#edf7f3] text-[#155e58]" },
  { href: "/join/submissions", title: "Review creator applications", description: "See the newest creator profiles and application details.", icon: UserRoundPlus, tone: "bg-[#f2efff] text-[#5d43bd]" },
  { href: "/blogs/manage/new", title: "Write a blog post", description: "Create a draft or publish a new story for the public archive.", icon: Newspaper, tone: "bg-[#fff5e7] text-[#9a6116]" },
  { href: "/landing/hero", title: "Edit the landing hero", description: "Refresh the first message visitors see on the website.", icon: FilePenLine, tone: "bg-[#fff0f5] text-[#a13c66]" },
] as const;

export default async function DashboardPage() {
  const [session, contact, creators, publishedBlogs, draftBlogs] = await Promise.all([
    requireAdminSession(),
    contactSubmissionRepository.list({ page: 1, limit: 1 }),
    creatorSubmissionRepository.list({ page: 1, limit: 1 }),
    blogPostRepository.list({ page: 1, limit: 1, published: true }),
    blogPostRepository.list({ page: 1, limit: 1, published: false }),
  ]);
  const stats = [
    { label: "Brand enquiries", value: contact.total, href: "/contact/submissions", detail: "Contact submissions", icon: Inbox, tone: "border-[#bad9cf] bg-[#eff8f5] text-[#155e58]" },
    { label: "Creator applications", value: creators.total, href: "/join/submissions", detail: "Join submissions", icon: UserRoundPlus, tone: "border-[#d7d0f6] bg-[#f5f2ff] text-[#5d43bd]" },
    { label: "Published posts", value: publishedBlogs.total, href: "/blogs/manage?status=published", detail: "Live in the blog archive", icon: Newspaper, tone: "border-[#f0d9ae] bg-[#fff8ea] text-[#9a6116]" },
    { label: "Draft posts", value: draftBlogs.total, href: "/blogs/manage?status=draft", detail: "Ready to refine", icon: FileText, tone: "border-[#ecc8d8] bg-[#fff3f7] text-[#a13c66]" },
  ] as const;

  return <div className="space-y-6"><CmsPageHeader title={`Welcome back, ${session.user.name.split(" ")[0] || "there"}.`} description="Keep an eye on incoming opportunities and move the next piece of TU Media content forward." /><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Content operations summary">{stats.map((stat) => { const Icon = stat.icon; return <Link key={stat.label} href={stat.href} className={`group rounded-xl border p-5 outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#1d8f7a] ${stat.tone}`}><div className="flex items-start justify-between gap-3"><Icon className="size-5" aria-hidden /><ArrowUpRight className="size-4 opacity-65 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></div><p className="mt-7 text-4xl font-bold tracking-[-.06em]">{stat.value}</p><p className="mt-2 font-semibold">{stat.label}</p><p className="mt-1 text-sm opacity-75">{stat.detail}</p></Link>; })}</section><ModuleCard title="Quick actions" description="Jump directly into the content and inboxes that keep the website moving."><div className="grid gap-3 lg:grid-cols-2">{quickActions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="group flex min-h-34 items-start gap-4 rounded-lg border border-[#d7e1dc] bg-white p-4 outline-none transition-colors hover:border-[#9db9ad] hover:bg-[#f8fbf9] focus-visible:ring-2 focus-visible:ring-[#1d8f7a]"><span className={`grid size-11 shrink-0 place-items-center rounded-md ${action.tone}`}><Icon className="size-5" aria-hidden /></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3 font-semibold text-[#173c38]">{action.title}<ArrowUpRight className="size-4 shrink-0 text-[#61746d] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span><span className="mt-1 block text-sm leading-6 text-[#61746d]">{action.description}</span></span></Link>; })}</div></ModuleCard></div>;
}
