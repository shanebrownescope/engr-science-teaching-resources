import dbConnect from "@/database/dbConnector";

export type SectionData = {
  SectionId: number
  SectionName: string,
  ModuleId: number,
  S3Url?: string
}