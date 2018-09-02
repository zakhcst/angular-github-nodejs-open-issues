import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiEndPoints {
    public gitHubNodejsReposUrl = 'https://api.github.com/orgs/nodejs/repos';
    public gitHubNodejsRepoOpenIssuesUrl = 'https://api.github.com/repos/nodejs/reponame/issues?state=open';
}
