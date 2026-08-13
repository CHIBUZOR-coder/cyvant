export interface GraduateOutcome {
  id: string;
  name: string;
  role: string;
  company: string;
  permissionConfirmed: boolean;
}

export interface Webinar {
  id: string;
  title: string;
  date: string; // ISO string
  registerUrl: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  role: string;
  company: string;
  outcome: string;
  quote: string;
  permissionOnFile: boolean;
  noTechBackground?: boolean;
}

export interface Course {
  id: string;
  title: string;
  academy: "cybersecurity" | "ai";
  level: "Foundations" | "Professional" | "Engineering";
  duration: string;
  format: string;
  startingPrice: number;
  isStartHere?: boolean;
  slug: string;
}

export interface FormPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  courseInterest?: string;
  serviceInterest?: string;
  qualifyingAnswer?: string;
  consent: boolean;
}
