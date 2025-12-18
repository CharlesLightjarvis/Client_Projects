interface Teacher {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  role: string;
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
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
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

export interface Formation {
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
  created_at: string;
  updated_at: string;
}
