import { fetchAPI } from "../lib/api";
import { Translation } from "./models";

export const transformTranslations = (t: Translation): Record<string, string> =>
  t.attributes.translations.reduce(
    (acc, row) => {
      const { key, value } = row;
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

export const getTranslation = async (locale: string) => {
  try {
    const result = await fetchAPI<Translation>(
      "/translation",
      {
        next: { revalidate: 300 },
      },
      {
        locale: locale,
        populate: ["translations"],
      },
    );
    return transformTranslations(result);
  } catch (error) {
    console.error(error);
    return {};
  }
};
