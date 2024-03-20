import { TagsData } from "@/actions/fetching/fetchTagsByFileId";
import { FormattedData } from "./formatting";
import { FieldError, UseFormRegister } from "react-hook-form";

export type FetchedFormattedData = {
  success?: FormattedData[];
  failure?: string;
};

export type FetchedFile = {
  fileId: number;
  originalFileName: string;
  formattedFileName: string;
  s3Url: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  conceptId: number;
  uploadedUserId: number;
  tags: string[] | undefined;
};

export type FileData = {
  FileId: number;
  FileName: string;
  S3Url: string | undefined;
  Description: string | undefined;
  UploadDate: Date;
  Contributor: string | undefined;
  ConceptId: number;
  UploadedUserId: number;
  TagNames?: string[];
};

export type LinkData = {
  LinkId: number;
  LinkName: string;
  LinkUrl: string | undefined;
  Description: string | undefined;
  UploadDate: Date;
  Contributor: string | undefined;
  ConceptId: number;
  UploadedUserId: number;
  TagNames?: string[];
};

export type FetchedLink = {
  linkId: number;
  originalLinkName: string;
  formattedLinkName: string;
  linkUrl: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  conceptId: number;
  uploadedUserId: number;
  tags: string[] | undefined;
};

export type searchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type FetchedFilesDataArray = {
  success?: FetchedFile[];
  failure?: string;
};

export type FetchedFileData = {
  success?: FetchedFile;
  failure?: string;
};

export type FetchedLinksDataArray = {
  success?: FetchedLink[];
  failure?: string;
};

export type FetchedLinkData = {
  success?: FetchedLink;
  failure?: string;
};

export type FetchedSearchResults = {
  success?: AllFilesAndLinksDataFormatted[];
  failure?: string;
};

export type AllFilesAndLinksData = {
  Id: number;
  Name: string;
  Type: string;
  Description: string;
  UploadDate: Date;
  Tags: string | null;
};
export type AllFilesAndLinksDataFormatted = {
  id: number;
  originalName: string;
  formattedName: string;
  description: string;
  uploadDate: Date;
  type: string;
  tags: string[];
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type FormSelectProps = {
  value: string;
  label: string;
};
