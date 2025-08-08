import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
 
});


export async function PATCH(req: NextRequest) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, imageName, imageDescription } = body;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid or missing image id" }, { status: 400 });
  }
  if (typeof imageName !== "string" || imageName.length < 5) {
    return NextResponse.json({ error: "Invalid imageName" }, { status: 400 });
  }
  if (imageDescription && typeof imageDescription !== "string") {
    return NextResponse.json({ error: "Invalid imageDescription" }, { status: 400 });
  }

  const image = await db.query.images.findFirst({
    where: eq(images.id, Number(id)),
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  if (image.userId !== user.userId) {
    return NextResponse.json({ error: "You do not have permission to update this image" }, { status: 403 });
  }

  await db
    .update(images)
    .set({
      imageName,
      imageDescription: imageDescription ?? null,
      updatedAt: new Date(),
    })
    .where(eq(images.id, Number(id)));

  return NextResponse.json({ message: "Image updated successfully" });
}
