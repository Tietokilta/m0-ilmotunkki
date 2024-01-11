import { fetchAPI } from "@/lib/api";
import { ItemCategory } from "@/utils/models";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export const GET = async () => {
  try {
    const response = await fetchAPI<ItemCategory[]>('/item-categories',{
      cache: 'no-store',
    },{
      populate: [
        'overflowItem',
        'itemTypes',
        'itemTypes.upgradeTarget',
        'itemTypes.upgradeTarget.itemCategory'
      ],
    });
    return NextResponse.json(response);
  } catch(error) {
    console.error(error);
    return NextResponse.json({},{status: 500});
  }
}