import { fetchSections } from "@/actions/fetching/fetchSections";
import {
  SegmentedControlInput,
  ModuleContentTable,
} from "@/components/mantine";

const ModulePage = async ({ params }: { params: { module: string } }) => {
  // const section = await fetchSections(params.module)
  // console.log(params.module)

  return (
    <div>
      <h1>{params.module}</h1>
      <SegmentedControlInput />
      <ModuleContentTable />
    </div>
  );
};

export default ModulePage;
