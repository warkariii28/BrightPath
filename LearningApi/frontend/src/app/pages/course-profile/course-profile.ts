import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { CourseProfile } from '../../core/models/course';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { SkeletonTableComponent } from '../../core/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-course-profile',
  imports: [CurrencyPipe, DatePipe, RouterLink, PageHeaderComponent, SkeletonTableComponent],
  templateUrl: './course-profile.html',
})
export class CourseProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  readonly profile = signal<CourseProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly courseName = computed(() => this.profile()?.courseName ?? 'Course profile');
  readonly hasStudents = computed(() => (this.profile()?.students.length ?? 0) > 0);

  constructor(public readonly authService: AuthService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Invalid course profile link.');
      this.loading.set(false);
      return;
    }

    this.loadProfile(id);
  }

  loadProfile(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.courseService.getCourseProfile(id).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load course profile.');
        this.loading.set(false);
      },
    });
  }
}
