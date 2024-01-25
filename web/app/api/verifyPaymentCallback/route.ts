import { extractStatusFromError } from "@/lib/utils";
import { updateOrderState } from "@/utils/helpers";
import paytrailService from "@/utils/paytrail";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// This is called by paytrail directly
export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams;
  const queryObject = Object.fromEntries(query.entries());
  try {
    const result = paytrailService.verifyPayment(queryObject);
    if (!result) return NextResponse.json({}, { status: 400 });
    await updateOrderState(
      Number(queryObject["checkout-reference"]),
      queryObject["checkout-status"] || "fail",
      queryObject["checkout-transaction-id"] || undefined,
    );
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      {
        status: extractStatusFromError(error) ?? 500,
      },
    );
  }
};
