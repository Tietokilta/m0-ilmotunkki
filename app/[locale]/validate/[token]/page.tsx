import { serverFetchAPI } from '@/lib/serverApi';
import { Item } from '@/utils/models';
import { useTranslation } from '@/utils/helpers';

type Props = {
  params: {
    token: string;
    locale: string;
  }
}


const getItem = async (token: string, locale: string) => {
  const [orderUid, itemId] = (token as string).split('_');
  try {
    const item = await serverFetchAPI<Item>(`/items/${itemId}`,{},{
      orderUid,
      locale: locale,
    });
    return item;
  } catch(error) {
    return undefined;
  }
}

const CallbackPage = async ({ params: {token, locale} }: Props) => {
  const item = await getItem(token, locale);
  const { translation } = useTranslation(locale);
  const success = <div className='bg-success-500 rounded p-8 text-center text-3xl uppercase'>
    <p>{translation.success}</p>
    {item &&<p>{translation[item.attributes.itemType.data.attributes.slug]} ID:{item.id}</p> }
  </div>
  const fail = <div className='bg-danger-500 rounded p-8 text-center text-3xl uppercase'>
    {translation.failed}
  </div>
  return (
    <div className='container text-primary-900 dark:text-primary-100 max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-8 sm:p-8'>
      {item ? success : fail}
    </div>
  );
}

export default CallbackPage