import { sendMessageToTelegram } from '../telegram-api.js';
import {
  ContactFormMessageBuilder,
  getNewOrderTelegramMessage,
} from '../helpers/telegram-templates.js';
import {
  NewMessageData,
  OrderData,
  TelegramMessageType,
} from '../types/telegram-templates.js';
import { TELEGRAM_ERRORS, TELEGRAM_MESSAGE_TYPES } from '../constants.js';

export const sendTelegramMessage = async (
  type: TelegramMessageType,
  data: NewMessageData | OrderData
): Promise<void> => {
  let telegramMessage: string;

  switch (type) {
    case TELEGRAM_MESSAGE_TYPES.NEW_MESSAGE:
      telegramMessage = ContactFormMessageBuilder(data as NewMessageData);
      break;
    case TELEGRAM_MESSAGE_TYPES.NEW_ORDER:
      telegramMessage = getNewOrderTelegramMessage(data as OrderData);
      break;
    default:
      throw new Error(TELEGRAM_ERRORS.INVALID_MESSAGE_TYPE);
  }

  await sendMessageToTelegram(telegramMessage);
};
