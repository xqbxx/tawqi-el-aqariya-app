const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client.cd("wwwroot/logs");
        
        const list = await client.list();
        if (list.length > 0) {
            console.log("Downloading log files...");
            for (const file of list) {
                if (file.isFile) {
                    await client.downloadTo(path.join(__dirname, file.name), file.name);
                    console.log(`Downloaded ${file.name}`);
                }
            }
        } else {
            console.log("No logs found.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}
run();
