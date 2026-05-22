import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Enrollment } from '../../core/models/enrollment';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { getPaginationItems } from '../../core/utils/paginate';

@Component({
  selector: 'app-enrollments',
  imports: [DatePipe, RouterLink, SkeletonTableComponent, PageHeaderComponent],
  templateUrl: './enrollments.html',
})
export class Enrollments implements OnInit {
  private readonly enrollmentService = inject(EnrollmentService);
  readonly enrollments = toSignal(this.enrollmentService.enrollments$, { initialValue: [] });
  readonly totalCount = toSignal(this.enrollmentService.totalCount$, { initialValue: 0 });
  readonly error = signal('');
  readonly loading = signal(true);

  // 🔍 Search + Pagination
  readonly query = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(5);

  // ✅ Filtered data
  readonly filtered = computed(() => this.enrollments());

  // ✅ Total pages
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  readonly paginationItems = computed(() => getPaginationItems(this.page(), this.totalPages()));

  // ✅ Paginated data
  readonly paged = computed(() => this.filtered());

  constructor(
    /*  private readonly enrollmentService: EnrollmentService, */
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly confirm: ConfirmService,
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading.set(true);
    this.error.set('');

    this.enrollmentService
      .fetchEnrollments(this.page(), this.pageSize(), this.query(), true)
      .subscribe({
        next: () => {
          this.loading.set(false);
          /* this.page.set(1); */
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not load enrollments. Check backend API and authentication.');
        },
      });
  }

  // 🔍 Search handler
  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
    this.loadEnrollments();
  }

  // ⬅️➡️ Pagination
  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadEnrollments();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadEnrollments();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber !== this.page() && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.page.set(pageNumber);
      this.loadEnrollments();
    }
  }

  async deleteEnrollment(enrollment: Enrollment): Promise<void> {
    const ok = await this.confirm.ask(
      `Remove ${enrollment.studentName} from ${enrollment.courseName}?`,
    );
    if (!ok) return;

    this.enrollmentService.deleteEnrollment(enrollment.enrollmentID).subscribe({
      next: () => this.loadEnrollments(),
    });
  }

  logout(): void {
    this.authService.logoutFromServer().subscribe(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }
}
