const fetch = require('node-fetch');

async function trigger() {
  try {
    const res = await fetch('https://tawqi-1.runasp.net/api/properties');
    console.log("Trigger Status:", res.status);
  } catch (err) {
    console.error(err);
  }
}

trigger();
