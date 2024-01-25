import { fetchAPI } from "@/lib/api";
import { StrapiBaseType } from "@/utils/models";
import { getTranslation } from "@/utils/translationHelper";
import { BackLink } from "./BackLink";
import { TermsContent } from "./Content";

export const dynamic = "force-dynamic";
type Fields = StrapiBaseType<{
  terms: string;
  gdpr: string;
}>;

const getContent = async (locale: string) => {
  const response = await fetchAPI<Fields>(
    "/terms-and-condition",
    {
      next: { revalidate: 300 },
    },
    {
      locale,
    },
  );
  return response;
};

type Props = {
  params: {
    locale: string;
  };
};
const Terms = async ({ params: { locale } }: Props) => {
  const content = await getContent(locale);
  const translation = await getTranslation(locale);

  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-8">
      <TermsContent
        terms={content.attributes.terms}
        gdpr={content.attributes.gdpr}
      />
      <div className="my-4">
        <BackLink backText={translation.back} />
      </div>
    </div>
  );
};

export default Terms;
