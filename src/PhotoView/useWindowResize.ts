import { Ref, onBeforeUnmount } from 'vue';
import getSuitableImageSize from '../utils/getSuitableImageSize';
import throttle from 'lodash-es/throttle';

export default function useWindowResize(
  width: Ref<number>, height: Ref<number>,
  naturalWidth: Ref<number>, naturalHeight: Ref<number>
): void {
  const handleResize = throttle(() => {
    const imageSize = getSuitableImageSize(naturalWidth.value, naturalHeight.value);
    width.value = imageSize.width;
    height.value = imageSize.height;
  }, 8);

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.addEventListener('resize', handleResize);
  });
}
