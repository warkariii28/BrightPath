import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, shareReplay, finalize, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Course, CoursePayload, CourseProfile } from '../models/course';
import { PagedResult } from '../models/api-response';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class CourseService extends BaseApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/courses`;

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private pageSizeSubject = new BehaviorSubject<number>(20);
  public pageSize$ = this.pageSizeSubject.asObservable();

  private inflight$?: Observable<Course[]>;

  constructor(http: HttpClient) {
    super(http);
  }

  fetchCourses(
    page: number = 1,
    pageSize: number = 20,
    search: string = '',
    forceRefresh: boolean = false,
  ): Observable<Course[]> {
    const current = this.coursesSubject.value;

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

    this.inflight$ = this.get<PagedResult<Course>>(
      `${this.apiUrl}?${params}`).pipe(
      tap((result) => {
        this.coursesSubject.next(result.items || []);
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

  hasCourses(): boolean {
    return this.coursesSubject.value.length > 0;
  }

  getCourse(id: number): Observable<Course> {
    return this.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCourseProfile(id: number): Observable<CourseProfile> {
    return this.get<CourseProfile>(`${this.apiUrl}/${id}/profile`);
  }

  addCourse(payload: CoursePayload): Observable<number> {
    return this.post<number>(this.apiUrl, payload).pipe(
      tap((courseID) => {
        const newCourse: Course = { courseID, ...payload };
        this.coursesSubject.next([newCourse, ...this.coursesSubject.value]);
      }),
    );
  }

  updateCourse(id: number, payload: CoursePayload): Observable<string> {
    return this.putWithMessage(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => {
        const updated = this.coursesSubject.value.map((c) =>
          c.courseID === id ? { ...c, ...payload } : c,
        );
        this.coursesSubject.next(updated);
      }),
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const filtered = this.coursesSubject.value.filter((c) => c.courseID !== id);
        this.coursesSubject.next(filtered);
      }),
    );
  }
}
