const ftp = require("basic-ftp");

async function run() {
    let client = new ftp.Client();
    client.ftp.timeout = 60000;

    try {
        console.log("Connecting...");
        await client.access({
            host: "win8036.site4now.net",
            user: "xqbxx1-001",
            password: "Aa116600ang",
            secure: false
        });
        await client.cd("site1");
        
        console.log("Listing files...");
        const list = await client.list();
        const backups = list.filter(f => f.name.startsWith("Npgsql.dll.corrupt"));
        if (backups.length > 0) {
            // Sort by name to get the latest (since it has Date.now())
            backups.sort((a,b) => a.name.localeCompare(b.name));
            const latestBackup = backups[backups.length - 1].name;
            
            console.log(`Found backup: ${latestBackup}`);
            console.log("Taking app offline...");
            await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/backend/uploader/app_offline.htm", "app_offline.htm");
            await new Promise(r => setTimeout(r, 8000));

            try { await client.rename("Npgsql.dll", "Npgsql.dll.old"); } catch(e){}
            
            console.log(`Restoring ${latestBackup} to Npgsql.dll`);
            await client.rename(latestBackup, "Npgsql.dll");
            
            await client.remove("app_offline.htm");
            console.log("App brought online.");
        } else {
            console.log("No backup found.");
        }

    } catch (e) {
        console.error("Fatal:", e.message);
    } finally {
        if (!client.closed) client.close();
    }
}
run();
