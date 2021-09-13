import { EdgeTypeEnum } from '../types';

/**
 * 获取图片拖拽到边缘需要的值
 */
export function getEdgeInfo({
  width,
  height,
  scale,
}: {
  width: number,
  height: number,
  scale: number
}): {
  edgeLeft: number,
  edgeRight: number,
  edgeTop: number,
  edgeBottom: number,
} {
  const currentWidth = width * scale;
  const currentHeight = height * scale;
  const { innerWidth, innerHeight } = window;
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
  x,
  y,
}: {
  width: number,
  height: number,
  scale: number,
  x: number,
  y: number,
}): EdgeTypeEnum[] {
  const position = getEdgeInfo({ width, height, scale });
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
  x,
  y,
}: {
  width: number,
  height: number,
  scale: number,
  x: number,
  y: number,
}): {
  x: number,
  y: number,
  scale: number,
} {
  const { edgeLeft, edgeRight, edgeTop, edgeBottom } = getEdgeInfo({ width, height, scale });

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
