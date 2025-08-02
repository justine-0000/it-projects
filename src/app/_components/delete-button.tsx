"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button"; // ✅ Adjust if path differs
import { id } from "zod/v4/locales"; // ✅ Make sure this exists
import { deleteImage } from "~/server/queries";

export function DeleteButton({ idAsNumber }: { idAsNumber: number }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteImage(idAsNumber);
      router.push("/");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      className="cursor-pointer"
    >
      Delete
    </Button>
  );
}
