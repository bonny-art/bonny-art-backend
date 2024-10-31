import nodemailer from 'nodemailer';

const { META_PASS, META_EMAIL } = process.env;

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: META_EMAIL,
    pass: META_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  verifyToken: string
) => {
  const verificationLink = `http://localhost:8080/api/auth/verify/${verifyToken}`;

  await transport.sendMail({
    to,
    from: 'ovsyannikovnikolai1790@gmail.com',
    subject: 'Welcome',
    html: `Please click <a href='${verificationLink}'>here</a> to verify your email.`,
    text: `Please open this link in your browser: ${verificationLink}`,
  });
};
