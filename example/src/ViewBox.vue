<template>
  <img :src="src" class="view-box">
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ViewBox',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.view-box {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  object-fit: cover;
}
</style>
