export interface AiMessage {
  role: 'interviewer' | 'user';
  content: string;
  timestamp: Date;
}
