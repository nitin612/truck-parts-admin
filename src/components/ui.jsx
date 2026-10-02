import { X } from "lucide-react";

/* Brand-matched admin UI primitives (mirrors the storefront's /admin styling). */

export const th = "border-b-2 border-ink bg-mist px-3 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-steel";
export const td = "border-b border-line px-3 py-2.5 text-[13px] align-top";
export const inputCls = "h-11 w-full rounded-md border border-line-dark bg-white px-3 text-sm outline-none placeholder:text-faint focus:border-gold";
export const labelCls = "mb-1 block text-xs font-bold";
export const btnGold = "rounded bg-gold px-4 py-2 text-[13px] font-bold text-ink transition-colors hover:bg-navy hover:text-white";
export const btnGhost = "rounded border border-line-dark px-4 py-2 text-[13px] font-bold transition-colors hover:border-navy hover:text-navy";

export function PageTitle({ kicker, title, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-faint">{kicker}</p>}
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-[28px]">{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function Stat({ label, value, sub }) {
  return (
    <div className="border-2 border-ink bg-white p-4">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-faint">{label}</p>
      <p className="tabular mt-1 text-2xl font-extrabold md:text-3xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-steel">{sub}</p>}
    </div>
  );
}

export function Empty({ text }) {
  return <p className="border border-dashed border-line-dark bg-mist p-8 text-center text-sm text-steel">{text}</p>;
}

export function Modal({ close, children, wide }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-auto p-4">
      <div className="absolute inset-0 bg-black/55" onClick={close} />
      <div className={`popup-in relative my-8 w-full ${wide ? "max-w-3xl" : "max-w-xl"} border-2 border-ink bg-white shadow-2xl`}>
        <button onClick={close} aria-label="Close" className="absolute right-3 top-3 text-faint hover:text-ink"><X size={20} /></button>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
