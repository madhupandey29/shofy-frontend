
let NEXT_CONFIG = {};
try {
  NEXT_CONFIG = require('../next.config.js');         
} catch {
  /* next.config.js absent – ignore */
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  NEXT_CONFIG.env?.NEXT_PUBLIC_API_BASE_URL ??
  '';

if (!API_BASE) {
  console.error('❌  NEXT_PUBLIC_API_BASE_URL is not defined');
  process.exit(1);
}

(async () => {
  const endpoint = `${API_BASE}/newproduct/view`;

  try {
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!Array.isArray(json?.data) || json.data.length === 0) {
      throw new Error('API returned an empty product list');
    }

  } catch (err) {
    console.error(`❌  API test failed: ${err.message}`);
    process.exit(1);
  }
})();
