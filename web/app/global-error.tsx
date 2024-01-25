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
    <html lang="fi" className="dark w-full h-full">
      <body className="bg-secondary-200 dark:bg-secondary-900 p-2 text-secondary-700 dark:text-secondary-100'">
        <div className="max-w-7xl mx-auto">
          <div className="container max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md mt-4 p-1 sm:p-8">
            <main className="container mx-auto px-4">
              <section className="prose dark:prose-invert prose-li:my-0.5 prose-ul:my-0.5 prose-secondary mt-0 mb-4">
                <h2>Hups, jotain meni pieleen!</h2>
                <p>Kokeile jotakin seuraavista korjataksesi vian</p>
                <ol>
                  <li>
                    1. Kokeile uudestaan{" "}
                    <button className="btn" onClick={reset}>
                      Resetoi
                    </button>
                  </li>
                  <li>
                    2. Päivitä sivu ja nollaa välimuisti <kbd>CTRL</kbd>+
                    <kbd>SHIFT</kbd>+<kbd>R</kbd>
                  </li>
                  <li>3. Kokeile toista selainta</li>
                  <li>
                    4. Ota yhteyttä Muistinnollaustireehtööreihin @kulttuuri tai
                    @Carogust. Helpottaaksesi asian selvitystä ota kuvankaappaus
                    konsolista <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd> ja
                    ilmoita tämä koodi {error.digest}
                  </li>
                </ol>
              </section>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Error;
