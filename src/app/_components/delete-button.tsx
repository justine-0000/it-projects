"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { deleteImage } from "~/server/queries";

export function DeleteButton({ idAsNumber }: { idAsNumber: number }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteImage(idAsNumber);
      router.refresh();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      className="cursor-pointer mt-2"
    >
      Delete
    </Button>
  );
}
