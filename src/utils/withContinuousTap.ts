import debounce from 'lodash-es/debounce';

export type TapFuncType<T> = (...args: T[]) => void;

export default function withContinuousTap<T>(
  singleTap: TapFuncType<T>,
  doubleTap: TapFuncType<T>
): TapFuncType<T> {
  // 当前连续点击次数
  let continuousCount = 0;

  const withSingleTap = debounce((...args) => {
    continuousCount = 0;
    singleTap(...args);
  }, 300);

  return function invokeTap(...args) {
    continuousCount += 1;
    withSingleTap(...args);
    if (continuousCount >= 2) {
      withSingleTap.cancel();
      continuousCount = 0;
      doubleTap(...args);
    }
  };
}
