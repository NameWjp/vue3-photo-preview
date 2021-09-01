import { ref, Ref } from 'vue';
import getSuitableImageSize from '../utils/getSuitableImageSize';

export default function useLoadImage(src: string): {
  width: Ref<number>;
  height: Ref<number>;
  loaded: Ref<boolean>;
  naturalWidth: Ref<number>;
  naturalHeight: Ref<number>;
} {
  const naturalWidth = ref(0);
  const naturalHeight = ref(0);
  const width = ref(0);
  const height = ref(0);
  const loaded = ref(false);

  const img = new Image();

  img.onload = () => {
    naturalWidth.value = img.naturalWidth;
    naturalHeight.value = img.naturalHeight;
    const imageSize = getSuitableImageSize(naturalWidth.value, naturalHeight.value);
    width.value = imageSize.width;
    height.value = imageSize.height;
    loaded.value = true;
  };

  img.src = src;

  return {
    width,
    height,
    loaded,
    naturalWidth,
    naturalHeight
  };
}
