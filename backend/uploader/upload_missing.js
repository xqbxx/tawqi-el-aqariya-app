const ftp = require("basic-ftp");
const path = require("path");

async function run() {
    let client = new ftp.Client();
    client.ftp.timeout = 120000;

    try {
        console.log("Connecting...");
        await client.access({
            host: "win8036.site4now.net",
            user: "xqbxx1-001",
            password: "Aa116600ang",
            secure: false
        });
        await client.cd("site1");
        
        console.log("Taking app offline...");
        await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/backend/uploader/app_offline.htm", "app_offline.htm");
        await new Promise(r => setTimeout(r, 10000));

        console.log("Renaming existing DLLs to unlock them...");
        try { await client.rename("Npgsql.dll", "Npgsql.dll.bak" + Date.now()); } catch(e){}
        try { await client.rename("Swashbuckle.AspNetCore.SwaggerUI.dll", "Swagger.bak" + Date.now()); } catch(e){}
        
        console.log("Uploading Npgsql.dll...");
        for (let i = 1; i <= 5; i++) {
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
                await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/publish/Npgsql.dll", "Npgsql.dll");
                console.log("Uploaded Npgsql.dll successfully!");
                break;
            } catch(e) {
                console.log(`Attempt ${i} failed: ${e.message}`);
            }
        }

        console.log("Uploading SwaggerUI...");
        for (let i = 1; i <= 5; i++) {
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
                await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/publish/Swashbuckle.AspNetCore.SwaggerUI.dll", "Swashbuckle.AspNetCore.SwaggerUI.dll");
                console.log("Uploaded SwaggerUI successfully!");
                break;
            } catch(e) {
                console.log(`Attempt ${i} failed: ${e.message}`);
            }
        }

        await client.remove("app_offline.htm");
        console.log("App brought online.");

    } catch (e) {
        console.error("Fatal:", e.message);
    } finally {
        if (!client.closed) client.close();
    }
}
run();
