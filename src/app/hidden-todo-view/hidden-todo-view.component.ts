import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../message';

@Component({
  selector: 'app-hidden-todo-view',
  templateUrl: './hidden-todo-view.component.html',
  styleUrls: ['./hidden-todo-view.component.css']
})
export class HiddenTodoViewComponent implements OnInit {
  importantMarkClass = 'text-primary nf-fa-star';
  todos: Todo[];
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
  ) {}

  ngOnInit() {
    this.todoService.getHiddenTodos().subscribe(todos => (this.todos = todos));
    this.sortDescending();
    this.ascending = false;

    this.todoItemClass = 'todoItem';
    this.selected = [];
    this.classes = [];
  }

  delete(id: number): void {
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

  setStar(id: number): void {
    this.todoService.setStar([id], true);
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

  unhide(id: number): void {
    this.todoService.setHidden([id], false);
  }

  unhideSelected() {
    if (this.selected.length) {
      this.todoService.setHidden(this.selected, false, (err) => {
        if (!err) {
          this.deselectAll();
        }
      });
      this.selected = [];
    } else {
      this.messageService.addToast(
        new Message('Please select one or more items!')
      );
    }
  }

  unsetStar(id: number): void {
    this.todoService.setStar([id], false);
  }

  unstarSelected() {
    if (this.selected.length) {
      this.todoService.setStar(this.selected, false, (err) => {
        if (!err) {
          this.deselectAll();
        }
      });
      this.selected = [];
    } else {
      this.messageService.addToast(
        new Message('Please select one or more items!')
      );
    }
  }
}
