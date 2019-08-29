import { TodoDate } from './TodoDate';
import { Observable, of } from 'rxjs';
export class Todo {
  id: number;
  created: TodoDate;
  updated: TodoDate;
  stared: boolean;
  hidden: boolean;

  constructor(public text: string) {}

  public static copy(obj: Todo): Observable<Todo> {
    const todo = new Todo('');
    todo.id = obj.id;
    todo.created = obj.created;
    todo.updated = obj.updated;
    todo.stared = obj.stared;
    todo.hidden = obj.hidden;
    return of(todo);
  }
}
