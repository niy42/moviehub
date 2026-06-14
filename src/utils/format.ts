export const formatRuntime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatCurrency = (amount: number): string =>
  amount > 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
    : "N/A";

export const formatYear = (dateStr: string): string =>
  dateStr ? new Date(dateStr).getFullYear().toString() : "—";

export const formatDate = (dateStr: string): string =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

export const getYearOptions = (): string[] => {
  const current = new Date().getFullYear();
  return Array.from({ length: 40 }, (_, i) => String(current - i));
};
