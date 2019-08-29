import { PartialError } from './partial-error';
import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Message } from './message';

export enum RequestTypes {
  add,
  delete,
  deleteMany,
  fetch,
  hide,
  hideMany,
  star,
  starMany,
  unhide,
  unhideMany,
  unstar,
  unstarMany,
  update
}

@Injectable({
  providedIn: 'root'
})
export class ServerResponceMessageHandlerService {
  private errorMessagePrefix: string[] = [];
  private partialError: string[] = [];
  private successMessages: string[] = [];

  constructor(private messageService: MessageService) {

    /* Error Messages */
    this.errorMessagePrefix[RequestTypes.add] = 'Add Todo: ';

    this.errorMessagePrefix[RequestTypes.delete] = 'Delete Todo: ';

    this.errorMessagePrefix[RequestTypes.deleteMany] = 'Delete Todos: ';

    this.partialError[RequestTypes.deleteMany] =
      'Failed to delete some todos!';

    this.errorMessagePrefix[RequestTypes.fetch] = 'Load Todos: ';

    this.partialError[RequestTypes.fetch] =
      'Failed to load some todos!';

    this.errorMessagePrefix[RequestTypes.hide] = 'Hide Todo: ';

    this.errorMessagePrefix[RequestTypes.hideMany] = 'Hide Todos: ';

    this.partialError[RequestTypes.hideMany] =
      'Failed to move some todos to hidden!';

    this.errorMessagePrefix[RequestTypes.star] = 'Star Todo: ';

    this.errorMessagePrefix[RequestTypes.starMany] = 'Star Todos: ';

    this.partialError[RequestTypes.starMany] =
      'Failed to move some todos to stared!';

    this.errorMessagePrefix[RequestTypes.unstar] = 'Unstar Todo: ';

    this.errorMessagePrefix[RequestTypes.unstarMany] = 'Unstar Todos: ';

    this.partialError[RequestTypes.unstarMany] = 'Failed to move some todos ' +
        'to unstared!';

    this.errorMessagePrefix[RequestTypes.update] = 'Update Todo: ';


    /* Success Messages */
    this.successMessages[RequestTypes.add] = 'Todo has been added!';

    this.successMessages[RequestTypes.delete] = 'Todo has been deleted!';

    this.successMessages[RequestTypes.deleteMany] = 'Todos has been deleted!';

    this.successMessages[RequestTypes.fetch] = 'Todos has been loaded!';

    this.successMessages[RequestTypes.hide] = 'Todo has been moved to hidden!';

    this.successMessages[RequestTypes.hideMany]
      = 'Todos has been moved to hidden!';

    this.successMessages[RequestTypes.star] =
      'Todo has been moved to stared!';

    this.successMessages[RequestTypes.starMany] =
      'Todos has been moved to stared!';

    this.successMessages[RequestTypes.unhide] =
      'Todo has been moved to visible!';

    this.successMessages[RequestTypes.unhideMany] =
      'Todos has been moved to visible!';

    this.successMessages[RequestTypes.update] =
      'Todo has been updated!';
  }

  handle(request: RequestTypes, err: any = null,
         partialErr: PartialError = null) {
    if (partialErr || err instanceof PartialError) {
      this.messageService.addToast(
        new Message(this.errorMessagePrefix[request] + partialErr[request]));
    } else if (err) {
      if (err instanceof ErrorEvent) {
        this.messageService.add(
          new Message(this.errorMessagePrefix[request] + err.error.message));
      } else {
        console.log(err);
        this.messageService.add(
          new Message(
            this.errorMessagePrefix[request] +
            'Some kind of server error occured!'
          )
        );
      }
    } else {
      this.messageService.addToast(new Message(this.successMessages[request]));
    }
  }
}
