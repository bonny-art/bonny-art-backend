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
    html: `${resetToken}`,
    text: `${resetToken}`,
  };
};
