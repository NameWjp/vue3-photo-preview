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
          <download
            class="PhotoSlider__BannerIcon"
            @click="handleDownload"
          />
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
        v-for="(item, currentIndex) in showItems"
        :key="item.key"
        class="PhotoSlider__PhotoBox"
        :style="{
          left: getItemLeft(currentIndex),
          transition: getItemTransition(),
          transform: getItemTransform()
        }"
        @transitionend="resetNeedTransition"
        @click="handleClickMask"
      >
        <photo-view
          :ref="(val) => setPhotoViewRef(item.key, val)"
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
          v-if="loop || index > 0"
          class="PhotoSlider__ArrowLeft"
          @click="handlePrevious"
        >
          <arrow-left />
        </div>
        <div
          v-if="loop || index < items.length - 1"
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
import { horizontalOffset, minSwitchImageOffset } from '../constant';
import useBodyEffect from './useBodyEffect';
import useInnerWidth from './useInnerWidth';
import Close from './Close.vue';
import ArrowLeft from './ArrowLeft.vue';
import ArrowRight from './ArrowRight.vue';
import RotateLeft from './RotateLeft.vue';
import RotateRight from './RotateRight.vue';
import FlipHorizontal from './FlipHorizontal.vue';
import FilpVertical from './FilpVertical.vue';
import Download from './Download.vue';
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
    Download,
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
     * 是否显示模态框
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
      default: false,
    },
    /**
     * 是否切换显隐覆盖物
     */
    toggleOverlay: {
      type: Boolean,
      default: true,
    },
    /**
     * 默认背景透明度
     */
    defaultBackdropOpacity: {
      type: Number,
      default: 1,
    },
    /**
     * 是否循环显示预览图
     */
    loop: {
      type: Boolean,
      default: false,
    }
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
      backdropOpacity: this.defaultBackdropOpacity,
      // 是否显示覆盖物
      overlayVisible: true,
      // 虚拟下标，用于循环预览
      virtualIndex: 0,
      // photo-view 子组件
      photoViewRefs: {} as { [key: string]: InstanceType<typeof PhotoView> },
    };
  },
  computed: {
    // 当前显示的图片列表
    showItems() {
      const len = this.items.length;
      if (this.loop) {
        const connect = this.items.concat(this.items).concat(this.items);
        return connect.slice(len + this.index - 1, len + this.index + 2);
      }
      return this.items.slice(Math.max(this.index - 1, 0), Math.min(this.index + 2, len));
    }
  },
  created() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  beforeUpdate() {
    this.photoViewRefs = {};
  },
  methods: {
    handleDownload() {
      const item = this.items[this.index];
      if (item) {
        const a = document.createElement('a');
        const paths = item.src.split('.')[0].split('/');
        const name = paths[paths.length - 1];
        a.download = item.downloadName || name;
        a.href = item.src;
        a.dispatchEvent(new MouseEvent('click'));
      }
    },
    toggleFlipHorizontal() {
      this.photoViewRefs[this.currentItem.key]?.toggleFlipHorizontal();
    },
    toggleFlipVertical() {
      this.photoViewRefs[this.currentItem.key]?.toggleFlipVertical();
    },
    handleRotateLeft() {
      this.photoViewRefs[this.currentItem.key]?.handleRotateLeft();
    },
    handleRotateRight() {
      this.photoViewRefs[this.currentItem.key]?.handleRotateRight();
    },
    setPhotoViewRef(key: string, ref: InstanceType<typeof PhotoView>) {
      this.photoViewRefs[key] = ref;
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
      if (this.toggleOverlay) {
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

      // 非循环模式下，第一张和最后一张超出时拖拽距离减半
      if (
        !this.loop &&
        ((this.index === 0 && touchMoveX > 0) || (this.index === this.items.length - 1 && touchMoveX < 0))
      ) {
        touchMoveX = touchMoveX / 2;
      }

      this.hasMove = clientX !== this.clientX;
      this.touchMoveX = touchMoveX;
    },
    handleTouchVerticalMove(clientX: number, clientY: number) {
      let touchMoveY = Math.abs(clientY - this.clientY);
      const opacity = Math.max(
        Math.min(this.defaultBackdropOpacity, this.defaultBackdropOpacity - touchMoveY / 100 / 4),
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
      this.backdropOpacity = this.defaultBackdropOpacity;
    },
    resetNeedTransition() {
      this.needTransition = false;
    },
    handlePrevious() {
      const len = this.items.length;
      if (!this.loop && this.index === 0) return;
      this.$emit('changeIndex', (this.index + len - 1) % len);
      this.virtualIndex -= 1;
    },
    handleNext() {
      const len = this.items.length;
      if (!this.loop && this.index === len - 1) return;
      this.$emit('changeIndex', (this.index + 1) % len);
      this.virtualIndex += 1;
    },
    handleClickPhoto(e: MouseEvent) {
      this.$emit('clickPhoto', e);
    },
    handleClickMask(e: MouseEvent) {
      this.$emit('clickMask', e);
    },
    handleClickClose() {
      this.$emit('closeModal');
    },
    // 当预览下一张时，currentIndex 会从 1 变成 0，相当于左移一个单位，所以此时只需要右移一个单位的来平衡 transform 的左移即可
    getItemLeft(currentIndex: number) {
      let index = this.virtualIndex + currentIndex;
      // 非循环模式的第一张图片不需要左移，因为只有两张图片，左侧没有图片
      if (this.loop || this.index !== 0) {
        index -= 1;
      }
      return `${(this.innerWidth + this.horizontalOffset) * index}px`;
    },
    getItemTransition() {
      const transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
      if (this.needTransition) {
        return transition;
      }
      if (this.hasMove) {
        return undefined;
      }
      return this.shouldTransition ? transition : undefined;
    },
    getItemTransform() {
      return `translate3d(${-(this.innerWidth + this.horizontalOffset) * this.virtualIndex + this.touchMoveX}px, 0px, 0px)`;
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
    @media (any-hover: hover){
      &:hover {
        opacity: 0;
      }
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

    @media (any-hover: hover){
      &:hover {
        opacity: 1;
      }
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

        @media (any-hover: hover){
          &:hover {
            opacity: 1;
          }
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

    @media (any-hover: hover){
      &:hover {
        opacity: 1;
      }
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

    @media (any-hover: hover){
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
