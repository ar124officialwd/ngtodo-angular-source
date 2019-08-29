import { TestBed } from '@angular/core/testing';

import { TodoDateService } from './todo-date.service';

describe('TodoDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodoDateService = TestBed.get(TodoDateService);
    expect(service).toBeTruthy();
  });
});
