import Form from "./ContactForm";

type Props = {
  params: {
    locale: string
  }
}

const ContactPage = ({params: {locale}}:Props) => {
  return <Form locale={locale}/>
}

export default ContactPage;