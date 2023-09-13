"use client";

import Link from 'next/link';
import useSWR from 'swr';
import { fetchAPI, getStrapiURL } from '../lib/api';

import { StrapiBaseType, StrapiImage, StrapiResponse } from '../utils/models';

type Response = StrapiBaseType<{
  header: StrapiResponse<StrapiImage[]>;
  headerTitle: string;
}>

type PropType = {
  children: React.ReactNode;
  locale: string;
}
const Header = ({children, locale}: PropType) => {
  const { data } = useSWR<Response>('/front-page', url => fetchAPI(url,{},{
    populate: ['header']
  }));
  const headerArray = data?.attributes.header.data;
  const headerData = headerArray && headerArray[0];
  const header = headerData?.attributes.formats?.large || headerData?.attributes
  return <header className="container max-w-3xl mx-auto relative">
        <div className='w-fit p-1 flex gap-4'>
          {children}
      </div>
      <style jsx>{`
        .bg-image {
          background-image: ${header ? `url(${getStrapiURL(header?.url)})` : 'none' };
          background-size: cover;
        }
      `}</style>
      <Link href={`/${locale}`}>
        <div className="cursor-pointer relative text-5xl text-center font-bold py-4 text-secondary-900 dark:text-secondary-100 bg-image h-40">
          <p className="py-10">{data?.attributes.headerTitle}</p>
        </div>
      </Link>
    </header>
}

export default Header;