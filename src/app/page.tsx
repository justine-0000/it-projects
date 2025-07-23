
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";

async function Images() {
const mockUrls = ["https://tse3.mm.bing.net/th/id/OIP.rEcJ5Muh5JXQ83GOrWI1XQAAAA?pid=Api&P=0&h=220",
  "https://tse4.mm.bing.net/th/id/OIP.cQbepYfR9fdSCvemajzMjAHaEu?pid=Api&P=0&h=220",
  "https://okagcj03wg.ufs.sh/f/YCBlntuozhBqHOnKXmQcvCai7F60YuWpKh4PXAnosfV9SxZr",
  "https://okagcj03wg.ufs.sh/f/YCBlntuozhBqSasj3cH6uGpMQcVJWEta5hA0jd24CgNDZomX"
];
 
const images = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

return(
  <div>
    <div className="flex justify-end p-4">
      <UploadDialog />
    </div>
  <div className="flex flex-wrap justify-center gap-6 p-4">
    {images.map((image) => (
      
      <div key={image.id} className="w-64">
        <div className="h-50 w-full overflow-hidden rounded-md bg-zinc-900">
          <img 
           src={image.url} 
           alt={`Image ${image.id}`} 
           className="h-full w-full object-cover"
           />
        </div>
       <div className="mt-2 text-center text-sm text-blue-700">{image.id}</div>       
    </div>
    ))}
  </div>
  </div>
);
}

export default function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className ="h-full w-full text-center text-2xl">
         Please Sign In above to Continue!
        </div>
      </SignedOut>
      <SignedIn>
        <div className ="h-full w-full text-center text-2xl">
         COLLECTION OF GIRLS THAT I CRUSH!
         <Images />
        </div>
      </SignedIn>
    </main>
  );
}
