import Image from 'next/image';
import Link from 'next/link';
import Banner from '../public/banner.svg'

type PropType = {
  children: React.ReactNode
}
const Header = ({children}: PropType) => {
  return <header className="container max-w-3xl mx-auto relative">
        <div className='w-fit p-1 flex gap-4'>
          {children}
      </div>
      <style jsx>{`
        .bg-image {
          background-image: url(${Banner.src});
          background-size: cover;
        }
      `}</style>
      <Link href="/">
        <div className="cursor-pointer relative text-5xl text-center font-bold py-4 text-secondary-900 dark:text-secondary-100 bg-image h-40">
          <p className="py-10"> Muistinnollaus 100101</p>
        </div>
      </Link>
    </header>
}

export default Header;