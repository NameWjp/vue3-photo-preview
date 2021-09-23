<template>
  <teleport to="body">
    <div
      v-if="photoVisible"
      class="PhotoSlider__Wrapper"
      :class="{
        'PhotoSlider__Clean': showAnimateType !== ShowAnimateEnum.None ,
        'PhotoSlider__Hide': !overlayVisible,
      }"
    >
      <div
        class="PhotoSlider__Backdrop"
        :class="{
          'PhotoSlider__fadeIn': showAnimateType === ShowAnimateEnum.In,
          'PhotoSlider__fadeOut': showAnimateType === ShowAnimateEnum.Out
        }"
        :style="{
          background: `rgba(0, 0, 0, ${backdropOpacity})`,
        }"
        @animationend="onShowAnimateEnd(), resetBackdropOpacity()"
      />
      <div class="PhotoSlider__BannerWrap">
        <div class="PhotoSlider__Counter">
          {{ index + 1 }} / {{ items.length }}
        </div>
        <div class="PhotoSlider__BannerRight">
          <rotate-left
            class="PhotoSlider__BannerIcon"
            @click="handleRotateLeft"
          />
          <rotate-right
            class="PhotoSlider__BannerIcon"
            @click="handleRotateRight"
          />
          <flip-horizontal
            class="PhotoSlider__BannerIcon"
            @click="toggleFlipHorizontal"
          />
          <filp-vertical
            class="PhotoSlider__BannerIcon"
            @click="toggleFlipVertical"
          />
          <close
            class="PhotoSlider__BannerIcon"
            @click="handleClickClose"
          />
        </div>
      </div>
      <div
        v-for="item in items"
        :key="item.key"
        class="PhotoSlider__PhotoBox"
        :style="{
          left: `${(innerWidth + horizontalOffset) * getItemIndex(item)}px`,
          transition: getTransition(),
          transform: `translate3d(${-(innerWidth + horizontalOffset) * index + touchMoveX}px, 0px, 0px)`
        }"
        @transitionend="resetNeedTransition"
        @click="handleClickMask"
      >
        <photo-view
          :ref="setPhotoViewRef"
          :origin-rect="originRect"
          :show-animate-type="showAnimateType"
          :src="item.src"
          @click.stop="handleClickPhoto"
          @touchStart="handleTouchStart"
          @touchMove="handleTouchMove"
          @touchEnd="handleTouchEnd"
          @singleTap="handleSingleTap"
        />
      </div>
      <template v-if="!isTouchDevice">
        <div
          v-if="index > 0"
          class="PhotoSlider__ArrowLeft"
          @click="handlePrevious"
        >
          <arrow-left />
        </div>
        <div
          v-if="index < items.length - 1"
          class="PhotoSlider__ArrowRight"
          @click="handleNext"
        >
          <arrow-right />
        </div>
      </template>
      <div
        v-if="currentItem.intro"
        class="PhotoSlider__FooterWrap"
      >
        {{ currentItem.intro }}
      </div>
    </div>
  </teleport>
</template>

<script lang='ts'>
import { defineComponent, computed, toRefs, PropType } from 'vue';
import PhotoView from '../PhotoView/index.vue';
import { horizontalOffset, minSwitchImageOffset, defaultBackdropOpacity } from '../constant';
import useBodyEffect from './useBodyEffect';
import useInnerWidth from './useInnerWidth';
import Close from './Close.vue';
import ArrowLeft from './ArrowLeft.vue';
import ArrowRight from './ArrowRight.vue';
import RotateLeft from './RotateLeft.vue';
import RotateRight from './RotateRight.vue';
import FlipHorizontal from './FlipHorizontal.vue';
import FilpVertical from './FilpVertical.vue';
import useAnimationHandle from './useAnimationHandle';
import { ItemType, ShowAnimateEnum, TouchTypeEnum, EdgeTypeEnum } from '../types';
import isTouchDevice from '../utils/isTouchDevice';

export default defineComponent({
  name: 'PhotoSlider',
  components: {
    PhotoView,
    Close,
    ArrowLeft,
    ArrowRight,
    RotateLeft,
    RotateRight,
    FlipHorizontal,
    FilpVertical,
  },
  props: {
    /**
     * 图片列表
     */
    items: {
      type: Array as PropType<ItemType[]>,
      required: true,
    },
    /**
     * 图片当前索引
     */
    index: {
      type: Number,
      required: true,
    },
    /**
     * 是否显示
     */
    visible: {
      type: Boolean,
      required: true,
    },
    /**
     * 箭头切换是否需要过渡
     */
    shouldTransition: {
      type: Boolean,
      default: true,
    },
    /**
     * 图片点击是否关闭
     */
    photoClosable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clickPhoto', 'clickMask', 'changeIndex', 'closeModal'],
  setup(props) {
    const { items, index, visible } = toRefs(props);
    const currentItem = computed<ItemType>(() => {
      return items.value[index.value] || {};
    });

    useBodyEffect(visible);
    const {
      photoVisible, showAnimateType, originRect, onShowAnimateEnd
    } = useAnimationHandle(visible, currentItem);
    const { innerWidth } = useInnerWidth();

    return {
      innerWidth,
      currentItem,
      photoVisible,
      showAnimateType,
      originRect,
      onShowAnimateEnd,
    };
  },
  data() {
    return {
      // 常量
      horizontalOffset,
      ShowAnimateEnum,
      isTouchDevice,
      // 触摸相关
      touched: false,
      hasMove: false,
      needTransition: false,
      clientX: 0,
      clientY: 0,
      touchMoveX: 0,
      backdropOpacity: defaultBackdropOpacity,
      // 是否显示覆盖物
      overlayVisible: true,
      // photo-view 子组件
      photoViewRefs: [] as InstanceType<typeof PhotoView>[],
    };
  },
  created() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  beforeUpdate() {
    this.photoViewRefs = [];
  },
  methods: {
    toggleFlipHorizontal() {
      this.photoViewRefs[this.index].toggleFlipHorizontal();
    },
    toggleFlipVertical() {
      this.photoViewRefs[this.index].toggleFlipVertical();
    },
    handleRotateLeft() {
      this.photoViewRefs[this.index].handleRotateLeft();
    },
    handleRotateRight() {
      this.photoViewRefs[this.index].handleRotateRight();
    },
    setPhotoViewRef(ref: InstanceType<typeof PhotoView>) {
      this.photoViewRefs.push(ref);
    },
    handleKeyDown(e: KeyboardEvent) {
      if (this.visible) {
        switch (e.code) {
          case 'ArrowLeft':
            this.handlePrevious();
            break;
          case 'ArrowRight':
            this.handleNext();
            break;
          case 'Escape':
            this.handleClickClose();
            break;
        }
      }
    },
    handleSingleTap() {
      // 图片点击不关闭时切换覆盖物显示
      if (!this.photoClosable) {
        this.overlayVisible = !this.overlayVisible;
      }
    },
    handleTouchStart(clientX: number, clientY: number) {
      this.touched = true;
      this.needTransition = false;
      this.clientX = clientX;
      this.clientY = clientY;
    },
    handleTouchMove(touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) {
      if (touchType === TouchTypeEnum.Scale) {
        this.handleTouchScaleMove(clientX, edgeTypes);
      }
      if (touchType === TouchTypeEnum.X) {
        this.handleTouchHorizontalMove(clientX);
      }
      if (touchType === TouchTypeEnum.Y) {
        this.handleTouchVerticalMove(clientX, clientY);
      }
    },
    handleTouchScaleMove(clientX: number, edgeTypes: EdgeTypeEnum[]) {
      let touchMoveX = clientX - this.clientX;
      if (
        (touchMoveX > 0 && edgeTypes.includes(EdgeTypeEnum.Left)) ||
        (touchMoveX < 0 && edgeTypes.includes(EdgeTypeEnum.Right))
      ) {
        this.handleTouchHorizontalMove(clientX);
      }
    },
    handleTouchHorizontalMove(clientX: number) {
      let touchMoveX = clientX - this.clientX;

      // 第一张和最后一张超出时拖拽距离减半
      if (
        (this.index === 0 && touchMoveX > 0) ||
        (this.index === this.items.length - 1 && touchMoveX < 0)
      ) {
        touchMoveX = touchMoveX / 2;
      }

      this.hasMove = clientX !== this.clientX;
      this.touchMoveX = touchMoveX;
    },
    handleTouchVerticalMove(clientX: number, clientY: number) {
      let touchMoveY = Math.abs(clientY - this.clientY);
      const opacity = Math.max(
        Math.min(defaultBackdropOpacity, defaultBackdropOpacity - touchMoveY / 100 / 4),
        0
      );

      this.hasMove = clientX !== this.clientX || clientY !== this.clientY;
      this.backdropOpacity = opacity;
    },
    handleTouchEnd(touchType: TouchTypeEnum, clientX: number, clientY: number, edgeTypes: EdgeTypeEnum[]) {
      if (touchType === TouchTypeEnum.Scale) {
        this.handleTouchScaleEnd(clientX, edgeTypes);
      }
      if (touchType === TouchTypeEnum.X) {
        this.handleTouchHorizontalEnd(clientX);
      }
      if (touchType === TouchTypeEnum.Y) {
        this.handleTouchVerticalEnd(clientY);
      }
      // 只要移动过，则需要动画过渡
      if (this.hasMove) {
        this.needTransition = true;
      }
      this.touched = false;
      this.hasMove = false;
      this.clientX = 0;
      this.clientY = 0;
      this.touchMoveX = 0;
    },
    handleTouchScaleEnd(clientX: number, edgeTypes: EdgeTypeEnum[]) {
      const offsetX = clientX - this.clientX;
      // 下一张
      if (offsetX < -minSwitchImageOffset && edgeTypes.includes(EdgeTypeEnum.Right)) {
        this.handleNext();
      }
      // 上一张
      if (offsetX > minSwitchImageOffset && edgeTypes.includes(EdgeTypeEnum.Left)) {
        this.handlePrevious();
      }
    },
    handleTouchHorizontalEnd(clientX: number) {
      const offsetX = clientX - this.clientX;
      // 下一张
      if (offsetX < -minSwitchImageOffset) {
        this.handleNext();
      }
      // 上一张
      if (offsetX > minSwitchImageOffset) {
        this.handlePrevious();
      }
    },
    handleTouchVerticalEnd(clientY: number) {
      const offsetY = clientY - this.clientY;

      if (Math.abs(offsetY) > window.innerHeight * 0.14) {
        this.$emit('closeModal');
      } else {
        this.resetBackdropOpacity();
      }
    },
    resetBackdropOpacity() {
      this.backdropOpacity = defaultBackdropOpacity;
    },
    resetNeedTransition() {
      this.needTransition = false;
    },
    getItemIndex(item: ItemType) {
      return this.items.findIndex(({ key }) => key === item.key);
    },
    handlePrevious() {
      if (this.index > 0) {
        this.$emit('changeIndex', this.index - 1);
      }
    },
    handleNext() {
      if (this.index < this.items.length - 1) {
        this.$emit('changeIndex', this.index + 1);
      }
    },
    handleClickPhoto() {
      this.$emit('clickPhoto');
    },
    handleClickMask() {
      this.$emit('clickMask');
    },
    handleClickClose() {
      this.$emit('closeModal');
    },
    getTransition() {
      const transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
      if (this.needTransition) {
        return transition;
      }
      if (this.hasMove) {
        return undefined;
      }
      return this.shouldTransition ? transition : undefined;
    }
  }
});
</script>

<style lang="scss">
@keyframes PhotoView__fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.PhotoSlider__Wrapper.PhotoSlider__Clean {
  .PhotoSlider__BannerWrap,
  .PhotoSlider__ArrowLeft,
  .PhotoSlider__ArrowRight,
  .PhotoSlider__FooterWrap {
    opacity: 0;
    &:hover {
      opacity: 0;
    }
  }
}

.PhotoSlider__Wrapper.PhotoSlider__Hide {
  .PhotoSlider__BannerWrap,
  .PhotoSlider__ArrowLeft,
  .PhotoSlider__ArrowRight,
  .PhotoSlider__FooterWrap {
    opacity: 0;
  }
}

.PhotoSlider__Wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2000;
  user-select: none;

  .PhotoSlider__Backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    &.PhotoSlider__fadeIn {
      opacity: 0;
      animation: PhotoView__fade 0.4s linear both;
    }
    &.PhotoSlider__fadeOut {
      opacity: 1;
      animation: PhotoView__fade 0.4s linear both reverse;
    }
  }

  .PhotoSlider__BannerWrap {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease-out;
    z-index: 20;

    &:hover {
      opacity: 1;
    }

    .PhotoSlider__Counter {
      padding: 0 10px;
      font-size: 14px;
      opacity: 0.75;
    }

    .PhotoSlider__BannerRight {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .PhotoSlider__BannerIcon {
        vertical-align: top;
        box-sizing: border-box;
        padding: 10px;
        opacity: 0.75;
        cursor: pointer;
        transition: all 0.2s linear;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .PhotoSlider__PhotoBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    overflow: hidden;
  }

  .PhotoSlider__ArrowLeft {
    left: 0;
  }

  .PhotoSlider__ArrowRight {
    right: 0;
  }

  .PhotoSlider__ArrowLeft,
  .PhotoSlider__ArrowRight {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0 auto 0;
    width: 70px;
    height: 100px;
    opacity: 0.7;
    z-index: 20;
    cursor: pointer;
    transition: opacity 0.2s linear;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 1;
    }

    svg {
      box-sizing: content-box;
      padding: 10px;
      width: 24px;
      height: 24px;
      fill: white;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .PhotoSlider__FooterWrap {
    position: absolute;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    padding: 10px;
    line-height: 1.5;
    font-size: 14px;
    text-align: justify;
    color: #ccc;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease-out;
    z-index: 20;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
