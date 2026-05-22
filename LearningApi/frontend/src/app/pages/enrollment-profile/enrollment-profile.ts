import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EnrollmentDetail } from '../../core/models/enrollment';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-enrollment-profile',
  imports: [CurrencyPipe, DatePipe, RouterLink, PageHeaderComponent, SkeletonTableComponent],
  templateUrl: './enrollment-profile.html',
})
export class EnrollmentProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly enrollmentService = inject(EnrollmentService);

  readonly enrollment = signal<EnrollmentDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly pageTitle = computed(() => {
    const enrollment = this.enrollment();
    return enrollment
      ? `${enrollment.studentName} in ${enrollment.courseName}`
      : 'Enrollment details';
  });

  constructor(public readonly authService: AuthService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Invalid enrollment details link.');
      this.loading.set(false);
      return;
    }

    this.loadEnrollment(id);
  }

  loadEnrollment(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.enrollmentService.getEnrollment(id).subscribe({
      next: (enrollment) => {
        this.enrollment.set(enrollment);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load enrollment details.');
        this.loading.set(false);
      },
    });
  }
}
