export type EmploymentType =
  | 'Full-Time'
  | 'Part-Time'
  | 'Contract'
  | 'Remote'
  | 'Hybrid';

export type ApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

export interface ICareerJob {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: EmploymentType;
  experienceLevel?: string;
  salaryRange?: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  isActive: boolean;
  closingDate?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IJobApplication {
  id?: string;
  jobId: string;
  jobTitle: string;
  department?: string;
  applicantName: string;
  email: string;
  phone: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  yearsOfExperience?: string;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

