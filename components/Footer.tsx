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
  return <div className="container max-w-3xl mx-auto relative flex justify-center gap-2 pt-2">
      {sponsors?.map(sponsor => {
        const image = sponsor.logo.data.attributes.formats.small;
        const dimensions = sponsor.logo.data.attributes.formats.thumbnail;
        return <Link key={sponsor.name} href={sponsor.url}>
          <div className="cursor-pointer">
            <Image height={dimensions.height} width={dimensions.width} src={getStrapiURL(image.url)} alt={sponsor.name}/>
          </div>
        </Link>
      })}
    </div>
}

export default Footer;