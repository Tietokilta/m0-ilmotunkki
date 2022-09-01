import Image from 'next/image';
import Link from 'next/link';
import HeaderImage from '../public/header.svg';

type PropType = {
  children: React.ReactNode
}
const Header = ({children}: PropType) => {
  return <div className="container max-w-3xl mx-auto relative">
        <div className='w-fit p-1 flex gap-4'>
          {children}
      </div>
      <Link href="/">
        <div>
        <Image className='cursor-pointer' src={HeaderImage} alt="header"/>
        </div>
      </Link>
    </div>
}

export default Header;