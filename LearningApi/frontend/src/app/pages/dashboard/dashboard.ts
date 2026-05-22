import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';
import { DashboardAnalyticsService } from '../../core/services/dashboard-analytics.service';
import { DashboardAnalytics } from '../../core/models/dashboard-analytics';

import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink, SkeletonTableComponent, PageHeaderComponent],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  // ✅ inject() used correctly
  private readonly studentService = inject(StudentService);
  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly analyticsService = inject(DashboardAnalyticsService);

  constructor(public readonly authService: AuthService) {}

  // ✅ state from service
  readonly students = toSignal(this.studentService.students$, { initialValue: [] });

  readonly courses = toSignal(this.courseService.courses$, { initialValue: [] });
  readonly enrollments = toSignal(this.enrollmentService.enrollments$, { initialValue: [] });
  readonly error = signal('');
  readonly analyticsError = signal('');
  readonly loading = signal(true);
  readonly analytics = signal<DashboardAnalytics | null>(null);
  readonly totalCount = toSignal(this.studentService.totalCount$, { initialValue: 0 });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');
    this.analyticsError.set('');

    forkJoin([
      this.studentService.fetchStudents(1, 5, '', true),
      this.courseService.fetchCourses(),
      this.enrollmentService.fetchEnrollments(),
      this.analyticsService.getAnalytics().pipe(
        catchError(() => {
          this.analyticsError.set('Could not load dashboard analytics.');
          return of(null);
        }),
      ),
    ]).subscribe({
      next: ([, , , analytics]) => {
        this.analytics.set(analytics);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load dashboard data. Check backend API and authentication.');
      },
    });
  }
}
