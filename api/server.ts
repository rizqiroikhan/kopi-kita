import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const categories = ['kopi', 'non-kopi', 'pastry'] as const;
const statuses = ['pending', 'confirmed', 'done', 'cancelled'] as const;
const adminToken = process.env.ADMIN_TOKEN;

app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));

const bad = (res: Response, message: string) => res.status(400).json({ error: message });
const parseId = (value: string | string[]) => typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : null;

const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authorization = req.header('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  if (!adminToken || !token || token !== adminToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return bad(res, 'Email and password are required');
  try {
    const result = await pool.query('SELECT id FROM admins WHERE email = $1 AND password_hash = crypt($2, password_hash)', [email, password]);
    if (!result.rowCount) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: adminToken });
  } catch { res.status(500).json({ error: 'Login failed' }); }
});

app.get('/api/products', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    if (category && !categories.includes(category as typeof categories[number])) return bad(res, 'Invalid category');
    const result = await pool.query('SELECT id, name, description, price, category, image_url, available, created_at FROM products' + (category ? ' WHERE category = $1' : '') + ' ORDER BY id', category ? [category] : []);
    res.json(result.rows);
  } catch { res.status(500).json({ error: 'Failed to fetch products' }); }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const { name, description, price, category, image_url, available = true } = req.body ?? {};
  if (!name || !description || !Number.isInteger(price) || !categories.includes(category) || typeof image_url !== 'string' || typeof available !== 'boolean') return bad(res, 'Invalid product data');
  try {
    const result = await pool.query('INSERT INTO products (name, description, price, category, image_url, available) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [name, description, price, category, image_url, available]);
    res.status(201).json(result.rows[0]);
  } catch { res.status(500).json({ error: 'Failed to create product' }); }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const id = parseId(req.params.id); const { name, description, price, category, image_url, available } = req.body ?? {};
  if (!id) return bad(res, 'Invalid product id');
  if (!name || !description || !Number.isInteger(price) || !categories.includes(category) || typeof image_url !== 'string' || typeof available !== 'boolean') return bad(res, 'Invalid product data');
  try {
    const result = await pool.query('UPDATE products SET name=$1, description=$2, price=$3, category=$4, image_url=$5, available=$6 WHERE id=$7 RETURNING *', [name, description, price, category, image_url, available, id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch { res.status(500).json({ error: 'Failed to update product' }); }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const id = parseId(req.params.id); if (!id) return bad(res, 'Invalid product id');
  try { const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]); if (!result.rowCount) return res.status(404).json({ error: 'Product not found' }); res.status(204).send(); }
  catch { res.status(500).json({ error: 'Failed to delete product' }); }
});

app.post('/api/bookings', async (req, res) => {
  const { customer_name, whatsapp, booking_date, booking_time, party_size, notes } = req.body ?? {};
  const today = new Date().toISOString().slice(0, 10);
  if (!customer_name || !whatsapp || !booking_date || !booking_time || party_size === undefined || party_size === null) return bad(res, 'All booking fields except notes are required');
  if (booking_date < today) return bad(res, 'Booking date cannot be in the past');
  if (!Number.isInteger(party_size) || party_size < 1 || party_size > 8) return bad(res, 'Party size must be between 1 and 8');
  try { const result = await pool.query('INSERT INTO bookings (customer_name, whatsapp, booking_date, booking_time, party_size, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [customer_name, whatsapp, booking_date, booking_time, party_size, notes ?? null]); res.status(201).json(result.rows[0]); }
  catch { res.status(500).json({ error: 'Failed to create booking' }); }
});

app.get('/api/bookings', requireAdmin, async (_req, res) => {
  try { const result = await pool.query('SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC'); res.json(result.rows); }
  catch { res.status(500).json({ error: 'Failed to fetch bookings' }); }
});

app.patch('/api/bookings/:id', requireAdmin, async (req, res) => {
  const id = parseId(req.params.id); const { status } = req.body ?? {};
  if (!id || !statuses.includes(status)) return bad(res, 'Invalid booking id or status');
  try { const result = await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *', [status, id]); if (!result.rowCount) return res.status(404).json({ error: 'Booking not found' }); res.json(result.rows[0]); }
  catch { res.status(500).json({ error: 'Failed to update booking' }); }
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Keep malformed JSON responses consistent with the API contract.
app.use((error: unknown, _req: Request, res: Response, _next: (error?: unknown) => void) => {
  if (error instanceof SyntaxError && 'status' in error && (error as { status?: number }).status === 400) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => console.log(`Kopi Kita API listening on port ${port}`));
