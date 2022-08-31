import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchAPI } from '../lib/api';

const Locale = () => {
  const router = useRouter();
  const {customer} = useContext(AppContext);
  const { pathname, asPath, query } = router;
  const handleClick = async (locale: string) => {
    router.push({ pathname, query }, asPath, { locale, });
    if(!customer.attributes.uid) return;
    await fetchAPI(`/customers/${customer.attributes.uid}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          locale,
        }
      }),
    });
  }
  if(router.pathname === '/callback') {
    return null;
  }
  return (
    <div>
      {router.locales?.map(locale => (
        <span
          className='m-1 uppercase cursor-pointer font-bold select text-slate-900'
          key={locale}
          onClick={() => handleClick(locale)}>
          <style jsx>{`
            .select {
              ${router.locale === locale && `border-bottom: 2px solid; @apply border-b-slate-900`}
            }
        `}</style>
          {locale}
      </span>
      ))}
    </div>
  )
}

export default Locale;