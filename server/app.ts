import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createHash, randomBytes } from 'node:crypto';
import { pool } from './db';

const app = express();
const categories = ['kopi', 'non-kopi', 'pastry'] as const;
const statuses = ['pending', 'confirmed', 'done', 'cancelled'] as const;
const sessionSecret = process.env.SESSION_SECRET;
const loginFailures = new Map<string, { count: number; resetAt: number }>();
const loginAttemptLimit = 5;
const loginAttemptWindowMs = 15 * 60 * 1000;

app.use(express.json());
// serverless-http may mount the catch-all segment without the `/api` prefix.
// Normalize that internal URL while keeping the public contract unchanged.
app.use((req, _res, next) => { if (!req.url.startsWith('/api/')) req.url = `/api${req.url}`; next(); });
const bad = (res: Response, message: string) => res.status(400).json({ error: message });
const parseId = (value: string | string[]) => typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : null;
const cookieValue = (req: Request, name: string) => req.header('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
const sessionId = (token: string) => createHash('sha256').update(`${sessionSecret ?? ''}:${token}`).digest('hex');
const setSessionCookie = (res: Response, token: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `kopikita_session=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${maxAge}`);
};
const loginAttemptKey = (email: unknown) => String(email).trim().toLowerCase();
const rateLimitRetryAfter = (key: string, now = Date.now()) => {
  const attempt = loginFailures.get(key);
  if (!attempt) return 0;
  if (attempt.resetAt <= now) { loginFailures.delete(key); return 0; }
  return attempt.count >= loginAttemptLimit ? Math.ceil((attempt.resetAt - now) / 1000) : 0;
};
const recordFailedLogin = (key: string, now = Date.now()) => {
  const attempt = loginFailures.get(key);
  if (!attempt || attempt.resetAt <= now) return loginFailures.set(key, { count: 1, resetAt: now + loginAttemptWindowMs });
  attempt.count += 1;
};
const clearFailedLogins = (key: string) => loginFailures.delete(key);
const requireAdmin = async (req: Request, res: Response, next: () => void) => {
  const token = cookieValue(req, 'kopikita_session');
  if (!token || !sessionSecret) return res.status(401).json({ error: 'Unauthorized' });
  try { const result = await pool.query('SELECT id FROM sessions WHERE id = $1 AND expires_at > CURRENT_TIMESTAMP', [sessionId(token)]); if (!result.rowCount) return res.status(401).json({ error: 'Unauthorized' }); next(); }
  catch { return res.status(500).json({ error: 'Authentication failed' }); }
};

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return bad(res, 'Email and password are required');
  const attemptKey = loginAttemptKey(email);
  const retryAfter = rateLimitRetryAfter(attemptKey);
  if (retryAfter) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many failed login attempts. Try again later.' });
  }
  try {
    if (!sessionSecret) return res.status(500).json({ error: 'Session configuration is missing' });
    const result = await pool.query('SELECT id FROM admins WHERE email = $1 AND password_hash = crypt($2, password_hash)', [email, password]);
    if (!result.rowCount) { recordFailedLogin(attemptKey); return res.status(401).json({ error: 'Invalid credentials' }); }
    clearFailedLogins(attemptKey);
    const token = randomBytes(32).toString('hex');
    await pool.query('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    await pool.query("INSERT INTO sessions (id, admin_id, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '7 days')", [sessionId(token), result.rows[0].id]);
    setSessionCookie(res, token, 60 * 60 * 24 * 7);
    res.json({ ok: true });
  }
  catch { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/admin/logout', async (req, res) => {
  const token = cookieValue(req, 'kopikita_session');
  try { if (token && sessionSecret) await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId(token)]); setSessionCookie(res, '', 0); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Logout failed' }); }
});

app.get('/api/products', async (req, res) => {
  try { const category = typeof req.query.category === 'string' ? req.query.category : undefined; if (category && !categories.includes(category as typeof categories[number])) return bad(res, 'Invalid category'); const result = await pool.query('SELECT id, name, description, price, category, image_url, available, created_at FROM products' + (category ? ' WHERE category = $1' : '') + ' ORDER BY id', category ? [category] : []); res.json(result.rows); }
  catch { res.status(500).json({ error: 'Failed to fetch products' }); }
});

app.post('/api/products', requireAdmin, async (req, res) => { const { name, description, price, category, image_url, available = true } = req.body ?? {}; if (!name || !description || !Number.isInteger(price) || !categories.includes(category) || typeof image_url !== 'string' || typeof available !== 'boolean') return bad(res, 'Invalid product data'); try { const result = await pool.query('INSERT INTO products (name, description, price, category, image_url, available) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, description, price, category, image_url, available]); res.status(201).json(result.rows[0]); } catch { res.status(500).json({ error: 'Failed to create product' }); } });
app.put('/api/products/:id', requireAdmin, async (req, res) => { const id = parseId(req.params.id); const { name, description, price, category, image_url, available } = req.body ?? {}; if (!id) return bad(res, 'Invalid product id'); if (!name || !description || !Number.isInteger(price) || !categories.includes(category) || typeof image_url !== 'string' || typeof available !== 'boolean') return bad(res, 'Invalid product data'); try { const result = await pool.query('UPDATE products SET name=$1, description=$2, price=$3, category=$4, image_url=$5, available=$6 WHERE id=$7 RETURNING *', [name, description, price, category, image_url, available, id]); if (!result.rowCount) return res.status(404).json({ error: 'Product not found' }); res.json(result.rows[0]); } catch { res.status(500).json({ error: 'Failed to update product' }); } });
app.delete('/api/products/:id', requireAdmin, async (req, res) => { const id = parseId(req.params.id); if (!id) return bad(res, 'Invalid product id'); try { const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]); if (!result.rowCount) return res.status(404).json({ error: 'Product not found' }); res.status(204).send(); } catch { res.status(500).json({ error: 'Failed to delete product' }); } });

app.post('/api/bookings', async (req, res) => { const { customer_name, whatsapp, booking_date, booking_time, party_size, notes } = req.body ?? {}; const today = new Date().toISOString().slice(0, 10); if (!customer_name || !whatsapp || !booking_date || !booking_time || party_size === undefined || party_size === null) return bad(res, 'All booking fields except notes are required'); if (!/^\d+$/.test(String(whatsapp)) || String(whatsapp).length < 10) return bad(res, 'WhatsApp number must contain at least 10 digits'); if (booking_date < today) return bad(res, 'Booking date cannot be in the past'); if (!Number.isInteger(party_size) || party_size < 1 || party_size > 8) return bad(res, 'Party size must be between 1 and 8'); try { const result = await pool.query('INSERT INTO bookings (customer_name, whatsapp, booking_date, booking_time, party_size, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [customer_name, whatsapp, booking_date, booking_time, party_size, notes ?? null]); res.status(201).json(result.rows[0]); } catch { res.status(500).json({ error: 'Failed to create booking' }); } });
app.get('/api/bookings', requireAdmin, async (_req, res) => { try { const result = await pool.query('SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC'); res.json(result.rows); } catch { res.status(500).json({ error: 'Failed to fetch bookings' }); } });
app.patch('/api/bookings/:id', requireAdmin, async (req, res) => { const id = parseId(req.params.id); const { status } = req.body ?? {}; if (!id || !statuses.includes(status)) return bad(res, 'Invalid booking id or status'); try { const result = await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *', [status, id]); if (!result.rowCount) return res.status(404).json({ error: 'Booking not found' }); res.json(result.rows[0]); } catch { res.status(500).json({ error: 'Failed to update booking' }); } });

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error: unknown, _req: Request, res: Response, next: (error?: unknown) => void) => { void next; if (error instanceof SyntaxError && 'status' in error && (error as { status?: number }).status === 400) return res.status(400).json({ error: 'Invalid JSON request body' }); console.error(error); return res.status(500).json({ error: 'Internal server error' }); });

export default app;
