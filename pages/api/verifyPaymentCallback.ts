import type { NextApiRequest, NextApiResponse } from 'next'
import paytrailService from "../../utils/paytrail";
import { updateOrderState } from './createPayment';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'GET') return response.status(405).json({});
  const query = request.query as Record<string,string>
  try {
    const result = paytrailService.verifyPayment(query);
    if (!result) return response.status(400).json({});
    await updateOrderState(
      Number(query['checkout-reference']),
      query['checkout-status'],
      query['checkout-transaction-id'],
      );
    return response.status(200).json({});
  } catch(error) {
    console.error(error);
    return response.status(400).json({});
  }
}

export default handler