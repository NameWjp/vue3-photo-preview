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

  if (naturalWidth < innerWidth && naturalHeight < innerHeight) {
    // 如果图片原始宽度未超过容器尺寸，则使用原始尺寸
    width = naturalWidth;
    height = naturalHeight;
  } else {
    // 否则缩放图片使之恰好放入
    if (scaleWidth < scaleHeight) {
      width = innerWidth;
      height = innerWidth * (naturalHeight / naturalWidth);
    } else {
      width = innerHeight * (naturalWidth / naturalHeight);
      height = innerHeight;
    }
  }

  return {
    width,
    height
  };
}
