
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
//const mockUrls = ["https://i.redd.it/bm7n0bsav73b1.jpg",];
 
//const images = mockUrls.map((url, index) => ({
 // id: index + 1,
  //url,
//}));

const images = await getMyImages();

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
           src={image.imageUrl} 
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
        <div className="h-full w-full font-bold text-center text-2xl">
        <div className="h-full w-full font-bold text-center text-4xl md:text-5xl tracking-wide text-gr drop-shadow-lg font-sans">
         <h1>ArteFactCloud</h1>
         
        </div>
        <Images />
        </div>
      </SignedIn>
    </main>
  );
}
 