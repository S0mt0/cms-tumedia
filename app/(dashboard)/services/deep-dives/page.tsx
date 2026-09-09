import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="deepDives" initial={content.deepDives} title="Service deep dives" description="Manage the detailed service narratives." />; }
