import { useState } from "react";
import { Power, Trash2 } from "lucide-react";
import { useFetch } from "../lib/useFetch.js";
import { PageTitle, inputCls, labelCls, btnGold } from "../components/ui.jsx";
import api from "../api/client.js";

export default function Promos() {
  const { data, loading, error, reload } = useFetch("/promos");
  const [code, setCode] = useState("");
  const [pct, setPct] = useState("");
  const [msg, setMsg] = useState("");

  const add = async (e) => {
    e.preventDefault();
    setMsg("");
    const n = Number(pct);
    if (!code.trim()) { setMsg("Code is required."); return; }
    if (!(n > 0 && n <= 90)) { setMsg("Percent must be 1 to 90."); return; }
    try { await api.post("/promos", { code: code.toUpperCase(), pct: n }); setCode(""); setPct(""); await reload(); }
    catch (e2) { setMsg(e2.message); }
  };
  const toggle = async (p) => { try { await api.put(`/promos/${p.code}`, { active: !p.active }); await reload(); } catch (e) { alert(e.message); } };
  const remove = async (p) => { if (confirm(`Delete ${p.code}?`)) { try { await api.del(`/promos/${p.code}`); await reload(); } catch (e) { alert(e.message); } } };

  return (
    <div>
      <PageTitle kicker="Catalog" title="Marketing & Promos" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border-2 border-ink bg-white">
          <p className="border-b-2 border-ink px-4 py-2.5 text-sm font-extrabold">Promo codes</p>
          {loading && <p className="p-4 text-sm text-steel">Loading…</p>}
          {error && <p className="p-4 text-sm text-red-700">{error}</p>}
          {data?.items.map((p) => (
            <div key={p.code} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
              <span className="bg-ink px-2.5 py-1 font-mono text-[12px] font-bold text-gold">{p.code}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{p.label}</span>
                <span className="tabular text-xs text-steel">{p.pct}% off · {p.active ? "Active" : "Paused"}</span>
              </span>
              <button onClick={() => toggle(p)} aria-label="Toggle active" className={`grid h-9 w-9 place-items-center border transition-colors ${p.active ? "border-navy bg-navy text-white" : "border-line-dark text-faint hover:border-navy hover:text-navy"}`}><Power size={15} /></button>
              <button onClick={() => remove(p)} aria-label="Delete" className="grid h-9 w-9 place-items-center border border-line-dark text-steel transition-colors hover:border-red-500 hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          ))}
          {data && !data.items.length && <p className="p-4 text-sm text-steel">No codes. Add one.</p>}
        </div>
        <div className="h-fit border-2 border-ink bg-white p-4">
          <p className="text-sm font-extrabold">Add code</p>
          <form onSubmit={add} className="mt-2 grid gap-2">
            <label className="block"><span className={labelCls}>Code</span><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" className={`${inputCls} font-mono`} /></label>
            <label className="block"><span className={labelCls}>% off</span><input value={pct} onChange={(e) => setPct(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" placeholder="10" className={inputCls} /></label>
            {msg && <p className="text-[13px] font-semibold text-red-600">{msg}</p>}
            <button className={`${btnGold} py-2.5`}>Add Promo</button>
          </form>
          <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-steel">Active codes apply at checkout. The highest-percent active code feeds the storefront welcome popup.</p>
        </div>
      </div>
    </div>
  );
}
