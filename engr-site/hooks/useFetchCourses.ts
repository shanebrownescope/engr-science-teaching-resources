import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { useState, useEffect } from "react";

const useFetchCourses = (limit?: number) => {
  const [data, setData] = useState<FormattedData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: FetchedFormattedData = await fetchCourses(limit);
        if (response.success) {
          setData(response.success);
        } else if (response.failure) {
          setError(response.failure);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, error, loading };
};

export default useFetchCourses;
