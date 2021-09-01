import { Ref, watch } from 'vue';

export default function useBodyEffect(visible: Ref<boolean>): void {
  const { style } = document.body;
  const originalOverflow = style.overflow;

  watch(visible, () => {
    if (visible.value) {
      style.overflow = 'hidden';
    } else {
      style.overflow = originalOverflow;
    }
  });
}
