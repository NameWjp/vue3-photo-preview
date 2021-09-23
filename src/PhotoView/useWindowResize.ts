import { Ref, onBeforeUnmount } from 'vue';
import throttle from 'lodash-es/throttle';

export default function useWindowResize(
  naturalWidth: Ref<number>, naturalHeight: Ref<number>, rotate: Ref<number>,
  setSuitableImageSize: (actualWidth: number, actualHeight: number, rotate: number) => void,
): void {

  const handleResize = throttle(() => {
    setSuitableImageSize(naturalWidth.value, naturalHeight.value, rotate.value);
  }, 8);

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.addEventListener('resize', handleResize);
  });
}
