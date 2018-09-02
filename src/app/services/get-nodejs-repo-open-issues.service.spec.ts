import { TestBed, inject } from '@angular/core/testing';

import { GetNodejsRepoOpenIssuesService } from './get-nodejs-repo-open-issues.service';
import { HttpClientModule } from '@angular/common/http';

describe('GetNodejsRepoOpenIssuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [GetNodejsRepoOpenIssuesService]
    });
  });

  it('should be created', inject([GetNodejsRepoOpenIssuesService], (service: GetNodejsRepoOpenIssuesService) => {
    expect(service).toBeTruthy();
  }));
});
