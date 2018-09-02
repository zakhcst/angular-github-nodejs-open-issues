import { TestBed, inject } from '@angular/core/testing';

import { GetNodejsReposService } from './get-nodejs-repos.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GetNodejsReposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [GetNodejsReposService]
    });
  });

  it('should be created', inject([GetNodejsReposService], (service: GetNodejsReposService) => {
    expect(service).toBeTruthy();
  }));
});
