import Image from 'next/image';
import HeaderImage from '../public/header.svg';

type PropType = {
  children: React.ReactNode
}
const Header = ({children}: PropType) => {
  return <div className="container max-w-3xl mx-auto relative">
        <div className=' w-fit p-1 flex gap-4'>
          {children}
      </div>
      <Image src={HeaderImage} alt="header"/>
    </div>
}

export default Header;