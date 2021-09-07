import { Ref, ref } from 'vue';
import isTouchDevice from '../utils/isTouchDevice';
import throttle from 'lodash-es/throttle';
import { TouchTypeEnum } from '../types';
import { minStartTouchOffset } from '../constant';

type useMoveImageReturn = {
  x: Ref<number>;
  y: Ref<number>;
  scale: Ref<number>;
  touched: Ref<boolean>;
  handleMouseDown: (e: MouseEvent) => void;
  handleTouchStart: (e: TouchEvent) => void;
}

export default function useMoveImage(
  onTouchStart: (clientX: number, clientY: number) => void,
  onTouchMove: (touchType: TouchTypeEnum, clientX: number, clientY: number) => void,
  onTouchEnd: (touchType: TouchTypeEnum, clientX: number, clientY: number) => void
): useMoveImageReturn {
  // 图片 x 偏移量
  const x = ref(0);
  // 图片 y 偏移量
  const y = ref(0);
  // 图片缩放程度
  const scale = ref(1);
  // 图片是否处于触摸状态
  const touched = ref(false);
  // 触摸开始时 x 的坐标
  const clientX = ref(0);
  // 触摸开始时 y 的坐标
  const clientY = ref(0);
  // 初始触摸状态
  const touchType = ref(TouchTypeEnum.Normal);

  const handleMouseDown = (e: MouseEvent) => {
    if (isTouchDevice) return;

    touched.value = true;
    clientX.value = e.clientX;
    clientY.value = e.clientY;

    onTouchStart(e.clientX, e.clientY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = throttle((e: MouseEvent) => {
    if (isTouchDevice || !touched.value) return;

    // 初始化触摸状态
    if (touchType.value === TouchTypeEnum.Normal) {
      const isMoveX = Math.abs(e.clientX - clientX.value) > minStartTouchOffset;
      const isMoveY = Math.abs(e.clientY - clientY.value) > minStartTouchOffset;
      if (!isMoveX && !isMoveY) {
        // 缓慢移动重置触摸初始坐标
        clientX.value = e.clientX;
        clientY.value = e.clientY;
        return;
      }

      // 水平方向优先
      touchType.value = isMoveX ? TouchTypeEnum.X : TouchTypeEnum.Y;
    }

    onTouchMove(touchType.value, e.clientX, e.clientY);

    if (touchType.value === TouchTypeEnum.Y) {
      x.value = e.clientX - clientX.value;
      y.value = e.clientY - clientY.value;
    }
  }, 8, { trailing: false });

  const handleMouseUp = (e: MouseEvent) => {
    if (isTouchDevice) return;

    onTouchEnd(touchType.value, e.clientX, e.clientY);

    touched.value = false;
    touchType.value = TouchTypeEnum.Normal;
    clientX.value = 0;
    clientY.value = 0;
    x.value = 0;
    y.value = 0;

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isTouchDevice) return;

    console.log('touch事件执行');
    console.log(e);
  };

  return {
    x,
    y,
    scale,
    touched,
    handleMouseDown,
    handleTouchStart
  };
}
