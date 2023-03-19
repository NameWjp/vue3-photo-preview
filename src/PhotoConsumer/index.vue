<template>
  <span
    v-if="$slots.default && $slots.default()"
    ref="root"
    style="display:inline-block;"
    class="PhotoConsumer"
    @click="handleClick"
  >
    <!-- @slot 默认插槽 -->
    <slot />
  </span>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, onUnmounted, ref, watch, toRefs } from 'vue';
import { updateItemKey, removeItemKey, handleShowKey } from '../symbols';
import uniqueId from 'lodash-es/uniqueId';

export default defineComponent({
  name: 'PhotoConsumer',
  props: {
    /**
     * 图片地址
     */
    src: {
      type: String,
      required: true,
    },
    /**
     * 图片介绍
     */
    intro: {
      type: String,
      default: null
    },
    /**
     * 图片下载名称，默认图片名称
     */
    downloadName: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const updateItem = inject(updateItemKey);
    const removeItem = inject(removeItemKey);
    const handleShow = inject(handleShowKey);
    const root = ref<HTMLElement | null>(null);
    const key = uniqueId();
    const { src, intro, downloadName } = toRefs(props);

    const handleClick = () => {
      handleShow?.(key);
    };
    const getItem = () => ({
      key,
      src: src.value,
      originRef: root.value,
      intro: intro.value,
      downloadName: downloadName.value
    });

    watch([src, intro, downloadName], () => {
      updateItem?.(getItem());
    });

    onMounted(() => {
      updateItem?.(getItem());
    });
    onUnmounted(() => {
      removeItem?.(key);
    });

    return {
      root,
      handleClick
    };
  },
});
</script>

<style lang="scss">
</style>
