import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAPI } from '../../lib/api';
import { serverFetchAPI } from '../../lib/serverApi';
import { mappedItems, transformTranslations } from '../../utils/helpers';
import { Order, Translation } from '../../utils/models'
import paytrailService from '../../utils/paytrail';

export const updateOrderState = async (orderId: number, status: string, transactionId?: string) => {
  return serverFetchAPI<Order>(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        status,
        transactionId,
      }
    })
  });
}

const createPayment = async (orderId: number) => {
  const order = await serverFetchAPI<Order>(`/orders/${orderId}`,{},{
      populate: [
        'customer',
        'items',
        'items.itemType',
        'items.itemType.itemCategory',
        'items.giftCard',
      ]
    }
  );
  if (!order) throw new Error("No Order");
  const translation = await fetchAPI<Translation>('/translation',{},{
    locale: order.attributes.customer.data.attributes.locale,
    populate: ['translations']
  });
  const mappedCart = mappedItems(order.attributes.items.data, transformTranslations(translation));
  const total = mappedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await updateOrderState(order.id, 'pending');
  if (total === 0) return paytrailService.createSkipPayment(order);
  return paytrailService.createPayment(order);
}

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') return response.status(405).json({});
  const { orderId } = request.body;
  if (!orderId) return response.status(404).json({});
  try {
    const result = await createPayment(orderId);
    return response.status(200).json(result);
  } catch(error) {
    console.error(error);
    return response.status(400).json({});
  }
};

export default handler;
