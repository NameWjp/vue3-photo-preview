/**
 * 获取移动或缩放之后的中心点
 */
export default function getPositionOnMoveOrScale({
  x,
  y,
  clientX,
  clientY,
  fromScale,
  toScale
}: {
  x: number,
  y: number,
  clientX: number,
  clientY: number,
  fromScale: number,
  toScale: number
}): {
  x: number,
  y: number,
  scale: number,
} {
  const { innerWidth, innerHeight } = window;
  // 缩放前的图片的中心坐标
  const imageCenterClientX = innerWidth / 2 + x;
  const imageCenterClientY = innerHeight / 2 + y;
  // 放大偏移量
  const offsetScale = toScale / fromScale;
  // 缩放后的偏移量(为保证点击的点相对于视图位置不变，需要将缩放多出来的尺寸通过 translate 平衡掉)
  const originX = -(clientX - imageCenterClientX) * (offsetScale - 1);
  const originY = -(clientY - imageCenterClientY) * (offsetScale - 1);

  return {
    x: originX + x,
    y: originY + y,
    scale: toScale,
  };
}
