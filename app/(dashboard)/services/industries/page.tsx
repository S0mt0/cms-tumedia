import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="industries" initial={content.industries} title="Industries callout" description="Manage the services-page industry message." />; }
