export type Order = {
  id: string;
  customerId: string;
  status: string;
  total: number;
  createdAt?: string;
  items?: Array<{
    id?: string;
    sku?: string;
    quantity?: number;
    price?: number;
  }>;
};

export type OrdersQueryResult = {
  statusCode: number;
  message: string;
  orders?: Order[];
  errors?: Record<string, string>;
};

function normalizeCustomerId(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function createOrderQueryResponse(
  statusCode: number,
  message: string,
  orders?: Order[],
  errors?: Record<string, string>,
): OrdersQueryResult {
  return {
    statusCode,
    message,
    ...(orders ? { orders } : {}),
    ...(errors && Object.keys(errors).length > 0 ? { errors } : {}),
  };
}

export function getOrdersByCustomerId(
  orders: Order[] | undefined,
  customerId: string | undefined,
): OrdersQueryResult {
  if (!Array.isArray(orders)) {
    return createOrderQueryResponse(400, 'Orders collection is required.', undefined, {
      orders: 'Orders collection is required.',
    });
  }

  const normalizedCustomerId = normalizeCustomerId(customerId);
  if (!normalizedCustomerId) {
    return createOrderQueryResponse(400, 'Customer ID is required.', undefined, {
      customerId: 'Customer ID is required.',
    });
  }

  const matchingOrders = orders.filter((order) => {
    if (!order || typeof order !== 'object') {
      return false;
    }

    return normalizeCustomerId(order.customerId) === normalizedCustomerId;
  });

  if (matchingOrders.length === 0) {
    return createOrderQueryResponse(404, `No orders found for customer ${normalizedCustomerId}.`, [], {
      customerId: `No orders found for customer ${normalizedCustomerId}.`,
    });
  }

  return createOrderQueryResponse(
    200,
    `Orders for customer ${normalizedCustomerId} retrieved successfully.`,
    matchingOrders,
  );
}

export const fetchOrdersByCustomerId = getOrdersByCustomerId;
