import { useRouter } from 'next/router';

const Locale = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router
  return (
    <div>
      {router.locales?.map(locale => (
        <span
          className='m-1 uppercase cursor-pointer font-bold select'
          key={locale}
          onClick={() => router.push({ pathname, query }, asPath, { locale, })}>
          <style jsx>{`
            .select {
              ${router.locale === locale && `border-bottom: 2px solid black`}
            }
        `}</style>
          {locale}
      </span>
      ))}
    </div>
  )
}

export default Locale;