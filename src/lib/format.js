export const formatAUD = (n) => {
  if (n === null || n === undefined) return "POA";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }) : "";
