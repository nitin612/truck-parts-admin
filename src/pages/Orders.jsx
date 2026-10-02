import { useState } from "react";
import { useFetch } from "../lib/useFetch.js";
import { formatAUD, formatDate } from "../lib/format.js";
import { PageTitle, Empty, th, td, inputCls } from "../components/ui.jsx";
import api from "../api/client.js";

const STATUSES = ["Pending payment", "Packed in Campbellfield VIC", "Courier booked", "In transit", "Delivered", "Cancelled"];

export default function Orders() {
  const { data, loading, error, reload } = useFetch("/orders");
  const [busy, setBusy] = useState("");
  const [q, setQ] = useState("");

  const setStatus = async (ref, status) => {
    setBusy(ref);
    try { await api.patch(`/orders/${ref}/status`, { status }); await reload(); }
    catch (e) { alert(e.message); }
    finally { setBusy(""); }
  };

  const list = (data?.items || []).filter((o) => {
    const n = q.trim().toLowerCase();
    if (!n) return true;
    return `${o.ref} ${o.email} ${(o.items || []).map((i) => i.name).join(" ")}`.toLowerCase().includes(n);
  });

  return (
    <div>
      <PageTitle kicker="Sales" title="Orders" />
      <div className="mb-3"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ref, email, item…" className={`${inputCls} max-w-md`} /></div>
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {data && (list.length === 0 ? <Empty text="No orders match." /> : (
        <div className="overflow-x-auto border-2 border-ink bg-white">
          <table className="w-full min-w-[760px] border-collapse">
            <thead><tr><th className={th}>Ref</th><th className={th}>Customer</th><th className={th}>Items</th><th className={th}>Total</th><th className={th}>Placed</th><th className={th}>Status</th></tr></thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.ref}>
                  <td className={td}><span className="font-mono font-bold text-navy">{o.ref}</span><br /><span className="font-mono text-[11px] text-faint">{o.payment} · {o.paymentStatus}</span></td>
                  <td className={td}>{o.address?.name || o.email}<br /><span className="text-[11px] text-faint">{o.email}</span></td>
                  <td className={td}><span className="text-[12px] text-steel">{(o.items || []).map((i) => `${i.name} ×${i.qty}`).join(", ")}</span></td>
                  <td className={td}><span className="tabular font-bold">{formatAUD(o.total)}</span></td>
                  <td className={td}><span className="text-faint">{formatDate(o.placedAt)}</span></td>
                  <td className={td}>
                    <select value={o.status} disabled={busy === o.ref} onChange={(e) => setStatus(o.ref, e.target.value)} className="rounded-md border border-line-dark bg-white px-2 py-1.5 text-xs outline-none focus:border-gold">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
