export const getVerificationEmailContent = (verifyToken: string) => {
  const verificationLink = `http://localhost:8080/api/auth/verify/${verifyToken}`;
  return {
    subject: 'Welcome',
    html: `Please click <a href='${verificationLink}'>here</a> to verify your email.`,
    text: `Please open this link in your browser: ${verificationLink}`,
  };
};

export const getPasswordContent = (resetToken: string) => {
  return {
    subject: 'Password Reset Request',
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your password. Please use the following code to complete the process:</p>
      <h2 style="color: green; cursor: pointer;">${resetToken}</h2>
      <p>Copy this code and paste it in the required field to reset your password.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you!</p>
    `,
    text: `Hello,\n\nWe received a request to reset your password. Please use the following code to complete the process:\n\n${resetToken}\n\nCopy this code and paste it in the required field to reset your password.\n\nIf you did not request this, please ignore this email.\n\nThank you!`
  };
};
