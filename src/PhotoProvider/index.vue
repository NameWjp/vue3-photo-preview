<template>
  <!-- @slot 默认插槽 -->
  <slot />
  <photo-slider
    :visible="visible"
    :index="index"
    :items="items"
    @clickPhoto="handleClickPhoto"
    @clickMask="handleClickMask"
    @changeIndex="updateIndex"
    @closeModal="handleHide"
  />
</template>

<script lang='ts'>
import { defineComponent, provide } from 'vue';
import { updateItemKey, removeItemKey, handleShowKey } from '../symbols';
import useItems from './useItems';
import useVisible from './useVisible';
import useIndex from './useIndex';
import PhotoSlider from '../PhotoSlider/index.vue';

export default defineComponent({
  name: 'PhotoProvider',
  components: {
    PhotoSlider
  },
  props: {
    /**
     * 图片点击是否关闭
     */
    photoClosable: {
      type: Boolean,
      default: false,
    },
    /**
     * 背景点击是否关闭
     */
    maskClosable: {
      type: Boolean,
      default: true,
    }
  },
  setup() {
    const { index, updateIndex } = useIndex();
    const { items, updateItem, removeItem } = useItems(index);
    const { visible, handleHide, handleShow } = useVisible(items, index);

    provide(updateItemKey, updateItem);
    provide(removeItemKey, removeItem);
    provide(handleShowKey, handleShow);

    return {
      items,
      updateItem,
      removeItem,
      visible,
      handleHide,
      handleShow,
      index,
      updateIndex,
    };
  },
  methods: {
    handleClickPhoto() {
      if (this.photoClosable) {
        this.handleHide();
      }
    },
    handleClickMask() {
      if (this.maskClosable) {
        this.handleHide();
      }
    }
  }
});
</script>

<style lang="scss">
</style>
