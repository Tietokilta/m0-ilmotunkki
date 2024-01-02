/**
 * email service.
 */
import NodeMailer from 'nodemailer';
import { factories } from '@strapi/strapi';

const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

const transporter = NodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPassword
  },
  pool: true
});

transporter
  .verify()
  .then(() =>console.log('Mailer setup succesfully'))
  .catch((error) => console.error('Mailer error', error))

export default factories.createCoreService('api::email.email',{
  create: async(options: Record<string, unknown>) => {
    await transporter.sendMail(options);
    return null;
  },
}
);
