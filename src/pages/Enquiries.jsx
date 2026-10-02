import { useFetch } from "../lib/useFetch.js";
import { formatDate } from "../lib/format.js";
import { PageTitle, Empty } from "../components/ui.jsx";
import api from "../api/client.js";

const STATUSES = ["New", "Replied", "Closed"];

export default function Enquiries() {
  const { data, loading, error, reload } = useFetch("/enquiries");
  const setStatus = async (ref, status) => { try { await api.patch(`/enquiries/${ref}/status`, { status }); await reload(); } catch (e) { alert(e.message); } };

  return (
    <div>
      <PageTitle kicker="Sales" title="Enquiries" />
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {data && (data.items.length === 0 ? <Empty text="No enquiries yet." /> : (
        <div className="grid gap-3">
          {data.items.map((e) => (
            <div key={e.ref} className="border-2 border-ink bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-faint">{e.ref}</span>
                <span className="font-bold">{e.name}</span>
                <span className="text-sm text-steel">{e.email}{e.phone ? ` · ${e.phone}` : ""}</span>
                {e.sku && <span className="rounded bg-mist px-2 py-0.5 font-mono text-[11px] ring-1 ring-line">{e.sku}</span>}
                <span className="ml-auto text-xs text-faint">{formatDate(e.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-steel"><b className="text-ink">{e.topic}:</b> {e.message}</p>
              <div className="mt-2">
                <select value={e.status} onChange={(ev) => setStatus(e.ref, ev.target.value)} className="rounded-md border border-line-dark bg-white px-2 py-1.5 text-xs outline-none focus:border-gold">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
