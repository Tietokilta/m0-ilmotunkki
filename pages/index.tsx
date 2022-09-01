import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next'
import Link from 'next/link'
import { useContext } from 'react'
import ItemList from '../components/ItemList'
import { AppContext } from '../context/AppContext'
import { fetchAPI } from '../lib/api'
import { transformTranslations } from '../utils/helpers'
import { FrontPageFields, Translation } from '../utils/models'

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
        <h1 className='font-medium leading-tight text-slate-900 text-3xl md:text-5xl mb-4' style={{hyphens: "auto"}}>{title}</h1>
          <p className="text-base mt-0 mb-4 whitespace-pre-wrap text-slate-900">
            {bodyText}
          </p>
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
