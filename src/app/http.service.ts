import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from './api';
import { ServerResponce } from './server-responce';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private static serverUrl = 'http://127.0.0.1:3000/todos';

  constructor(private http: HttpClient) {

  }

  add(todo: Todo): Observable<ServerResponce> {
    return this.http.post<ServerResponce>(HttpService.serverUrl, todo);
  }

  delete(ids: number[]): Observable<ServerResponce> {

    function internelDelete(observer) {
      let count = 0;
      for (const id of ids) {
        this.http.delete(HttpService.serverUrl, {
          headers: new HttpHeaders({
            id: String(id)
          })
        })
        .subscribe((success) => {
          observer.next(success);

          if (++count === ids.length) {
            observer.complete();
          }
        }, (error) => {
          observer.error(error);
        });
      }
    }
    /* end internelDelete() */

    const producer = internelDelete.bind(this);
    return new Observable(producer);
  }

  fetch(): Observable<ServerResponce> {
    function internelFetch(observer) {
      this.http.get(HttpService.serverUrl, {
        headers: new HttpHeaders({
          req_code: String(api.Q_RESET)
        })
      })
      .subscribe((success) => {
        this.http.get(HttpService.serverUrl, {
          headers: new HttpHeaders({
            req_code: String(api.Q_ENTRIES)
          })
        })
        .subscribe((success1) => {
          const entries = JSON.parse(success1.data);
          for (const entry of entries) {
            this.http.get(HttpService.serverUrl, {
              headers: new HttpHeaders({
                req_code: String(api.Q_ENTRY),
                id: entry
              })
            })
            .subscribe((success2) => {
              observer.next(success2);
            }, (error2) => {
              observer.error(error2);
            });
          }
        }, (error1) => {
          observer.error(error1);
        });
      }, (error) => {
        observer.error(error);
      });
    }
    /* end internelFetch() */

    const producer = internelFetch.bind(this);
    return new Observable(producer);
  }

  update(todos: Todo[]) {
    function internelUpdate(observer) {
      let count = 0;
      for (const todo of todos) {
        this.http.put(HttpService.serverUrl, todo)
        .subscribe((success) => {
          observer.next(success);

          if (++count === todos.length) {
            observer.complete();
          }
        }, (error) => {
          observer.error(error);
        });
      }
    }

    const producer = internelUpdate.bind(this);
    return new Observable(producer);
  }
}
