<template>
  <span
    v-if="$slots.default()"
    ref="root"
    @click="handleClick"
  >
    <!-- @slot 默认插槽 -->
    <slot />
  </span>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, ref } from 'vue';
import { updateItemKey, handleShowKey } from '../symbols';
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
      default: ''
    }
  },
  setup(props) {
    const updateItem = inject(updateItemKey);
    const handleShow = inject(handleShowKey);
    const root = ref<HTMLElement | null>(null);
    const key = uniqueId();

    const handleClick = () => {
      if (handleShow) {
        handleShow(key);
      }
    };

    onMounted(() => {
      if (updateItem) {
        updateItem({
          key,
          src: props.src,
          originRef: root.value
        });
      }
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
