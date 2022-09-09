import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next';
import Link from 'next/link';

import { fetchAPI } from '../../lib/api';
import { transformTranslations } from '../../utils/helpers';
import { Translation, StrapiBaseType } from '../../utils/models';
import { useRouter } from 'next/router';
import useSWR from 'swr';

type Field = StrapiBaseType<{
  id: number;
  index: number;
  name: string;
  group: string;
}>

type StaticPropType = {
  content: Field[],
  translation: Record<string,string>
}

export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [
    content,
    translation,
    ] = await Promise.all([
    fetchAPI<Field[]>('/orders/signups'),
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  return {
    props: {
      content,
      translation: transformTranslations(translation)
    },
    revalidate: 60,
  }
}

type PropType = InferGetStaticPropsType<typeof getStaticProps>

const Terms: NextPage<PropType> = ({content,translation}) => {
  const router = useRouter();
  const {data: signups} = useSWR<Field[]>('/orders/signups',fetchAPI,{
    fallback: {
      '/orders/signups': content,
    },
  });
  console.log(signups);
  const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.back();
  }
  return (
    <div className="container max-w-3xl bg-slate-50 mx-auto rounded shadow-md p-3 sm:p-8">
      <div>
      <div className="flex border-b-2 border-b-gray-200 py-2 justify-around text-xl">
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
        <div key={field.id} className="flex border-b-2 border-b-gray-200 py-4 justify-around">
          <div className='flex-[0.5]'>
            {field.attributes.index}
          </div>
          <div className='flex-1'>
            {field.attributes.name}
          </div>
          <div className='flex-1'>
            {field.attributes.group}
          </div>
        </div>)}
      </div>
      <div className='mt-4'>
      <Link href="">
        <a onClick={goBack} className='underline text-sky-900'>
          {translation.back}
        </a>
      </Link>
      </div>

    </div>
  )
}

export default Terms
