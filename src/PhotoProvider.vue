<template>
  <slot />
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PhotoProvider',
  props: {
    // 图片点击是否关闭
    photoClosable: {
      type: Boolean,
      default: false,
    },
    // 背景点击是否关闭
    maskClosable: {
      type: Boolean,
      default: true,
    }
  },
});
</script>

<style lang="scss">
</style>
