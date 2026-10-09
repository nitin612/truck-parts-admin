/**
 * Tiny fetch wrapper for the Aurex API.
 *  - attaches the Bearer access token
 *  - sends cookies (for the refresh token)
 *  - on a 401, tries one silent /auth/refresh then retries the request
 *  - throws an Error with a friendly `.message` and `.details`
 */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

// Security: Admin tokens stored in-memory only; sessions persisted via httpOnly cookies
try {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
} catch { /* noop */ }

let accessToken = null;
export const setToken = (t) => { accessToken = t; };
export const getToken = () => accessToken;

async function raw(path, { method = "GET", body, auth = true, _retry = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !_retry) {
    // try a silent refresh, then retry once
    const refreshed = await tryRefresh();
    if (refreshed) return raw(path, { method, body, auth, _retry: true });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

async function tryRefresh() {
  try {
    const res = await fetch(BASE + "/auth/refresh", { method: "POST", credentials: "include" });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) { accessToken = data.accessToken; return true; }
    return false;
  } catch {
    return false;
  }
}

/** Upload a File via multipart/form-data to the admin upload endpoint. */
async function uploadFile(file, { _retry = false } = {}) {
  const fd = new FormData();
  fd.append("image", file);
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(BASE + "/uploads", { method: "POST", headers, credentials: "include", body: fd });
  if (res.status === 401 && !_retry && (await tryRefresh())) return uploadFile(file, { _retry: true });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data; // { url, path, filename }
}

export const api = {
  get: (p, o) => raw(p, { ...o, method: "GET" }),
  post: (p, body, o) => raw(p, { ...o, method: "POST", body }),
  put: (p, body, o) => raw(p, { ...o, method: "PUT", body }),
  patch: (p, body, o) => raw(p, { ...o, method: "PATCH", body }),
  del: (p, o) => raw(p, { ...o, method: "DELETE" }),
  upload: uploadFile,
  refresh: tryRefresh,
};

export default api;
