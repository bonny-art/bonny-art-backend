import { NewMessageData } from "../types/telegram-templates.js";

export const getNewMessageTelegramContactForm = (
  data: NewMessageData
): string => {
  const { name, email, message, agreement } = data;

  return `
    📝 **Нове повідомлення з контактної форми**:
    👤 Ім'я: ${name}
    📧 Email: ${email}
    💬 Повідомлення: ${message}
    ✅ Згода на обробку даних: ${agreement ? 'Так' : 'Ні'}
    ⏰ Дата: ${new Date().toLocaleString()}
  `;
};