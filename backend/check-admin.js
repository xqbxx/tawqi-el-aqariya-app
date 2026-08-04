const { Client } = require('pg');

const c = new Client({
  connectionString: 'postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
});

async function run() {
  await c.connect();
  
  const admins = await c.query('SELECT "Id", "Username", "PasswordHash" FROM "Admins"');
  console.log("=== Admins ===");
  for (const a of admins.rows) {
    console.log(`  ID: ${a.Id}, Username: "${a.Username}"`);
    console.log(`  Hash: "${a.PasswordHash}"`);
  }

  await c.end();
}

run().catch(e => { console.error(e); process.exit(1); });
