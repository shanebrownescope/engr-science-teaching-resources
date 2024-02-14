import { fetchSections } from "@/actions/fetching/fetchSections"

const ModulePage = async({ params }: { params: {module: string} }) => {
  // const section = await fetchSections(params.module)
  // console.log(params.module)

  return (
    <div>{params.module}</div>
  )
}

export default ModulePage