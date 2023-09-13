import { fetchAPI } from "@/lib/api";
import Component from "./Component"
import { ItemCategory, StrapiBaseType } from "@/utils/models";


type Field = StrapiBaseType<{
  id: number;
  index: number;
  name: string;
  group: string;
  status: string;
}>


const getData = async () => {
  const [
    content,
    categories,
    ] = await Promise.all([
    fetchAPI<Field[]>('/orders/signups'),
    fetchAPI<ItemCategory[]>('/item-categories',{},{
      populate: [
        'overflowItem',
        'itemTypes',
        'itemTypes.upgradeTarget',
        'itemTypes.upgradeTarget.itemCategory'
      ],
    }),
  ]);
  return {
    content,
    categories,
  }
}

type Props = {
  params: {
    locale: string
  }
}

const SignupsPage = async ({params: {locale}}: Props) => {
  const data = await getData();
  return <Component
    categories={data.categories}
    content={data.content}
    locale={locale}
    />
}

export default SignupsPage;