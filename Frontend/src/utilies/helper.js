// Convert Western numerals (0-9) to Persian/Dari numerals (٠-٩)
export function toPersianDigits(num) {
  const persianDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Format number with Persian digits and comma separators
export function formatNumberWithPersianDigits(num) {
  if (isNaN(num) || num === null || num === undefined) return '٠';
  
  // Format with comma separators (using Western digits first)
  const formatted = Math.abs(num).toLocaleString('en-US');
  
  // Convert to Persian digits
  return toPersianDigits(formatted);
}

export function formatCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "؋٠";

  // Format with full digits and comma separators
  const formattedAmount = formatNumberWithPersianDigits(Math.abs(amount));
  const sign = amount < 0 ? "-" : "";

  return `${sign}؋${formattedAmount}`;
}

// Format number without currency symbol (for general use)
export function formatNumber(num) {
  if (isNaN(num) || num === null || num === undefined) return '٠';
  return formatNumberWithPersianDigits(num);
}
