import { FormattedData } from "./formatting";
import { FieldError, UseFormRegister } from "react-hook-form";

export type FetchedFormattedData = {
  success?: FormattedData[];
  failure?: string;
};

export type FetchedFile = {
  id: number;
  type: string;
  fileName: string;
  urlName: string;
  s3Url: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string[];
};

export type FileData = {
  id: number;
  fileName: string;
  s3Url: string;
  description: string | undefined;
  uploadDate: Date;
  contributor: string | undefined;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tagNames: string[];
};

export type LinkData = {
  id: number;
  linkName: string;
  linkUrl: string;
  description: string | undefined;
  uploadDate: Date;
  contributor: string | undefined;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tagNames: string[];
};

export type FetchedLink = {
  id: number;
  type: string;
  linkName: string;
  urlName: string;
  linkUrl: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | undefined;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string[];
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
  id: number;
  name: string;
  type: string;
  description: string;
  uploadDate: Date;
  tags: string | null;
};
export type AllFilesAndLinksDataFormatted = {
  id: number;
  originalName: string;
  urlName: string;
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

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  accountStatus: "pending" | "approved" | "activated" | "rejected";
  role: "admin" | "instructor" | "student";
};

export type FetchedUserData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  accountStatus: "pending" | "approved" | "activated" | "rejected";
  role: "admin" | "instructor" | "student";
};

export type PasswordResetTokenData = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
};

export type TransformedPasswordResetToken = {
  passwordResetTokenId: string;
  token: string;
  userId: string;
  expiresAt: Date;
};

export type CommentFileData = {
  id: number;
  fileId: number;
  userId: number;
  parentCommentId: number | null;
  commentText: string;
  uploadDate: string | Date;
  name: string;
};

export type CommentLinkData = {
  id: number;
  linkId: number;
  userId: number;
  parentCommentId: number | null;
  commentText: string;
  uploadDate: string | Date;
  name: string;
};

export type FetchedCommentFileData = {
  success?: CommentFileData[];
  failure?: string;
};

export type FetchedCommentLinkData = {
  success?: CommentLinkData[];
  failure?: string;
};
