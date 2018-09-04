import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiEndPoints } from './api-end-points';
import { Repo } from './interfaces/repo';
import { Issue } from './interfaces/issue';

describe('AppComponent', () => {
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

  it('should receive data from GetNodejsReposService and throw error on http request fails (combined)', async(() => {
    const reposSampleData: Repo[] = [{ name: 'TestRepo1' }, { name: 'TestRepo2' }];
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const emsg = 'simulated network error';

    app.repos.subscribe(recievedRepos => {
      expect(recievedRepos).toEqual(reposSampleData);
    });
    app.repos.subscribe(recievedRepos => {
      fail('should have failed with the network error');
    },
      (error) => {
        expect(error.error.message).toEqual(emsg, 'message');
        expect(app.errorResponse.message).toEqual(error.message, 'message');
      }
    );

    // Respond to request repos
    const reqs = httpTestingController.match(gitHubNodejsReposUrl);
    // Assert that the request is a GET.
    expect(reqs[0].request.method).toEqual('GET');
    expect(reqs[1].request.method).toEqual('GET');
    // Respond with mock data, causing Observable to resolve.
    reqs[0].flush(reposSampleData);

    // Respond with mock data, causing Observable to resolve.
    const mockError = new ErrorEvent('Network error', {
      message: emsg
    });

    // Respond with mock error
    reqs[1].error(mockError);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }));

  it('should throw error when GetNodejsReposService http request fails (only)', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const emsg = 'simulated network error';

    app.repos.subscribe(recievedRepos => {
      fail('should have failed with the network error');
    },
      (error) => {
        expect(error.error.message).toEqual(emsg, 'message');
        expect(app.errorResponse.message).toEqual(error.message, 'message');
      }
    );

    // Respond to request repos
    const req = httpTestingController.expectOne(gitHubNodejsReposUrl);
    // Respond with mock data, causing Observable to resolve.
    const mockError = new ErrorEvent('Network error', {
      message: emsg
    });
    // Respond with mock error
    req.error(mockError);

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

      // Close issues
      app.toggleOpenIssue('reponame');
      expect(app.showIssues['reponame']).toBe(false);

      // Open issues again
      app.toggleOpenIssue('reponame');
      expect(app.showIssues['reponame']).toBe(true);

      // Check value availability
      expect(app.openIssues['reponame']).toEqual(openIssuesSample);

    });

    // Respond to request repos
    const requestRepos = httpTestingController.expectOne(gitHubNodejsReposUrl);
    expect(requestRepos.request.method).toEqual('GET');
    requestRepos.flush(reposSampleData);

    // Respond to request issues
    const requestIssues = httpTestingController.expectOne(gitHubNodejsRepoOpenIssuesUrl);
    // Assert that the request is a GET.
    expect(requestIssues.request.method).toEqual('GET');
    // Respond with mock data, causing Observable to resolve.
    requestIssues.flush(openIssuesSample);
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }));


  it('should throw error when GetNodejsRepoOpenIssuesService http request fails', async(() => {
    const reposSampleData: Repo[] = [{ name: 'reponame' }, { name: 'reponame1' }];

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const emsg = 'simulated network error on open issues request';
    fixture.detectChanges();

    app.toggleOpenIssue('reponame');

    fixture.whenStable().then(() => {
      expect(app.errorResponse.error.message).toEqual(emsg);
    });

    // Respond to request repos
    const requestRepos = httpTestingController.expectOne(gitHubNodejsReposUrl);
    expect(requestRepos.request.method).toEqual('GET');
    console.log('FIRST REQUEST: repos');
    requestRepos.flush(reposSampleData);

    // Respond to request issues
    const requestIssues = httpTestingController.expectOne(gitHubNodejsRepoOpenIssuesUrl);
    // Assert that the request is a GET.
    expect(requestIssues.request.method).toEqual('GET');
    console.log('SECOND REQUEST: issues');

    // Respond with error
    const mockError = new ErrorEvent('Network error', {
      message: emsg
    });
    // Respond with mock error
    const opts = {
      status: 500,
      statusText: emsg
    };
    requestIssues.error(mockError, opts);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  }));
});
