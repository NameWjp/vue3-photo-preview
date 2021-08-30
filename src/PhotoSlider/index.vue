<template>
  <teleport to="body">
    <div
      class="PhotoSlider__Wrapper"
    >
      <div class="PhotoSlider__Backdrop" />
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
    </div>
  </teleport>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import PhotoView from '../PhotoView/index.vue';
import { horizontalOffset } from '../constant';
import useBodyEffect from './useBodyEffect';
import useInnerWidth from './useInnerWidth';

export default defineComponent({
  name: 'PhotoSlider',
  components: {
    PhotoView
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
  emits: ['clickPhoto', 'clickMask'],
  setup(_props, { emit }) {
    useBodyEffect();
    const { innerWidth } = useInnerWidth();

    const handleClickPhoto = () => {
      emit('clickPhoto');
    };
    const handleClickMask = () => {
      emit('clickMask');
    };

    return {
      handleClickPhoto,
      handleClickMask,
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

  .PhotoSlider__Backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0);
    z-index: -1;
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
}
</style>
