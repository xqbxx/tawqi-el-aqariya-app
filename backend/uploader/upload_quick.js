const ftp = require("basic-ftp");
const path = require("path");

async function run() {
    const filesToUpload = [
        "appsettings.json",
        "appsettings.Development.json",
        "TawqiApi.dll",
        "TawqiApi.pdb",
        "TawqiApi.deps.json",
        "web.config"
    ];

    for (const fileName of filesToUpload) {
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
                await client.cd("wwwroot");
                
                console.log(`Uploading ${fileName}...`);
                await client.uploadFrom(path.join(__dirname, "../publish", fileName), fileName);
                success = true;
            } catch (e) {
                console.error(`Error uploading ${fileName}: ${e.message}`);
                attempts++;
            } finally {
                client.close();
            }
        }
        
        if (!success) {
            console.error(`Failed to upload ${fileName} completely.`);
            process.exit(1);
        }
    }
    
    console.log("Quick upload completed successfully.");
}
run();
