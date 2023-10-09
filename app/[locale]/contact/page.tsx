import { fetchAPI } from "@/lib/api";
import ContactForm from "./ContactForm";
import { ContactForm as ContactFormType } from "@/utils/models";

type Props = {
  params: {
    locale: string
  }
}

const getContactForms = async (locale: string) => {
  try {
    const data = await fetchAPI<ContactFormType[]>('/contact-forms',{},{
      locale,
      populate: ['contactForm','itemTypes']
    });
    return data;
  } catch(error) {
    return undefined;
  }
}

const ContactPage = async ({params: {locale}}: Props) => {
  const contactForms = await getContactForms(locale);
  if(!contactForms) {
    return <p>Error in loading contact forms. Please contact admin</p>
  }
  return <ContactForm locale={locale} contactForms={contactForms}/>
}

export default ContactPage;