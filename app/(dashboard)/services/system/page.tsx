import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="system" initial={content.system} title="Connected system" description="Manage the strategy message and business-need cards." />; }
