export type AttendanceStatus = "present" | "absent";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
}

export interface Attendance {
  id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  student: Student;
}

export interface AttendanceFormData {
  session_id: string;
  date: string;
  attendances: {
    student_id: string;
    status: AttendanceStatus;
    notes?: string;
  }[];
}
