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
  contributor: string | null;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string[];
  courses: string[];
  courseTopics: string[];
  avgRating: number | null;
  numReviews: number
};

export type FetchedLink = {
  id: number;
  type: string;
  linkName: string;
  urlName: string;
  linkUrl: string;
  description: string | undefined;
  uploadDate: string;
  contributor: string | null;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string[];
  courses: string[];
  courseTopics: string[];
  avgRating: number | null;
  numReviews: number;
};

export type FileData = {
  id: number;
  type: string;
  fileName: string;
  s3Url: string;
  description: string | undefined;
  uploadDate: Date;
  contributor: string | null;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string | null;
  courses: string | null;
  courseTopics: string | null;
  avgRating: number | null;
  numReviews: number;
};

export type LinkData = {
  id: number;
  type: string,
  linkName: string;
  linkUrl: string;
  description: string | undefined;
  uploadDate: Date;
  contributor: string | null;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  uploadedUserId: number;
  tags: string | null;
  courses: string | null;
  courseTopics: string | null;
  avgRating: number | null;
  numReviews: number;
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
  resourceType: "exercise" | "notes" | "video" | "interactive";
  contributor: string | null;
  description: string;
  uploadDate: Date;
  tags: string | null;
  courses: string | null;
  courseTopics: string | null;
  avgRating: number | null;
  numReviews: number;
};

export type AllFilesAndLinksDataFormatted = {
  id: number;
  originalName: string;
  urlName: string;
  description: string;
  uploadDate: string;
  type: string;
  resourceType: "exercise" | "notes" | "video" | "interactive";
  contributor: string | null;
  tags: string[];
  courses: string[];
  courseTopics: string[];
  avgRating: number | null;
  numReviews: number;
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

export type ReviewsFileData = {
  id: number;
  fileId: number;
  userId: number;
  rating: number;
  comments: string | null;
  uploadDate: string | Date;
  title: string;
  userPublicName: string;
};

export type ReviewsLinkData = {
  id: number;
  linkId: number;
  userId: number;
  rating: number;
  comments: string | null;
  uploadDate: string | Date;
  title: string;
  userPublicName: string;
};

export type FetchedReviewsFileData = {
  success?: ReviewsFileData[];
  failure?: string;
};

export type FetchedReviewsLinkData = {
  success?: ReviewsLinkData[];
  failure?: string;
};

