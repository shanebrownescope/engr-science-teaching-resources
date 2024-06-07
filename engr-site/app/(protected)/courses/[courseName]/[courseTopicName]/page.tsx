"use client";
import { fetchFilesByConceptId } from "@/actions/fetching/files/fetchFilesByConceptId";
import { fetchLinksByConceptId } from "@/actions/fetching/links/fetchLinksByConceptId";
import React, { useState, useEffect } from "react";
import { FormattedData, capitalizeAndReplaceDash } from "@/utils/formatting";
import { FetchedFormattedData } from "@/utils/types";
import { notFound } from "next/navigation";
import {
  SegmentedControlInput,
  ModuleContentTable,
  ConceptBar,
} from "@/components/mantine";
import "./page.css";
import { fetchResourceTypesByCourseTopicId } from "@/actions/fetching/resourceType/fetchResourceTypesByCourseTopicId";
import { fetchConceptsByResourceTypeId } from "@/actions/fetching/concepts/fetchConceptsByResourceTypeId";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type ResourceTypePageProps = {
  params: { courseTopicName: string; courseName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

type ResourceTypeDataResults = {
  resourceTypeName: string;
  concepts: FormattedData[];
};

const ResourceTypePage = ({ params, searchParams }: ResourceTypePageProps) => {
  useRequireAuth();

  const [selectedSegment, setSelectedSegment] = useState("Problems");
  const [resourceType, setResourceType] = useState<FetchedFormattedData>(); // Initialize sections state
  const [resourceTypeDataResults, setResourceTypeDataResults] =
    useState<ResourceTypeDataResults[]>(); // Store fetched section data
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [selectedConcept, setSelectedConcept] = useState("");
  const [selectedConceptId, setSelectedConceptId] = useState("");
  const [conceptFiles, setConceptFiles] = useState<any[]>([]);
  const [conceptLinks, setConceptLinks] = useState<any[]>([]);

  const handleSegmentChange = (value: any) => {
    console.log("Segment changed to", value);
    setSelectedSegment(value);
  };

  console.log("selected segment: ", selectedSegment);

  const id = searchParams.id; // Ensure this is consistent with your data structure
  const courseTopicName = capitalizeAndReplaceDash(params.courseTopicName);
  console.log("courseTopicName: ", courseTopicName);
  const searchParamId = searchParams.id;

  // Fetch resourceType data
  useEffect(() => {
    setIsLoading(true); // Start loading
    const fetchData = async () => {
      if (!id) return;

      try {
        const fetchedData = await fetchResourceTypesByCourseTopicId(
          id as string,
        );

        if (fetchedData.success) {
          setResourceType(fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch sections", error);
      } finally {
        setIsLoading(false); // End loading regardless of outcome
      }
    };

    fetchData();
  }, [id]);
  console.log("resourceType: ", resourceType);
  console.log("resourceTypeDataResults: ", resourceTypeDataResults);
  console.log("selectedSegment: ", selectedSegment);
  console.log("selectedConcept: ", selectedConcept);
  // Fetch data for each resource type
  useEffect(() => {
    const fetchAllResourceTypeData = async () => {
      if (resourceType?.success) {
        setIsLoading(true); // Start loading
        try {
          resourceType.success.forEach((resourceType: FormattedData) => {
            console.log("resourceType map item: ", resourceType);
          });

          const promises = resourceType.success.map(
            (resourceType: FormattedData) =>
              fetchConceptsByResourceTypeId(resourceType.id).then(
                (results: FetchedFormattedData) => ({
                  resourceTypeName: resourceType.name,
                  concepts: results.success || [],
                }),
              ),
          );

          const results: ResourceTypeDataResults[] =
            await Promise.all(promises);
          if (results.length > 0) {
            setResourceTypeDataResults(results);
          }
        } catch (error) {
          console.error("Failed to fetch section details", error);
        } finally {
          setIsLoading(false); // End loading regardless of outcome
        }
      }
    };

    fetchAllResourceTypeData();
  }, [resourceType]); // Re-fetch whenever 'resourceType' changes
  console.log(" == resourceTypeDataResults: ", resourceTypeDataResults);

  // Update selectedConcept when resourceTypeDataResults or selectedSegment changes
  useEffect(() => {
    if (!resourceTypeDataResults || !selectedSegment) return;
    setSelectedConceptId("");
    setSelectedConcept("");
    setConceptFiles([]);
    setConceptLinks([]);

    const currentResourceType = resourceTypeDataResults?.find(
      (resourceType: ResourceTypeDataResults) =>
        resourceType.resourceTypeName === selectedSegment,
    );
    // Set the first concept of the current section as the selectedConcept
    if (currentResourceType && currentResourceType.concepts.length > 0) {
      setSelectedConcept(currentResourceType.concepts[0].name);
      setSelectedConceptId(currentResourceType.concepts[0].id as string);
    }
  }, [resourceTypeDataResults, selectedSegment]);

  // Fetch files and links for the selected concept
  useEffect(() => {
    const fetchConceptData = async () => {
      if (!selectedConceptId) return; // Check if there's a selected concept

      setIsLoading(true);
      try {
        const filesResult = await fetchFilesByConceptId({
          id: selectedConceptId,
        });
        const linksResult = await fetchLinksByConceptId({
          id: selectedConceptId,
        });

        setConceptFiles(
          filesResult.success
            ? filesResult.success.map((file) => ({
                type: file.type,
                originalName: file.fileName,
                urlName: file.urlName,
                description: file.description || "",
                tags: file.tags || [],
                id: file.id,
                dateAdded: file.uploadDate,
              }))
            : [],
        );

        setConceptLinks(
          linksResult.success
            ? linksResult.success.map((link) => ({
                type: link.type,
                originalName: link.linkName,
                urlName: link.urlName,
                description: link.description || "",
                tags: link.tags || [],
                id: link.id,
                dateAdded: link.uploadDate,
              }))
            : [],
        );
      } catch (error) {
        console.error("Failed to fetch concept data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConceptData();
  }, [selectedConceptId]); // Re-fetch whenever the selected concept changes

  console.log("conceptFiles: ", conceptFiles);
  console.log("conceptLinks: ", conceptLinks);

  if (!searchParamId) {
    return notFound();
  }

  const currentResourceType = resourceTypeDataResults?.find(
    (resourceType: ResourceTypeDataResults) =>
      resourceType.resourceTypeName === selectedSegment,
  );

  return (
    <div>
      <div className="concept-bar-container">
        <ConceptBar
          concepts={
            currentResourceType?.concepts.map((concept: FormattedData) => ({
              label: concept.name,
              link: `/courses/${params.courseName}/${params.courseTopicName}/${concept.url}`,
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
          data={resourceType?.success || []}
          value={selectedSegment}
          onChange={handleSegmentChange}
        />

        <div style={{ marginTop: "20px" }}>
          <ModuleContentTable files={conceptFiles} links={conceptLinks} />
        </div>
      </div>
    </div>
  );
};

export default ResourceTypePage;
