import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { StudentService } from '../../core/services/student.service';
import { ToastService } from '../../core/services/toast.service';

import { ValidationErrors } from '../../core/models/api-response';
import { getFieldError } from '../../core/utils/validation-errors';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './student-form.html',
})
export class StudentForm implements OnInit {
  private readonly fb = inject(FormBuilder);

  error = '';
  isSubmitting = false;
  isLoadingStudent = false;
  studentId: number | null = null;

  validationErrors: ValidationErrors | null = null;
  readonly getFieldError = getFieldError;

  studentForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  get isEditMode(): boolean {
    return this.studentId !== null;
  }

  constructor(
    public readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.studentId = Number(id);
    this.isLoadingStudent = true;
    this.studentService.getStudent(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
        this.isLoadingStudent = false;
      },
      error: () => {
        this.toast.error('Could not load student');
        this.isLoadingStudent = false;
      },
    });
  }

  submit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }
    this.validationErrors = null;

    this.error = '';
    this.isSubmitting = true;
    const payload = this.studentForm.getRawValue();

    if (this.isEditMode) {
      this.studentService
        .updateStudent(this.studentId!, payload)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (msg) => {
            this.toast.success(msg || 'Student updated');
            this.router.navigate(['/dashboard/students']);
          },
          error: (err) => {
            this.validationErrors = err.error?.data ?? null;
            this.error = err.error?.message || 'Could not save student';
            this.toast.error(this.error);
          },
        });
      return;
    }

    this.studentService
      .addStudent(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toast.success('Student added');
          this.router.navigate(['/dashboard/students']);
        },
        error: (err) => {
          this.validationErrors = err.error?.data ?? null;
          this.error = err.error?.message || 'Could not save student';
          this.toast.error(this.error);
        },
      });
  }
}
