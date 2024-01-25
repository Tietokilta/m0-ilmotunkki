import { fetchAPI } from "@/lib/api";
import FormWrapper from "./FormWrapper";
import { ContactForm as ContactFormType } from "@/utils/models";
export const dynamic = "force-dynamic";
type Props = {
  params: {
    locale: string;
  };
};

const getContactForms = async (locale: string) => {
  try {
    const data = await fetchAPI<ContactFormType[]>(
      "/contact-forms",
      { cache: "no-store" },
      {
        locale,
        populate: ["contactForm", "itemTypes"],
      },
    );
    return data;
  } catch (error) {
    return undefined;
  }
};

const ContactPage = async ({ params: { locale } }: Props) => {
  const contactForms = await getContactForms(locale);
  if (!contactForms) {
    return <p>Error in loading contact forms. Please contact admin</p>;
  }
  return <FormWrapper locale={locale} contactForms={contactForms} />;
};

export default ContactPage;
