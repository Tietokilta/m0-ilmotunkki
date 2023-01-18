import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { serverFetchAPI } from '../../lib/serverApi';
import { Item } from '../../utils/models';
import { useTranslation } from '../../utils/helpers';

type ServerPropsType = {
  item?: Item;
}

export const getServerSideProps: GetServerSideProps<ServerPropsType> = async (context) => {
  let item = undefined;
  const {token} = context.query;
  if(token) {
    const [orderUid, itemId] = (token as string).split('_');
    try {
      item = await serverFetchAPI<Item>(`/items/${itemId}`,{},{
        orderUid,
        locale: context.locale,
      });
    } catch(error) {
      item = undefined
    }
  }
  return {
    props: {
      item,
    }
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>

const CallbackPage: NextPage<PropType> = ({ item }) => {
  const { translation } = useTranslation();
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