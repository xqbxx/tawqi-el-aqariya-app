const https = require('https');

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  // 1. Login
  console.log("🔐 Logging in...");
  const loginRes = await makeRequest({
    hostname: 'api.tawqielaqariya.com',
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ Username: "xqbxx", Password: "Aa116600stt" }));
  
  console.log("Login status:", loginRes.status);
  console.log("Login response:", loginRes.body);

  if (loginRes.status !== 200) {
    console.log("❌ Login failed!");
    return;
  }

  const token = JSON.parse(loginRes.body).token;
  console.log("✅ Token received:", token.substring(0, 30) + "...");

  // 2. Try delete on property 16
  console.log("\n🗑️  Testing DELETE on property 16...");
  const deleteRes = await makeRequest({
    hostname: 'api.tawqielaqariya.com',
    path: '/api/properties/16',
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  console.log("Delete status:", deleteRes.status);
  console.log("Delete response:", deleteRes.body);
}

run().catch(console.error);
