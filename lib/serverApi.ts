import { fetchAPI } from "./api";

const token = process.env.STRAPI_TOKEN;

export const serverFetchAPI = <T>(
  path: string,
  options: RequestInit = {},
  urlParamsObject = {}) => fetchAPI<T>(path,{
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers
    },
    ...options,
  },urlParamsObject
)