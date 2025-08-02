"use server";
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { images } from "./db/schema";
import { utapi } from "./uploadthing";

// ✅ Get all uploaded images (visible to everyone)
export async function getMyImages() {
  const allImages = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return allImages;
}

// ✅ Only the uploader can delete
export async function deleteImage(id: number) {
  const user = await auth();

  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  // ✅ Get the image by ID
  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) {
    throw new Error("Image not found");
  }

  // ✅ Debug logs to verify userId matching
  console.log("Current user ID:", user.userId);
  console.log("Uploader user ID:", image.userId);

  if (image.userId !== user.userId) {
    throw new Error("You do not have permission to delete this image");
  }

  // ✅ Delete the uploaded file from storage
  const fileKey = image.imageUrl?.split("/").pop();
  if (!fileKey) {
    throw new Error("Invalid image URL");
  }

  await utapi.deleteFiles(fileKey);

  // ✅ Delete the image record from database
  await db.delete(images).where(
    and(eq(images.id, id), eq(images.userId, user.userId))
  );
}
