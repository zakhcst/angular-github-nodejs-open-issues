import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { ApiEndPoints } from './api-end-points';
import { Repo } from './interfaces/repo';
import { Issue } from './interfaces/issue';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const endPoints = new ApiEndPoints();
  const gitHubNodejsReposUrl = endPoints.gitHubNodejsReposUrl;
  const gitHubNodejsRepoOpenIssuesUrl = endPoints.gitHubNodejsRepoOpenIssuesUrl;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [AppComponent]
    }).compileComponents();

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render a Welcome in a h3 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Welcome');
  }));

  it('should be created GetNodejsReposService within the component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app.repos).toBeTruthy();
  }));

  it('should receive data from GetNodejsReposService', async(() => {
    const reposSampleData: Repo[] = [{ name: 'TestRepo1' }, { name: 'TestRepo2' }];
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.repos.subscribe(recievedRepos => {
      expect(recievedRepos).toEqual(reposSampleData);
    });


    const req = httpTestingController.expectOne(gitHubNodejsReposUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    req.flush(reposSampleData);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }));

  it('should receive data from GetNodejsRepoOpenIssuesService', async(() => {
    const reposSampleData: Repo[] = [{ name: 'reponame' }, { name: 'reponame1' }];
    const openIssuesSample: Issue[] = [{ title: 'TestIssue1' }, { title: 'TestIssue2' }];

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    app.toggleOpenIssue('reponame');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(app.openIssues['reponame']).toEqual(openIssuesSample);
    });

    // Intercept & respond to request
    // Mock repos array needs to be set as response to the first request
    const requestRepos = httpTestingController.expectOne(gitHubNodejsReposUrl);
    requestRepos.flush(reposSampleData);
    expect(requestRepos.request.method).toEqual('GET');

    const requestIssues = httpTestingController.expectOne(gitHubNodejsRepoOpenIssuesUrl);
    // Assert that the request is a GET.
    expect(requestIssues.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    requestIssues.flush(openIssuesSample);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }));
});
