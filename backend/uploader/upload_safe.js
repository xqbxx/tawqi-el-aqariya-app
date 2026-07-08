const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

// SmarterASP.NET credentials
const FTP_CONFIG = {
    host: "win8036.site4now.net",
    port: 21,
    user: "xqbxx1-001",
    password: "Aa116600ang",
    secure: false
};

const REMOTE_ROOT = "site1";

async function run() {
    const publishDir = path.join(__dirname, "../publish");
    const allFiles = fs.readdirSync(publishDir).filter(f =>
        fs.statSync(path.join(publishDir, f)).isFile()
    );

    console.log(`\n🚀 Deploying to SmarterASP.NET (single-connection mode)...`);
    console.log(`📦 Found ${allFiles.length} files to upload.\n`);

    const client = new ftp.Client();
    client.ftp.timeout = 60000;

    try {
        // Connect ONCE and reuse the connection
        console.log("🔌 Connecting to FTP...");
        await client.access(FTP_CONFIG);
        await client.cd(REMOTE_ROOT);
        console.log("✅ Connected!\n");

        // Take app offline
        try {
            await client.uploadFrom(path.join(__dirname, "app_offline.htm"), "app_offline.htm");
            console.log("⏸️  App taken offline.\n");
        } catch(e) {
            console.log("⚠️  Could not take app offline, continuing...\n");
        }

        // Upload all files using the SAME connection
        let succeeded = 0;
        let failed = [];

        for (const file of allFiles) {
            const localPath = path.join(publishDir, file);
            try {
                process.stdout.write(`📤 ${file}...`);
                await client.uploadFrom(localPath, file);
                console.log(" ✅");
                succeeded++;
            } catch (e) {
                console.log(` ❌ ${e.message}`);
                failed.push(file);
                
                // If connection dropped, reconnect once and retry
                if (e.message.includes("ECONNRESET") || e.message.includes("FIN") || e.message.includes("530")) {
                    console.log("   🔄 Reconnecting...");
                    try {
                        client.close();
                        await new Promise(r => setTimeout(r, 3000));
                        await client.access(FTP_CONFIG);
                        await client.cd(REMOTE_ROOT);
                        console.log("   ✅ Reconnected. Retrying file...");
                        await client.uploadFrom(localPath, file);
                        console.log(`   ✅ ${file} uploaded on retry.`);
                        failed.pop();
                        succeeded++;
                    } catch(e2) {
                        console.log(`   ❌ Retry failed: ${e2.message}`);
                    }
                }
            }
        }

        // Bring app online
        try {
            await client.remove("app_offline.htm");
            console.log("\n✅ App brought online.");
        } catch(e) {
            console.log("\n⚠️  Could not remove app_offline.htm - remove it manually.");
        }

        console.log(`\n📊 Results: ${succeeded}/${allFiles.length} uploaded successfully.`);
        if (failed.length > 0) {
            console.log(`⚠️  Failed: ${failed.join(", ")}`);
        } else {
            console.log(`🎉 Deployment complete! Site: http://xqbxx1-001-site1.etempurl.com/`);
        }

    } catch (err) {
        console.error("💥 Fatal connection error:", err.message);
    } finally {
        client.close();
    }
}

run().catch(console.error);
