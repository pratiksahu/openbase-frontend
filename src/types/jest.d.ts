import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveAccessibleName(): R;
      toBeVisible(): R;
      toBeEnabled(): R;
      toHaveFocus(): R;
      toHaveValue(value?: string | number): R;
      toHaveDisplayValue(value: string | string[]): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveTextContent(text?: string | RegExp): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toBeEmptyDOMElement(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
    }
  }

  // Extend Vi's expect interface as well for compatibility
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): T;
      toBeDisabled(): T;
      toHaveClass(className: string): T;
      toHaveAttribute(attr: string, value?: string): T;
      toHaveAccessibleName(): T;
      toBeVisible(): T;
      toBeEnabled(): T;
      toHaveFocus(): T;
      toHaveValue(value?: string | number): T;
      toHaveDisplayValue(value: string | string[]): T;
      toBeChecked(): T;
      toBePartiallyChecked(): T;
      toHaveDescription(text?: string | RegExp): T;
      toHaveTextContent(text?: string | RegExp): T;
      toContainElement(element: HTMLElement | null): T;
      toContainHTML(htmlText: string): T;
      toHaveStyle(css: string | Record<string, any>): T;
      toBeEmptyDOMElement(): T;
      toBeInvalid(): T;
      toBeRequired(): T;
      toBeValid(): T;
      toHaveFormValues(expectedValues: Record<string, any>): T;
    }
  }
}

export {};
