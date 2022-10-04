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
    <div className='flex h-fit'>
      {router.locales?.map(locale => (
        <div
          className='m-1 uppercase cursor-pointer font-bold text-secondary-900 dark:text-secondary-50'
          key={locale}
          onClick={() => handleClick(locale)}>
          {locale}
          {router.locale === locale && <div className='border-t-2 border-t-primary-600'></div>}
        </div>

      ))}
    </div>
  )
}

export default Locale;