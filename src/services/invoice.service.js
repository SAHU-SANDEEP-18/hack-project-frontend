export const formatRupees = (paiseOrRupees, isPaise = true) => {
  const val = isPaise ? Number(paiseOrRupees) / 100 : Number(paiseOrRupees);
  if (isNaN(val)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val);
};

export const calculateInvoiceTotals = (items = [], taxRatePercent = 18) => {
  const subtotalPaise = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const pricePaise = Number(item.unitPricePaise) || 0;
    return sum + (pricePaise * qty);
  }, 0);

  const taxAmountPaise = Math.round((subtotalPaise * Number(taxRatePercent)) / 100);
  const totalPaise = subtotalPaise + taxAmountPaise;

  return {
    subtotalPaise,
    taxAmountPaise,
    totalPaise,
  };
};

export const generateWhatsAppShareUrl = (invoice) => {
  if (!invoice) return '';
  const customerName = invoice.customer?.name || 'Customer';
  const total = formatRupees(invoice.totalPaise, true);
  const itemsList = (invoice.items || [])
    .map((item) => `• ${item.matchedService || item.requestedText} (x${item.quantity}) - ${formatRupees(item.lineTotalPaise, true)}`)
    .join('\n');

  const text = `🧾 *Invoice #${invoice.invoiceNumber}*\n` +
    `Client: *${customerName}*\n` +
    `Status: *${invoice.status.toUpperCase()}*\n\n` +
    `*Items:*\n${itemsList}\n\n` +
    `*Subtotal:* ${formatRupees(invoice.subtotalPaise, true)}\n` +
    `*Tax (${invoice.taxRatePercent}%):* ${formatRupees(invoice.taxAmountPaise, true)}\n` +
    `*Total:* ${total}\n\n` +
    `Generated via Kodnexus Smart Invoice AI.`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
