import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "2GB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        imageName: z.string().min(5),
        imageDescription: z.string().min(10).max(200).optional(),
      })
    )
    .middleware(async ({ req, input }) => {
      const user = await auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");

      return {
        userId: user.userId,
        imageName: input.imageName,
        imageDescription: input.imageDescription,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      await db.insert(images).values({
        fileName: file.name,
        imageName: metadata.imageName,
        imageDescription: metadata.imageDescription ?? null,
        imageUrl: file.ufsUrl,
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
