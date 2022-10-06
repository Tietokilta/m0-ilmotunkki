import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { serverFetchAPI } from '../../lib/serverApi';
import { Item, StrapiBaseType, Translation } from '../../utils/models';
import { transformTranslations } from '../../utils/helpers';
import { fetchAPI } from '../../lib/api';

type ServerPropsType = {
  item?: Item;
  translation: Record<string,string>;
}



export const getServerSideProps: GetServerSideProps<ServerPropsType> = async (context) => {
  const {token} = context.query;
  const translation = await fetchAPI<Translation>('/translation',{},{
    locale: context.locale,
    populate: ['translations']
  });
  if(!token) {
    return {
      props: {
        translation: transformTranslations(translation),
      }
    }
  }
  const [orderUid, itemId] = (token as string).split('_');
  try {
    const item = await serverFetchAPI<Item>(`/items/${itemId}`,{},{
      orderUid,
      locale: context.locale,
    });
    return {
      props: {
        item,
        translation: transformTranslations(translation),
      },
    }
  } catch(error) {
    return {
      props: {
        translation: transformTranslations(translation),
      }
    }
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>


const CallbackPage: NextPage<PropType> = ({translation, item}) => {
  console.log(item)
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