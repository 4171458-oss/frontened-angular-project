import { TestBed } from '@angular/core/testing';
import { CommentsService } from './comments';
import { ApiClient } from '../../../core/services/api-client';

describe('CommentsService', () => {
  let service: CommentsService;
  let apiSpy: jasmine.SpyObj<ApiClient>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('ApiClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        { provide: ApiClient, useValue: apiSpy }
      ]
    });
    service = TestBed.inject(CommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
