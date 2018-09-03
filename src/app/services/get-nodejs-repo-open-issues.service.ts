import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndPoints } from '../api-end-points';

@Injectable({
  providedIn: 'root'
})

export class GetNodejsRepoOpenIssuesService {
  constructor(private _http: HttpClient, private _api: ApiEndPoints) {}

  getRepoIssues$(repoName: string) {
    const issueUrl = this._api.gitHubNodejsRepoOpenIssuesUrl.replace('reponame', repoName);
    return this._http.get<any>(issueUrl);
  }
}
