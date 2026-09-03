const ftp = require("basic-ftp");
const path = require("path");

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
        console.log("Connected!");

        console.log("Taking app offline...");
        try {
            await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/backend/uploader/app_offline.htm", "app_offline.htm");
        } catch(e) {}
        
        console.log("Waiting 10 seconds for IIS to release files...");
        await new Promise(r => setTimeout(r, 10000));

        const files = ["Npgsql.dll", "Swashbuckle.AspNetCore.SwaggerUI.dll"];
        
        for (const file of files) {
            console.log(`Processing ${file}...`);
            try {
                await client.rename(file, file + ".corrupt" + Date.now());
                console.log(`Renamed old ${file}`);
            } catch(e) {}

            const localPath = "j:/downloads/tawqi-el-aqariya-app/publish/" + file;
            
            for (let attempt = 1; attempt <= 5; attempt++) {
                try {
                    await client.uploadFrom(localPath, file);
                    console.log(`Success on attempt ${attempt} for ${file}!`);
                    break;
                } catch (e) {
                    console.log(`Attempt ${attempt} failed: ${e.message}`);
                }
            }
        }

        try {
            await client.remove("app_offline.htm");
            console.log("App brought online!");
        } catch (e) {}

    } catch (e) {
        console.error("Fatal:", e.message);
    } finally {
        if (!client.closed) client.close();
    }
}
run();
