const url = "https://rssqznucdiocywendgtq.supabase.co/rest/v1/users?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzc3F6bnVjZGlvY3l3ZW5kZ3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTA2NzMsImV4cCI6MjA5Nzc4NjY3M30.8xUvRaZ8sbVL9OYM8RZ1KX2KVSaCA-33o8-2SOgzXow";

async function run() {
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
