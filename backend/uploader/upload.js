const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function uploadFiles() {
    const publishDir = path.join(__dirname, "../publish");
    const files = [];

    function walkDir(currentPath) {
        const items = fs.readdirSync(currentPath);
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                walkDir(itemPath);
            } else {
                files.push(itemPath);
            }
        }
    }
    walkDir(publishDir);

    console.log(`Found ${files.length} files to upload.`);

    for (const file of files) {
        const relativePath = path.relative(publishDir, file).replace(/\\/g, '/');
        const remotePath = `/wwwroot/${relativePath}`;
        
        let success = false;
        let attempts = 0;
        
        while (!success && attempts < 3) {
            const client = new ftp.Client();
            try {
                await client.access({
                    host: "site78065.siteasp.net",
                    user: "site78065",
                    password: "Hg7?t_S5Q4=p",
                    secure: false
                });
                
                await client.ensureDir(path.dirname(remotePath));
                console.log(`Uploading ${relativePath}...`);
                await client.uploadFrom(file, remotePath);
                success = true;
            } catch (err) {
                console.error(`Error uploading ${relativePath} (Attempt ${attempts + 1}):`, err.message);
                attempts++;
            } finally {
                client.close();
            }
        }
        
        if (!success) {
            console.error(`Failed to upload ${relativePath} after 3 attempts. Exiting.`);
            process.exit(1);
        }
    }
    
    console.log("Upload completed!");
}

async function prepareRoot() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client.cd("wwwroot");
        try { await client.remove("default.html"); console.log("Deleted default.html"); } catch(e){}
        try { await client.remove("hostingstart.html"); console.log("Deleted hostingstart.html"); } catch(e){}
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}

async function run() {
    await prepareRoot();
    await uploadFiles();
}

run();
