// Типы сообщений для Telegram
export const TELEGRAM_MESSAGE_TYPES = {
  NEW_MESSAGE: 'newMessage',
  NEW_ORDER: 'newOrder',
} as const;

// Ошибки
export const TELEGRAM_ERRORS = {
  INVALID_MESSAGE_TYPE: 'Invalid Telegram message type',
} as const;