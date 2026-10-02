import { useFetch } from "../lib/useFetch.js";
import { formatDate } from "../lib/format.js";
import { PageTitle, Empty, th, td } from "../components/ui.jsx";

export default function Customers() {
  const { data, loading, error } = useFetch("/admin/customers");
  return (
    <div>
      <PageTitle kicker="Sales" title="Customers" />
      {loading && <p className="text-sm text-steel">Loading…</p>}
      {error && <p className="border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {data && (data.items.length === 0 ? <Empty text="No customers yet." /> : (
        <div className="overflow-x-auto border-2 border-ink bg-white">
          <table className="w-full min-w-[560px] border-collapse">
            <thead><tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Phone</th><th className={th}>Company</th><th className={th}>Joined</th></tr></thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td className={td}><span className="font-bold">{c.name}</span></td>
                  <td className={td}>{c.email}</td>
                  <td className={td}>{c.phone}</td>
                  <td className={td}>{c.company}</td>
                  <td className={td}><span className="text-faint">{formatDate(c.createdAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
