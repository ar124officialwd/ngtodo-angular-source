import { AboutComponent } from './about/about.component';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoViewComponent } from './todo-view/todo-view.component';
import { ImportantTodoViewComponent } from './important-todo-view/important-todo-view.component';
import { NewTodoComponent } from './new-todo/new-todo.component';
import { NormalTodoViewComponent } from './normal-todo-view/normal-todo-view.component';
import { HiddenTodoViewComponent } from './hidden-todo-view/hidden-todo-view.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    component: TodoViewComponent,
  },
  {
    path: 'important',
    component: ImportantTodoViewComponent
  },
  {
    path: 'normal',
    component: NormalTodoViewComponent
  },
  {
    path: 'hidden',
    component: HiddenTodoViewComponent
  },
  {
    path: 'new',
    component: NewTodoComponent
  },
  {
    path: 'edit/:mainId',
    component: EditTodoComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
