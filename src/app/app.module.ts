import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TodoViewComponent } from './todo-view/todo-view.component';
import { ImportantTodoViewComponent } from './important-todo-view/important-todo-view.component';
import { NewTodoComponent } from './new-todo/new-todo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NormalTodoViewComponent } from './normal-todo-view/normal-todo-view.component';
import { HiddenTodoViewComponent } from './hidden-todo-view/hidden-todo-view.component';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { ActionsComponent } from './actions/actions.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TodoViewComponent,
    ImportantTodoViewComponent,
    NewTodoComponent,
    MessageComponent,
    NormalTodoViewComponent,
    HiddenTodoViewComponent,
    EditTodoComponent,
    ActionsComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
