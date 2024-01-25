"use client";

import { useTranslation } from "@/context/useTranslation";
import { getContactForm } from "@/utils/helpers";
import { ContactForm, Customer, Item } from "@/utils/models";
import { FormEvent, useState } from "react";

type Props = {
  locale: string;
  contactForms: ContactForm[];
  customer: Customer;
  items: Item[];
  onSubmit?: () => void | Promise<void>;
};

const Form = ({
  locale,
  contactForms,
  customer,
  items,
  onSubmit = () => Promise.resolve(),
}: Props) => {
  const [isSending, setIsSending] = useState(false);
  const { translation } = useTranslation(locale);
  const contactForm = getContactForm(contactForms || [], items);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updateFields = Object.fromEntries(form.entries()) as Record<
      string,
      string | boolean | number
    >;
    contactForm.forEach((field) => {
      if (field.type === "checkbox") {
        updateFields[field.fieldName] = form.has(field.fieldName);
      }
    });
    updateFields.locale = locale;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    delete updateFields.publishedAt;
    const payload = {
      data: updateFields,
      customerUid: customer.attributes.uid,
    };
    setIsSending(true);
    await fetch(`/api/customers`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    onSubmit();
    setIsSending(false);
  };
  const getFieldValue = (key: keyof Customer["attributes"]) => {
    return customer.attributes[key] as string;
  };
  return (
    <form
      className="mb-6 text-secondary-800 dark:text-secondary-100"
      onSubmit={handleSubmit}
    >
      {contactForm.map((field) => (
        <div className="mb-8" key={field.fieldName}>
          <label className="block p-1">
            {field.label}
            {field.required && "*"}
            <input
              className="tx-input mt-2"
              type={field.type}
              id={field.fieldName}
              name={field.fieldName}
              defaultChecked={
                field.type === "checkbox"
                  ? !!getFieldValue(field.fieldName)
                  : undefined
              }
              defaultValue={
                field.type !== "checkbox"
                  ? getFieldValue(field.fieldName)
                  : undefined
              }
              required={field.required}
            />
          </label>
        </div>
      ))}
      <div className="float-right">
        <button disabled={isSending} className="group btn h-12">
          <svg
            className="group-disabled:inline-block hidden animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
            />
          </svg>
          <span>{translation.send}</span>
        </button>
      </div>
    </form>
  );
};

export default Form;
