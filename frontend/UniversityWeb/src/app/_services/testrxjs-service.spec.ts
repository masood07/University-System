import { TestBed } from '@angular/core/testing';

import { TestrxjsService } from './testrxjs-service';

describe('TestrxjsService', () => {
  let service: TestrxjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestrxjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
