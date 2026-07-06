const { Client } = require("pg");

async function cleanDb() {
    const client = new Client({
        connectionString: "postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres",
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query("DELETE FROM \"Properties\" WHERE \"Images\"[1] LIKE 'blob:%'");
        console.log("Deleted old properties with blob URLs.");
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await client.end();
    }
}
cleanDb();
