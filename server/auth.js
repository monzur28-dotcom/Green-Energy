import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { createSessionRow, getSessionRow, deleteSessionRow } from './db.js';

export const hashPassword = password => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
};

export const verifyPassword = (password, hash, salt) => {
  const candidate = scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
};

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const createSession = async (userId, kind) => {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await createSessionRow(token, userId, kind, expiresAt);
  return token;
};

export const destroySession = token => deleteSessionRow(token);

export const getSession = async token => {
  if (!token) return null;
  const row = await getSessionRow(token);
  if (!row) return null;
  if (new Date(row.expiresAt) < new Date()) { await deleteSessionRow(token); return null; }
  return row;
};

const tokenFromReq = req => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

export const requireAdmin = async (req, res, next) => {
  const session = await getSession(tokenFromReq(req));
  if (!session || session.kind !== 'admin') return res.status(401).json({ error: 'Admin session required.' });
  next();
};

export const requireUser = async (req, res, next) => {
  const session = await getSession(tokenFromReq(req));
  if (!session || session.kind !== 'user') return res.status(401).json({ error: 'Sign-in required.' });
  req.userId = session.userId;
  next();
};

export const optionalUser = async (req, res, next) => {
  const session = await getSession(tokenFromReq(req));
  req.userId = session && session.kind === 'user' ? session.userId : null;
  next();
};
