import { getTranslation } from "@/utils/translationHelper";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    locale: string;
  }
}
export const GET = async (request: NextRequest, {params}: Props) => {
  const translation = await getTranslation(params.locale);
  if(Object.keys(translation).length === 0) {
    return NextResponse.json({}, {status: 404})
  }
  return NextResponse.json(translation);
}