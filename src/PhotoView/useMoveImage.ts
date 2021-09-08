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

    handleDown(e.clientX, e.clientY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isTouchDevice) return;

    const touch = e.touches[0];
    handleDown(touch.clientX, touch.clientY);

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleDown = (newClientX: number, newClientY: number) => {
    touched.value = true;
    clientX.value = newClientX;
    clientY.value = newClientY;

    onTouchStart(newClientX, newClientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isTouchDevice || !touched.value) return;

    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouchDevice || !touched.value) return;

    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleMove = throttle((newClientX: number, newClientY: number) => {
    // 初始化触摸状态
    if (touchType.value === TouchTypeEnum.Normal) {
      const isMoveX = Math.abs(newClientX - clientX.value) > minStartTouchOffset;
      const isMoveY = Math.abs(newClientY - clientY.value) > minStartTouchOffset;

      if (!isMoveX && !isMoveY) return;

      // 水平方向优先
      touchType.value = isMoveX ? TouchTypeEnum.X : TouchTypeEnum.Y;
    }

    onTouchMove(touchType.value, newClientX, newClientY);

    if (touchType.value === TouchTypeEnum.Y) {
      x.value = newClientX - clientX.value;
      y.value = newClientY - clientY.value;
    }
  }, 8, { trailing: false });

  const handleMouseUp = (e: MouseEvent) => {
    if (isTouchDevice) return;

    handleUp(e.clientX, e.clientY);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isTouchDevice) return;

    const touch = e.changedTouches[0];
    handleUp(touch.clientX, touch.clientY);

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const handleUp = (newClientX: number, newClientY: number) => {
    onTouchEnd(touchType.value, newClientX, newClientY);

    touched.value = false;
    touchType.value = TouchTypeEnum.Normal;
    clientX.value = 0;
    clientY.value = 0;
    x.value = 0;
    y.value = 0;
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
