import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="hero" initial={content.hero} title="Services hero" description="Set the opening invitation and calls to action." />; }
