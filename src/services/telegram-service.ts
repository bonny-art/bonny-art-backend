import { deliverToTelegram } from '../api/telegram-api.js';
import {
  ContactFormMessageBuilder,
  OrderMessage,
} from '../helpers/telegram-templates.js';
import {
  NewMessageData,
  OrderData,
  TelegramMessageType,
} from '../types/telegram-templates.js';
import { TELEGRAM_MESSAGE_TYPES } from '../constants.js';

export const buildAndSendTelegramMessage = async (
  type: TelegramMessageType,
  data: NewMessageData | OrderData
): Promise<void> => {
  let telegramMessage: string;

  switch (type) {
    case TELEGRAM_MESSAGE_TYPES.NEW_MESSAGE:
      telegramMessage = ContactFormMessageBuilder(data as NewMessageData);
      break;
    case TELEGRAM_MESSAGE_TYPES.NEW_ORDER:
      telegramMessage = OrderMessage(data as OrderData);
      break;
    default:
      throw new Error('Invalid Telegram message type');
  }

  await deliverToTelegram(telegramMessage);
};
