import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="faq" initial={content.faq} title="Services FAQ" description="Manage frequently asked service questions." />; }
