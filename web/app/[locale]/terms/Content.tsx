"use client";

import ReactMarkdown from "react-markdown";

export const TermsContent = ({
  terms,
  gdpr,
}: {
  terms: string;
  gdpr: string;
}) => {
  return (
    <>
      <ReactMarkdown className="prose prose-secondary dark:prose-invert">
        {terms}
      </ReactMarkdown>
      <ReactMarkdown className="prose prose-secondary dark:prose-invert">
        {gdpr}
      </ReactMarkdown>
    </>
  );
};
