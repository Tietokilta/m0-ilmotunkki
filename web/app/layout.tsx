import { Metadata } from "next";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Locale from "../components/Locale";
import Timer from "../components/Timer";
import BackgroundCanvas from "../components/BackgroundCanvas";


import { fetchAPI } from "@/lib/api";
import { StrapiBaseType, StrapiImage, StrapiResponse } from "@/utils/models";
import AppProvider from "../context/AppContext";
import "../styles/global.css";

type PropType = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};
export const dynamic = "force-dynamic";

const RootLayout = async ({ children }: PropType) => {
  return (
    <html lang="fi" className="dark w-full h-full">
      <head />
      <body className="bg-secondary-200 dark:bg-secondary-900 p-2 text-secondary-50 dark:text-secondary-100 font-raleway font-extralight">
        <BackgroundCanvas />
        <AppProvider>
          <Header locale="">
            <Locale />
            <Timer />
          </Header>
          <div className="max-w-7xl mx-auto">{children}</div>
        </AppProvider>
        <Footer />
      </body>
    </html>
  );
};

type Global = StrapiBaseType<{
  updateEnd: string;
  title: string;
  description: string;
  url: string;
  favicon: StrapiResponse<StrapiImage>;
}>;

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await fetchAPI<Global>(
    "/global",
    {
      next: { revalidate: 300 },
    },
    { populate: ["favicon"] },
  );
  return {
    title: data.attributes.title,
    description: data.attributes.description,
    icons: {
      icon: data.attributes.favicon.data.attributes.url,
    },
    metadataBase: new URL(data.attributes.url),
    openGraph: {
      title: data.attributes.title,
      description: data.attributes.description,
      url: data.attributes.url,
      siteName: data.attributes.title,
      locale: "fi_FI",
      type: "website",
    },
  };
};

export default RootLayout;
