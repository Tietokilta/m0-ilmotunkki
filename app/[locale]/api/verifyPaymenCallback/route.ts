import { NextRequest, NextResponse } from "next/server";
import paytrailService from "@/utils/paytrail";
import { updateOrderState } from "../createPayment/route";

const handler = async (request: NextRequest) => {
  if (request.method !== 'GET') return NextResponse.json({}, {status: 405});
  const query = request.nextUrl.searchParams;
  const queryObject = Object.fromEntries(query.entries())
  try {
    const result = paytrailService.verifyPayment(queryObject);
    if (!result) return NextResponse.json({}, {status: 400});
    await updateOrderState(
      Number(query.get('checkout-reference')),
      query.get('checkout-status') || 'fail',
      query.get('checkout-transaction-id') || undefined,
      );
    return NextResponse.json({}, {status: 200});
  } catch(error) {
    console.error(error);
    return NextResponse.json({}, {status: 500});
  }
}

export default handler