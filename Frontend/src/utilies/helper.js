export function formatCurrency(amount) {
  if (isNaN(amount)) return "؋0.00";

  return new Intl.NumberFormat("fa-AF", {
    style: "currency",
    currency: "AFN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
