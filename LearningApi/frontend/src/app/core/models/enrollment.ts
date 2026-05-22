export interface Enrollment {
  enrollmentID: number;
  studentName: string;
  courseName: string;
  enrollmentDate: string;
}

export interface EnrollmentPayload {
  studentID: number;
  courseID: number;
}

export interface EnrollmentDetail {
  enrollmentID: number;
  studentID: number;
  studentName: string;
  studentEmail: string;
  courseID: number;
  courseName: string;
  fee: number;
  durationWeeks: number;
  enrollmentDate: string;
  status: string;
  amountPaid: number;
  balanceDue: number;
}
