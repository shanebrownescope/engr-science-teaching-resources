import { TagsData } from "@/actions/fetching/fetchTagsByFileId";
import { FormattedData } from "./formatting";

export type fetchedFormattedData = {
  success?: FormattedData[],
  failure?: string 
}

export type fetchedFile = {
  fileId: number;
  originalFileName: string
  formattedFileName: string
  s3Url: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  conceptId: number;
  uploadedUserId: number;
  tags: String[] | undefined;
}

export type FileData = {
  FileId: number,
  FileName: string,
  S3Url: string | undefined,
  Description: string | undefined,
  UploadDate: Date,
  Contributor: string | undefined
  ConceptId: number,
  UploadedUserId: number,
  TagNames?: string[]
}

export type LinkData = {
  LinkId: number,
  LinkName: string,
  LinkUrl: string | undefined,
  Description: string | undefined,
  UploadDate: Date,
  Contributor: string | undefined
  ConceptId: number,
  UploadedUserId: number,
  TagNames?: string[]
}

export type fetchedLink = {
  linkId: number;
  originalLinkName: string,
  formattedLinkName: string,
  linkUrl: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  conceptId: number;
  uploadedUserId: number;
  tags: string[] | undefined;
}

export type searchParams = {
  searchParams: { [key: string]: string | string[] | undefined };
}

