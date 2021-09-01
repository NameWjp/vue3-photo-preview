<template>
  <div
    v-if="loaded"
    class="PhotoView__PhotoWrap"
    :style="{
      width: `${width}px`,
      height: `${height}px`
    }"
  >
    <div
      class="PhotoView__PhotoBox"
      :class="{
        'PhotoView__animateIn': showAnimateType === ShowAnimateEnum.In,
        'PhotoView__animateOut': showAnimateType === ShowAnimateEnum.Out,
      }"
      :style="{
        transformOrigin: getAnimateOrigin(originRect)
      }"
    >
      <img
        class="PhotoView__Photo"
        :width="width"
        :height="height"
        :src="src"
      >
    </div>
  </div>
  <spinner v-else />
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import Spinner from './Spinner.vue';
import useLoadImage from './useLoadImage';
import useWindowResize from './useWindowResize';
import { OriginRectType, ShowAnimateEnum } from '../types';
import getAnimateOrigin from '../utils/getAnimateOrigin';

export default defineComponent({
  name: 'PhotoView',
  components: {
    Spinner
  },
  props: {
    /**
     * 图片地址
     */
    src: {
      type: String,
      required: true,
    },
    /**
     * 触发打开模态框的位置信息
     */
    originRect: {
      type: Object as PropType<OriginRectType>,
      default: null,
    },
    /**
     * 动画类型
     */
    showAnimateType: {
      type: Number as PropType<ShowAnimateEnum>,
      default: null,
    }
  },
  setup(props) {
    const { width, height, loaded, naturalWidth, naturalHeight } = useLoadImage(props.src);
    useWindowResize(width, height, naturalWidth, naturalHeight);

    return {
      width,
      height,
      loaded
    };
  },
  data() {
    return {
      ShowAnimateEnum
    };
  },
  methods: {
    getAnimateOrigin,
  }
});
</script>

<style lang="scss">
@keyframes PhotoView__animateIn {
  from {
    opacity: 0.4;
    transform: scale(0.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes PhotoView__animateOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.2);
  }
}

.PhotoView__PhotoWrap {
  display: flex;
  justify-content: center;
  align-items: center;

  .PhotoView__PhotoBox {
    width: 0;
    height: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.PhotoView__animateIn {
      opacity: 0.4;
      animation: PhotoView__animateIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) both;
    }

    &.PhotoView__animateOut {
      opacity: 1;
      animation: PhotoView__animateOut 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) both;
    }
  }
}
</style>