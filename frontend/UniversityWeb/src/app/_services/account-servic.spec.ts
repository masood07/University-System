import { TestBed } from '@angular/core/testing';

import { AccountServic } from './account-servic';

describe('AccountServic', () => {
  let service: AccountServic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountServic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
