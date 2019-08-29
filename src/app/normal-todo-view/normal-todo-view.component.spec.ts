import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalTodoViewComponent } from './normal-todo-view.component';

describe('NormalTodoViewComponent', () => {
  let component: NormalTodoViewComponent;
  let fixture: ComponentFixture<NormalTodoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalTodoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalTodoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
