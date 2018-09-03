import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { ApiEndPoints } from '../api-end-points';

@Injectable({
  providedIn: 'root'
})
export class GetNodejsReposService {
  public nodejsRepos$: Observable<any>;

  constructor(private _http: HttpClient, private _api: ApiEndPoints) {
    this.nodejsRepos$ = _http.get<any>(this._api.gitHubNodejsReposUrl);
  }
}
