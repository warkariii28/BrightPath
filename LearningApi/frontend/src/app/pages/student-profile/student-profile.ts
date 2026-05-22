import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { StudentService } from '../../core/services/student.service';
import { StudentProfile } from '../../core/models/student';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-student-profile',
  imports: [CurrencyPipe, DatePipe, RouterLink, PageHeaderComponent, SkeletonTableComponent],
  templateUrl: './student-profile.html',
})
export class StudentProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly studentService = inject(StudentService);

  readonly profile = signal<StudentProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly studentName = computed(() => this.profile()?.name ?? 'Student profile');
  readonly hasEnrollments = computed(() => (this.profile()?.enrollments.length ?? 0) > 0);

  constructor(public readonly authService: AuthService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Invalid student profile link.');
      this.loading.set(false);
      return;
    }

    this.loadProfile(id);
  }

  loadProfile(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.studentService.getStudentProfile(id).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load student profile.');
        this.loading.set(false);
      },
    });
  }
}
