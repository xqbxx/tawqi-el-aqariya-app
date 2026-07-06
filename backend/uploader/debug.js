const ftp = require("basic-ftp");
const path = require("path");

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "site78065.siteasp.net",
            user: "site78065",
            password: "Hg7?t_S5Q4=p",
            secure: false
        });
        await client.cd("wwwroot");
        
        // Upload web.config
        await client.uploadFrom(path.join(__dirname, "../publish/web.config"), "web.config");
        console.log("Uploaded web.config");
        
        // Ensure logs dir exists
        await client.ensureDir("logs");
        console.log("Created logs dir");
        
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}
run();
