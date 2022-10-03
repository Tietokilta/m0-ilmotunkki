import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

import { fetchAPI } from '../../lib/api';
import { transformTranslations } from '../../utils/helpers';
import { Translation, StrapiBaseType } from '../../utils/models';
import { useRouter } from 'next/router';

type Fields = StrapiBaseType<{
  terms: string;
  gdpr: string;
}>
type StaticPropType = {
  content: Fields,
  translation: Record<string,string>
}

export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [
    content,
    translation,
    ] = await Promise.all([
    fetchAPI<Fields>('/terms-and-condition',{},{
      locale: context.locale,
    }),
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
  const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.back();
  }
  const router = useRouter();
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-8">
      <ReactMarkdown className='prose prose-secondary dark:prose-invert'>{content.attributes.terms}</ReactMarkdown>
      <ReactMarkdown className="prose prose-secondary dark:prose-invert">{content.attributes.gdpr}</ReactMarkdown>
      <div className='mt-4'>
      <Link href="">
        <a onClick={goBack} className='underline text-primary-900 dark:text-primary-500'>
          {translation.back}
        </a>
      </Link>
      </div>

    </div>
  )
}

export default Terms
