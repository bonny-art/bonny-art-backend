export const getNewMessageTelegramContactForm = (
  data: { name: string; email: string; message: string; agreement: boolean },
  language: string = 'uk'
) => {
  const { name, email, message, agreement } = data;

  return language === 'uk'
    ? `
    📝 **Нове повідомлення з контактної форми**:
    👤 Ім'я: ${name}
    📧 Email: ${email}
    💬 Повідомлення: ${message}
    ✅ Згода на обробку даних: ${agreement ? 'Так' : 'Ні'}
    ⏰ Дата: ${new Date().toLocaleString()}
    `
    : `
    📝 **New message from the contact form**:
    👤 Name: ${name}
    📧 Email: ${email}
    💬 Message: ${message}
    ✅ Data processing agreement: ${agreement ? 'Yes' : 'No'}
    ⏰ Date: ${new Date().toLocaleString()}
    `;
};
