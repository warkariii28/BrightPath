export interface DashboardAnalytics {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  adminActionsThisWeek: number;
  recentEnrollments: RecentEnrollment[];
  popularCourses: PopularCourse[];
  studentGrowth: StudentGrowth[];
  recentStudents: RecentStudent[];
  recentAdminActions: RecentAdminAction[];
}

export interface RecentEnrollment {
  enrollmentID: number;
  studentName: string;
  courseName: string;
  enrollmentDate: string;
}

export interface PopularCourse {
  courseID: number;
  courseName: string;
  enrollmentCount: number;
  revenue: number;
}

export interface StudentGrowth {
  period: string;
  studentCount: number;
}

export interface RecentStudent {
  studentID: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface RecentAdminAction {
  auditLogID: number;
  adminName: string;
  action: string;
  entityName: string;
  entityID?: number | null;
  createdAt: string;
}
