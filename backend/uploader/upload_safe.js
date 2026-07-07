const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function uploadFileSafe(localPath, remoteName) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client.cd("wwwroot");
        await client.uploadFrom(localPath, remoteName);
        console.log(`Successfully uploaded ${remoteName}`);
    } catch (e) {
        console.error(`Failed to upload ${remoteName}:`, e.message);
        throw e;
    } finally {
        client.close();
    }
}

async function run() {
    const publishDir = path.join(__dirname, "../publish");
    const files = ["web.config"];
    
    console.log("App taken offline.");
    
    const client = new ftp.Client();
    try {
        await client.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client.cd("wwwroot");
        await client.uploadFrom(path.join(__dirname, "app_offline.htm"), "app_offline.htm");
    } finally {
        client.close();
    }

    for (const file of files) {
        const localPath = path.join(publishDir, file);
        if (fs.statSync(localPath).isFile()) {
            console.log(`Uploading ${file}...`);
            let success = false;
            for(let attempt=1; attempt<=5; attempt++) {
                try {
                    await uploadFileSafe(localPath, file);
                    success = true;
                    break;
                } catch(e) {
                    console.log(`Attempt ${attempt} failed for ${file}. Retrying in 2 seconds...`);
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
            if(!success) {
                console.log(`FATAL: Could not upload ${file}`);
            }
        }
    }

    console.log("Upload completed!");
    console.log("App brought online.");
    
    const client2 = new ftp.Client();
    try {
        await client2.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client2.cd("wwwroot");
        await client2.remove("app_offline.htm");
    } finally {
        client2.close();
    }
}

run();
