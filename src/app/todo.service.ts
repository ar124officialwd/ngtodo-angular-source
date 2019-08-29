import { PartialError } from './partial-error';
import { HttpService } from './http.service';
import { ServerResponceMessageHandlerService, RequestTypes } from './server-responce-message-handler.service';
import { TodoDateService } from './todo-date.service';
import { ServerResponce } from './server-responce';
import { Injectable } from '@angular/core';
import { Todo } from './todo';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  static collection: Todo[] = [];
  static hidden: Todo[] = [];
  static stared: Todo[] = [];
  static triedFetched = false;
  static unstared: Todo[] = [];
  static visible: Todo[] = [];

  constructor(
    private http: HttpService,
    private msgHandler: ServerResponceMessageHandlerService) {
    if (!TodoService.triedFetched) {
      this.fetch();
    }
  }

  add(todo: Todo) {
    const created = new TodoDateService();
    todo.created = created.getDate();
    todo.id = created.getUnixTime();
    this.http.add(todo)
    .subscribe(
      (success) => {
        this.adjust(todo);
        this.msgHandler.handle(RequestTypes.add);
      },
      (error) => {
        this.msgHandler.handle(RequestTypes.add, error);
      }
    );
  }

  private adjust(todo: Todo) {
    for (const c of [TodoService.collection, TodoService.visible,
      TodoService.stared, TodoService.unstared, TodoService.hidden]) {
      const index = c.findIndex((t) => {
        return t.id === todo.id;
      });

      if (index !== -1) {
        c.splice(index, 1);
      }
    }

    if (todo.hidden) {
      TodoService.hidden.unshift(todo);
    } else {
      TodoService.visible.unshift(todo);
      if (todo.stared) {
        TodoService.stared.unshift(todo);
      } else {
        TodoService.unstared.unshift(todo);
      }
    }
    TodoService.collection.unshift(todo);
  }

  delete(ids: number[], callback: (err: any) => void = null) {
    let partialSuccess = false;

    this.http.delete(ids)
    .subscribe({
      next: (responce) => {
        this.purge([Number(responce.id)]);
        partialSuccess = true;
      },

      error: (error) => {
        if (callback) {
          callback(error || true);
        }

        if (ids.length === 1) {
          this.msgHandler.handle(RequestTypes.delete, error);
        } else {
          if (partialSuccess) {
            this.msgHandler.handle(RequestTypes.delete, new PartialError());
          } else {
            this.msgHandler.handle(RequestTypes.delete, error);
          }
        }
      },

      complete: () => {
        if (callback) {
          callback(null);
        }
      }
    });
  }

  fetch() {
    let partialSuccess = false;

    this.http.fetch()
    .subscribe({
      next: (responce: ServerResponce) => {
        const todo: Todo = JSON.parse(responce.data);
        this.adjust(todo);
        partialSuccess = true;
      },

      error: (error) => {
        if (partialSuccess) {
          this.msgHandler.handle(RequestTypes.fetch, new PartialError());
        } else {
          this.msgHandler.handle(RequestTypes.fetch, error);
        }
        TodoService.triedFetched = true;
      },

      complete: () => {
        this.msgHandler.handle(RequestTypes.fetch);
        TodoService.triedFetched = true;
      }
    });
  }

  /* get all hidden todos */
  getHiddenTodos(): Observable<Todo[]> {
    return of(TodoService.hidden);
  }

  /* get all stared todos */
  getStaredTodos(): Observable<Todo[]> {
    return of(TodoService.stared);
  }

  getTodo(id: number): Observable<Todo> {
    const todo = TodoService.collection.find((t) => {
      return t.id === id;
    });

    return of(todo);
  }

  /* get all unstared todos */
  getUnstaredTodos(): Observable<Todo[]> {
    return of(TodoService.unstared);
  }

  /* get all visible todos */
  getVisibleTodos(): Observable<Todo[]> {
    return of(TodoService.visible);
  }

  /* return newer of two todos */
  // tslint:disable-next-line: member-ordering
  static newer(t1: Todo, t2: Todo) {
    let t1Date: any = t1.updated || t1.created;
    let t2Date: any = t2.updated || t2.created;

    t1Date ?
    t1Date = new TodoDateService(`${t1Date.dateString} ${t1Date.timeString}`) :
    t1Date = new TodoDateService();

    t2Date ?
    t2Date = new TodoDateService(`${t2Date.dateString} ${t2Date.timeString}`) :
    t2Date = new TodoDateService();

    return t1Date.getUnixTime() - t2Date.getUnixTime();
  }

  /* return older of two todos */
  // tslint:disable-next-line: member-ordering
  static older(t1: Todo, t2: Todo) {
    let t1Date: any = t1.updated || t1.created;
    let t2Date: any = t2.updated || t2.created;

    t1Date ?
    t1Date = new TodoDateService(`${t1Date.dateString} ${t1Date.timeString}`) :
    t1Date = new TodoDateService();

    t2Date ?
    t2Date = new TodoDateService(`${t2Date.dateString} ${t2Date.timeString}`) :
    t2Date = new TodoDateService();

    return -(t1Date.getUnixTime()) + t2Date.getUnixTime();
  }

  /* remove a todo from everywhere it is found */
  purge(ids: number[]) {
    for (const id of ids) {
      for (const c of [TodoService.collection, TodoService.visible,
        TodoService.stared, TodoService.unstared, TodoService.hidden]) {
        const index = c.findIndex((t) => {
          return t.id === id;
        });

        if (index !== -1) {
          c.splice(index, 1);
        }
      }
    }
  }

  setHidden(ids: number[], value, callback: (err: any) => void = null) {
    let partialSuccess = false;
    const candidates: Todo[] = [];

    for (const id of ids) {
      const todo = TodoService.collection.find((t) => {
        return t.id === id;
      });

      if (todo) {
        todo.hidden = value;
        candidates.push(todo);
      }
    }

    this.http.update(candidates)
    .subscribe({
      next: (responce: ServerResponce) => {
        const todo = candidates.find((c) => {
          return c.id === responce.id;
        });

        this.adjust(todo);
        partialSuccess = true;
      },

      error: (error) => {
        if (value === true) {
          if (ids.length === 1) {
            this.msgHandler.handle(RequestTypes.hide, error);
          } else {
            if (partialSuccess) {
              this.msgHandler.handle(RequestTypes.hideMany, new PartialError());
            } else {
              this.msgHandler.handle(RequestTypes.hideMany, error);
            }
          }
        } else {
          if (ids.length === 1) {
            this.msgHandler.handle(RequestTypes.unhide, error);
          } else {
            if (partialSuccess) {
              this.msgHandler.handle(RequestTypes.unhideMany,
                new PartialError());
            } else {
              this.msgHandler.handle(RequestTypes.unhideMany, error);
            }
          }
        }

        if (callback) {
          callback(error);
        }
      },

      complete: () => {
        if (ids.length === 1) {
          if (value === true) {
            this.msgHandler.handle(RequestTypes.hide);
          } else {
            this.msgHandler.handle(RequestTypes.unhide);
          }
        } else {
          if (value === true) {
            this.msgHandler.handle(RequestTypes.hideMany);
          } else {
            this.msgHandler.handle(RequestTypes.unhideMany);
          }
        }

        if (callback) {
          callback(false);
        }
      }
    });
  }

  setStar(ids: number[], value, callback: (err: any) => void = null) {
    let partialSuccess = false;
    const candidates: Todo[] = [];

    for (const id of ids) {
      const todo = TodoService.collection.find((t) => {
        return t.id === id;
      });

      if (todo) {
        todo.stared = value;
        candidates.push(todo);
      }
    }

    this.http.update(candidates)
    .subscribe({
      next: (responce: ServerResponce) => {
        const todo = candidates.find((c) => {
          return c.id === responce.id;
        });

        this.adjust(todo);
        partialSuccess = true;
      },

      error: (error) => {
        if (value === true) {
          if (ids.length === 1) {
            this.msgHandler.handle(RequestTypes.star, error);
          } else {
            if (partialSuccess) {
              this.msgHandler.handle(RequestTypes.starMany, );
            } else {
              this.msgHandler.handle(RequestTypes.starMany, error);
            }
          }
        } else {
          if (ids.length === 1) {
            this.msgHandler.handle(RequestTypes.unstar, error);
          } else {
            if (partialSuccess) {
              this.msgHandler.handle(RequestTypes.unstarMany,
                new PartialError());
            } else {
              this.msgHandler.handle(RequestTypes.unstarMany, error);
            }
          }
        }

        if (callback) {
          callback(error);
        }
      },

      complete: () => {
        if (ids.length === 1) {
          if (value === true) {
            this.msgHandler.handle(RequestTypes.star);
          } else {
            this.msgHandler.handle(RequestTypes.unstar);
          }
        } else {
          if (value === true) {
            this.msgHandler.handle(RequestTypes.starMany);
          } else {
            this.msgHandler.handle(RequestTypes.unstarMany);
          }
        }

        if (callback) {
          callback(false);
        }
      }
    });
  }

  update(todo: Todo) {
    let subscription;
    try {
      subscription = this.http.update([todo])
      .subscribe({
        next: (responce: ServerResponce) => {
          this.adjust(todo);
          this.msgHandler.handle(RequestTypes.update);
        },

        error: (error) => {
          this.msgHandler.handle(RequestTypes.update, error);
        },

        complete: () => {
          throw true;
        }
      });
    } catch (error) {
      if (subscription) {
        subscription.unsubscribe();
      }
    }
  }
}
