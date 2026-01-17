"use server";

import { imagekit } from "@/lib/imagekit";

// IMAGE kit action

export type UploadField = {
  key: string;
  folder: string;
};

export type UploadedFile = {
  url: string;
  fileId: string;
};

export const uploadImages = async (
  file: File,
  field: UploadField
): Promise<UploadedFile | null> => {
  try {
    if (!file) return null;
    const buffer = Buffer.from(await file.arrayBuffer());

    const res = await imagekit.upload({
      file: buffer,
      fileName: `course-${file.name.slice(0, 10)}`,
      folder: field.folder,
      useUniqueFileName: true,
    });

    return { url: res.url, fileId: res.fileId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    throw new Error(errorMessage);
  }
};


export const deleteImages = async (fieldID: string[]) => {
  try {
    if(!fieldID.length) return {success: false, error: "Field ID is required"}

    await Promise.all(fieldID.map(async(id) => imagekit.deleteFile(id)))
    return {success: true}

  } catch (error) {
    return {success: false, error: error instanceof Error ? error.message : "Server error"}
  }
}
