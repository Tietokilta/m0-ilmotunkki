// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAPI } from '../../lib/api'
import { Item } from '../../utils/models'


const handler = async(
  _request: NextApiRequest,
  response: NextApiResponse<{count: number}>
) => {
  const result = await fetchAPI<Item[]>('/items', {
    method: 'GET',
  },
  {
    populate: 'itemType',
  }
  );
  const count = result.filter(item => item.attributes.itemType.data.id !== 3).length;
  return response.status(200).json({count});
}

export default handler;
