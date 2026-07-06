const { Client } = require("pg");

async function checkDb() {
    const client = new Client({
        connectionString: "postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres",
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT * FROM \"Admins\"");
        console.log("Admins:", res.rows);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await client.end();
    }
}
checkDb();
