export function formatCurrency(amount) {
  if (isNaN(amount)) return "؋0.00";

  // Format large numbers with Dari suffixes
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + " میلیارد";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " میلیون";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + " هزار";
    }
    return num.toString();
  };

  const formattedAmount = formatNumber(Math.abs(amount));
  const sign = amount < 0 ? "-" : "";

  return `${sign}؋${formattedAmount}`;
}
