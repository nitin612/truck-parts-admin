import { useState } from "react";
import { useFetch } from "../lib/useFetch.js";
import { PageTitle, Empty, Modal, inputCls, labelCls, btnGold, btnGhost } from "../components/ui.jsx";
import api from "../api/client.js";

const blank = { slug: "", name: "", tag: "", blurb: "" };

export default function Categories() {
  const { data, loading, error, reload } = useFetch("/categories");
  const [modal, setModal] = useState(null); // null | "add" | slug
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm(blank); setErr(""); setModal("add"); };
  const openEdit = (c) => { setForm({ slug: c.slug, name: c.name, tag: c.tag || "", blurb: c.blurb || "" }); setErr(""); setModal(c.slug); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true);
    try {
      if (modal === "add") await api.post("/categories", { slug: form.slug || form.name, name: form.name.trim(), tag: form.tag, blurb: form.blurb });
      else await api.put(`/categories/${modal}`, { name: form.name.trim(), tag: form.tag, blurb: form.blurb });
      setModal(null); await reload();
    } catch (e2) { setErr(e2.message); }
    finally { setSaving(false); }
  };

  const remove = async (slug) => {
    if (!confirm(`Delete category ${slug}? Products keep their category tag.`)) return;
    try { await api.del(`/categories/${slug}`); await reload(); } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <PageTitle kicker="Catalog" title="Categories" right={<button onClick={openAdd} className={btnGold}>+ Add Category</button>} />
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {data && (data.items.length === 0 ? <Empty text="No categories yet." /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((c) => (
            <div key={c.slug} className="border-2 border-ink bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">{c.name}</h3>
                <span className="tabular rounded bg-mist px-2 py-0.5 text-xs font-bold ring-1 ring-line">{c.count}</span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-faint">{c.slug}</p>
              {c.tag && <p className="mt-1 text-xs font-semibold text-navy">{c.tag}</p>}
              <p className="mt-1 text-sm text-steel">{c.blurb}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(c)} className="text-[13px] font-bold text-navy underline">Edit</button>
                <button onClick={() => remove(c.slug)} className="text-[13px] font-bold text-red-600 underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {modal && (
        <Modal close={() => setModal(null)}>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-faint">{modal === "add" ? "Add category" : `Edit ${modal}`}</p>
          <form onSubmit={save} className="mt-3 grid gap-3">
            <label className="block"><span className={labelCls}>Name *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tail Lifts" className={inputCls} /></label>
            {modal === "add" && <label className="block"><span className={labelCls}>Slug (optional — derived from name)</span><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="tail-lifts" className={inputCls} /></label>}
            <label className="block"><span className={labelCls}>Tag</span><input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Built to order" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>Blurb</span><textarea value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} rows={3} className="w-full rounded-md border border-line-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setModal(null)} className={btnGhost}>Cancel</button>
              <button disabled={saving} className={`${btnGold} flex-1 py-3 disabled:opacity-60`}>{saving ? "Saving…" : modal === "add" ? "Add Category" : "Save Changes"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
