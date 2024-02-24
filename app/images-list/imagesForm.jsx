import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { AddImage } from "../serverActions/addImage";

const CDNURL = "https://cwnbofhlrkvkjgmiliso.supabase.co/storage/v1/object/public/Images/"

export default async function ImagesForm(){
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });


    const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

  const { data: image } = await supabase.storage.from("Images");

  const { data: imagis, error } = await supabase
    .from("ImagesData")
    .select("*")
    .eq("user_id", user?.id)
    .order("title", { ascending: true });
    if (error) {
        console.error("Error fetching recipis");
      }
    
      console.log({ imagis });
      console.log({ image });

    return(
        <>
        <h1 className="text-2xl font-bold text-center my-8">IMAGES LIST</h1>
          {/*
      <form action={AddImage} className="max-w-md mx-auto my-4 p-4 border rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
            Title {user.id}
          </label>
          <input type="text" id="title" name="title"  className="mt-1 block w-full border-gray-300 shadow-sm rounded-md text-black"/>
        </div>
        <div className="mb-4">
          <label htmlFor="imageDes" className="block text-lg font-medium text-gray-700">
            Image
          </label>
          <input type="file" accept="image/png, image/jpeg" name="imageFile" className="mt-1 block w-full"/>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Add Image
        </button>
       
      </form>
    */}
      <div className="w-full h-48 flex justify-center items-center overflow-hidden">
  <Image
    src={`${CDNURL}/taz.jpg`} 
    width={250}
    height={200}
    alt="Descripción de la imagen"
    unoptimized={true}
    className="object-cover"
    
    /> 
   <Image
    src={`${CDNURL}/marvin.png`} 
    width={250}
    height={200}
    alt="Descripción de la imagen"
    unoptimized={true}
    className="object-cover"
    />
</div>
      {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {imagis.map((ImagesData) => (
          <div key={ImagesData.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="p-4">
              <p className="text-sm font-medium text-gray-500">{ImagesData.id}</p>
              <h2 className="text-xl font-bold">{ImagesData.title}</h2>
            </div>
            <div>
              <Image
                src={`${CDNURL}/${encodeURIComponent(ImagesData.image_url)}`}
                width={250}
                height={200}
                alt={ImagesData.title}
                unoptimized={true}
                className="w-full object-cover h-48"
              />
            </div>
          </div>
        ))}
       </div>*/}
        </>
    )
}