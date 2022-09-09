import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ItemList from '../components/ItemList';
import { AppContext } from '../context/AppContext';
import { fetchAPI } from '../lib/api';
import { transformTranslations } from '../utils/helpers';
import { FrontPageFields, Translation } from '../utils/models';
type StaticPropType = {
  content: FrontPageFields,
  translation: Record<string,string>
}
export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [
    content,
    translation,
    ] = await Promise.all([
    fetchAPI<FrontPageFields>('/front-page',{},{
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

const Home: NextPage<PropType> = ({content,translation}) => {
  const {items} = useContext(AppContext)
  const { title, bodyText } = content.attributes;

  return (
    <div className="container max-w-3xl bg-slate-50 mx-auto rounded shadow-md p-8">
      <main className='container mx-auto px-4'>
          <ReactMarkdown className="prose prose-slate mt-0 mb-4">
            {bodyText}
          </ReactMarkdown>
          <ItemList translation={translation} />
          {items.length > 0 && 
          <Link href={'/contact'} passHref>
            <a className="btn">{translation.next}</a>
          </Link>}
      </main>
    </div>
  )
}

export default Home
