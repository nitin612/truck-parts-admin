import { useEffect, useState } from "react";
import { PageTitle, inputCls, labelCls, btnGold } from "../components/ui.jsx";
import api from "../api/client.js";

const FIELDS = [
  ["storeName", "Store name"], ["phone", "Phone"], ["email", "Email"], ["address", "Address"],
  ["hours", "Hours"], ["abn", "ABN"], ["announcement", "Announcement bar"],
];
const NUMS = [["freeFreightOver", "Free freight over ($)"], ["standardFee", "Standard freight ($)"], ["expressFee", "Express freight ($)"]];

export default function Settings() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/settings").then((d) => setForm(d.settings)).catch((e) => setErr(e.message)); }, []);

  const save = async (e) => {
    e.preventDefault();
    setMsg(""); setErr(""); setSaving(true);
    try {
      const payload = { ...form };
      NUMS.forEach(([k]) => { payload[k] = Number(payload[k]); });
      const { settings } = await api.put("/settings", payload);
      setForm(settings); setMsg("Saved.");
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageTitle kicker="System" title="Settings" />
      {!form ? (err ? <p className="text-sm text-red-700">{err}</p> : <p className="text-sm text-steel">Loading…</p>) : (
        <form onSubmit={save} className="grid max-w-2xl gap-3 border-2 border-ink bg-white p-5">
          {FIELDS.map(([k, label]) => (
            <label key={k} className="block"><span className={labelCls}>{label}</span>
              <input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputCls} /></label>
          ))}
          <div className="grid gap-3 sm:grid-cols-3">
            {NUMS.map(([k, label]) => (
              <label key={k} className="block"><span className={labelCls}>{label}</span>
                <input type="number" value={form[k] ?? 0} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputCls} /></label>
            ))}
          </div>
          {msg && <p className="text-sm font-semibold text-green-700">{msg}</p>}
          {err && <p className="text-sm font-semibold text-red-700">{err}</p>}
          <button disabled={saving} className={`${btnGold} w-fit px-6 py-2.5 disabled:opacity-60`}>{saving ? "Saving…" : "Save settings"}</button>
        </form>
      )}
    </div>
  );
}
