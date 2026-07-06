const { Client } = require("pg");

async function fixDb() {
    const client = new Client({
        connectionString: "postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres",
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query("UPDATE \"Admins\" SET \"PasswordHash\" = '$2b$10$l52VGH6rqy0IFKbaLiQLwuiRH4Ry06/4wrDH1IWOn3B7VHXr8K5JC' WHERE \"Id\" = 1");
        console.log("Password hash fixed successfully.");
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await client.end();
    }
}
fixDb();
