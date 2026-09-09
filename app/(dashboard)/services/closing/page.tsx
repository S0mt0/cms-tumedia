import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="closing" initial={content.closing} title="Final invitation" description="Manage the closing call to action." />; }
