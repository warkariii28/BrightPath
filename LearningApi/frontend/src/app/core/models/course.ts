export interface Course {
  courseID: number;
  courseName: string;
  fee: number;
  durationWeeks: number;
}

export interface CoursePayload {
  courseName: string;
  fee: number;
  durationWeeks: number;
}

export interface CourseProfile {
  courseID: number;
  courseName: string;
  fee: number;
  durationWeeks: number;
  createdAt: string;
  totalStudents: number;
  projectedRevenue: number;
  firstEnrollmentDate?: string | null;
  lastEnrollmentDate?: string | null;
  students: CourseProfileStudent[];
  recentActivity: CourseActivity[];
}

export interface CourseProfileStudent {
  enrollmentID: number;
  studentID: number;
  studentName: string;
  email: string;
  enrollmentDate: string;
}

export interface CourseActivity {
  activityType: string;
  description: string;
  activityDate: string;
}
