export type TelegramMessageType = 'newMessage';
export type NewMessageData = {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
};