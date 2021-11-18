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
        :style="{
          transform: getTransform(),
          transition: touched ? undefined : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }"
        @mousedown.prevent="handleMouseDown"
        @touchstart.prevent="handleTouchStart"
        @wheel="handleWheel"
      >
    </div>
  </div>
  <spinner v-else />
</template>

<script lang='ts'>
import { defineComponent, PropType, toRefs } from 'vue';
import Spinner from './Spinner.vue';
import useLoadImage from './useLoadImage';
import useWindowResize from './useWindowResize';
import { OriginRectType, ShowAnimateEnum, TouchTypeEnum, EdgeTypeEnum } from '../types';
import getAnimateOrigin from '../utils/getAnimateOrigin';
import useMoveImage from './useMoveImage';

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
  emits: ['touchStart', 'touchMove', 'touchEnd', 'singleTap'],
  setup(props, { emit }) {
    const { src } = toRefs(props);
    const { width, height, loaded, naturalWidth, naturalHeight, setSuitableImageSize } = useLoadImage(src);

    const onTouchStart = (clientX: number, clientY: number) => {
      emit('touchStart', clientX, clientY);
    };
    const onTouchMove = (touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) => {
      emit('touchMove', touchType, clientX, clientY, edgeTypes);
    };
    const onTouchEnd = (touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) => {
      emit('touchEnd', touchType, clientX, clientY, edgeTypes);
    };
    const onSingleTap = (clientX: number, clientY: number) => {
      emit('singleTap', clientX, clientY);
    };

    const {
      x, y, scale, rotate, touched,
      handleMouseDown, handleTouchStart, handleWheel, handleRotateLeft, handleRotateRight
    } = useMoveImage(
      width, height, naturalWidth, naturalHeight,
      setSuitableImageSize, onTouchStart, onTouchMove, onTouchEnd, onSingleTap,
    );

    useWindowResize(naturalWidth, naturalHeight, rotate, setSuitableImageSize);

    return {
      width,
      height,
      loaded,
      x,
      y,
      scale,
      touched,
      handleMouseDown,
      handleTouchStart,
      handleWheel,
      rotate,
      handleRotateLeft,
      handleRotateRight
    };
  },
  data() {
    return {
      ShowAnimateEnum,
      // 翻转
      isFlipHorizontal: false,
      isFlipVertical: false,
    };
  },
  methods: {
    getAnimateOrigin,
    toggleFlipHorizontal() {
      this.isFlipHorizontal = !this.isFlipHorizontal;
    },
    toggleFlipVertical() {
      this.isFlipVertical = !this.isFlipVertical;
    },
    getTransform() {
      const transform: Record<string, string> = {
        translate3d: `${this.x}px, ${this.y}px, 0`,
        scaleX: `${this.isFlipHorizontal ? '-' : ''}${this.scale}`,
        scaleY: `${this.isFlipVertical ? '-' : ''}${this.scale}`
      };
      if (this.rotate) {
        transform.rotate = `${this.rotate}deg`;
      }

      let str = '';
      Object.keys(transform).forEach(name => {
        str += `${name}(${transform[name]})`;
      });

      return str;
    }
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

    .PhotoView__Photo {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>
