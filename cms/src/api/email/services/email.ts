/**
 * email service.
 */
import { createTransport } from "nodemailer";
import { factories } from "@strapi/strapi";

const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com.";
const stmpTLS = process.env.SMTP_TLS === "true";
const transporter = createTransport({
  host: smtpHost,
  secure: stmpTLS,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
  pool: true,
});

transporter
  .verify()
  .then(() => console.log("Mailer setup succesfully"))
  .catch((error) => console.error("Mailer error", error));

export default factories.createCoreService("api::email.email", {
  create: async (options: Record<string, unknown>) => {
    await transporter.sendMail(options);
    return null;
  },
});
