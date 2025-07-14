import { TestBed } from '@angular/core/testing';

import { Volunteer } from './volunteer';

describe('Volunteer', () => {
  let service: Volunteer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Volunteer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
