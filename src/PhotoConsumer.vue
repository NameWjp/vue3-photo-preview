<template>
  <slot />
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PhotoConsumer',
  props: {
    // 图片地址
    src: {
      type: String,
      default: ''
    }
  },
});
</script>

<style lang="scss">
</style>
