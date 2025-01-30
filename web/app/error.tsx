"use client";

import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md mt-4 p-1 sm:p-8">
      <main className="container mx-auto px-4">
        <section className="prose text-secondary-50 dark:prose-invert prose-li:my-0.5 prose-ul:my-0.5 prose-secondary mt-0 mb-4">
          <h2>Hups, jotain meni pieleen!</h2>
          <p>Kokeile jotakin seuraavista korjataksesi vian</p>
          <ol>
            <li>
              Kokeile uudestaan{" "}
              <button className="btn my-0" onClick={reset}>
                Resetoi
              </button>
            </li>
            <li>
              Päivitä sivu ja nollaa välimuisti <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>
              +<kbd>R</kbd>
            </li>
            <li>Kokeile toista selainta</li>
            <li>
              Ota yhteyttä Muistinnollaustireehtööreihin @kulttuuri tai
              @Carogust. Helpottaaksesi asian selvitystä ota kuvankaappaus
              konsolista <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd> ja
              ilmoita tämä koodi {error.digest}
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
};

export default Error;
