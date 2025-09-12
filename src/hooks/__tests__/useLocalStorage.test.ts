import { renderHook, act } from '@testing-library/react';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockLocalStorage } from '@/test-utils/mocks';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage(),
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when key exists', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.getItem('test-key')).toBe(
      JSON.stringify('new-value')
    );
  });

  it('supports function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 1));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('removes value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('stored-value');
    });

    expect(window.localStorage.getItem('test-key')).toBe(
      JSON.stringify('stored-value')
    );

    act(() => {
      result.current[2](); // removeValue function
    });

    expect(result.current[0]).toBe('initial');
    expect(window.localStorage.getItem('test-key')).toBeNull();
  });

  it('handles JSON parsing errors gracefully', () => {
    window.localStorage.setItem('test-key', 'invalid-json');

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading localStorage'),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('handles objects and arrays', () => {
    const testObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('test-object', testObject));

    expect(result.current[0]).toEqual(testObject);

    const newObject = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(window.localStorage.getItem('test-object') || '{}')).toEqual(newObject);
  });
});