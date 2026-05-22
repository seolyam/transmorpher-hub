import { S3Client, CreateBucketCommand, ListBucketsCommand, PutBucketAclCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  forcePathStyle: true,
  region: "us-east-1",
  endpoint: "https://rnkoetwcsfihpzaacesr.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: "a1bd0f38071a0e837e596ae32eb35a96",
    secretAccessKey: "0ed9eed59c5b76515b5d5f26f39f604cc61927c185aacccf81854aa7ee775e84",
  },
});

async function main() {
  console.log("Checking existing buckets...");
  try {
    const listResponse = await client.send(new ListBucketsCommand({}));
    const buckets = listResponse.Buckets || [];
    console.log("Buckets found:", buckets.map(b => b.Name));

    const bucketName = "loadout-images";
    const exists = buckets.some(b => b.Name === bucketName);

    if (exists) {
      console.log(`Bucket "${bucketName}" already exists!`);
    } else {
      console.log(`Bucket "${bucketName}" does not exist. Creating...`);
      await client.send(new CreateBucketCommand({
        Bucket: bucketName,
      }));
      console.log(`Bucket "${bucketName}" successfully created!`);
    }
  } catch (error) {
    console.error("Error connecting or creating bucket:", error);
  }
}

main();
