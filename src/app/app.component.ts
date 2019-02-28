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
  openIssues = {};
  showIssues = {};
  loadingRepos = false;
  errorResponse: any;
  repos;


  constructor(private _repos: GetNodejsReposService, private _openIssues: GetNodejsRepoOpenIssuesService) {}

  ngOnInit() {
    this.loadingRepos = true;
    this.repos = this._repos.nodejsRepos$.pipe(
      tap(_ => this.loadingRepos = false),
      catchError(err => {
        this.errorResponse = err;
        console.log('ERROR repos:', err);
        return throwError(err);
      })
    );
  }

  toggleOpenIssue(repoName): void {
    this.showIssues[repoName] = !this.showIssues[repoName];
    if (this.showIssues[repoName] && !this.openIssues[repoName]) {
      this._openIssues.getRepoIssues$(repoName)
        .subscribe(data => {
          this.openIssues[repoName] = data;
        },
        (err) => {
          this.errorResponse = err;
          console.log('ERROR issues:', repoName);
          console.log(err);
          return throwError(err);
        }
      );
    }
  }
}

