const BASE = '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: 'POST', body: body ?? {}, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body: body ?? {}, token }),
  patch: (path, body, token) => request(path, { method: 'PATCH', body: body ?? {}, token }),
  del: (path, token) => request(path, { method: 'DELETE', token }),
};
