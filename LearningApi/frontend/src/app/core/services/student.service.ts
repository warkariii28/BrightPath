import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, shareReplay, finalize, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Student, StudentPayload, StudentProfile } from '../models/student';
import { PagedResult } from '../models/api-response';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/students`;

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private pageSizeSubject = new BehaviorSubject<number>(20);
  public pageSize$ = this.pageSizeSubject.asObservable();

  private inflight$?: Observable<Student[]>;

  constructor(http: HttpClient) {
    super(http);
  }

  fetchStudents(
    page: number = 1,
    pageSize: number = 20,
    search: string = '',
    forceRefresh: boolean = false,
  ): Observable<Student[]> {
    const current = this.studentsSubject.value;

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

    this.inflight$ = this.get<PagedResult<Student>>(
      `${this.apiUrl}?${params}`).pipe(
      tap((result) => {
        this.studentsSubject.next(result.items || []);
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

  hasStudents(): boolean {
    return this.studentsSubject.value.length > 0;
  }

  getStudent(id: number): Observable<Student> {
    return this.get<Student>(`${this.apiUrl}/${id}`);
  }

  getStudentProfile(id: number): Observable<StudentProfile> {
    return this.get<StudentProfile>(`${this.apiUrl}/${id}/profile`);
  }

  addStudent(student: StudentPayload): Observable<number> {
    return this.post<number>(this.apiUrl, student).pipe(
      tap((id) => {
        const newStudent: Student = { studentID: id, ...student };
        this.studentsSubject.next([newStudent, ...this.studentsSubject.value]);
      }),
    );
  }

  updateStudent(id: number, student: StudentPayload): Observable<string> {
    return this.putWithMessage(`${this.apiUrl}/${id}`, student).pipe(
      tap(() => {
        const updated = this.studentsSubject.value.map((s) =>
          s.studentID === id ? { ...s, ...student } : s,
        );
        this.studentsSubject.next(updated);
      }),
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const filtered = this.studentsSubject.value.filter((s) => s.studentID !== id);
        this.studentsSubject.next(filtered);
      }),
    );
  }
}
