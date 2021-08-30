export default function getSuitableImageSize(
  naturalWidth: number,
  naturalHeight: number,
): {
  width: number;
  height: number;
} {
  let width;
  let height;
  const { innerWidth, innerHeight } = window;
  // 缩放到和窗口一样所需要的比例
  const scaleWidth = innerWidth / naturalWidth;
  const scaleHeight = innerHeight / naturalHeight;

  if (scaleWidth < scaleHeight) {
    width = innerWidth;
    height = innerWidth * (naturalHeight / naturalWidth);
  } else {
    width = innerHeight * (naturalWidth / naturalHeight);
    height = innerHeight;
  }

  return {
    width,
    height
  };
}
