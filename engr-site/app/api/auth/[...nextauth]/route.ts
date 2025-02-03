import { NextResponse } from "next/server";
import { fetchUploadedFiles } from "@/actions/fetching/files/fetchUploadedFiles";

export async function GET() {
  const result = await fetchUploadedFiles();

  if (result.failure) {
    return NextResponse.json({ error: result.failure }, { status: 500 });
  }

  return NextResponse.json(result.success);
}


export const runtime = "nodejs";

export { GET, POST } from "@/auth";
