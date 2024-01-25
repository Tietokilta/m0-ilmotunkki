"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Locale = () => {
  const router = useRouter();
  const { customer } = useContext(AppContext);
  const pathname = usePathname() || "";
  const pathParts = pathname.split("/").filter((part) => part.length > 0);
  const query = useSearchParams() || "";
  const locales = ["fi", "en"];
  const currentLocale = pathParts[0];
  const handleClick = async (locale: string) => {
    pathParts[0] = locale;
    router.push(`/${pathParts.join("/")}?${query.toString()}`);
    if (!customer.attributes.uid) return;
    await fetch("api/customers", {
      method: "PUT",
      body: JSON.stringify({
        customerUid: customer.attributes.uid,
        data: {
          locale,
        },
      }),
    });
  };
  if (pathname === "/callback") {
    return null;
  }
  return (
    <div className="flex h-fit">
      {locales.map((locale) => (
        <div
          className="m-1 uppercase cursor-pointer font-bold text-secondary-900 dark:text-secondary-50"
          key={locale}
          onClick={() => handleClick(locale)}
        >
          {locale}
          {currentLocale === locale && (
            <div className="border-t-2 border-t-primary-600"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Locale;
