import { fetchAPI } from "@/lib/api";
import Component from "./Component";
import { ContactForm, StrapiBaseType } from "@/utils/models";

type Global = StrapiBaseType<{
  updateEnd: string;
}>


const getData = async (locale: string) => {
  const [formData, global] = await Promise.all([
    fetchAPI<ContactForm[]>('/contact-forms',{},{
      locale,
      populate: ['contactForm','itemTypes']
    }),
    fetchAPI<Global>('/global'),
  ]);
  return {
    contactForms: formData,
    global
  }
}

type Props = {
  params: {
    locale: string
  }
}


const EditPage = async ({params: {locale}}: Props) => {
  const data = await getData(locale)
  return <Component
    contactForms={data.contactForms}
    global={data.global}
    locale={locale}
    />
}

export default EditPage;