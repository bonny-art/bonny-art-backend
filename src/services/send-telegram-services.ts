import { getNewMessageTelegramContent } from '../helpers/telegram-templates.js';
import { sendOrderToTelegram } from './telegram-service.js'; 

type TelegramMessageType = 'newMessage';
type NewMessageData = {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
};

export const sendTelegramMessage = async (
  type: TelegramMessageType,
  language: string = 'uk',
  data: NewMessageData
) => {
  let telegramMessage;

  if (type === 'newMessage') {
    telegramMessage = getNewMessageTelegramContent(data, language);
  } else {
    throw new Error('Invalid Telegram message type');
  }

  await sendOrderToTelegram(telegramMessage);
};
