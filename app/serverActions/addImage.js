"use server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


export async function AddImage(formData) {
    console.log(formData);
    const title = formData.get("title");
     const file = formData.get("imageFile");

    const newFileName = title.replace(/\s+/g, '_');

    console.log(newFileName);

    const bucket = "Images";
  const filePath = `${title}/${newFileName}.png`; // Usar el nuevo nombre
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: uploadData, error: uploadError } = await supabase.storage
  .from(bucket)
  .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return;
  }
  const { data, error } = await supabase.from('ImagesData').insert([
    {
        user_id: user?.id,
        title,
        image_url: filePath, // Save the file URL in the database if necessary
    },
], { returning: 'minimal' }); // This is the updated line

  if (error) {
    console.error("Error inserting data", error);
    return;
  }

  revalidatePath("/images-list");
  return { message: "Success" };
}