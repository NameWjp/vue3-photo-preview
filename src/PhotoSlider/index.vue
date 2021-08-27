<template>
  <div
    v-if="visible"
    class="PhotoSlider__Wrapper"
  >
    <div class="PhotoSlider__Backdrop" />
    <div
      v-for="item in items"
      :key="item.key"
      class="PhotoSlider__PhotoBox"
      @click="handleClickMask"
    >
      <img
        class="PhotoSlider__Photo"
        :src="item.src"
        @click.stop="handleClickPhoto"
      >
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PhotoSlider',
  props: {
    /**
     * 图片列表
     */
    items: {
      type: Array,
      required: true,
    },
    /**
     * 是否可见
     */
    visible: {
      type: Boolean,
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
    const handleClickPhoto = () => {
      emit('clickPhoto');
    };
    const handleClickMask = () => {
      emit('clickMask');
    };

    return {
      handleClickPhoto,
      handleClickMask,
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
    background: rgba(0, 0, 0, 0.6);
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

    .PhotoSlider__Photo {
      width: 100%;
    }
  }
}
</style>
