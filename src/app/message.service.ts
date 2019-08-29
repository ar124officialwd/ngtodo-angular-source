import { IdGeneratorService } from './id-generator.service';
import { Injectable } from '@angular/core';
import { Message } from './message';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private idGenerator: IdGeneratorService;
  messages: Message[] = [];

  constructor() {
    this.idGenerator = new IdGeneratorService();
  }

  /* add a message lasting for 10 seconds */
  add(msg: Message): void {
    const id = this.addSelf(msg);
    setTimeout(() => this.remove(id), 10000);
  }

  /* add a message lasting for 3 seconds */
  addToast(msg: Message): void {
    const id = this.addSelf(msg);
    setTimeout(() => this.remove(id), 3000);
  }

  /* explicitly remove all messages! */
  clear(): void {
    this.messages = [];
    this.idGenerator.clearIds();
  }

  /* retrive messages */
  getMessages(): Observable<Message[]> {
    return of(this.messages);
  }

  /* explicitly remove a message! */
  remove(id: string): void {
    const index = this.messages.findIndex((m) => {
      return m.id === id;
    });

    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }

 private addSelf(msg: Message): string {
    msg.id = this.idGenerator.getId();
    this.messages.push(msg);
    return msg.id;
  }
}
