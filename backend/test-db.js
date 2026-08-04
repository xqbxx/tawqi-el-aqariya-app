const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
});

(async () => {
  await c.connect();
  const t = Date.now();
  const r = await c.query('SELECT * FROM "Properties"');
  const elapsed = Date.now() - t;
  let s = 0;
  r.rows.forEach(row => s += JSON.stringify(row).length);
  console.log(`Query took ${elapsed} ms for ${r.rowCount} rows`);
  console.log(`Total size: ${(s / 1024).toFixed(1)} KB`);
  await c.end();
})();
