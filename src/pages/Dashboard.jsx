import { useFetch } from "../lib/useFetch.js";
import { formatAUD, formatDate } from "../lib/format.js";
import { PageTitle, Stat, th, td } from "../components/ui.jsx";

export default function Dashboard() {
  const { data, loading, error } = useFetch("/admin/stats");
  const s = data?.stats;
  return (
    <div>
      <PageTitle kicker="Overview" title="Dashboard" />
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {s && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Revenue" value={formatAUD(s.revenue)} />
            <Stat label="Orders" value={s.orders} />
            <Stat label="Products" value={s.products} />
            <Stat label="Customers" value={s.customers} />
            <Stat label="New enquiries" value={s.newEnquiries} />
          </div>
          <h2 className="mb-2 mt-7 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-faint">Recent orders</h2>
          <div className="overflow-x-auto border-2 border-ink bg-white">
            <table className="w-full min-w-[640px] border-collapse">
              <thead><tr><th className={th}>Ref</th><th className={th}>Customer</th><th className={th}>Status</th><th className={th}>Total</th><th className={th}>Placed</th></tr></thead>
              <tbody>
                {data.recentOrders?.map((o) => (
                  <tr key={o.ref}>
                    <td className={td}><span className="font-mono font-bold text-navy">{o.ref}</span></td>
                    <td className={td}>{o.address?.name || o.email}</td>
                    <td className={td}>{o.status}</td>
                    <td className={td}><span className="tabular font-bold">{formatAUD(o.total)}</span></td>
                    <td className={td}><span className="text-faint">{formatDate(o.placedAt)}</span></td>
                  </tr>
                ))}
                {!data.recentOrders?.length && <tr><td className={td} colSpan={5}><span className="text-faint">No orders yet.</span></td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
