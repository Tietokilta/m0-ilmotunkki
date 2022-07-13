import type { NextApiRequest, NextApiResponse } from 'next'
import paytrailService from "../../utils/paytrail";
import { updateOrderState } from './createPayment';


const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') return response.status(405).json({});
  const {data}  = request.body;
  const result = paytrailService.verifyPayment(data);
  if (!result) return response.status(400).json({});
  try {
    await updateOrderState(
      data['checkout-reference'],
      data['checkout-status'],
      data['checkout-transaction-id'],
    );
  } catch(error) {
    return response.status(500).json({});
  }

  return response.status(200).json({});
}

export default handler;