<template>
  <img
    v-if="loaded"
    :width="width"
    :height="height"
    :src="src"
  >
  <spinner v-else />
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Spinner from './Spinner.vue';
import useLoadImage from './useLoadImage';
import useWindowResize from './useWindowResize';

export default defineComponent({
  name: 'PhotoView',
  components: {
    Spinner
  },
  props: {
    /**
     * 图片地址
     */
    src: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { width, height, loaded, naturalWidth, naturalHeight } = useLoadImage(props.src);
    useWindowResize(width, height, naturalWidth, naturalHeight);

    return {
      width,
      height,
      loaded
    };
  },
});
</script>

<style lang="scss">
</style>
