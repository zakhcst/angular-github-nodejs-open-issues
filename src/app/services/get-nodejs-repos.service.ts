import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { ApiEndPoints } from '../api-end-points';

// import { share, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetNodejsReposService {
  public nodejsRepos$: Observable<any>;

  constructor(private _http: HttpClient, private _api: ApiEndPoints) {

    this.nodejsRepos$ = _http.get<any>(this._api.gitHubNodejsReposUrl);
      // .pipe(
        // tap(_ => {
        //   console.log(`repos: ${_}`);
        //   _.forEach(element => {
        //     console.log(element);
        //   });
        // }),
        // share()
      // );
  }
}
