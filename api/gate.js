import crypto from 'node:crypto';

// ── In-memory store of consumed tokens (nonce → true) ──
// On Vercel each cold-start resets this, which is fine:
// expired tokens are rejected by timestamp anyway.
const usedTokens = new Set();

function getSecret() {
  return process.env.DOWNLOAD_GATE_SECRET;
}

function base64urlEncode(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/') + pad;
  return Buffer.from(b64, 'base64');
}

function sign(payloadJson, secret) {
  const payload = base64urlEncode(Buffer.from(payloadJson, 'utf8'));
  const sig = crypto.createHmac('sha256', secret).update(payload).digest();
  return `${payload}.${base64urlEncode(sig)}`;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verify a download token.
 * Returns { ok, payload, error }.
 * If ok === true the token is CONSUMED — calling again will fail.
 */
export function verifyDownloadToken(token, secret) {
  if (!token || typeof token !== 'string') return { ok: false, error: 'Missing token' };
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, error: 'Invalid token format' };

  const [payloadB64u, sigB64u] = parts;
  let payloadBuf;
  let sigBuf;

  try {
    payloadBuf = base64urlDecode(payloadB64u);
    sigBuf = base64urlDecode(sigB64u);
  } catch {
    return { ok: false, error: 'Invalid token encoding' };
  }

  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64u).digest();
  if (!timingSafeEqual(sigBuf, expectedSig)) return { ok: false, error: 'Invalid token signature' };

  let payload;
  try {
    payload = JSON.parse(payloadBuf.toString('utf8'));
  } catch {
    return { ok: false, error: 'Invalid token payload' };
  }

  if (!payload || typeof payload !== 'object') return { ok: false, error: 'Invalid token payload' };
  if (!payload.fileId) return { ok: false, error: 'Invalid token payload' };
  if (!payload.exp || typeof payload.exp !== 'number') return { ok: false, error: 'Invalid token payload' };
  if (!payload.nonce) return { ok: false, error: 'Invalid token payload' };

  // ── Expired? ──
  if (Date.now() > payload.exp) return { ok: false, error: 'Token expired. Please go back to the movie page and try again.' };

  // ── Already used? (one-time enforcement) ──
  if (usedTokens.has(payload.nonce)) {
    return { ok: false, error: 'This download link has already been used. Please go back to the movie page and request a new download.' };
  }

  // Mark as consumed
  usedTokens.add(payload.nonce);

  // Housekeep: remove old nonces after 10 minutes to prevent memory leak
  setTimeout(() => usedTokens.delete(payload.nonce), 10 * 60 * 1000);

  return { ok: true, payload };
}

// ── POST /api/gate?id=<fileId>  →  issues a single-use token ──
export default async function handler(req, res) {
  const { id } = req.query;
  const secret = getSecret();

  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured (DOWNLOAD_GATE_SECRET missing)' });
  }

  if (!id) return res.status(400).json({ error: 'File ID is required' });

  // Token lives for 5 minutes, but can only be used ONCE.
  const ttlMs = 5 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');

  const payload = {
    fileId: String(id),
    exp: Date.now() + ttlMs,
    nonce,
  };

  const token = sign(JSON.stringify(payload), secret);
  return res.status(200).json({ token, expiresInMs: ttlMs, nonce });
}
