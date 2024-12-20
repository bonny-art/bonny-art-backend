import axios from 'axios';
import { getNewMessageTelegramContactForm } from '../helpers/telegram-templates.js';
import {
  NewMessageData,
  TelegramMessageType,
} from '../types/telegram-templates.js';

export const sendMessageToTelegram = async (message: string) => {
  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error sending message:',
        error.response?.data || error.message
      );
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

export const sendTelegramMessage = async (
  type: TelegramMessageType,
  data: NewMessageData
): Promise<void> => {
  let telegramMessage: string;

  switch (type) {
    case 'newMessage':
      telegramMessage = getNewMessageTelegramContactForm(data);
      break;
    default:
      throw new Error('Invalid Telegram message type');
  }

  await sendMessageToTelegram(telegramMessage);
};
