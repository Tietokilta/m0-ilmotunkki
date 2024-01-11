import useSWR from "swr";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useTranslation = (locale: string) => {
  const { data, error } = useSWR<Record<string,string>>(`/api/translation/${locale}`,fetcher);
  return {
    translation: data || {},
    error: error
  }
}