export interface GraduateOutcome {
  id: string;
  name: string;
  role: string;
  company: string;
  permissionConfirmed: boolean;
}

export interface WebinarSpeaker {
  name: string;
  role: "Founder" | "Guest Speaker" | "Student Presenter";
  bio: string;
  photoUrl?: string;
}

export interface Webinar {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO — upcoming if >= now, past if < now (auto-computed)
  time: string; // display string e.g. "6:00 PM WAT"
  description?: string;
  formatSummary?: string;
  speakers: WebinarSpeaker[];
  registrationOpen: boolean;
  qualifyingQuestion: string;
  thumbnailImage?: string;
  recordingUrl?: string;
  recordingPermissionConfirmed: boolean;
  recapContent?: string;
  keyClips?: string[];
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
  tier: 1 | 2 | 3;
  path?: "A" | "B" | "C";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  format: string;
  startingPrice: number;
  isStartHere?: boolean;
  isMostPopular?: boolean;
  featured?: boolean;
  slug: string;
  description?: string;
  prerequisites?: string[];
  whatYouLearn?: string[];
  capstone?: string;
  advancedElective?: string;
  certificationAlignment?: string[];
  careerPaths?: string[];
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
