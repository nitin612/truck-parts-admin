import { useState } from "react";
import { useFetch } from "../lib/useFetch.js";
import { formatAUD } from "../lib/format.js";
import { PageTitle, Empty, Modal, th, td, inputCls, labelCls, btnGold, btnGhost } from "../components/ui.jsx";
import api from "../api/client.js";

const STATUSES = ["In stock VIC", "Built to order", "Enquiry"];
const blank = { sku: "", name: "", price: "", category: "accessories", sub: "", brand: "", fit: "", oem: "", status: "In stock VIC", lead: "", rating: "4.6", reviews: "12", badge: "", desc: "", specs: "", images: [] };

const specsToText = (s) => (s ? Object.entries(s).map(([k, v]) => `${k}: ${v}`).join("\n") : "");
const textToSpecs = (t) => {
  const out = {};
  (t || "").split("\n").forEach((line) => { const i = line.indexOf(":"); if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim(); });
  return out;
};

export default function Products() {
  const cats = useFetch("/categories");
  const { data, loading, error, reload } = useFetch("/products?limit=1000");
  const categories = cats.data?.items || [];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState(null); // null | "add" | sku
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const list = (data?.items || []).filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    const n = q.toLowerCase().trim();
    return !n || `${p.sku} ${p.name} ${p.brand || ""}`.toLowerCase().includes(n);
  });

  const openAdd = () => { setForm({ ...blank, category: categories[0]?.slug || "accessories" }); setErr(""); setModal("add"); };
  const openEdit = (p) => {
    setForm({
      sku: p.sku, name: p.name, price: p.price == null ? "" : String(p.price), category: p.category,
      sub: p.sub || "", brand: p.brand || "", fit: p.fit || "", oem: p.oem || "",
      status: p.price == null ? "Enquiry" : (p.status || "In stock VIC"), lead: p.lead || "",
      rating: String(p.rating ?? 4.6), reviews: String(p.reviews ?? 0), badge: p.badge || "",
      desc: p.desc || "", specs: specsToText(p.specs), images: p.images || [],
    });
    setErr(""); setModal(p.sku);
  };

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try { const { url } = await api.upload(file); setForm((f) => ({ ...f, images: [url] })); }
    catch (e) { setErr(e.message); }
    finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: form.price === "" ? null : Number(form.price),
      category: form.category, sub: form.sub.trim(), brand: form.brand.trim(), fit: form.fit.trim(),
      oem: form.oem.trim(), status: form.price === "" ? "Enquiry" : form.status, lead: form.lead.trim(),
      rating: Number(form.rating) || 4.6, reviews: Number(form.reviews) || 0, badge: form.badge.trim(),
      desc: form.desc.trim(), specs: textToSpecs(form.specs), images: form.images,
    };
    if (!payload.name) { setErr("Name is required."); return; }
    if (form.price !== "" && !(payload.price > 0)) { setErr("Price must be above 0, or blank for enquiry-only."); return; }
    setSaving(true);
    try {
      if (modal === "add") {
        if (!form.sku.trim()) { setErr("SKU is required."); setSaving(false); return; }
        await api.post("/products", { sku: form.sku.trim().toUpperCase(), ...payload });
      } else {
        await api.put(`/products/${modal}`, payload);
      }
      setModal(null);
      await reload();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  const remove = async (sku) => {
    if (!confirm(`Delete ${sku}?`)) return;
    try { await api.del(`/products/${sku}`); await reload(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <PageTitle kicker="Catalog" title={`Products${data ? ` (${data.total})` : ""}`} right={<button onClick={openAdd} className={btnGold}>+ Add Product</button>} />
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, brand…" className={`${inputCls} min-w-52 flex-1`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls} aria-label="Category">
          <option>All</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {data && (list.length === 0 ? <Empty text="No products match." /> : (
        <div className="overflow-x-auto border-2 border-ink bg-white">
          <table className="w-full min-w-[820px] border-collapse">
            <thead><tr><th className={th}>Product</th><th className={th}>Cat</th><th className={th}>Price</th><th className={th}>Status</th><th className={th}>Rating</th><th className={th}>Actions</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.sku}>
                  <td className={td}>
                    <span className="flex items-center gap-2.5">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded bg-mist ring-1 ring-line">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}</span>
                      <span><span className="block font-bold">{p.name}</span><span className="font-mono text-[11px] text-faint">{p.sku}{p.brand ? ` · ${p.brand}` : ""}</span></span>
                    </span>
                  </td>
                  <td className={td}>{p.category}</td>
                  <td className={td}><span className="tabular font-bold">{p.price == null ? "POA" : formatAUD(p.price)}</span></td>
                  <td className={td}>{p.price == null ? "Enquiry" : p.status}</td>
                  <td className={td}>★ {p.rating} ({p.reviews})</td>
                  <td className={td}>
                    <span className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="font-bold text-navy underline">Edit</button>
                      <button onClick={() => remove(p.sku)} className="font-bold text-red-600 underline">Delete</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {modal && (
        <Modal close={() => setModal(null)} wide>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-faint">{modal === "add" ? "Add product" : `Edit ${modal}`}</p>
          <form onSubmit={save} className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block"><span className={labelCls}>SKU *</span><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} disabled={modal !== "add"} placeholder="GL-00000" className={`${inputCls} disabled:bg-mist`} /></label>
            <label className="block"><span className={labelCls}>Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label className="block sm:col-span-2"><span className={labelCls}>Name *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Price (blank = enquiry only)</span><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^\d.]/g, "") })} inputMode="decimal" placeholder="e.g. 293" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="block"><span className={labelCls}>Sub line</span><input value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })} placeholder="e.g. Tail Lifts" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Brand</span><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Beauway" className={inputCls} /></label>
            <label className="block sm:col-span-2"><span className={labelCls}>Fitment</span><input value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} placeholder="Suits…" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>OEM cross</span><input value={form.oem} onChange={(e) => setForm({ ...form, oem: e.target.value })} className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Lead time</span><input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} placeholder="e.g. Ships in 24 hrs" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Rating (1 to 5)</span><input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value.replace(/[^\d.]/g, "").slice(0, 3) })} inputMode="decimal" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Reviews count</span><input value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value.replace(/\D/g, "") })} inputMode="numeric" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Badge</span><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. 2T Aluminium" className={inputCls} /></label>
            <div className="block">
              <span className={labelCls}>Image</span>
              <div className="flex items-center gap-3">
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded border border-line bg-mist">{form.images?.[0] && <img src={form.images[0]} alt="" className="h-full w-full object-cover" />}</span>
                <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} className="text-[12px]" />
              </div>
              {uploading && <p className="mt-1 text-[12px] text-faint">Uploading…</p>}
            </div>
            <label className="block sm:col-span-2"><span className={labelCls}>Description</span><textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2} className="w-full rounded-md border border-line-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
            <label className="block sm:col-span-2"><span className={labelCls}>Specs (one Key: value per line)</span><textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={3} placeholder={"Capacity: 2000 kg\nPower: 24V"} className="w-full rounded-md border border-line-dark bg-white px-3 py-2.5 font-mono text-[13px] outline-none focus:border-gold" /></label>
            {err && <p className="text-sm font-semibold text-red-600 sm:col-span-2">{err}</p>}
            <div className="flex gap-2 sm:col-span-2">
              <button type="button" onClick={() => setModal(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving || uploading} className={`${btnGold} flex-1 py-3 disabled:opacity-60`}>{saving ? "Saving…" : modal === "add" ? "Add Product" : "Save Changes"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
