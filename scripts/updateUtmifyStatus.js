// scripts/updateUtmifyStatus.js
// Usage: node scripts/updateUtmifyStatus.js <orderId>
// Reads the payload saved by lib/utmify.js, sets status to "paid", and resends it to UTMify.

const path = require('path');
const fs = require('fs');
const { config } = require('dotenv');
// node-fetch v3 is ESM; load dynamically.
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Load .env.local from project root
config({ path: path.resolve(process.cwd(), '.env.local') });

const orderId = process.argv[2];
if (!orderId) {
  console.error('Uso: node scripts/updateUtmifyStatus.js <orderId>');
  process.exit(1);
}

const apiKey = (process.env.UTMIFY_API_TOKEN || '').trim();
if (!apiKey) {
  console.error('UTMIFY_API_TOKEN not set or empty after trimming.');
  process.exit(1);
}
console.log('UTMIFY_API_TOKEN (trimmed) =', apiKey);

// Path where lib/utmify.js saved payloads
const ordersDir = path.resolve(process.cwd(), 'orders');
const payloadPath = path.join(ordersDir, `${orderId}.json`);
if (!fs.existsSync(payloadPath)) {
  console.error('Payload file not found for orderId:', orderId);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse payload JSON:', e);
  process.exit(1);
}

// Update required fields
payload.status = 'paid';
payload.updatedAt = new Date().toISOString();

(async () => {
  try {
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      console.error('Erro ao atualizar status UTMify:', data || response.statusText);
    } else {
      console.log('Status atualizado com sucesso:', data);
    }
  } catch (err) {
    console.error('Exceção ao chamar API UTMify:', err);
  }
})();
