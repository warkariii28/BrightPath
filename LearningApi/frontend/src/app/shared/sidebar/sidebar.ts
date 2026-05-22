import { Component, computed, signal, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { StudentService } from '../../core/services/student.service';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import {
  LucideAngularModule,
  Users,
  BookOpen,
  ClipboardList,
  UserPlus,
  Plus,
  ShieldCheck,
  UserCog,
  LayoutDashboard,
} from 'lucide-angular';
import { Student } from '../../core/models/student';
import { Course } from '../../core/models/course';
import { Enrollment } from '../../core/models/enrollment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit, OnDestroy {
  private readonly sidebarOpenClass = 'sidebar-open';
  private readonly body = document.body;
  private readonly routerSubscriptions = new Subscription();

  readonly isSidebarOpen = signal(false);
  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  students = signal<any[]>([]);
  courses = signal<any[]>([]);
  enrollments = signal<any[]>([]);
  readonly Users = Users;
  readonly BookOpen = BookOpen;
  readonly ClipboardList = ClipboardList;
  readonly UserPlus = UserPlus;
  readonly Plus = Plus;
  readonly isCollapsed = signal(false);
  readonly ShieldCheck = ShieldCheck;
  readonly UserCog = UserCog;
  readonly LayoutDashboard = LayoutDashboard;

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    public authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.studentService.fetchStudents().subscribe();
    if (!this.courseService.hasCourses()) {
      this.courseService.fetchCourses().subscribe();
    }

    this.courseService.courses$.subscribe((data: Course[]) => this.courses.set(data));
    if (!this.enrollmentService.hasEnrollments()) {
      this.enrollmentService.fetchEnrollments().subscribe();
    }

    this.enrollmentService.enrollments$.subscribe((data: Enrollment[]) =>
      this.enrollments.set(data),
    );

    this.studentService.students$.subscribe((data: Student[]) => this.students.set(data));

    this.routerSubscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.closeSidebar()),
    );
  }

  ngOnDestroy(): void {
    this.routerSubscriptions.unsubscribe();
    this.setBodyClass(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => {
      const nextOpen = !isOpen;
      this.setBodyClass(nextOpen);
      return nextOpen;
    });
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
    this.setBodyClass(false);
  }

  private setBodyClass(open: boolean): void {
    this.body.classList.toggle(this.sidebarOpenClass, open);
  }

  navigateTo(route: string): void {
    this.closeSidebar();
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logoutFromServer().subscribe(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }

  menu = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: this.LayoutDashboard,
      roles: ['User', 'Admin'],
    },
    {
      label: 'Students',
      route: '/dashboard/students',
      icon: this.Users,
      roles: ['User', 'Admin'],
    },
    {
      label: 'Courses',
      route: '/dashboard/courses',
      icon: this.BookOpen,
      roles: ['User', 'Admin'],
    },
    {
      label: 'Enrollments',
      route: '/dashboard/enrollments',
      icon: this.ClipboardList,
      roles: ['User', 'Admin'],
    },
  ];

  quickActions = [
    {
      label: 'Student',
      route: '/dashboard/students/add',
      icon: this.Plus,
      roles: ['Admin'],
    },
    {
      label: 'Course',
      route: '/dashboard/courses/add',
      icon: this.Plus,
      roles: ['Admin'],
    },
    {
      label: 'Enroll',
      route: '/dashboard/enrollments/add',
      icon: this.Plus,
      roles: ['Admin'],
    },
  ];

  hasAccess(roles: string[]): boolean {
    const role = this.authService.getRole();
    return !!role && roles.includes(role);
  }
}
