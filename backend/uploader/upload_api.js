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
        try { await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/backend/uploader/app_offline.htm", "app_offline.htm"); } catch(e){}
        await new Promise(r => setTimeout(r, 10000));

        const files = ["TawqiApi.dll", "TawqiApi.deps.json", "TawqiApi.pdb"];

        for (const file of files) {
            console.log(`Uploading ${file}...`);
            try { await client.rename(file, file + ".bak" + Date.now()); } catch(e){}
            
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
                    await client.uploadFrom(`j:/downloads/tawqi-el-aqariya-app/backend/publish/${file}`, file);
                    console.log(`Uploaded ${file} successfully!`);
                    break;
                } catch(e) {
                    console.log(`Attempt ${i} failed: ${e.message}`);
                }
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
