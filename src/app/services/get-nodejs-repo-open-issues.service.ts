import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndPoints } from '../api-end-points';
// import { share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetNodejsRepoOpenIssuesService {
  constructor(private _http: HttpClient, private _api: ApiEndPoints) {}

  getRepoIssues$(repoName: string) {
    const issueUrl = this._api.gitHubNodejsRepoOpenIssuesUrl.replace('reponame', repoName);
    console.log('getRepoIssues$', repoName);
    return this._http.get<any>(issueUrl);
      // .pipe(
      //   tap(_ => {
      //     console.log(`repos: ${_}`);
      //     _.forEach(element => {
      //       console.log(element);
      //     });
      //   }),
      //   share()
      // );
  }
}
