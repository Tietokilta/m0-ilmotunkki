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
import { useTranslation } from '../utils/helpers';
import { StrapiBaseType } from '../utils/models';

type FrontPageFields = StrapiBaseType<{
  bodyText: string;
}>;

type StaticPropType = {
  content: FrontPageFields,
}

export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [
    content,
    ] = await Promise.all([
    fetchAPI<FrontPageFields>('/front-page',{},{
      locale: context.locale,
    }),
  ]);
  return {
    props: {
      content,
    },
    revalidate: 60,
  }
}


type PropType = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<PropType> = ({content}) => {
  const {translation} = useTranslation()
  const {items} = useContext(AppContext)
  const { bodyText, } = content.attributes;
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md mt-4 p-1 sm:p-8">
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
          {/*/
          <div className='my-10'>
            <Link href={'/signups'} passHref>
              <a className="btn">{translation.signups}</a>
            </Link>
          </div>
          */}
          <div className='w-full border-b-2 border-b-primary-700 dark:border-b-primary-300 opacity-50 my-4'></div>
          <ItemList />
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
