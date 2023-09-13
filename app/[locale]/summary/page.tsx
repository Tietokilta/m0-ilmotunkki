import Component from './Component';


type Props = {
  params: {
    locale: string
  }
}
const ContactPage = ({params: {locale}}: Props) => {
  return <Component locale={locale}/>
}

export default ContactPage;
