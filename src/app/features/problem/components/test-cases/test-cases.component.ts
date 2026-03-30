import {
  Component,
  Input,
  signal,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  HostBinding,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase, SubmissionResult } from '@core/models/problem.model';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-cases.component.html',
  styleUrl: './test-cases.component.css',
})
export class TestCasesComponent implements OnInit, OnDestroy {
  @Input({ required: true }) testCases!: TestCase[];
  @Input() submissionResult: SubmissionResult | null = null;

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  activeTab = signal<'testcase' | 'result'>('testcase');
  selectedCaseIndex = signal(0);
  isCollapsed = signal(false);

  @HostBinding('class.collapsed')
  get isCollapsedClass() {
    return this.isCollapsed();
  }

  private collapsedBarElement: HTMLElement | null = null;
  private resizeListener: (() => void) | null = null;
  private verticalGutter: HTMLElement | null = null;

  // Minimum height threshold below which component collapses (in pixels)
  private readonly COLLAPSE_THRESHOLD = 120;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit() {
    // Start in normal state - user can manually collapse if needed
    this.isCollapsed.set(false);
  }

  ngOnDestroy() {
    // Clean up collapsed bar if it exists
    this.removeCollapsedBar();
  }

  get activeTestCase(): TestCase | undefined {
    return this.testCases[this.selectedCaseIndex()];
  }

  get statusClass(): string {
    if (!this.submissionResult) return '';
    return this.submissionResult.status === 'Accepted'
      ? 'text-green-400'
      : 'text-red-400';
  }

  setTab(tab: 'testcase' | 'result'): void {
    this.activeTab.set(tab);
  }

  selectCase(index: number): void {
    this.selectedCaseIndex.set(index);
  }

  caseResultPassed(caseId: number): boolean | null {
    if (!this.submissionResult?.testCaseResults) return null;
    const result = this.submissionResult.testCaseResults.find(
      (r) => r.id === caseId,
    );
    return result ? result.passed : null;
  }

  private setupResizeObserver(): void {
    // Removed automatic collapse for now - let user control manually
    // In the future, this could be enhanced to work with angular split events
  }

  collapse(): void {
    this.isCollapsed.set(true);
    this.createCollapsedBar();
  }

  expand(): void {
    this.isCollapsed.set(false);
    this.removeCollapsedBar();
  }

  private createCollapsedBar(): void {
    // Remove existing bar if any
    this.removeCollapsedBar();

    // Find the right split area to position the collapsed bar correctly
    const rightSplitArea = this.findRightSplitArea();
    if (!rightSplitArea) return;

    // Create the collapsed bar element
    this.collapsedBarElement = this.renderer.createElement('div');

    // Add classes and styles for positioning within the right split area only
    this.renderer.addClass(this.collapsedBarElement, 'fixed');
    this.renderer.addClass(this.collapsedBarElement, 'bottom-0');
    this.renderer.addClass(this.collapsedBarElement, 'bg-[#1e1e1e]');
    this.renderer.addClass(this.collapsedBarElement, 'border-t');
    this.renderer.addClass(this.collapsedBarElement, 'border-gray-700');
    this.renderer.addClass(this.collapsedBarElement, 'shadow-lg');
    this.renderer.addClass(this.collapsedBarElement, 'cursor-pointer');
    this.renderer.setStyle(this.collapsedBarElement, 'z-index', '1001');

    // Get the bounds of the right split area
    const rect = rightSplitArea.getBoundingClientRect();
    this.renderer.setStyle(this.collapsedBarElement, 'left', `${rect.left}px`);
    this.renderer.setStyle(
      this.collapsedBarElement,
      'width',
      `${rect.width}px`,
    );

    // Hide the vertical split gutter
    this.hideVerticalGutter();

    // Create inner content
    const innerDiv = this.renderer.createElement('div');
    this.renderer.addClass(innerDiv, 'h-12');
    this.renderer.addClass(innerDiv, 'flex');
    this.renderer.addClass(innerDiv, 'items-center');
    this.renderer.addClass(innerDiv, 'justify-between');
    this.renderer.addClass(innerDiv, 'px-4');
    this.renderer.addClass(innerDiv, 'hover:bg-[#2d2d2d]');
    this.renderer.addClass(innerDiv, 'transition-colors');

    // Create content based on current state
    const content = this.getCollapsedBarContent();
    this.renderer.setProperty(innerDiv, 'innerHTML', content);

    // Add click listener
    this.renderer.listen(innerDiv, 'click', () => this.expand());

    // Append to inner div and then to main element
    this.renderer.appendChild(this.collapsedBarElement, innerDiv);

    // Append to document body
    this.renderer.appendChild(document.body, this.collapsedBarElement);

    // Update position on window resize
    this.setupResizeListener();
  }

  private removeCollapsedBar(): void {
    if (this.collapsedBarElement) {
      this.renderer.removeChild(document.body, this.collapsedBarElement);
      this.collapsedBarElement = null;
    }

    // Show the vertical gutter again
    this.showVerticalGutter();

    // Remove resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  private getCollapsedBarContent(): string {
    const activeTabText =
      this.activeTab() === 'testcase' ? 'Test Cases' : 'Test Results';
    const statusDot = this.submissionResult
      ? `<span class="w-2 h-2 rounded-full inline-block ${this.submissionResult.status === 'Accepted' ? 'bg-green-400' : 'bg-red-400'}"></span>`
      : '';

    let rightContent = '';
    if (this.submissionResult && this.activeTab() === 'result') {
      rightContent = `<div class="text-xs text-gray-500">${this.submissionResult.testCasesPassed || 0} / ${this.submissionResult.totalTestCases || 0} passed</div>`;
    } else if (this.activeTab() === 'testcase') {
      rightContent = `<div class="text-xs text-gray-500">${this.testCases.length || 0} test cases</div>`;
    }

    return `
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-300">${activeTabText}</span>
          ${statusDot}
        </div>
        ${rightContent}
      </div>
      <button class="p-1.5 rounded hover:bg-[#3d3d3d] text-gray-400 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    `;
  }

  toggleCollapse(): void {
    if (this.isCollapsed()) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Allow Escape key to collapse and Enter key to expand when collapsed
    if (event.key === 'Escape' && !this.isCollapsed()) {
      this.collapse();
    } else if (event.key === 'Enter' && this.isCollapsed()) {
      this.expand();
    }
  }

  private findRightSplitArea(): HTMLElement | null {
    // Find the right-side split area that contains this component
    const hostElement = this.elementRef.nativeElement;
    let current = hostElement.parentElement;

    while (current) {
      if (current.classList.contains('as-split-area')) {
        // Check if this is the right split area by looking at its parent
        const parentSplit = current.parentElement;
        if (parentSplit && parentSplit.classList.contains('vertical-split')) {
          return current;
        }
      }
      current = current.parentElement;
    }

    return null;
  }

  private hideVerticalGutter(): void {
    // Find the vertical split gutter
    const rightSplitArea = this.findRightSplitArea();
    if (!rightSplitArea) return;

    const verticalSplit = rightSplitArea.parentElement;
    if (!verticalSplit) return;

    this.verticalGutter = verticalSplit.querySelector(
      '.as-split-gutter',
    ) as HTMLElement;
    if (this.verticalGutter) {
      this.renderer.setStyle(this.verticalGutter, 'display', 'none');
    }

    // Find both split areas
    const splitAreas = verticalSplit.querySelectorAll('as-split-area');

    if (splitAreas.length >= 2) {
      const codeEditorArea = splitAreas[0] as HTMLElement;
      const testCasesArea = splitAreas[1] as HTMLElement;

      // Make code editor take full available space
      this.renderer.setStyle(codeEditorArea, 'flex', '1 1 100%');
      this.renderer.setStyle(codeEditorArea, 'height', '100%');
      this.renderer.setStyle(codeEditorArea, 'max-height', 'none');
      this.renderer.setStyle(codeEditorArea, 'min-height', '0');

      // Completely collapse test cases area
      this.renderer.setStyle(testCasesArea, 'flex', '0 0 0px');
      this.renderer.setStyle(testCasesArea, 'height', '0px');
      this.renderer.setStyle(testCasesArea, 'min-height', '0px');
      this.renderer.setStyle(testCasesArea, 'max-height', '0px');
      this.renderer.setStyle(testCasesArea, 'overflow', 'hidden');
      this.renderer.setStyle(testCasesArea, 'visibility', 'hidden');
    }

    // Force the vertical split to recalculate layout
    this.renderer.setStyle(verticalSplit, 'display', 'flex');
    this.renderer.setStyle(verticalSplit, 'flex-direction', 'column');
    this.renderer.setStyle(verticalSplit, 'height', '100%');
  }

  private showVerticalGutter(): void {
    if (this.verticalGutter) {
      this.renderer.removeStyle(this.verticalGutter, 'display');
      this.verticalGutter = null;
    }

    // Reset both split areas to their original state
    const rightSplitArea = this.findRightSplitArea();
    if (!rightSplitArea) return;

    const verticalSplit = rightSplitArea.parentElement;
    if (!verticalSplit) return;

    const splitAreas = verticalSplit.querySelectorAll('as-split-area');

    if (splitAreas.length >= 2) {
      const codeEditorArea = splitAreas[0] as HTMLElement;
      const testCasesArea = splitAreas[1] as HTMLElement;

      // Reset code editor area
      this.renderer.removeStyle(codeEditorArea, 'flex');
      this.renderer.removeStyle(codeEditorArea, 'height');
      this.renderer.removeStyle(codeEditorArea, 'max-height');
      this.renderer.removeStyle(codeEditorArea, 'min-height');

      // Reset test cases area
      this.renderer.removeStyle(testCasesArea, 'flex');
      this.renderer.removeStyle(testCasesArea, 'height');
      this.renderer.removeStyle(testCasesArea, 'min-height');
      this.renderer.removeStyle(testCasesArea, 'max-height');
      this.renderer.removeStyle(testCasesArea, 'overflow');
      this.renderer.removeStyle(testCasesArea, 'visibility');
    }

    // Reset vertical split styles
    this.renderer.removeStyle(verticalSplit, 'display');
    this.renderer.removeStyle(verticalSplit, 'flex-direction');
    this.renderer.removeStyle(verticalSplit, 'height');
  }

  private setupResizeListener(): void {
    this.resizeListener = () => {
      if (this.collapsedBarElement && this.isCollapsed()) {
        const rightSplitArea = this.findRightSplitArea();
        if (rightSplitArea) {
          const rect = rightSplitArea.getBoundingClientRect();
          this.renderer.setStyle(
            this.collapsedBarElement,
            'left',
            `${rect.left}px`,
          );
          this.renderer.setStyle(
            this.collapsedBarElement,
            'width',
            `${rect.width}px`,
          );
        }
      }
    };

    window.addEventListener('resize', this.resizeListener);
  }
}
