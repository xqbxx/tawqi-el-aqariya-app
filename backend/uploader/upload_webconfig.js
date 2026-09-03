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
        await client.cd("site1");
        await client.uploadFrom("j:/downloads/tawqi-el-aqariya-app/backend/publish/web.config", "web.config");
        console.log("Uploaded web.config");
    } finally {
        client.close();
    }
}
run();
