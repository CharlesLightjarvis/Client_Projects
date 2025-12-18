export interface Category {
  id: string;
  name: string;
}

export interface Formation {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string;
  duration: number;
  level: string;
  price: number;
  category: Category;
}

export interface FormationInterest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  formation: Formation;
}

export interface FormationInterestPayload {
  interest: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
    formation: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
      description: string;
      duration: number;
      level: string;
      price: number;
      category: Category;
    };
  };
}
