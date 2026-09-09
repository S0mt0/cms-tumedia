import { servicesRepository } from "@/lib/db/repositories/services.repository";
import { ServicesFields } from "../_components/services-fields";
export default async function Page() { const content = await servicesRepository.get(); return <ServicesFields section="overview" initial={content.overview} title="Services overview" description="Manage the introductory copy and service cards." />; }
