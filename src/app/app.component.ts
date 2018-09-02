import { Component, OnInit } from '@angular/core';
import { GetNodejsReposService } from './services/get-nodejs-repos.service';
import { GetNodejsRepoOpenIssuesService } from './services/get-nodejs-repo-open-issues.service';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  repos;
  openIssues = {};
  showIssues = {};
  loadingRepos: Boolean = false;

  constructor(private _repos: GetNodejsReposService, private _openIssues: GetNodejsRepoOpenIssuesService) {
    this.loadingRepos = true;
    this.repos = _repos.nodejsRepos$.pipe(tap(_ => this.loadingRepos = false)) ;
    console.log('AppComponent constructed');
  }

  ngOnInit() {}

  toggleOpenIssue(repoName): void {
    this.showIssues[repoName] = !this.showIssues[repoName];
    if (this.showIssues[repoName] && !this.openIssues[repoName]) {
      this._openIssues.getRepoIssues$(repoName)
      .pipe(
        catchError(err => {
            console.log('ERROR:', repoName);
            console.log(err);
            return throwError(err);
          })
        )
        .subscribe(data => {
          console.log('Toggled issue data received', data);
          this.openIssues[repoName] = data;
        }
      );
    }
  }
}

