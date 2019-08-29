import { TestBed } from '@angular/core/testing';

import { ServerResponceMessageHandlerService } from './server-responce-message-handler.service';

describe('ServerResponceMessageHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerResponceMessageHandlerService = TestBed.get(ServerResponceMessageHandlerService);
    expect(service).toBeTruthy();
  });
});
