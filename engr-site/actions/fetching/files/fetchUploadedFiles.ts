import { prisma } from "@/utils/prisma"; // 确保 prisma 配置正确

export async function fetchUploadedFiles() {
  try {
    const files = await prisma.file.findMany({
      orderBy: { uploadedAt: "desc" }, 
    });

    return { success: files };
  } catch (error) {
    console.error("Error fetching uploaded files", error);
    return { failure: "Failed to fetch uploaded files" };
  }
}
