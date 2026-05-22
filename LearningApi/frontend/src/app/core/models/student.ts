export interface Student {
  studentID: number;
  name: string;
  email: string;
}

export interface StudentPayload {
  name: string;
  email: string;
}

export interface StudentProfile {
  studentID: number;
  name: string;
  email: string;
  createdAt: string;
  totalCourses: number;
  totalFees: number;
  firstEnrollmentDate?: string | null;
  lastEnrollmentDate?: string | null;
  enrollments: StudentProfileEnrollment[];
  recentActivity: StudentActivity[];
}

export interface StudentProfileEnrollment {
  enrollmentID: number;
  courseID: number;
  courseName: string;
  fee: number;
  durationWeeks: number;
  enrollmentDate: string;
}

export interface StudentActivity {
  activityType: string;
  description: string;
  activityDate: string;
}
