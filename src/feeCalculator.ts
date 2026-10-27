export type FeeCalculationInput = {
  subtotal: number;
  shipping: number;
  discount?: number;
  feeRate?: number;
  minimumFee?: number;
  maximumFee?: number;
};

export function calculateProcessingFee({
  subtotal,
  shipping,
  discount = 0,
  feeRate = 0.02,
  minimumFee = 0,
  maximumFee = Number.POSITIVE_INFINITY,
}: FeeCalculationInput): number {
  if (!Number.isFinite(subtotal) || !Number.isFinite(shipping) || !Number.isFinite(discount)) {
    throw new Error('Subtotal, shipping, and discount must be finite numbers.');
  }

  if (!Number.isFinite(feeRate) || feeRate < 0) {
    throw new Error('feeRate must be a finite number greater than or equal to zero.');
  }

  if (!Number.isFinite(minimumFee) || minimumFee < 0) {
    throw new Error('minimumFee must be a finite number greater than or equal to zero.');
  }

  if (!Number.isFinite(maximumFee) && maximumFee !== Number.POSITIVE_INFINITY) {
    throw new Error('maximumFee must be a finite number or Infinity.');
  }

  const orderTotal = Math.max(subtotal + shipping - discount, 0);
  const rawFee = orderTotal * feeRate;
  const feeAfterMinimum = Math.max(rawFee, minimumFee);
  const cappedFee = maximumFee === Number.POSITIVE_INFINITY ? feeAfterMinimum : Math.min(feeAfterMinimum, maximumFee);

  return Number(cappedFee.toFixed(2));
}
