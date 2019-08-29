import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantTodoViewComponent } from './important-todo-view.component';

describe('ImportantTodoViewComponent', () => {
  let component: ImportantTodoViewComponent;
  let fixture: ComponentFixture<ImportantTodoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantTodoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantTodoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
