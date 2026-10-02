import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const go = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
      go("/");
    } catch (e2) {
      setErr(e2.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-[15px] text-white outline-none placeholder:text-gray-500 focus:border-[var(--gold)]";

  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0e14] px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#12161f] shadow-2xl">
        <div className="border-b border-white/10 bg-[var(--ink)] px-6 py-4">
          <p className="font-mono text-lg font-extrabold text-[var(--gold)]">AUREX</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-400">Staff Console · Restricted</p>
        </div>
        <form onSubmit={submit} className="grid gap-3 p-6 sm:p-7">
          <h1 className="text-[22px] font-extrabold text-white">Staff login</h1>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-400">Staff email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@aurex.com.au" className={input} autoComplete="username" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-400">Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className={input} autoComplete="current-password" />
          </label>
          {err && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[13px] font-semibold text-red-300">{err}</p>}
          <button disabled={busy} className="rounded-lg bg-[var(--gold)] py-3 text-sm font-extrabold text-[var(--ink)] transition hover:bg-white disabled:opacity-60">
            {busy ? "Signing in…" : "Unlock console →"}
          </button>
        </form>
      </div>
    </main>
  );
}
