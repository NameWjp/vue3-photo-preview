/**
 * 从 Touch 事件中获取两个触控中心的位置
 * @param e TouchEvent
 */
export default function getMultipleTouchPosition(e: TouchEvent): {
  clientX: number,
  clientY: number,
  touchLength: number
} {
  const { clientX, clientY } = e.touches[0];
  if (e.touches.length >= 2) {
    const { clientX: nextClientX, clientY: nextClientY } = e.touches[1];
    return {
      clientX: (clientX + nextClientX) / 2,
      clientY: (clientY + nextClientY) / 2,
      touchLength: Math.sqrt(Math.pow(nextClientX - clientX, 2) + Math.pow(nextClientY - clientY, 2)),
    };
  }
  return { clientX, clientY, touchLength: 0 };
}
