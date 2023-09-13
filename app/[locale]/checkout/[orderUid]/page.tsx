import Component from "./Component";


type Props = {
  params: {
    locale: string;
    orderUid: string
  }
}
const ContactPage = ({params: {locale, orderUid}}: Props) => {
  return <Component locale={locale} orderUid={orderUid} />
}

export default ContactPage;