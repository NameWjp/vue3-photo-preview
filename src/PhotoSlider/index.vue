<template>
  <teleport to="body">
    <div
      v-if="photoVisible"
      class="PhotoSlider__Wrapper"
      :class="{
        'PhotoSlider__Clean': !(showAnimateType === ShowAnimateEnum.None)
      }"
    >
      <div
        class="PhotoSlider__Backdrop"
        :class="{
          'PhotoSlider__fadeIn': showAnimateType === ShowAnimateEnum.In,
          'PhotoSlider__fadeOut': showAnimateType === ShowAnimateEnum.Out
        }"
        @animationend="onShowAnimateEnd"
      />
      <div class="PhotoSlider__BannerWrap">
        <div class="PhotoSlider__Counter">
          {{ index + 1 }} / {{ items.length }}
        </div>
        <div
          class="PhotoSlider__Close"
          @click="handleClickClose"
        >
          <close class="PhotoSlider__CloseIcon" />
        </div>
      </div>
      <div
        v-for="(item, currentIndex) in items"
        :key="item.key"
        class="PhotoSlider__PhotoBox"
        :style="{
          left: `${(innerWidth + horizontalOffset) * currentIndex}px`,
          transform: `translate3d(-${(innerWidth + horizontalOffset) * index}px, 0px, 0px)`
        }"
        @click="handleClickMask"
      >
        <photo-view
          :origin-rect="originRect"
          :show-animate-type="showAnimateType"
          :src="item.src"
          @click.stop="handleClickPhoto"
        />
      </div>
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
import { horizontalOffset } from '../constant';
import useBodyEffect from './useBodyEffect';
import useInnerWidth from './useInnerWidth';
import Close from './Close.vue';
import useAnimationHandle from './useAnimationHandle';
import { ItemType, ShowAnimateEnum } from '../types';

export default defineComponent({
  name: 'PhotoSlider',
  components: {
    PhotoView,
    Close
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
    }
  },
  emits: ['clickPhoto', 'clickMask', 'clickClose'],
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
      horizontalOffset,
      ShowAnimateEnum,
    };
  },
  methods: {
    handleClickPhoto() {
      this.$emit('clickPhoto');
    },
    handleClickMask() {
      this.$emit('clickMask');
    },
    handleClickClose() {
      this.$emit('clickClose');
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
    background: rgba(0, 0, 0, 1);
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

    .PhotoSlider__Counter {
      padding: 0 10px;
      font-size: 14px;
      opacity: 0.75;
    }

    .PhotoSlider__Close {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .PhotoSlider__CloseIcon {
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
  }
}
</style>
