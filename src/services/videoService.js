import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase.js";

export const uploadVideoService = async (file) => {
  try {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("course-videos")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    console.log("uploadError", uploadError);
    const { data } = supabase.storage
      .from("course-videos")
      .getPublicUrl(filePath);
    if (uploadError) return uploadError;
    return data.publicUrl;
  } catch (err) {
    return err;
  }
};
