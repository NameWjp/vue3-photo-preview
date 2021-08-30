import { onBeforeUnmount } from 'vue';

export default function useBodyEffect(): void {
  const { style } = document.body;
  const originalOverflow = style.overflow;
  style.overflow = 'hidden';

  onBeforeUnmount(() => {
    style.overflow = originalOverflow;
  });
}
