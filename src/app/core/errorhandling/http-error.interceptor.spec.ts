import { TestBed } from '@angular/core/testing';

import { HttpError.InterceptorService } from './http-error.interceptor.service';

describe('HttpError.InterceptorService', () => {
  let service: HttpError.InterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpError.InterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
