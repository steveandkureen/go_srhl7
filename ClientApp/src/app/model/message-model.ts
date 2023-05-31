export interface IMessageModel {
  message?: string;
  response?: string;
  messageStatus?: MessageStatus;
  messageId?: string;
  connectionId?: string;
  connectionStatus?: boolean;
  dateTime?: string;
}

export enum MessageStatus {
  InQueue = 'InQueue',
  Sending = 'Sending',
  Sent = 'Sent',
  Acked = 'Acked',
  NoAck = 'NoAck',
  Received = 'Received',
}

export enum MessageStatusMap {
  InQueue = 'Queued',
  Sending = 'Sending',
  Sent = 'Sent',
  Acked = 'Acked',
  NoAck = 'No Ack',
}

export enum AckTypes {
  AA = '0',
  AE = '1',
  AR = '2',
}
