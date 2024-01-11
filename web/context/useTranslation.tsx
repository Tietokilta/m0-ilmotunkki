import { fetchAPI } from "@/lib/api";
import { transformTranslations } from "@/utils/helpers";
import { Translation } from "@/utils/models";
import useSWR from "swr";

export const useTranslation = (locale: string) => {
  //TODO FORWARD TO NEXT
  const { data, error } = useSWR('/translation',url => fetchAPI<Translation>(url,{},{
    locale,
    populate: ['translations']
  }));
  return {
    translation: data ? transformTranslations(data) : {},
    error: error
  }
}