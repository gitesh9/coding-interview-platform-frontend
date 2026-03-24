import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Problem, SubmissionResult, TestCaseResult } from '@core/models/problem.model';

const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.<br><br>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.<br><br>You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10<sup>4</sup>',
      '-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>',
      '-10<sup>9</sup> <= target <= 10<sup>9</sup>',
      '<strong>Only one valid answer exists.</strong>'
    ],
    starterCode: {
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
    },
    testCases: [
      { id: 1, input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { id: 2, input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { id: 3, input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' }
    ]
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.<br><br>An input string is valid if:<ol class="list-decimal list-inside mt-2 space-y-1"><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li><li>Every close bracket has a corresponding open bracket of the same type.</li></ol>`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' }
    ],
    constraints: [
      '1 <= s.length <= 10<sup>4</sup>',
      's consists of parentheses only <code>\'()[]{}\'</code>.'
    ],
    starterCode: {
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`
    },
    testCases: [
      { id: 1, input: 's = "()"', expectedOutput: 'true' },
      { id: 2, input: 's = "()[]{}"', expectedOutput: 'true' },
      { id: 3, input: 's = "(]"', expectedOutput: 'false' }
    ]
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10<sup>4</sup>',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expectedOutput: '3' },
      { id: 2, input: 's = "bbbbb"', expectedOutput: '1' },
      { id: 3, input: 's = "pwwkew"', expectedOutput: '3' }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class ProblemService {
  getProblems(): Observable<Problem[]> {
    return of(MOCK_PROBLEMS);
  }

  getProblemById(id: number): Observable<Problem> {
    const problem = MOCK_PROBLEMS.find(p => p.id === id);
    if (problem) {
      return of(problem);
    }
    return throwError(() => new Error(`Problem with id ${id} not found`));
  }

  getMockSubmissionResult(problem: Problem): SubmissionResult {
    const testCaseResults: TestCaseResult[] = problem.testCases.map(tc => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: true
    }));

    return {
      status: 'Accepted',
      runtime: '4 ms',
      memory: '42.1 MB',
      testCasesPassed: problem.testCases.length,
      totalTestCases: problem.testCases.length,
      testCaseResults
    };
  }
}
