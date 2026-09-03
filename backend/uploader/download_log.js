const ftp = require("basic-ftp");

async function run() {
    let client = new ftp.Client();
    client.ftp.timeout = 60000;
    try {
        await client.access({
            host: "win8036.site4now.net",
            user: "xqbxx1-001",
            password: "Aa116600ang",
            secure: false
        });
        await client.cd("site1/logs");
        const list = await client.list();
        if (list.length === 0) {
            console.log("No logs found.");
            return;
        }
        list.sort((a,b) => a.modifiedAt - b.modifiedAt);
        const latest = list[list.length - 1];
        console.log(`Downloading ${latest.name}...`);
        await client.downloadTo("latest.log", latest.name);
        const fs = require('fs');
        console.log(fs.readFileSync("latest.log", "utf8"));
    } finally {
        client.close();
    }
}
run();
