"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface ImageModalProps {
  image: {
    id: number;
    fileName: string | null;
    imageName: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
  };
  children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // ✅ Added missing uploaderInfo state
  const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(null);

  // ✅ Fixed useEffect syntax
  useEffect(() => {
    if (isOpen && !uploaderInfo) {
      setIsLoading(true);
      fetch(`/api/user/${image.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setUploaderInfo({ fullName: data.fullName });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching uploader info:", error);
          setUploaderInfo({ fullName: "Unknown" });
          setIsLoading(false);
        });
    }
  }, [isOpen, uploaderInfo, image.userId]);

  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[90vh] min-w-[90vw] overflow-hidden p-0">
          <div className="flex h-full flex-col md:flex-row">
            <div className="flex flex-1 items-center justify-center bg-black p-4">
              <img
                src={image.imageUrl}
                alt={image.imageName || image.fileName || "Uploaded image"}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex md:w-80 w-full flex-col p-4 text-white bg-zinc-900">
              <DialogHeader className="border-b p-4">
                <DialogTitle className="text-center">
                  {image.imageName || image.fileName}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col p-4 space-y-4 flex-1">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-100">
                    Uploaded By:
                  </span>
                  <span>{isLoading ? "Loading..." : uploaderInfo?.fullName}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-100">
                    Created At:
                  </span>
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4">
                  <Button>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
