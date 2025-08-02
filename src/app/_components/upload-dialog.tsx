"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useUploadThing } from "~/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const formSchema = z.object({
  imageName: z
    .string()
    .min(5, { message: "Image name must be at least 5 characters." })
    .max(50),
});

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { imageName: "" },
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name);
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      toast.error("Select a valid image file.");
    }
  };

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast("Uploading...", { duration: 100000, id: "upload-begin" });
    },
    onUploadError: () => {
      toast.dismiss("upload-begin");
      toast.error("Upload Error!");
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success("Upload Complete!");
      router.refresh();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      toast.warning("No file selected!");
      return;
    }

    try {
      setIsUploading(true);
      await startUpload(Array.from(files), {
        imageName: values.imageName,
      });
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Image</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload your favorite ArtiFacts. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          {selectedImageUrl && (
            <div className="w-full max-h-64 aspect-video rounded-md overflow-hidden border">
              <img
                src={selectedImageUrl}
                alt={selectedImageName || "Selected Image"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload />
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="sr-only"
              accept="image/*"
              onChange={handleImageSelect}
            />
            {selectedImageName && <div>Selected: {selectedImageName}</div>}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="imageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Image Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
