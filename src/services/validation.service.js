export const validateApprovalGate = (invoice) => {
  const errors = [];

  if (!invoice) {
    return { canApprove: false, errors: ['Invoice data not loaded'] };
  }

  // 1. Customer Info Gate
  const name = invoice.customer?.name?.trim();
  const email = invoice.customer?.email?.trim();

  if (!name) {
    errors.push('Customer Name is required');
  }

  if (!email) {
    errors.push('Customer Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Customer Email format is invalid');
    }
  }

  // 2. Items Gate
  const items = invoice.items || [];
  if (items.length === 0) {
    errors.push('Invoice must contain at least 1 line item');
  }

  const unmatchedItems = items.filter(
    (item) => item.matchStatus !== 'matched' || item.unitPricePaise === null || item.unitPricePaise === undefined
  );

  if (unmatchedItems.length > 0) {
    errors.push(`${unmatchedItems.length} item(s) are unresolved (not matched or missing price)`);
  }

  return {
    canApprove: errors.length === 0,
    errors,
  };
};
