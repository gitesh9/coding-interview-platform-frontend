export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  isSolved?: boolean;
}

export interface ProblemListItem {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  tags?: string;
  constraints?: string;
  description: string;
  isSolved?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

export interface SubmissionResult {
  status:
    | 'Accepted'
    | 'Wrong Answer'
    | 'Runtime Error'
    | 'Time Limit Exceeded'
    | 'Compilation Error';
  runtime?: string;
  memory?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  output?: string;
  error?: string;
  testCaseResults?: TestCaseResult[];
}

export interface TestCaseResult {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}
