import { NewMessageData, OrderData } from '../types/telegram-templates.js';

export const ContactFormMessageBuilder = (data: NewMessageData): string => {
  const { name, email, message } = data;

  return `
    📝 **Нове повідомлення з контактної форми**:
    👤 Ім'я: ${name}
    📧 Email: ${email}
    💬 Повідомлення: ${message}
    ⏰ Дата: ${new Date().toLocaleString()}
  `;
};

export const OrderMessage = (data: OrderData): string => {
  const { orderNumber, user, items, contactInfo } = data;

  const itemDetails = items
    .map(
      (item, index) => `${index + 1}. ${item.patternId} - ${item.canvasCount}`
    )
    .join('\n');

  return `
    🛒 **Новий замовлення**:
    🆔 Номер замовлення: ${orderNumber}
    👤 Користувач: ${user}
    📦 Товари:
    ${itemDetails}
    Загальна сума: ${items.length * 65} $
    📞 Контакти: ${
      contactInfo.phone || contactInfo.instagram || contactInfo.facebook
        ? `${contactInfo.phone || ''} ${contactInfo.instagram || ''} ${
            contactInfo.facebook || ''
          }`
        : 'Не вказано'
    }
    ⏰ Дата: ${new Date().toLocaleString()}
  `;
};
