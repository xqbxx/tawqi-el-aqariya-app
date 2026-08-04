const { Client } = require('pg');
const https = require('https');
const http = require('http');

const SUPABASE_URL = 'https://mcxkglaxpegfdjpdzjkk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeGtnbGF4cGVnZmRqcGR6amtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzMyMTAxMiwiZXhwIjoyMDk4ODk3MDEyfQ.jtaqIhj8p75v6r1nJidtIsq6fPuSDSUM-crQ4NQmF-Y';
const BUCKET = 'properties-images';

const client = new Client({
  connectionString: 'postgresql://postgres.mcxkglaxpegfdjpdzjkk:Aa116600stt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
});

function uploadToSupabase(imageBytes, fileName, contentType) {
  return new Promise((resolve, reject) => {
    const url = new URL(`/storage/v1/object/${BUCKET}/${fileName}`, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'Content-Length': imageBytes.length,
        'x-upsert': 'true'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(imageBytes);
    req.end();
  });
}

async function main() {
  console.log('🔌 Connecting to database...');
  await client.connect();
  console.log('✅ Connected!\n');

  const res = await client.query('SELECT "Id", "Title", "Images" FROM "Properties"');
  console.log(`Found ${res.rowCount} properties.\n`);

  for (const row of res.rows) {
    const images = row.Images;
    if (!images || images.length === 0) {
      console.log(`⏭️  Property ${row.Id} "${row.Title}": No images, skipping.`);
      continue;
    }

    let needsUpdate = false;
    const newImages = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      if (img.startsWith('data:image/')) {
        // This is base64 data - upload to Supabase
        console.log(`📤 Property ${row.Id} "${row.Title}" image ${i + 1}: Uploading base64 to Supabase...`);

        // Parse the base64 data
        const match = img.match(/^data:image\/([\w+]+);base64,(.+)$/);
        if (!match) {
          console.log(`   ⚠️  Could not parse base64 format, keeping as-is.`);
          newImages.push(img);
          continue;
        }

        const format = match[1]; // e.g. 'webp', 'png', 'jpeg'
        const base64Data = match[2];
        const imageBytes = Buffer.from(base64Data, 'base64');
        const fileName = `property_${row.Id}_img_${i}_${Date.now()}.${format}`;
        const contentType = `image/${format}`;

        console.log(`   📊 Size: ${(imageBytes.length / 1024).toFixed(1)} KB (${format})`);

        try {
          const publicUrl = await uploadToSupabase(imageBytes, fileName, contentType);
          console.log(`   ✅ Uploaded! URL: ${publicUrl.substring(0, 80)}...`);
          newImages.push(publicUrl);
          needsUpdate = true;
        } catch (err) {
          console.log(`   ❌ Upload failed: ${err.message}`);
          newImages.push(img); // Keep original on failure
        }
      } else {
        // Already a URL - keep it
        console.log(`⏭️  Property ${row.Id} "${row.Title}" image ${i + 1}: Already a URL, skipping.`);
        newImages.push(img);
      }
    }

    if (needsUpdate) {
      // Update the database with new URLs
      await client.query('UPDATE "Properties" SET "Images" = $1 WHERE "Id" = $2', [newImages, row.Id]);
      console.log(`   💾 Database updated!\n`);
    }
  }

  // Verify
  console.log('\n📊 Verification:');
  const verify = await client.query('SELECT "Id", "Title", pg_column_size("Images") as img_bytes FROM "Properties"');
  for (const row of verify.rows) {
    console.log(`  Property ${row.Id} "${row.Title}": Images column = ${(row.img_bytes / 1024).toFixed(1)} KB`);
  }

  await client.end();
  console.log('\n🎉 Migration complete!');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  client.end();
});
