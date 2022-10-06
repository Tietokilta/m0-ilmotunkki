import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { serverFetchAPI } from '../../lib/serverApi';
import { StrapiBaseType, Translation } from '../../utils/models';
import { transformTranslations } from '../../utils/helpers';
import { fetchAPI } from '../../lib/api';

type ServerPropsType = {
  isValid: boolean;
  translation: Record<string,string>;
}

type ValidationRequest = StrapiBaseType<{
  isValid: boolean
}>


export const getServerSideProps: GetServerSideProps<ServerPropsType> = async (context) => {
  const {token} = context.query;
  console.log(token)
  if(!token) {
    return {
      props: {
        isValid: false,
        translation: {}
      }
    }
  }
  const [validationRequest, translation] = await Promise.all([
    serverFetchAPI<ValidationRequest>(`/orders/validate/${token}`,{},{
      locale: context.locale,
    }),
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  return {
    props: {
      isValid: validationRequest.attributes.isValid,
      translation: transformTranslations(translation),
    },
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>


const CallbackPage: NextPage<PropType> = ({isValid, translation}) => {
  return (
    <div className='container text-primary-900 dark:text-primary-100 max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-2 pt-4 sm:p-8'>
      {isValid} asdasd
    </div>
  );
}

export default CallbackPage