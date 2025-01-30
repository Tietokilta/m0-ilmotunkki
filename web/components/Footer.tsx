import Image from "next/image";
import { fetchAPI } from "../lib/api";
import { StrapiBaseType, StrapiImage, StrapiResponse } from "../utils/models";

type Sponsor = {
  name: string;
  url: string;
  logo: StrapiResponse<StrapiImage>;
};

type Response = StrapiBaseType<{
  sponsors: Sponsor[];
}>;

const getSponsors = async () => {
  try {
    const response = await fetchAPI<Response>(
      "/global",
      { cache: "no-store" },
      { populate: ["sponsors.logo"] },
    );
    return response;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const Footer = async () => {
  const data = await getSponsors();
  const sponsors = data?.attributes.sponsors;
  if (!sponsors) return null;
  return (
    <footer className="relative container max-w-3xl mx-auto my-10 bg-secondary-50 dark:bg-secondary-600 rounded shadow-md p-1 pt-4 sm:p-8">
      <div className="flex justify-center gap-6 flex-wrap items-center">
        {sponsors?.map((sponsor) => {
          const image =
            sponsor.logo.data.attributes.formats?.small ||
            sponsor.logo.data.attributes;
          const dimensions =
            sponsor.logo.data.attributes.formats?.thumbnail ||
            sponsor.logo.data.attributes;
          return (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="cursor-pointer max-w-[200px]">
                <Image
                  height={dimensions.height}
                  width={dimensions.width}
                  src={image.url}
                  alt={sponsor.name}
                />
              </div>
            </a>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
