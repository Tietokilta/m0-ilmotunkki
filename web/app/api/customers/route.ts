import { fetchAPI } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
type PutPayload = {
  data: {
    [k: string]: FormDataEntryValue;
  };
  customerUid: string;
};
export const PUT = async (request: NextRequest) => {
  const payload = (await request.json()) as PutPayload;
  try {
    await fetchAPI(`/customers/${payload.customerUid}`, {
      method: "PUT",
      body: JSON.stringify({
        data: payload.data,
      }),
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
  }
};
