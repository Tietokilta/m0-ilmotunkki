import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import ItemList from '../components/ItemList';
import { AppContext } from '../context/AppContext';
import { fetchAPI, getStrapiURL } from '../lib/api';
import { transformTranslations } from '../utils/helpers';
import { StrapiBaseType, StrapiImage, Translation } from '../utils/models';

type FrontPageFields = StrapiBaseType<{
  bodyText: string;
  title: string;
  header: StrapiImage;
}>;

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
  const { bodyText, } = content.attributes;
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-1 pt-4 sm:p-8">
      <main className='container mx-auto px-4'>
          <ReactMarkdown
          components={{
            img: image => {
              if(!image.src) return null;
              return <Image src={getStrapiURL(image.src)} width={400} height={400} alt={image.alt}></Image>
            }
          }}
          className="prose dark:prose-invert prose-li:my-0.5 prose-ul:my-0.5 prose-secondary mt-0 mb-4">
            {bodyText}
          </ReactMarkdown>
          <div className='w-full border-b-2 border-b-primary-700 dark:border-b-primary-300 opacity-50 my-4'></div>
          <ItemList translation={translation} />
          {items.length > 0 && 
          <div className='h-10'>
          <Link href={'/contact'} passHref>
            <a className="btn">{translation.next}</a>
          </Link>
          </div>}
      </main>
    </div>
  )
}

export default Home
