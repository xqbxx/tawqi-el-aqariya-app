const ftp = require("basic-ftp");
const path = require("path");

async function run() {
    let client = new ftp.Client();
    client.ftp.timeout = 60000;

    try {
        console.log("🔌 Connecting...");
        await client.access({
            host: "win8036.site4now.net",
            user: "xqbxx1-001",
            password: "Aa116600ang",
            secure: false
        });
        await client.cd("site1");
        console.log("✅ Connected!\n");

        // Upload app_offline.htm first to stop the app
        console.log("⏸️  Taking app offline...");
        try {
            await client.uploadFrom(path.join(__dirname, "app_offline.htm"), "app_offline.htm");
        } catch(e) {
            console.log("Upload offline failed, ignoring...");
        }
        
        // Wait for IIS to release the files
        console.log("⏳ Waiting 5 seconds for IIS to release files...");
        await new Promise(r => setTimeout(r, 5000));

        // Upload the missing DLL
        const file = "Microsoft.EntityFrameworkCore.Relational.dll";
        const localPath = path.join(__dirname, "../publish", file);
        console.log(`📤 Uploading ${file}...`);
        
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                if (client.closed) {
                     client = new ftp.Client();
                     await client.access({
                        host: "win8036.site4now.net",
                        user: "xqbxx1-001",
                        password: "Aa116600ang",
                        secure: false
                    });
                    await client.cd("site1");
                }
                
                await client.uploadFrom(localPath, file);
                console.log(`   ✅ Success on attempt ${attempt}!`);
                break;
            } catch (e) {
                console.log(`   ❌ Attempt ${attempt} failed: ${e.message}`);
                if (attempt < 3) {
                    console.log("   ⏳ Waiting 5 seconds...");
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        }

        // Remove app_offline.htm
        try {
             if (client.closed) {
                     client = new ftp.Client();
                     await client.access({
                        host: "win8036.site4now.net",
                        user: "xqbxx1-001",
                        password: "Aa116600ang",
                        secure: false
                    });
                    await client.cd("site1");
                }
            await client.remove("app_offline.htm");
            console.log("\n✅ App brought online!");
        } catch (e) {
            console.log("\n⚠️  Could not remove app_offline.htm");
        }

    } catch (e) {
        console.error("💥 Fatal:", e.message);
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
}
run();
