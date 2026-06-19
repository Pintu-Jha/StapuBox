import { renderHook, act } from '@testing-library/react-hooks';
import { useOtpTimer } from '../src/hooks/useOtpTimer';

jest.useFakeTimers();

describe('useOtpTimer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('starts with the given initial seconds', () => {
    const { result } = renderHook(() => useOtpTimer({ initialSeconds: 30 }));
    expect(result.current.count).toBe(30);
    expect(result.current.isFinished).toBe(false);
  });

  it('defaults to 60 seconds', () => {
    const { result } = renderHook(() => useOtpTimer());
    expect(result.current.count).toBe(60);
  });

  it('decrements count every second', () => {
    const { result } = renderHook(() => useOtpTimer({ initialSeconds: 5 }));

    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.count).toBe(4);

    act(() => { jest.advanceTimersByTime(1000); });
    expect(result.current.count).toBe(3);
  });

  it('sets isFinished to true when countdown reaches 0', () => {
    const { result } = renderHook(() => useOtpTimer({ initialSeconds: 3 }));

    act(() => { jest.advanceTimersByTime(3000); });

    expect(result.current.count).toBe(0);
    expect(result.current.isFinished).toBe(true);
  });

  it('calls onFinish callback when timer ends', () => {
    const onFinish = jest.fn();
    renderHook(() => useOtpTimer({ initialSeconds: 2, onFinish }));

    act(() => { jest.advanceTimersByTime(2000); });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('resets the timer correctly', () => {
    const { result } = renderHook(() => useOtpTimer({ initialSeconds: 5 }));

    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current.count).toBe(2);

    act(() => { result.current.reset(); });
    expect(result.current.count).toBe(5);
    expect(result.current.isFinished).toBe(false);
  });

  it('does not go below 0', () => {
    const { result } = renderHook(() => useOtpTimer({ initialSeconds: 2 }));

    act(() => { jest.advanceTimersByTime(5000); });
    expect(result.current.count).toBe(0);
  });
});
