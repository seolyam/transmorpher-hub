import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Testing join query...");
  const { data, error } = await supabase
    .from("loadouts")
    .select(`
      *,
      profiles!loadouts_author_id_fkey ( username ),
      loadout_upvote_counts ( upvote_count )
    `);

  if (error) {
    console.error("Error executing join query:", error);
  } else {
    console.log("Join query results:", JSON.stringify(data, null, 2));
  }
}

main();
