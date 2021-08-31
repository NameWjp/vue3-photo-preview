<template>
  <teleport to="body">
    <div
      class="PhotoSlider__Wrapper"
    >
      <div class="PhotoSlider__Backdrop" />
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
          :src="item.src"
          @click.stop="handleClickPhoto"
        />
      </div>
      <div
        v-if="items[index].intro"
        class="PhotoSlider__FooterWrap"
      >
        {{ items[index].intro }}
      </div>
    </div>
  </teleport>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import PhotoView from '../PhotoView/index.vue';
import { horizontalOffset } from '../constant';
import useBodyEffect from './useBodyEffect';
import useInnerWidth from './useInnerWidth';
import Close from './Close.vue';

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
      type: Array,
      required: true,
    },
    /**
     * 图片当前索引
     */
    index: {
      type: Number,
      required: true,
    }
  },
  emits: ['clickPhoto', 'clickMask', 'clickClose'],
  setup(_props, { emit }) {
    useBodyEffect();
    const { innerWidth } = useInnerWidth();

    const handleClickPhoto = () => {
      emit('clickPhoto');
    };
    const handleClickMask = () => {
      emit('clickMask');
    };
    const handleClickClose = () => {
      emit('clickClose');
    };

    return {
      handleClickPhoto,
      handleClickMask,
      handleClickClose,
      horizontalOffset,
      innerWidth
    };
  },
});
</script>

<style lang="scss">
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
    background: rgba(0, 0, 0);
    z-index: -1;
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
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
