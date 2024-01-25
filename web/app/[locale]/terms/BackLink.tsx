"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export const BackLink = ({ backText }: { backText: string }) => {
  const router = useRouter();

  const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <>
      <Link
        onClick={goBack}
        className="underline text-primary-900 dark:text-primary-500"
        href=""
      >
        {backText}
      </Link>
    </>
  );
};
