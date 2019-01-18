import { TestBed, inject } from '@angular/core/testing';

import { BungieService } from './bungie.service';

describe('BungieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BungieService]
    });
  });

  it('should be created', inject([BungieService], (service: BungieService) => {
    expect(service).toBeTruthy();
  }));
});
