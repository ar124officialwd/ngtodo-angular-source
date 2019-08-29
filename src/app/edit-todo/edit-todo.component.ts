import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TodoService } from './../todo.service';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {
  mainId: number;
  text: FormControl;
  todo: Todo;
  originalTodo: Todo;
  dateString: string;
  staredClass: string;
  hiddenClass: string;
  staredTitle: string;
  hiddenTitle: string;
  unchanged = true;
  editLabel: string;
  timeString: string;

  constructor(
              private activatedRoute: ActivatedRoute,
              private todoService: TodoService,
              private location: Location) {
  }

  ngOnInit() {
    this.text = new FormControl('');
    this.mainId = Number(this.activatedRoute.snapshot.paramMap.get('mainId'));
    this.todoService.getTodo(this.mainId)
      .subscribe(todo => this.originalTodo = todo);
    this.text.setValue(this.originalTodo.text);
    Todo.copy(this.originalTodo).subscribe(todo => this.todo = todo);

    if (this.todo.updated) {
      this.editLabel = 'Last updated';
      this.dateString = this.todo.updated.dateString;
      this.timeString = this.todo.updated.timeString;
    } else {
      this.editLabel = 'Created';
      this.dateString = this.todo.created.dateString;
      this.timeString = this.todo.created.timeString;
    }

    if (this.todo.stared) {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star_o';
      this.staredTitle = 'Mark this unstared!';
    } else {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star';
      this.staredTitle = 'Mark this stared!';
    }

    if (this.todo.hidden) {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye';
      this.hiddenTitle = 'Mark this not hidden!';
    } else {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye_slash';
      this.hiddenTitle = 'Mark this hidden!';
    }
  }

  toggleStared(): void {
    // tslint:disable-next-line: triple-equals
    if (this.todo.stared == true) {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star';
      this.todo.stared = false;
    } else {
      this.staredClass = 'btn btn-sm btn-light nf-fa-star_o';
      this.todo.stared = true;
    }

    // tslint:disable-next-line: triple-equals
    this.unchanged = this.ifUnChanged();
  }

  toggleHidden(): void {
    // tslint:disable-next-line: triple-equals
    if (this.todo.hidden == true) {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye_slash';
      this.todo.hidden = false;
    } else {
      this.hiddenClass = 'btn btn-sm btn-light nf-fa-eye';
      this.todo.hidden = true;
    }

    // tslint:disable-next-line: triple-equals
    this.unchanged = this.ifUnChanged();
  }

  goBack(): void {
    this.location.back();
  }

  clearText(): void {
    this.text = new FormControl('');
    // tslint:disable-next-line: triple-equals
    this.unchanged = this.ifUnChanged();
  }

  saveTemporary(): void {
    this.todo.text = this.text.value;
    // tslint:disable-next-line: triple-equals
    this.unchanged = this.ifUnChanged();
  }

  updateTodo(): void {
    if (!this.unchanged) {
      this.todoService.update(this.todo);
      this.location.back();
    }
  }

  private ifUnChanged() {
    // tslint:disable-next-line: triple-equals
    return this.todo.hidden == this.originalTodo.hidden &&
           // tslint:disable-next-line: triple-equals
           this.todo.stared == this.originalTodo.stared &&
           // tslint:disable-next-line: triple-equals
           this.todo.text == this.originalTodo.text;
  }
}
