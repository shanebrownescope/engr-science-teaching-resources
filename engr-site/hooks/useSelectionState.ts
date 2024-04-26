import { fetchCourseTopicsByCourseId } from "@/actions/fetching/courseTopics/fetchCourseTopicsByCourseId";
import { FormattedData } from "@/utils/formatting";
import { useState } from "react";



type Options = {
  value: string | null;
  id: string | null;
  formatted: string | null;
};

type SelectOptionFunction = (value: string, id: string, formatted: string) => void;

interface CommonState {
  CourseTopicOptionsData: any[];
  ResourceTypeOptionsData: any[];
  conceptOptionsData: any[];
}

const useCommonState = (): CommonState => {
  const [CourseTopicOptionsData, setCourseTopicOptionsData] = useState<any[]>([]);
  const [ResourceTypeOptionsData, setResourceTypeOptionsData] = useState<any[]>([]);
  const [conceptOptionsData, setConceptOptionsData] = useState<any[]>([]);

  return { CourseTopicOptionsData, ResourceTypeOptionsData, conceptOptionsData };
};

const useCommonSelection = (): [FormattedData, FormattedData, FormattedData, FormattedData, SelectOptionFunction, SelectOptionFunction, SelectOptionFunction, SelectOptionFunction] => {
  const [selectedCourseOption, setSelectedCourseOption] = useState<FormattedData>({ value: null, formatted: null });
  const [selectedCourseTopicOption, setSelectedCourseTopicOption] = useState<FormattedData>({ value: null, id: null, formatted: null });
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] = useState<FormattedData>({ value: null, id: null, formatted: null });
  const [selectedConceptOption, setSelectedConceptOption] = useState<FormattedData>({ value: null, id: null, formatted: null });

  const handleCourseOptionSelect: SelectOptionFunction = async (value, id, formatted) => {
    // Your logic here
    setSelectedResourceTypeOption({ value: null, id: null, formatted: null });
    setSelectedConceptOption({ value: null, id: null, formatted: null });
    
    setResourceTypeOptionsData([]);
    setConceptOptionData([]);
    

    setSelectedCourseOption({ value: value, id: id, formatted: formatted });

    const results = await fetchCourseTopicsByCourseId(id);
    setSelectedCourseTopicOption(results.success);
  };

  const handleCourseTopicOptionSelect: SelectOptionFunction = async (value, id, formatted) => {
    // Your logic here
  };

  const handleResourceTypeOptionSelect: SelectOptionFunction = async (value, id, formatted) => {
    // Your logic here
  };

  const handleConceptOptionSelect: SelectOptionFunction = async (value, id, formatted) => {
    // Your logic here
  };

  return [selectedCourseOption, selectedCourseTopicOption, selectedResourceTypeOption, selectedConceptOption, handleCourseOptionSelect, handleCourseTopicOptionSelect, handleResourceTypeOptionSelect, handleConceptOptionSelect];
};

export { useCommonState, useCommonSelection };
