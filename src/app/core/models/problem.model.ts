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
