import nodemailer from 'nodemailer';

const { MAILTRAP_PASS, MAILTRAP_USER } = process.env;

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  html: string,
  text: string
) => {
  await transport.sendMail({
    to,
    from: 'ovsyannikovnikolai1790@gmail.com',
    subject,
    html,
    text,
  });
};
