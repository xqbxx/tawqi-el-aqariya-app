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
        } catch(e) {}
        
        // Wait for IIS to release the files
        console.log("⏳ Waiting 8 seconds for IIS to release files...");
        await new Promise(r => setTimeout(r, 8000));

        const file = "Npgsql.dll";
        
        // Rename the old corrupted one to get it out of the way
        try {
            await client.rename(file, file + ".corrupt" + Date.now());
            console.log("✅ Renamed corrupt DLL");
        } catch(e) {}

        const localPath = path.join(__dirname, "../publish", file);
        console.log(`📤 Uploading ${file}...`);
        
        let success = false;
        for (let attempt = 1; attempt <= 10; attempt++) {
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
                
                // Verify size
                const list = await client.list();
                const uploadedFile = list.find(f => f.name === file);
                if (uploadedFile && uploadedFile.size === 2194784) {
                    console.log(`   ✅ Success on attempt ${attempt}! Size matches (2194784).`);
                    success = true;
                    break;
                } else {
                    console.log(`   ❌ Size mismatch on attempt ${attempt}: ${uploadedFile ? uploadedFile.size : 'not found'}`);
                }
            } catch (e) {
                console.log(`   ❌ Attempt ${attempt} failed: ${e.message}`);
            }
            if (attempt < 10) {
                console.log("   ⏳ Waiting 3 seconds...");
                await new Promise(r => setTimeout(r, 3000));
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
        } catch (e) {}

    } catch (e) {
        console.error("💥 Fatal:", e.message);
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
}
run();
