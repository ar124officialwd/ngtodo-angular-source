import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.css']
})
export class NewTodoComponent implements OnInit {
  todo: Todo;
  text: FormControl;
  staredClass: string;
  hiddenClass: string;

  constructor(private todoService: TodoService,
              private messageService: MessageService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit() {
    this.todo = new Todo('');
    this.text = new FormControl('');
    this.staredClass = 'btn btn-sm btn-light nf-fa-star_o';
    this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye';

    this.todo.stared = false;
    this.todo.hidden = false;
    this.todo.updated = null;
  }

  toggleStared(): void {
    // tslint:disable-next-line: triple-equals
    if (this.todo.stared == true) {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star_o';
      this.todo.stared = false;
    } else {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star';
      this.todo.stared = true;
    }
  }

  toggleHidden(): void {
    // tslint:disable-next-line: triple-equals
    if (this.todo.hidden == true) {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye';
      this.todo.hidden = false;
    } else {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye_slash';
      this.todo.hidden = true;
    }
  }

  goBack(): void {
    this.location.back();
  }

  clearText(): void {
    this.text = new FormControl('');
  }

  saveTodo(): void {
    this.todo.text = this.text.value;
    this.todoService.add(this.todo);
    if (this.todo.hidden) {
      this.router.navigateByUrl('hidden');
    } else {
      if (this.todo.stared) {
        this.router.navigateByUrl('important');
      } else {
        this.router.navigateByUrl('normal');
      }
    }
  }
}
