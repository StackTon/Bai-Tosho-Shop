import { TestBed, inject } from '@angular/core/testing';

import { AllUsersService } from './all-users.service';

describe('AllUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllUsersService]
    });
  });

  it('should be created', inject([AllUsersService], (service: AllUsersService) => {
    expect(service).toBeTruthy();
  }));
});
