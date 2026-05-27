'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createServerClient } from "@/utils/supabase/server";
import { isValidLoadoutExportString, loadoutExportHint } from "@/lib/loadoutCodec";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadLoadout(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const race = formData.get("race") as string;
    const gender = formData.get("gender") as string;
    const visualWeight = formData.get("visualWeight") as string;
    const exportString = formData.get("exportString") as string;
    const file = formData.get("screenshot") as File;

    if (!title || !race || !gender || !visualWeight || !exportString || !file) {
      return { success: false, error: "Missing required fields" };
    }

    if (!isValidLoadoutExportString(exportString)) {
      return { success: false, error: loadoutExportHint() };
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "transmorpher-media";
    
    // Upload to Cloudflare R2 using S3 client
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    // Construct the public URL
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "") || "";
    const imageUrl = `${publicUrl}/${fileName}`;

    // Insert loadout record to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerClient() as any;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be signed in to upload a loadout." };
    }

    const userId = user.id;

    const { data, error } = await supabase
      .from("loadouts")
      .insert({
        title,
        race,
        gender,
        visual_weight: visualWeight,
        import_string: exportString,
        image_url: imageUrl,
        author_id: userId,
        parsed_data: { items: [] },
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, loadout: data };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Upload action error:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
