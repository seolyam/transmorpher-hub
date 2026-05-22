'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createServerClient } from "@/src/lib/supabase";

const s3 = new S3Client({
  forcePathStyle: true,
  region: "us-east-1",
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadLoadout(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const className = formData.get("class") as string;
    const exportString = formData.get("exportString") as string;
    const file = formData.get("screenshot") as File;

    if (!title || !className || !exportString || !file) {
      return { success: false, error: "Missing required fields" };
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    // Upload to Supabase Storage using S3 client
    await s3.send(new PutObjectCommand({
      Bucket: "loadout-images",
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    // Construct the public URL
    const projectId = "rnkoetwcsfihpzaacesr";
    const imageUrl = `https://${projectId}.supabase.co/storage/v1/object/public/loadout-images/${fileName}`;

    // Insert loadout record to database
    const supabase = await createServerClient() as any;

    // Since we don't have login wired up yet in the UI, we'll try to find a user.
    // If no user exists, we will create/use a default guest profile to avoid foreign key failures.
    let userId: string;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
    } else {
      // Find or create a community guest user/profile.
      // For Phase 1 demo without auth, we can look for any existing profile to attach to, 
      // or fall back to an error asking the user to login.
      // Let's first fetch the first profile in the database.
      const { data: profiles } = await supabase.from("profiles").select("id").limit(1) as any;
      
      if (profiles && profiles.length > 0) {
        userId = profiles[0].id;
      } else {
        return { 
          success: false, 
          error: "No users exist in the database. Please sign up or insert a user in the auth.users table first." 
        };
      }
    }

    const classMap: Record<string, number> = {
      'Warrior': 1,
      'Paladin': 2,
      'Hunter': 3,
      'Rogue': 4,
      'Priest': 5,
      'Death Knight': 6,
      'Shaman': 7,
      'Mage': 8,
      'Warlock': 9,
      'Druid': 11,
    };

    const { data, error } = await supabase
      .from("loadouts")
      .insert({
        title,
        import_string: exportString,
        image_url: imageUrl,
        author_id: userId,
        class_id: classMap[className] || null,
        parsed_data: { items: [] },
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, loadout: data };
  } catch (error: any) {
    console.error("Upload action error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
