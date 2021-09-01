import { Ref, ref, watch } from 'vue';
import { ItemType, ShowAnimateEnum, OriginRectType } from '../types';

type useAnimationHandleReturn = {
  photoVisible: Ref<boolean>;
  showAnimateType: Ref<ShowAnimateEnum>;
  originRect: Ref<OriginRectType>;
  onShowAnimateEnd: () => void;
}

export default function useAnimationHandle(visible: Ref<boolean>, currentItem: Ref<ItemType>): useAnimationHandleReturn {
  const photoVisible = ref(visible.value);
  const showAnimateType = ref<ShowAnimateEnum>(ShowAnimateEnum.None);
  const originRect = ref<OriginRectType>(null);

  watch(visible, () => {
    const originRef = currentItem.value.originRef;

    if (visible.value) {
      // 点击打开按钮时收集位置信息，用于过渡动画
      if (originRef && originRef.nodeType === 1) {
        const { top, left, width, height } = originRef.getBoundingClientRect();
        originRect.value = {
          left, top, width, height
        };
      }
      // 设置动画类型
      showAnimateType.value = ShowAnimateEnum.In;
      // 显示图片
      photoVisible.value = true;
    } else {
      // 点击关闭按钮时，如果不存在打开的按钮，则将位置信息置空
      if (originRect.value && !originRef) {
        originRect.value = null;
      }
      // 设置动画类型
      showAnimateType.value = ShowAnimateEnum.Out;
    }
  });

  // 动画结束的回调
  const onShowAnimateEnd = () => {
    // 动画完成才关闭弹窗
    if (showAnimateType.value === ShowAnimateEnum.Out) {
      photoVisible.value = false;
    }
    showAnimateType.value = ShowAnimateEnum.None;
  };

  return {
    photoVisible,
    showAnimateType,
    originRect,
    onShowAnimateEnd
  };
}
