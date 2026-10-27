import { describe, expect, it } from 'vitest';
import { calculateProcessingFee } from './feeCalculator';

describe('calculateProcessingFee', () => {
  it('calculates a fee based on order value', () => {
    const fee = calculateProcessingFee({
      subtotal: 150,
      shipping: 15,
      feeRate: 0.02,
    });

    expect(fee).toBe(3.3);
  });

  it('applies a discount before charging the fee', () => {
    const fee = calculateProcessingFee({
      subtotal: 200,
      shipping: 10,
      discount: 25,
      feeRate: 0.025,
    });

    expect(fee).toBe(4.63);
  });

  it('enforces a minimum fee floor', () => {
    const fee = calculateProcessingFee({
      subtotal: 20,
      shipping: 0,
      feeRate: 0.01,
      minimumFee: 2,
    });

    expect(fee).toBe(2);
  });

  it('caps the fee at a maximum value', () => {
    const fee = calculateProcessingFee({
      subtotal: 1000,
      shipping: 100,
      feeRate: 0.08,
      maximumFee: 35,
    });

    expect(fee).toBe(35);
  });

  it('returns zero for negative or empty order totals', () => {
    const fee = calculateProcessingFee({
      subtotal: 0,
      shipping: 0,
      discount: 20,
      feeRate: 0.05,
    });

    expect(fee).toBe(0);
  });

  it('throws when required numeric values are invalid', () => {
    expect(() =>
      calculateProcessingFee({
        subtotal: Number.NaN,
        shipping: 5,
      }),
    ).toThrow('Subtotal, shipping, and discount must be finite numbers.');

    expect(() =>
      calculateProcessingFee({
        subtotal: 100,
        shipping: 10,
        feeRate: -0.01,
      }),
    ).toThrow('feeRate must be a finite number greater than or equal to zero.');
  });
});
