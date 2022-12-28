import Image from 'next/image';
import Link from 'next/link';

type PropType = {
  children: React.ReactNode
}
const Header = ({children}: PropType) => {
  return <header className="container max-w-3xl mx-auto relative">
        <div className='w-fit p-1 flex gap-4'>
          {children}
      </div>
      <Link href="/">
        <div className="cursor-pointer text-3xl text-center py-4 text-secondary-900 dark:text-secondary-100">
          Muistinnollaus 100101
        </div>
      </Link>
    </header>
}

export default Header;