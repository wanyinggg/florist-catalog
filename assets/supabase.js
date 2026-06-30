const SB_URL = 'https://xfjdmffruozupsvefzfm.supabase.co';
const SB_KEY = 'sb_publishable_ffkmaavk3IC_MYMhonZijA_ci3-c1oT'; // always used as apikey
const SB_IMG_BASE = `${SB_URL}/storage/v1/object/public/images/`;

// Admin writes use the service key (JWT) stored in localStorage for Authorization
function _adminKey() { return localStorage.getItem('lc_adm_sk') || SB_KEY; }

async function sbFetch(path, opts = {}, authKey = SB_KEY) {
  const res = await fetch(`${SB_URL}${path}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${authKey}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  if (opts.raw) return res;
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function sbGetProducts() {
  return sbFetch('/rest/v1/products?select=*&order=price.asc');
}

async function sbGetProduct(id) {
  const data = await sbFetch(`/rest/v1/products?select=*&id=eq.${id}`);
  return data?.[0] ?? null;
}

async function sbInsert(product) {
  return sbFetch('/rest/v1/products', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(product),
  }, _adminKey());
}

async function sbUpdate(id, product) {
  return sbFetch(`/rest/v1/products?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(product),
  }, _adminKey());
}

async function sbDelete(id) {
  return sbFetch(`/rest/v1/products?id=eq.${id}`, { method: 'DELETE', raw: true }, _adminKey());
}

async function sbUploadImage(filename, base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType || 'image/jpeg' });
  const authKey = _adminKey();
  const res = await fetch(`${SB_URL}/storage/v1/object/images/${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${authKey}`,
      'Content-Type': mimeType || 'image/jpeg',
      'x-upsert': 'true',
    },
    body: blob,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Upload failed'); }
  return `${SB_IMG_BASE}${encodeURIComponent(filename)}`;
}

// Returns a displayable URL for an img value (string filename or full URL)
function imgSrc(img) {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `images/${img}`;
}
