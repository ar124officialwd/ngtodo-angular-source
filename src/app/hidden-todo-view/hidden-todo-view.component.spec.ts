import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenTodoViewComponent } from './hidden-todo-view.component';

describe('HiddenTodoViewComponent', () => {
  let component: HiddenTodoViewComponent;
  let fixture: ComponentFixture<HiddenTodoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenTodoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenTodoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
