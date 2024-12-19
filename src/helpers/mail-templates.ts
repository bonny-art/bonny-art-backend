export const getEmailVerificationEmailContent = (
  verifyToken: string,
  language: string = 'uk'
) => {
  const verificationLink = `http://localhost:8080/api/${language}/auth/verify/${verifyToken}`;
  return language === 'uk'
    ? {
        subject: 'Ласкаво просимо',
        html: `Натисніть <a href='${verificationLink}'>тут</a>, щоб підтвердити вашу електронну пошту.`,
        text: `Будь ласка, відкрийте це посилання у вашому браузері: ${verificationLink}`,
      }
    : {
        subject: 'Welcome',
        html: `Please click <a href='${verificationLink}'>here</a> to verify your email.`,
        text: `Please open this link in your browser: ${verificationLink}`,
      };
};

export const getPasswordRecoveryEmailContent = (
  resetToken: string,
  language: string = 'uk'
) => {
  return language === 'uk'
    ? {
        subject: 'Запит на скидання пароля',
        html: `
        <p>Вітаємо,</p>
        <p>Ми отримали запит на скидання вашого пароля. Будь ласка, використовуйте наступний код для завершення процесу:</p>
        <h2 style="color: green; cursor: pointer;">${resetToken}</h2>
        <p>Скопіюйте цей код і вставте його у потрібне поле для скидання пароля.</p>
        <p>Якщо ви не запитували це, будь ласка, проігноруйте цей лист.</p>
        <p>Дякуємо!</p>
      `,
        text: `Вітаємо,\n\nМи отримали запит на скидання вашого пароля. Будь ласка, використовуйте наступний код для завершення процесу:\n\n${resetToken}\n\nСкопіюйте цей код і вставте його у потрібне поле для скидання пароля.\n\nЯкщо ви не запитували це, будь ласка, проігноруйте цей лист.\n\nДякуємо!`,
      }
    : {
        subject: 'Password Reset Request',
        html: `
        <p>Hello,</p>
        <p>We received a request to reset your password. Please use the following code to complete the process:</p>
        <h2 style="color: green; cursor: pointer;">${resetToken}</h2>
        <p>Copy this code and paste it in the required field to reset your password.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you!</p>
      `,
        text: `Hello,\n\nWe received a request to reset your password. Please use the following code to complete the process:\n\n${resetToken}\n\nCopy this code and paste it in the required field to reset your password.\n\nIf you did not request this, please ignore this email.\n\nThank you!`,
      };
};

export const getNewMessageEmailContent = (
  data: { name: string; email: string; message: string; agreement: boolean },
  language: string = 'uk'
) => {
  const { name, email, message, agreement } = data;

  return language === 'uk'
    ? {
        subject: `Нове повідомлення від ${name}`,
        html: `
          <p><strong>Ім'я:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Повідомлення:</strong></p>
          <p>${message}</p>
          <p><strong>Згода:</strong> ${agreement ? 'Так' : 'Ні'}</p>
        `,
        text: `Ім'я: ${name}\nEmail: ${email}\nПовідомлення: ${message}\nЗгода: ${agreement ? 'Так' : 'Ні'}`,
      }
    : {
        subject: `New message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Agreement:</strong> ${agreement ? 'Yes' : 'No'}</p>
        `,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nAgreement: ${agreement ? 'Yes' : 'No'}`,
      };
};
