import debounce from 'lodash-es/debounce';

export type TapFuncType = (clientX: number, clientY: number, e: TouchEvent | MouseEvent) => void;

export default function withContinuousTap(
  singleTap: TapFuncType,
  doubleTap: TapFuncType
): TapFuncType {
  // 当前连续点击次数
  let continuousCount = 0;

  const withSingleTap = debounce((...args: [number, number, TouchEvent | MouseEvent]) => {
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
