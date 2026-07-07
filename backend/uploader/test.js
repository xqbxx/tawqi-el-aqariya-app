const fetch = require('node-fetch');

async function testHub() {
  try {
    const res = await fetch('https://tawqi-1.runasp.net/hubs/property/negotiate?negotiateVersion=1', {
      method: 'POST'
    });
    console.log("HUB NEGOTIATE STATUS:", res.status);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  }
}

testHub();
