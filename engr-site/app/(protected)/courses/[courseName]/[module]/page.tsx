"use client";
import { fetchConceptsBySectionId } from "@/actions/fetching/fetchConceptsBySectionId";
import { fetchSectionsByModule } from "@/actions/fetching/fetchSectionsByModule";
import { useGetPathname } from "@/hooks/useGetPathname";
import React, { useState, useEffect } from "react";
import {
  FormattedData,
  capitalizeAndReplaceDash,
  lowercaseAndReplaceSpace,
} from "@/utils/formatting";
import { fetchedFormattedData } from "@/utils/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "path";
import {
  SegmentedControlInput,
  ModuleContentTable,
  ConceptBar,
} from "@/components/mantine";
import "./page.css";

type sectionDataResults = {
  sectionName: string;
  concepts: FormattedData[];
};

type ModulePageProps = {
  params: { module: string; courseName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ModulePage = ({ params, searchParams }: ModulePageProps) => {
  const [selectedSegment, setSelectedSegment] = useState("Problems");
  const [sections, setSections] = useState(null); // Initialize sections state
  const [sectionDataResults, setSectionDataResults] = useState([]); // Store fetched section data
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [selectedConcept, setSelectedConcept] = useState("");
  const [selectedConceptId, setSelectedConceptId] = useState("");

  const handleSegmentChange = (value) => {
    console.log("Segment changed to", value);
    setSelectedSegment(value);
  };

  const id = searchParams.id; // Ensure this is consistent with your data structure
  const sectionName = capitalizeAndReplaceDash(params.module);
  const searchParamId = searchParams.id;

  // Fetch sections data
  useEffect(() => {
    setIsLoading(true); // Start loading
    const fetchData = async () => {
      if (!id) return;

      try {
        const fetchedData = await fetchSectionsByModule({ id });
        setSections(fetchedData);
      } catch (error) {
        console.error("Failed to fetch sections", error);
      } finally {
        setIsLoading(false); // End loading regardless of outcome
      }
    };

    fetchData();
  }, [id]);

  // Fetch data for each section
  useEffect(() => {
    const fetchAllSectionData = async () => {
      if (sections?.success) {
        setIsLoading(true); // Start loading
        try {
          const promises = sections.success.map((section) =>
            fetchConceptsBySectionId({ id: section.id }).then((results) => ({
              sectionName: section.original,
              concepts: results.success,
            }))
          );

          const results = await Promise.all(promises);
          setSectionDataResults(results);
        } catch (error) {
          console.error("Failed to fetch section details", error);
        } finally {
          setIsLoading(false); // End loading regardless of outcome
        }
      }
    };

    fetchAllSectionData();
  }, [sections]); // Re-fetch whenever 'sections' changes

  // Update selectedConcept when sectionDataResults or selectedSegment changes
  useEffect(() => {
    const currentSection = sectionDataResults.find(
      (section) => section.sectionName === selectedSegment
    );
    // Set the first concept of the current section as the selectedConcept
    if (currentSection && currentSection.concepts.length > 0) {
      setSelectedConcept(currentSection.concepts[0].original);
      setSelectedConceptId(currentSection.concepts[0].id);
    }
  }, [sectionDataResults, selectedSegment]);

  if (!searchParamId) {
    return notFound();
  }

  const currentSection = sectionDataResults.find(
    (section) => section.sectionName === selectedSegment
  );

  return (
    <div>
      <div className="concept-bar-container">
        <ConceptBar
          concepts={
            currentSection?.concepts.map((concept) => ({
              label: concept.original,
              link: `/courses/${params.courseName}/${params.module}/${concept.formatted}`,
              id: concept.id,
            })) || []
          }
          selectedConcept={selectedConcept}
          onConceptChange={setSelectedConcept}
          onConceptIdChange={setSelectedConceptId}
        />
      </div>
      <div className="main-content">
        <SegmentedControlInput
          value={selectedSegment}
          onChange={handleSegmentChange}
        />
        <ModuleContentTable />

        <p> {sectionName} </p>
        {/* {sections?.success &&
          sections.success.map((item, index) => (
            <div key={index}> {item.original} </div>
          ))} */}

        {sectionDataResults?.map((section: sectionDataResults) => (
          <div>
            <p> {section.sectionName}</p>
            <div>
              {section.concepts?.map((concept: FormattedData) => {
                return (
                  <div>
                    <Link
                      href={`/courses/${params.courseName}/${params.module}/${
                        concept.formatted
                      }?${new URLSearchParams({
                        id: concept.id.toString(),
                      })} `}
                    >
                      {concept.original}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {sections?.failure && <div> No sections </div>}
      </div>
    </div>
  );
};

export default ModulePage;
