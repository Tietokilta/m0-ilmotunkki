import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAPI } from '../../lib/api'
import { mappedItems } from '../../utils/helpers';
import { Item, Order } from '../../utils/models'
import paytrailService from '../../utils/paytrail';

export const updateOrderState = async (orderId: number, status: string, transactionId?: string) => {
  return fetchAPI(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        status,
        transactionId,
      }
    })
  })
}

const createPayment = async (orderId: string) => {
  const [order, items] = await Promise.all([
    fetchAPI<Order>(`/orders/${orderId}`,{},{
      populate: 'customer'
    }),
    fetchAPI<Item[]>('/items',{}, {
      populate: 'itemType',
      filters: {
        order: {
          id: {
            $eq: orderId,
          },
        },
      },
    })
  ]);
  console.log(JSON.stringify(order));
  order.attributes.items = {data: items};
  if (!order) throw new Error("No Order");
  const mappedCart = mappedItems(order.attributes.items.data);
  const total = mappedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  if (total === 0) return paytrailService.createSkipPayment(order);
  return paytrailService.createPayment(order);
}

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') return response.status(405).json({});
  const { orderId } = request.body;
  if (!orderId) return response.status(404).json({});
  try {
    const result = await createPayment(orderId);
    await updateOrderState(orderId, 'pending');
    return response.status(200).json(result);
  } catch(error) {
    console.error(error);
    return response.status(400).json({});
  }
};

export default handler;
