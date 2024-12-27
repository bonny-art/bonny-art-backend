import { NewMessageData, OrderData } from '../types/telegram-templates.js';

export const contactFormMessageBuilder = (data: NewMessageData): string => {
  const { name, email, message } = data;

  return `
    📝 **Нове повідомлення з контактної форми**:
    👤 Ім'я: ${name}
    📧 Email: ${email}
    💬 Повідомлення: ${message}
    ⏰ Дата: ${new Date().toLocaleString()}
  `;
};

export const orderMessageBuilder = (data: OrderData): string => {
  const { orderNumber, user, items, contactInfo, comment } = data;

  const itemDetails = items
    .map(
      (item, index) => `${index + 1}. ${item.codename}  ${item.name} - ${item.canvasCount} count`
    )
    .join('\n');

    const contactDetails = `
    📞 Телефон: ${contactInfo.phone || 'Не вказано'}
    📸 Instagram: ${contactInfo.instagram || 'Не вказано'}
    📘 Facebook: ${contactInfo.facebook || 'Не вказано'}
    ✉️ Email: ${contactInfo.email || 'Не вказано'}
  `;

    const commentSection = comment
    ? `📝 Коментар: ${comment}`
    : '';

  return `
    🛒 **Нове замовлення**:
    🆔 Номер замовлення: ${orderNumber}
    👤 Користувач: ${user}
    📦 Товари:
    ${itemDetails}
    Загальна сума: ${items.length * 65} $
    ${contactDetails}
    ⏰ Дата: ${new Date().toLocaleString()}
    ${commentSection}
  `;
};
