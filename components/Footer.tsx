import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchAPI, getStrapiURL } from '../lib/api';
import { StrapiBaseType, StrapiImage, StrapiResponse } from '../utils/models';


type Sponsor = {
  name: string;
  url: string;
  logo: StrapiResponse<StrapiImage>;
}
type Response = StrapiBaseType<{
  sponsors: Sponsor[]
}>

const Footer = () => {
  const { data } = useSWR<Response>('/global', url => fetchAPI(url,{},{
    populate: ['sponsors.logo']
  }));
  const sponsors = data?.attributes.sponsors;
  if(!sponsors) return null;
  return <footer className="container max-w-3xl mx-auto my-10 bg-secondary-50 dark:bg-secondary-600 rounded shadow-md p-1 pt-4 sm:p-8">
      <div className="flex justify-center gap-6 flex-wrap items-center">
        {sponsors?.map(sponsor => {
            const image = sponsor.logo.data.attributes.formats?.small || sponsor.logo.data.attributes;
            const dimensions = sponsor.logo.data.attributes.formats?.thumbnail || sponsor.logo.data.attributes;
            return <a key={sponsor.name} href={sponsor.url} target="_blank" rel="noreferrer">
              <div className="cursor-pointer max-w-[200px]">
                <Image height={dimensions.height} width={dimensions.width} src={getStrapiURL(image.url)} alt={sponsor.name}/>
              </div>
            </a>
          })}
      </div>
    </footer>
}

export default Footer;