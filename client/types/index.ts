export type User = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export type Internship = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  description: string;
  applyLink: string;
  source: string;
  postedAt: string;
  isInternship: boolean;
  score?: number;
};

export type Application = {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  applyLink: string;
  status: "saved" | "applied";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
