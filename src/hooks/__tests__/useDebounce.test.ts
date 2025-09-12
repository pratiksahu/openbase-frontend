import { renderHook, act } from '@testing-library/react';

import { useDebounce } from '@/hooks/useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));

    expect(result.current).toBe('test');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // First change
    rerender({ value: 'change1', delay: 500 });
    
    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Second change before first debounce completes
    rerender({ value: 'change2', delay: 500 });

    // Advance remaining time from first change
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should still be initial value
    expect(result.current).toBe('initial');

    // Advance full delay from second change
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should now be second change value
    expect(result.current).toBe('change2');
  });

  it('handles delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value and delay
    rerender({ value: 'updated', delay: 1000 });

    // Advance time with old delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should not change yet
    expect(result.current).toBe('initial');

    // Advance remaining time with new delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('works with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: { name: 'John' }, delay: 500 },
      }
    );

    expect(result.current).toEqual({ name: 'John' });

    rerender({ value: { name: 'Jane' }, delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toEqual({ name: 'Jane' });
  });
});