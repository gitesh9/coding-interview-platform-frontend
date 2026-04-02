import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  Problem,
  SubmissionResult,
  TestCaseResult,
} from '@core/models/problem.model';

const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    isSolved: true,
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.<br><br>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.<br><br>You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10<sup>4</sup>',
      '-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>',
      '-10<sup>9</sup> <= target <= 10<sup>9</sup>',
      '<strong>Only one valid answer exists.</strong>',
    ],
    starterCode: {
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
      },
      { id: 2, input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { id: 3, input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' },
    ],
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    isSolved: false,
    description: `Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.<br><br>An input string is valid if:<ol class="list-decimal list-inside mt-2 space-y-1"><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li><li>Every close bracket has a corresponding open bracket of the same type.</li></ol>`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' },
    ],
    constraints: [
      '1 <= s.length <= 10<sup>4</sup>',
      "s consists of parentheses only <code>'()[]{}'</code>.",
    ],
    starterCode: {
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
    },
    testCases: [
      { id: 1, input: 's = "()"', expectedOutput: 'true' },
      { id: 2, input: 's = "()[]{}"', expectedOutput: 'true' },
      { id: 3, input: 's = "(]"', expectedOutput: 'false' },
    ],
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    isSolved: true,
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation:
          'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10<sup>4</sup>',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expectedOutput: '3' },
      { id: 2, input: 's = "bbbbb"', expectedOutput: '1' },
      { id: 3, input: 's = "pwwkew"', expectedOutput: '3' },
    ],
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    isSolved: false,
    description: `Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
    ],
    constraints: ['nums1.length == m', 'nums2.length == n'],
    starterCode: {
      python: `class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        pass`,
      javascript: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};`,
    },
    testCases: [
      { id: 1, input: 'nums1 = [1,3], nums2 = [2]', expectedOutput: '2.00000' },
    ],
  },
  {
    id: 5,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    isSolved: false,
    description: `You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.<br><br>Find two lines that together with the x-axis form a container, such that the container contains the most water.<br><br>Return <em>the maximum amount of water a container can store</em>.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation:
          'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.',
      },
    ],
    constraints: ['n == height.length', '2 <= n <= 10<sup>5</sup>'],
    starterCode: {
      python: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass`,
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nvar maxArea = function(height) {\n    \n};`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};`,
    },
    testCases: [
      { id: 1, input: 'height = [1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ProblemService {
  getProblems(): Observable<Problem[]> {
    return of(MOCK_PROBLEMS);
  }

  getProblemById(id: number): Observable<Problem> {
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (problem) {
      return of(problem);
    }
    return throwError(() => new Error(`Problem with id ${id} not found`));
  }

  getMockSubmissionResult(problem: Problem): SubmissionResult {
    const testCaseResults: TestCaseResult[] = problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: true,
    }));

    return {
      status: 'Accepted',
      runtime: '4 ms',
      memory: '42.1 MB',
      testCasesPassed: problem.testCases.length,
      totalTestCases: problem.testCases.length,
      testCaseResults,
    };
  }
}
