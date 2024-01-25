import { fetchAPI } from "@/lib/api";
import Summary from "./Summary";
import { ContactForm as ContactFormType } from "@/utils/models";
import { getTranslation } from "@/utils/translationHelper";
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
    return [];
  }
};

const ContactPage = async ({ params: { locale } }: Props) => {
  const contactForms = await getContactForms(locale);
  const translation = await getTranslation(locale);
  return (
    <Summary
      locale={locale}
      contactForms={contactForms}
      translation={translation}
    />
  );
};

export default ContactPage;
