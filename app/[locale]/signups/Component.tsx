import Link from 'next/link';

import { fetchAPI } from '@/lib/api';
import { useTranslation } from '@/utils/helpers';
import { StrapiBaseType, ItemCategory } from '@/utils/models';
import { useRouter } from 'next/router';
import useSWR from 'swr';

type Field = StrapiBaseType<{
  id: number;
  index: number;
  name: string;
  group: string;
  status: string;
}>

type Props = {
  content: Field[],
  categories: ItemCategory[],
  locale: string
}

const Signups = ({content, categories, locale}: Props) => {
  const {translation} = useTranslation(locale);
  const router = useRouter();
  const {data: signups} = useSWR<Field[]>('/orders/signups',fetchAPI,{
    fallback: {
      '/orders/signups': content,
    },
  });
  const {data: itemCategories} = useSWR<ItemCategory[]>('/item-categories', url => fetchAPI(url,{},{
    populate: [
      'overflowItem',
      'itemTypes',
      'itemTypes.upgradeTarget',
      'itemTypes.upgradeTarget.itemCategory'
    ],
  }),{
    fallback: {
      '/item-categories': categories,
    },
  });
  const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.back();
  }
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-3 sm:p-8 text-secondary-800 dark:text-secondary-100">
      <div className="flex gap-5 mb-6">
        {itemCategories?.map(category => <div key={category.id}>
          {translation[category.attributes.name]}: {category.attributes.currentQuantity}/{category.attributes.maximumItemLimit}
          </div>)}
      </div>
      <div className="flex border-b-4 border-b-secondary-200 dark:border-b-secondary-700 py-2 justify-around text-xl ">
          <div className='flex-[0.5]'>
            #
          </div>
          <div className='flex-1'>
            {translation.name}
          </div>
          <div className='flex-1'>
            {translation.group}
          </div>
        </div>
        {signups?.map(field =>
        <div key={field.id} className="flex border-b-2 border-b-secondary-200 dark:border-b-secondary-700 py-4 justify-around verified">
          <style jsx>{`
            .verified {
              ${field.attributes.status !== 'ok' && `opacity: 0.6`}
            }
          `}</style>
          <div className='flex-[0.5]'>
            {field.attributes.index}
          </div>
          <div className='flex-1'>
            <div>{field.attributes.name}</div>
            {field.attributes.status !== 'ok' &&
              <div className='text-primary-700 dark:text-primary-200'>
                {translation.unverified}
              </div>
            }
          </div>
          <div className='flex-1'>
            {field.attributes.group}
          </div>
        </div>)}
      <div className='mt-4'>
      <Link href="">
        <a onClick={goBack} className='underline text-primary-900 dark:text-primary-100'>
          {translation.back}
        </a>
      </Link>
      </div>

    </div>
  )
}

export default Signups
