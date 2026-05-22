import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, shareReplay, finalize, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Enrollment, EnrollmentDetail, EnrollmentPayload } from '../models/enrollment';
import { PagedResult } from '../models/api-response';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class EnrollmentService extends BaseApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/enrollments`;

  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>([]);
  public enrollments$ = this.enrollmentsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private pageSizeSubject = new BehaviorSubject<number>(20);
  public pageSize$ = this.pageSizeSubject.asObservable();

  private inflight$?: Observable<Enrollment[]>;

  constructor(http: HttpClient) {
    super(http);
  }

  fetchEnrollments(
    page: number = 1,
    pageSize: number = 20,
    search: string = '',
    forceRefresh: boolean = false,
  ): Observable<Enrollment[]> {
    const current = this.enrollmentsSubject.value;

    if (
      !forceRefresh &&
      current.length > 0 &&
      this.currentPageSubject.value === page &&
      this.pageSizeSubject.value === pageSize
    ) {
      return of(current);
    }

    if (this.inflight$ && !forceRefresh) {
      return this.inflight$;
    }

    this.loadingSubject.next(true);

    const params = `page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search.trim())}`;

    this.inflight$ = this.get<PagedResult<Enrollment>>(
      `${this.apiUrl}?${params}`).pipe(
      tap((result) => {
        this.enrollmentsSubject.next(result.items || []);
        this.totalCountSubject.next(result.totalCount);
        this.currentPageSubject.next(result.page);
        this.pageSizeSubject.next(result.pageSize);
      }),
      map((result) => result.items || []),
      finalize(() => {
        this.loadingSubject.next(false);
        this.inflight$ = undefined;
      }),
      shareReplay(1),
    );

    return this.inflight$;
  }

  hasEnrollments(): boolean {
    return this.enrollmentsSubject.value.length > 0;
  }

  getEnrollment(id: number): Observable<EnrollmentDetail> {
    return this.get<EnrollmentDetail>(`${this.apiUrl}/${id}`);
  }

  addEnrollment(payload: EnrollmentPayload): Observable<number> {
    return this.post<number>(this.apiUrl, payload).pipe(
      tap(() => {
        // must refetch (backend returns incomplete object)
        this.fetchEnrollments(1,20,'',true).subscribe();
      }),
    );
  }

  updateEnrollment(id: number, payload: EnrollmentPayload): Observable<string> {
    return this.putWithMessage(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => {
        this.fetchEnrollments(1,20,'',true).subscribe();
      }),
    );
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.fetchEnrollments(1,20,'',true).subscribe();
      }),
    );
  }
}
