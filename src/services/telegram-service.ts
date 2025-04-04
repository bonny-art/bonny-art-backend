import { deliverToTelegram } from '../api/telegram-api.js';
import {
  contactFormMessageBuilder,
  orderMessageBuilder,
} from '../helpers/telegram-templates.js';
import {
  ContactFormData,
  OrderData,
  TelegramMessageType,
} from '../types/telegram-templates.js';
import { TELEGRAM_MESSAGE_TYPES } from '../constants.js';

export const buildAndSendTelegramMessage = async (
  type: TelegramMessageType,
  data: ContactFormData | OrderData
): Promise<void> => {
  let telegramMessage: string;

  switch (type) {
    case TELEGRAM_MESSAGE_TYPES.NEW_MESSAGE:
      telegramMessage = contactFormMessageBuilder(data as ContactFormData);
      break;
    case TELEGRAM_MESSAGE_TYPES.NEW_ORDER:
      telegramMessage = orderMessageBuilder(data as OrderData);
      break;
    default:
      throw new Error('Invalid Telegram message type');
  }

  await deliverToTelegram(telegramMessage);
};
