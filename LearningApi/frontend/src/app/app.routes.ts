import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';
import { CourseForm } from './pages/course-form/course-form';
import { Courses } from './pages/courses/courses';
import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { EnrollmentForm } from './pages/enrollment-form/enrollment-form';
import { Enrollments } from './pages/enrollments/enrollments';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { StudentForm } from './pages/student-form/student-form';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { AppLayoutComponent } from './layouts/app-layout/app-layout';
import { AdminAuditLogs } from './pages/admin-audit-logs/admin-audit-logs';
import { Users } from './pages/users/users';
import { AppRoles } from './core/constants/app-roles';
import { StudentProfilePage } from './pages/student-profile/student-profile';
import { CourseProfilePage } from './pages/course-profile/course-profile';
import { EnrollmentProfilePage } from './pages/enrollment-profile/enrollment-profile';

export const routes: Routes = [
  // Redirect root
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // AUTH LAYOUT
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },

  {
    path: 'dashboard',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'students', component: Students },

      // ADMIN ONLY
      {
        path: 'add',
        redirectTo: 'students/add',
        pathMatch: 'full',
      },
      {
        path: 'edit/:id',
        redirectTo: 'students/edit/:id',
        pathMatch: 'full',
      },
      {
        path: 'students/add',
        component: StudentForm,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'students/edit/:id',
        component: StudentForm,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'students/:id',
        component: StudentProfilePage,
      },
      {
        path: 'audit-logs',
        component: AdminAuditLogs,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'users',
        component: Users,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },

      // STUDENT + ADMIN
      {
        path: 'courses',
        component: Courses,
      },
      {
        path: 'courses/add',
        component: CourseForm,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'courses/edit/:id',
        component: CourseForm,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'courses/:id',
        component: CourseProfilePage,
      },

      // VIEW ALLOWED
      {
        path: 'enrollments',
        component: Enrollments,
      },
      // ADD = ONLY ADMIN
      {
        path: 'enrollments/add',
        component: EnrollmentForm,
        canActivate: [roleGuard],
        data: { roles: [AppRoles.Admin] },
      },
      {
        path: 'enrollments/:id',
        component: EnrollmentProfilePage,
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
