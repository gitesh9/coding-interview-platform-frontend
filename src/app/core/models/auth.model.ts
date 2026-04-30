export interface User {
  id: string;
  name: string;
  email: string;
  role: 'interviewer' | 'candidate';
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'interviewer' | 'candidate';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface InterviewSession {
  id: string;
  interviewerId: string;
  candidateId?: string;
  candidateName?: string;
  problemIds: number[];
  problemTitles?: string[];
  timeLimit: number;
  status: 'waiting' | 'active' | 'completed';
  joinCode: string;
  createdAt: Date;
  scheduledAt?: Date;
}
