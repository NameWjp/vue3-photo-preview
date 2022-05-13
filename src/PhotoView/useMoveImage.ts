import { Ref, ref } from 'vue';
import isTouchDevice from '../utils/isTouchDevice';
import throttle from 'lodash-es/throttle';
import { TouchTypeEnum, EdgeTypeEnum } from '../types';
import { minStartTouchOffset, maxScale } from '../constant';
import withContinuousTap from '../utils/withContinuousTap';
import getPositionOnMoveOrScale from '../utils/getPositionOnMoveOrScale';
import { getStandardPosition, getEdgeTypes } from '../utils/getEdgeInfo';
import getMultipleTouchPosition from '../utils/getMultipleTouchPosition';

type useMoveImageReturn = {
  x: Ref<number>;
  y: Ref<number>;
  scale: Ref<number>;
  rotate: Ref<number>;
  touched: Ref<boolean>;
  handleMouseDown: (e: MouseEvent) => void;
  handleTouchStart: (e: TouchEvent) => void;
  handleWheel: (e: WheelEvent) => void;
  handleRotateLeft: () => void;
  handleRotateRight: () => void;
}

export default function useMoveImage(
  width: Ref<number>,
  height: Ref<number>,
  naturalWidth: Ref<number>,
  naturalHeight: Ref<number>,
  setSuitableImageSize: (actualWidth: number, actualHeight: number, rotate: number) => void,
  onTouchStart: (clientX: number, clientY: number) => void,
  onTouchMove: (touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) => void,
  onTouchEnd: (touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) => void,
  onSingleTap: (clientX: number, clientY: number, e: MouseEvent | TouchEvent) => void,
): useMoveImageReturn {
  // 图片 x 偏移量
  const x = ref(0);
  // 图片 y 偏移量
  const y = ref(0);
  // 图片缩放程度
  const scale = ref(1);
  // 图片旋转角度
  const rotate = ref(0);
  // 图片是否处于触摸状态
  const touched = ref(false);
  // 触摸开始时 x 的坐标
  const clientX = ref(0);
  // 触摸开始时 y 的坐标
  const clientY = ref(0);
  // 初始触摸状态
  const touchType = ref(TouchTypeEnum.Normal);
  // 上一次图片的 x 偏移量
  const lastX = ref(0);
  // 上一次图片的 y 偏移量
  const lastY = ref(0);
  // 上一次 touch 的长度
  const lastTouchLength = ref(0);
  // 边缘状态(用于缩放图片判断)
  let edgeTypes: EdgeTypeEnum[] = [];

  const handleMouseDown = (e: MouseEvent) => {
    if (isTouchDevice) return;

    handleDown(e.clientX, e.clientY, 0);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isTouchDevice) return;

    const touch = getMultipleTouchPosition(e);
    handleDown(touch.clientX, touch.clientY, touch.touchLength);

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleDown = (newClientX: number, newClientY: number, touchLength: number) => {
    touched.value = true;
    clientX.value = newClientX;
    clientY.value = newClientY;
    lastTouchLength.value = touchLength;
    edgeTypes = getEdgeTypes({
      width: width.value,
      height: height.value,
      scale: scale.value,
      rotate: rotate.value,
      x: lastX.value,
      y: lastY.value
    });

    onTouchStart(newClientX, newClientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isTouchDevice || !touched.value) return;

    handleMove(e.clientX, e.clientY, 0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouchDevice || !touched.value) return;

    const touch = getMultipleTouchPosition(e);
    handleMove(touch.clientX, touch.clientY, touch.touchLength);
  };

  const handleMove = throttle((newClientX: number, newClientY: number, touchLength: number) => {
    // 初始化触摸状态
    if (touchType.value === TouchTypeEnum.Normal) {
      if (scale.value !== 1 || touchLength) {
        touchType.value = TouchTypeEnum.Scale;
      } else {
        const isMoveX = Math.abs(newClientX - clientX.value) > minStartTouchOffset;
        const isMoveY = Math.abs(newClientY - clientY.value) > minStartTouchOffset;

        if (!isMoveX && !isMoveY) return;

        // 水平方向优先
        touchType.value = isMoveX ? TouchTypeEnum.X : TouchTypeEnum.Y;
      }
    }

    onTouchMove(touchType.value, newClientX, newClientY, edgeTypes);

    const newX = newClientX - clientX.value;
    const newY = newClientY - clientY.value;
    if (touchType.value === TouchTypeEnum.Y) {
      x.value = newX + lastX.value;
      y.value = newY + lastY.value;
    }
    if (touchType.value === TouchTypeEnum.Scale) {
      if (touchLength) {
        const endScale = scale.value + ((touchLength - lastTouchLength.value) / 100 / 2) * scale.value;
        const toScale = Math.max(Math.min(endScale, Math.max(maxScale, naturalWidth.value / width.value)), 1);
        handleToScale(toScale, newClientX, newClientY);
        lastTouchLength.value = touchLength;
      } else {
        // 处于左边缘情况，右划交给父级处理，处于右边缘情况，左划交给父级处理
        if (
          !(newX > 0 && edgeTypes.includes(EdgeTypeEnum.Left)) &&
          !(newX < 0 && edgeTypes.includes(EdgeTypeEnum.Right))
        ) {
          x.value = newX + lastX.value;
        }
        y.value = newY + lastY.value;
      }
    }
  }, 8, { trailing: false });

  const handleMouseUp = (e: MouseEvent) => {
    if (isTouchDevice) return;

    handleUp(e.clientX, e.clientY, e);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isTouchDevice) return;

    const touch = e.changedTouches[0];
    handleUp(touch.clientX, touch.clientY, e);

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const onDoubleTap = (newClientX: number, newClientY: number) => {
    if (touchType.value !== TouchTypeEnum.Normal) return;

    if (scale.value === 1) {
      const toScale = Math.max(2, naturalWidth.value / width.value);
      const position = getPositionOnMoveOrScale({
        x: x.value,
        y: y.value,
        clientX: newClientX,
        clientY: newClientY,
        fromScale: scale.value,
        toScale,
      });

      x.value = position.x;
      y.value = position.y;
      scale.value = position.scale;
    } else {
      x.value = 0;
      y.value = 0;
      scale.value = 1;
    }
  };

  const onTap = withContinuousTap(onSingleTap, onDoubleTap);

  const handleUp = (newClientX: number, newClientY: number, e: TouchEvent | MouseEvent) => {
    if (clientX.value === newClientX && clientY.value === newClientY) {
      onTap(newClientX, newClientY, e);
    }

    onTouchEnd(touchType.value, newClientX, newClientY, edgeTypes);

    if (touchType.value === TouchTypeEnum.Y) {
      x.value = 0;
      y.value = 0;
    }

    if (touchType.value === TouchTypeEnum.Scale) {
      setStandardPosition({
        width: width.value,
        height: height.value,
        scale: scale.value,
        rotate: rotate.value,
        x: x.value,
        y: y.value
      });
    }

    touched.value = false;
    touchType.value = TouchTypeEnum.Normal;
    clientX.value = 0;
    clientY.value = 0;
    lastX.value = x.value;
    lastY.value = y.value;
  };

  const handleWheel = (e: WheelEvent) => {
    const endScale = scale.value - e.deltaY / 100 / 2;
    const toScale = Math.max(Math.min(endScale, Math.max(maxScale, naturalWidth.value / width.value)), 1);
    handleToScale(toScale, e.clientX, e.clientY);
  };

  const handleToScale = (newScale: number, newClientX: number, newClientY: number) => {
    const position = getPositionOnMoveOrScale({
      x: x.value,
      y: y.value,
      clientX: newClientX,
      clientY: newClientY,
      fromScale: scale.value,
      toScale: newScale,
    });

    setStandardPosition({
      width: width.value,
      height: height.value,
      scale: position.scale,
      rotate: rotate.value,
      x: position.x,
      y: position.y
    });
  };

  const setStandardPosition = (position: {
    width: number; height: number; scale: number; rotate: number; x: number, y: number
  }) => {
    const standardPosition = getStandardPosition(position);
    x.value = standardPosition.x;
    y.value = standardPosition.y;
    lastX.value = standardPosition.x;
    lastY.value = standardPosition.y;
    scale.value = standardPosition.scale;
  };

  const handleRotateLeft = () => {
    rotate.value = rotate.value - 90;
    setSuitableImageSize(naturalWidth.value, naturalHeight.value, rotate.value);
    setStandardPosition({
      width: width.value,
      height: height.value,
      scale: scale.value,
      rotate: rotate.value,
      x: x.value,
      y: y.value
    });
  };

  const handleRotateRight = () => {
    rotate.value = rotate.value + 90;
    setSuitableImageSize(naturalWidth.value, naturalHeight.value, rotate.value);
    setStandardPosition({
      width: width.value,
      height: height.value,
      scale: scale.value,
      rotate: rotate.value,
      x: x.value,
      y: y.value
    });
  };

  return {
    x,
    y,
    scale,
    touched,
    handleMouseDown,
    handleTouchStart,
    handleWheel,
    rotate,
    handleRotateLeft,
    handleRotateRight
  };
}
