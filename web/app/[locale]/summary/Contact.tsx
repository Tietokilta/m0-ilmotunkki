import { getContactForm } from "@/utils/helpers";
import { ContactForm as ContactFormType, Customer, Item } from "@/utils/models";

type ContactProps = {
  customer: Customer;
  items: Item[];
  contactForms: ContactFormType[];
  translation: Record<string, string>;
};

const ContactComponent = ({
  customer,
  items,
  contactForms,
  translation,
}: ContactProps) => {
  const fields = getContactForm(contactForms, items);

  if (!fields) return null;
  return (
    <div className="mb-5 text-primary-900 dark:text-primary-100">
      <div className="shadow-lg rounded p-4 flex flex-col gap-2">
        {fields.map((row) => (
          <div className="flex flex-col sm:flex-row" key={row.fieldName}>
            <div className="flex-1 text-sm sm:text-base">{row.label}</div>
            <div className="flex-1">
              {row.type === "checkbox"
                ? customer.attributes[row.fieldName]
                  ? translation.yes
                  : translation.no
                : customer.attributes[row.fieldName]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactComponent;
