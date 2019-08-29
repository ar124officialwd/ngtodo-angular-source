import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../message';

@Component({
  selector: 'app-normal-todo-view',
  templateUrl: './normal-todo-view.component.html',
  styleUrls: ['./normal-todo-view.component.css']
})
export class NormalTodoViewComponent implements OnInit {
  todos: Todo[];
  checkedTodos: number[] = [];
  todoItemClass: string;
  selected: number[];
  classes: string[];
  allSelected: boolean;
  ascending: boolean;

  constructor(
    public todoService: TodoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.todoItemClass = 'todoItem';
    this.selected = [];
    this.classes = [];
  }

  ngOnInit() {
    this.todoService.getUnstaredTodos().subscribe(todos => (this.todos = todos));
    this.sortDescending();

    this.ascending = false;
  }

  delete(id: number) {
    this.todoService.delete([id]);
  }

  deleteSelected() {
    if (this.selected.length) {
      const confirm = window.confirm('Do you really want to delete selected items?');
      if (confirm) {
        this.todoService.delete(this.selected, (err) => {
          if (!err) {
            this.deselectAll();
          }
        });
      }
    } else {
      this.messageService.addToast(
        new Message('Please select one or more items!')
      );
    }
  }

  deselectAll() {
    for (const todo of this.todos) {
      const index = this.selected.indexOf(todo.id);
      if (index !== -1) {
        this.selected.splice(index, 1);
        this.classes[todo.id] = 'todoItem';
      }
    }
    this.allSelected = false;
  }

  edit(todoId: number): void {
    this.router.navigateByUrl('edit/' + todoId);
  }

  hide(id: number) {
    this.todoService.setHidden([id], true);
    this.ngOnInit();
  }

  hideSelected() {
    if (this.selected.length) {
      this.todoService.setHidden(this.selected, true, (err) => {
        if (!err) {
          this.deselectAll();
        }
      });
    } else {
      this.messageService.addToast(
        new Message('Please select one or more items!')
      );
    }
  }

  isSelected(id: number) {
    const index = this.selected.indexOf(id);
    return index !== -1;
  }

  selectAll() {
    for (const todo of this.todos) {
      const index = this.selected.indexOf(todo.id);
      if (index === -1) {
        this.selected.push(todo.id);
        this.classes[todo.id] = 'todoItem bg-selected';
      }
    }
    this.allSelected = true;
  }

  setStar(id: number) {
    this.todoService.setStar([id], true);
    this.messageService.addToast(new Message(`Todo has been moved to 'Stared Todos'`));
    this.ngOnInit();
  }

  /* sort items ascending */
  sortAscending() {
    this.todos = this.todos.sort((t1, t2) => {
      return TodoService.older(t1, t2);
    });
    this.ascending = true;
  }

  /* sort items descending */
  sortDescending() {
    this.todos = this.todos.sort((t1, t2) => {
      return TodoService.newer(t1, t2);
    });
    this.ascending = false;
  }

  starSelected() {
    if (this.selected.length) {
      this.todoService.setStar(this.selected, true, (err) => {
        if (!err) {
          this.deselectAll();
        }
      });
    } else {
      this.messageService.addToast(
        new Message('Please select one or more items!')
      );
    }
  }

  toggleChecked(id: number): void {
    const index = this.selected.indexOf(id);
    if (index > -1) {
      this.selected.splice(index, 1);
      this.classes[id] = 'todoItem';
    } else {
      this.selected.push(id);
      this.classes[id] = 'todoItem bg-selected';
    }
  }
}
