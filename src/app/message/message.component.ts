import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getMessages().subscribe(msgs => this.messages = msgs);
  }

  remove(id: string): void {
    this.messageService.remove(id);
  }
}
