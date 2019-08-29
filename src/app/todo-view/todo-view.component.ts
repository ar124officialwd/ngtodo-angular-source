import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { Message } from '../message';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-todo-view',
  templateUrl: './todo-view.component.html',
  styleUrls: ['./todo-view.component.css']
})
export class TodoViewComponent implements OnInit {
  importantMarkClass = 'text-primary nf-fa-star';
  private selected: number[];
  todos: Todo[]; // todos fetched to be shown
  classes: string[]; // class for each of todo(vary on select/deselect)
  todoItemClass: string; // default class for each of item
  allSelected: boolean; // whether all items are selected or not
  ascending: boolean; // whether items are sorted ascending or not

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {
    this.todoItemClass = 'todoItem';
    this.allSelected = false;
    this.selected = [];
    this.classes = [];
  }

  ngOnInit() {
    this.todoService.getVisibleTodos().subscribe(todos => this.todos = todos);
    for (const todo of this.todos) {
      this.classes[todo.id] = 'todoItem';
    }

    this.sortDescending();
    this.ascending = false;
  }

  /* delete a todo */
  delete(id: number) {
    this.todoService.delete([id]);
  }

  /* move selected items to (Visible) Not Hidden Collection */
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

  /* de(un)-select all of the todo items */
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

  /* edit a todo's content */
  edit(todoId: number): void {
    this.router.navigateByUrl('edit/' + todoId);
  }

  /* move an item to Hidden collection */
  hide(id: number) {
    this.todoService.setHidden([id], true);
  }

  /* move selected items to Hidden Collection */
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

  /* whether item is selected or not */
  isSelected(id: number) {
      const index = this.selected.indexOf(id);
      return index !== -1;
  }

  /* select all of the todo items */
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

  /* move an item to Stared Collection */
  setStar(id: number) {
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

  /* move selected items to Stared Collection */
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

  /* toggle the checked state of a todo */
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

  /* move an item to Ordinary(Not Stared) collection */
  unsetStar(id: number) {
    this.todoService.setStar([id], false);
  }

  /* move selected items to (Ordinary) Not Stared Collection */
  unstarSelected() {
    if (this.selected.length) {
      this.todoService.setStar(this.selected, false, (err) => {
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
}
