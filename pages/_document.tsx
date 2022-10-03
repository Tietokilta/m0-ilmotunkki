import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html className='dark w-full h-full'>
      <Head />
      <body className='bg-secondary-200 dark:bg-secondary-900'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document