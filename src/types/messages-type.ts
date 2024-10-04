export type IHttpError = Error & {
  status?: number;
};

export type MessageListT = {
  [key: string]: string;
};
