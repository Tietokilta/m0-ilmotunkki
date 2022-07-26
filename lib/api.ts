import qs from "qs";
export const getStrapiURL = (path = "") => {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  }${path}`;
}

export const fetchAPI = async <T>(
  path: string,
  options: RequestInit = {},
  urlParamsObject = {},
  ): Promise<T> => {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };
  const queryString = qs.stringify(urlParamsObject);
  // Build request URL
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);
  // Handle response
  if (!response.ok) {
    const {error} = await response.json()
    throw error;
  }
  const {data} = await response.json();
  return data as T;
};

export type StrapiError = {
  status: number,
  name: string,
  message: string,
  details: any,
}

type Media = {
  data: {
    attributes: {
      url: string;
    }
  },
};

export const getStrapiMedia = (media: Media) => {
  const { url } = media.data.attributes;
  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
  return imageUrl;
}