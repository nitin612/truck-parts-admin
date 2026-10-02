import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, MailQuestion, Users, Package, Tags, Megaphone, Settings, Menu, X,
} from "lucide-react";
import { useAuth } from "../store/auth.jsx";

const GROUPS = [
  { label: "Overview", links: [{ to: "/", end: true, label: "Dashboard", Icon: LayoutDashboard }] },
  { label: "Sales", links: [
    { to: "/orders", label: "Orders", Icon: ShoppingCart },
    { to: "/enquiries", label: "Enquiries", Icon: MailQuestion },
    { to: "/customers", label: "Customers", Icon: Users },
  ] },
  { label: "Catalog", links: [
    { to: "/products", label: "Products", Icon: Package },
    { to: "/categories", label: "Categories", Icon: Tags },
    { to: "/promos", label: "Marketing", Icon: Megaphone },
  ] },
  { label: "System", links: [{ to: "/settings", label: "Settings", Icon: Settings }] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const go = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav>
      {GROUPS.map((g) => (
        <div key={g.label} className="mt-5 first:mt-0">
          <p className="px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">{g.label}</p>
          <div className="mt-1.5 grid gap-0.5">
            {g.links.map(({ to, end, label, Icon }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold transition-colors ${isActive ? "bg-gold text-ink" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden bg-ink text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-4">
          <Link to="/" className="font-mono text-lg font-extrabold tracking-tight text-gold">AUREX</Link>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Staff Console</p>
        </div>
        <div className="flex-1 overflow-auto p-2">{nav}</div>
        <div className="border-t border-white/10 p-4 text-sm">
          <p className="truncate font-bold">{user?.name}</p>
          <p className="truncate font-mono text-[11px] text-gray-400">{user?.email}</p>
          <button onClick={async () => { await logout(); go("/login"); }} className="mt-2 w-full rounded border border-white/20 py-2 text-[13px] font-bold transition-colors hover:border-gold hover:text-gold">Logout</button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid h-10 w-10 place-items-center border border-line-dark">{open ? <X size={20} /> : <Menu size={20} />}</button>
          <p className="text-sm font-extrabold">Staff Console</p>
          <button onClick={async () => { await logout(); go("/login"); }} className="ml-auto text-[13px] font-bold text-steel">Logout</button>
        </div>
        {open && <div className="border-b border-line bg-ink p-2 text-white lg:hidden">{nav}</div>}
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-6"><Outlet /></main>
      </div>
    </div>
  );
}
