import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

import { fetchAPI } from '@/lib/api';
import { StrapiBaseType } from '@/utils/models';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/utils/translationHelper';

type Fields = StrapiBaseType<{
  terms: string;
  gdpr: string;
}>

const getContent = async (locale: string) => {
  const response = await fetchAPI<Fields>('/terms-and-condition',{},{
    locale,
  });
  return response;
}

type Props = {
  params: {
    locale: string
  }
}
const Terms = async ({params: {locale}}: Props) => {
  const content = await getContent(locale);
  const translation = await getTranslation(locale);
  const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.back();
  }
  const router = useRouter();
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-8">
      <ReactMarkdown className='prose prose-secondary dark:prose-invert'>{content.attributes.terms}</ReactMarkdown>
      <ReactMarkdown className="prose prose-secondary dark:prose-invert">{content.attributes.gdpr}</ReactMarkdown>
      <div className='my-4'>
        <Link onClick={goBack} className='underline text-primary-900 dark:text-primary-500' href="">
            {translation.back}
        </Link>
      </div>

    </div>
  )
}

export default Terms
