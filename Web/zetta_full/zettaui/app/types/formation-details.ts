interface Teacher {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  role: string;
  bio: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface Certification {
  id: string;
  image?: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: string;
  name: string;
  description?: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface Session {
  id: string;
  start_date: string;
  end_date: string;
  course_type: "DAY" | "NIGHT";
  capacity: number;
  enrolled_students: number;
  teacher: Teacher;
}

export interface FormationDetails {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // en semaines
  price: number;
  discount_price?: number;
  teacher: Teacher;
  category: Category;
  sessions: Session[];
  link: string;
  certifications: Certification[];
  prerequisites: string[];
  objectives: string[];
  modules: Module[];
  created_at: string;
  updated_at: string;
}
