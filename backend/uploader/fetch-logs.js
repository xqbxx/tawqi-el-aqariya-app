const ftp = require("basic-ftp");
const path = require("path");

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "win8036.site4now.net",
            user: "xqbxx1-001",
            password: "Aa116600ang",
            secure: false
        });
        await client.cd("site1");
        
        // List all files to find log files
        const list = await client.list();
        const logFiles = list.filter(f => f.isFile && (f.name.startsWith("stdout_") || f.name.endsWith(".log")));
        
        if (logFiles.length > 0) {
            console.log("Found log files:");
            for (const file of logFiles) {
                console.log(`  ${file.name} (${file.size} bytes)`);
                const localPath = path.join(__dirname, file.name);
                await client.downloadTo(localPath, file.name);
                console.log(`  Downloaded to ${localPath}`);
            }
        } else {
            console.log("No log files found in site1/");
            console.log("All files:");
            for (const f of list) {
                console.log(`  ${f.isDirectory ? "[DIR]" : ""} ${f.name} (${f.size})`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}
run();
