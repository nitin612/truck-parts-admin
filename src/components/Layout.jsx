import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, MailQuestion, Users, Package, Tags, Megaphone, Settings, Menu, X, LogOut,
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
          <p className="truncate font-bold text-white">{user?.name}</p>
          <p className="truncate font-mono text-[11px] text-gray-400">{user?.email}</p>
          <button
            onClick={async () => { await logout(); go("/login"); }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-red-600/90 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-red-600 shadow-sm"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex flex-col">
        {/* Top bar for desktop & mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 shadow-xs md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid h-9 w-9 place-items-center rounded border border-line-dark lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-extrabold text-ink">Staff Console <span className="hidden sm:inline font-mono text-xs font-normal text-faint">· API Administration</span></p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <p className="text-xs font-extrabold text-ink">{user?.name}</p>
              <p className="hidden font-mono text-[10px] text-faint md:block">{user?.email}</p>
            </div>
            <button
              onClick={async () => { await logout(); go("/login"); }}
              className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-red-700 active:scale-95"
              title="Log out of Staff Console"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </header>
        {open && <div className="border-b border-line bg-ink p-2 text-white lg:hidden">{nav}</div>}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6"><Outlet /></main>
      </div>
    </div>
  );
}

