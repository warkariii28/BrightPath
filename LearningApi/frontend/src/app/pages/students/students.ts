import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { StudentService } from '../../core/services/student.service';
import { ToastService } from '../../core/services/toast.service';
import { Student } from '../../core/models/student';
import { getPaginationItems } from '../../core/utils/paginate';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-students',
  imports: [RouterLink, SkeletonTableComponent, PageHeaderComponent],
  templateUrl: './students.html',
})
export class Students implements OnInit {
  private readonly studentService = inject(StudentService);

  readonly students = toSignal(this.studentService.students$, { initialValue: [] });
  readonly totalCount = toSignal(this.studentService.totalCount$, { initialValue: 0 });
  readonly error = signal('');
  readonly loading = signal(true);
  readonly query = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(5);

  readonly filteredStudents = computed(() => this.students());
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  readonly paginationItems = computed(() => getPaginationItems(this.page(), this.totalPages()));
  readonly pagedStudents = computed(() => this.filteredStudents());

  constructor(
    public readonly authService: AuthService,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly confirm: ConfirmService,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.error.set('');

    this.studentService
      .fetchStudents(this.page(), this.pageSize(), this.query(), true)
      .subscribe({
        next: () => this.loading.set(false),
        error: () => {
          this.loading.set(false);
          this.error.set('Could not load students. Check backend API and authentication.');
        },
      });
  }

  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
    this.loadStudents();
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadStudents();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadStudents();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber !== this.page() && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.page.set(pageNumber);
      this.loadStudents();
    }
  }

  async deleteStudent(student: Student): Promise<void> {
    const ok = await this.confirm.ask(`Delete ${student.name}?`);
    if (!ok) return;

    this.studentService.deleteStudent(student.studentID).subscribe({
      next: () => {
        this.toast.success('Student deleted');
        this.loadStudents();
      },
      error: () => this.error.set('Could not delete student'),
    });
  }

  logout(): void {
    this.authService.logoutFromServer().subscribe(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }
}
