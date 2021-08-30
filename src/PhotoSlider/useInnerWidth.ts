import { ref, Ref, onBeforeUnmount } from 'vue';
import throttle from 'lodash-es/throttle';

export default function useInnerWidth(): { innerWidth: Ref<number> } {
  const innerWidth = ref(window.innerWidth);

  const handleResize = throttle(() => {
    innerWidth.value = window.innerWidth;
  }, 8);

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    innerWidth
  };
}
