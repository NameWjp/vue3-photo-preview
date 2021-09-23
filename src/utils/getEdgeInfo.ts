import { EdgeTypeEnum } from '../types';

/**
 * 获取图片拖拽到边缘需要的值
 */
export function getEdgeInfo({
  width,
  height,
  scale,
  rotate,
}: {
  width: number,
  height: number,
  scale: number,
  rotate: number
}): {
  edgeLeft: number,
  edgeRight: number,
  edgeTop: number,
  edgeBottom: number,
} {
  // 如果图片不是水平，则调换宽高
  const isVertical = rotate % 180 !== 0;
  if (isVertical) {
    [width, height] = [height, width];
  }

  const { innerWidth, innerHeight } = window;
  const currentWidth = width * scale;
  const currentHeight = height * scale;

  let edgeLeft, edgeRight, edgeTop, edgeBottom;

  if (currentWidth > innerWidth) {
    edgeLeft = (currentWidth - innerWidth) / 2;
    edgeRight = -(currentWidth - innerWidth) / 2;
  } else {
    edgeLeft = 0;
    edgeRight = 0;
  }

  if (currentHeight > innerHeight) {
    edgeTop = (currentHeight - innerHeight) / 2;
    edgeBottom = -(currentHeight - innerHeight) / 2;
  } else {
    edgeTop = 0;
    edgeBottom = 0;
  }

  return {
    edgeLeft,
    edgeRight,
    edgeTop,
    edgeBottom,
  };
}

/**
 * 获取边缘类型
 */
export function getEdgeTypes({
  width,
  height,
  scale,
  rotate,
  x,
  y,
}: {
  width: number,
  height: number,
  scale: number,
  rotate: number,
  x: number,
  y: number,
}): EdgeTypeEnum[] {
  const position = getEdgeInfo({ width, height, scale, rotate });
  const edgeTypes: EdgeTypeEnum[] = [];

  if (x === position.edgeLeft) {
    edgeTypes.push(EdgeTypeEnum.Left);
  }
  if (x === position.edgeRight) {
    edgeTypes.push(EdgeTypeEnum.Right);
  }
  if (y === position.edgeTop) {
    edgeTypes.push(EdgeTypeEnum.Top);
  }
  if (y === position.edgeBottom) {
    edgeTypes.push(EdgeTypeEnum.Bottom);
  }

  return edgeTypes;
}

/**
 * 获取标准值
 */
export function getStandardPosition({
  width,
  height,
  scale,
  rotate,
  x,
  y,
}: {
  width: number,
  height: number,
  scale: number,
  rotate: number,
  x: number,
  y: number,
}): {
  x: number,
  y: number,
  scale: number,
} {
  const { edgeLeft, edgeRight, edgeTop, edgeBottom } = getEdgeInfo({ width, height, scale, rotate });

  if (x > edgeLeft) {
    x = edgeLeft;
  }
  if (x < edgeRight) {
    x = edgeRight;
  }
  if (y > edgeTop) {
    y = edgeTop;
  }
  if (y < edgeBottom) {
    y = edgeBottom;
  }

  return { x, y, scale };
}
