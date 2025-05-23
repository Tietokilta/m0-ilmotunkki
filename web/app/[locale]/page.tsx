'use client';
import CountDown from "@/components/CountDown";
import React from "react";
export const dynamic = "force-dynamic";

type Props = {
  params: {
    locale: string;
  };
};

const Home = ({ params: { locale } }: Props) => {
  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md mt-4 p-1 sm:p-2">
      <main className="container mx-auto px-2">
        <div className="flex w-full justify-center">
          <CountDown locale={locale} />
        </div>
      </main>
    </div>
  );
};

export default Home;
