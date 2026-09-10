import { CmsPageHeader } from "@/components/common/cms-page-header";
import { legalRepository } from "@/lib/db/repositories/legal.repository";
import { LegalEditor } from "./_components/legal-editor";
export default async function LegalPage() { const content = await legalRepository.get(); return <div className="space-y-6"><CmsPageHeader title="Terms & privacy" description="Manage the legal documents published on the public site." /><LegalEditor initial={{ terms: content.terms, privacy: content.privacy }} /></div>; }
