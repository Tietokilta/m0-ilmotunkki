import { NextRequest, NextResponse } from "next/server";
import { fetchAPI } from '@/lib/api';
import { serverFetchAPI } from '@/lib/serverApi';
import { mappedItems, transformTranslations } from '@/utils/helpers';
import { Order, Translation } from '@/utils/models'
import paytrailService from '@/utils/paytrail';

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

const handler = async (request: NextRequest) => {
  if (request.method !== 'POST') return NextResponse.json({},{status: 405})
  const { orderId } = await request.json();
  if (!orderId) return NextResponse.json({},{status: 404})
  try {
    const result = await createPayment(orderId);
    return NextResponse.json(result,{status: 200})
  } catch(error) {
    console.error(error);
    return NextResponse.json({},{status: 400})
  }
};

export default handler;
