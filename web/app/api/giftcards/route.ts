import { fetchAPI } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
type PostPayload = {
  code: string;
  orderUid: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json() as PostPayload;
    await fetchAPI('/giftcards/addGiftCard',{
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return NextResponse.json({},{status: 200})
  } catch(error) {
    console.error(error);
    return NextResponse.json({},{status: 500})
  }
}