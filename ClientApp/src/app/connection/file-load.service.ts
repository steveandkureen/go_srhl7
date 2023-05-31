import { Injectable } from '@angular/core';
import { IMessageModel, MessageStatus } from '../model/message-model';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FileLoadService {
  constructor() {}

  parseFiles(files: any[], connectionId: string): Observable<IMessageModel[]> {
    return new Observable((subscriber) => {
      let loadDone = false;
      files.forEach((file) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          const text = fileReader.result?.toString();
          let messageList = this.parseText(text, connectionId);
          subscriber.next(messageList);
        };
        fileReader.readAsText(file);
      });
    });
  }

  parseText(text: string | undefined, connectionId: string) {
    if (!text) return;

    let messageList: IMessageModel[] = [];
    let messageStart = false;
    let messageText: string[] = [];
    text.split('\n').forEach((line) => {
      let trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//')) {
        messageStart = true;
        messageText.push(trimmed);
      } else {
        if (messageStart) {
          messageList.push({
            message: messageText.join('\n'),
            response: '',
            messageId: uuidv4(),
            messageStatus: MessageStatus.InQueue,
            connectionId: connectionId,
            dateTime: '',
          });
          messageText = [];
          messageStart = false;
        }
      }
    });
    if (messageStart) {
      messageList.push({
        message: messageText.join('\n'),
        response: '',
        messageId: uuidv4(),
        messageStatus: MessageStatus.InQueue,
        connectionId: connectionId,
        dateTime: '',
      });
    }
    return messageList;
  }
}
