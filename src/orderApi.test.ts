import { describe, expect, it } from 'vitest';
import { getOrdersByCustomerId } from './orderApi';

describe('getOrdersByCustomerId', () => {
  const orders = [
    {
      id: 'ord_1001',
      customerId: 'cust_123',
      status: 'paid',
      total: 149.99,
      createdAt: '2026-10-01T10:00:00.000Z',
    },
    {
      id: 'ord_1002',
      customerId: 'cust_123',
      status: 'shipped',
      total: 89.5,
      createdAt: '2026-10-02T12:00:00.000Z',
    },
    {
      id: 'ord_1003',
      customerId: 'cust_456',
      status: 'delivered',
      total: 64,
      createdAt: '2026-10-03T14:00:00.000Z',
    },
  ];

  it('returns matching orders for the requested customer', () => {
    const result = getOrdersByCustomerId(orders, 'cust_123');

    expect(result.statusCode).toBe(200);
    expect(result.message).toBe('Orders for customer cust_123 retrieved successfully.');
    expect(result.orders).toHaveLength(2);
    expect(result.orders?.every((order) => order.customerId === 'cust_123')).toBe(true);
  });

  it('returns a 404 response when no orders are found for the customer', () => {
    const result = getOrdersByCustomerId(orders, 'cust_missing');

    expect(result.statusCode).toBe(404);
    expect(result.orders).toEqual([]);
    expect(result.errors).toEqual({
      customerId: 'No orders found for customer cust_missing.',
    });
  });

  it('returns a 400 response when the customer ID is missing', () => {
    const result = getOrdersByCustomerId(orders, '   ');

    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Customer ID is required.');
    expect(result.errors).toEqual({
      customerId: 'Customer ID is required.',
    });
  });
});
