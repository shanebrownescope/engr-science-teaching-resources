import { fetchModulesByCourse } from "@/actions/fetching/fetchModulesByCourse";
import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { ModuleCard } from "@/components/mantine";

const CourseModules = async ({
  params,
}: {
  params: { courseName: string };
}) => {
  const moduleName = capitalizeAndReplaceDash(params.courseName);
  const modules: FetchedFormattedData = await fetchModulesByCourse(moduleName);
  console.log(params.courseName);

  console.log("== success: ", modules.success);

  return (
    <div>
      <p> {moduleName} </p>

      {modules?.success?.map((item: any, index: number) => (
        <div>
          <ModuleCard
            title={item.original}
            description="description here"
            href={`/courses/${params.courseName}/${item.formatted}`}
          />

          <Link
            href={`/courses/${params.courseName}/${
              item.formatted
            }?${new URLsearchParams({
              id: item.id,
            })}`}
            key={index}
          >
            {" "}
            {item.original}{" "}
          </Link>
        </div>
      ))}

      {modules?.failure && <p> No modules </p>}
    </div>
  );
};

export default CourseModules;
