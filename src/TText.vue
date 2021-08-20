<template>
  <div class="tt">
    这是 ttext 组件
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TText',
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  methods: {}
});
</script>

<style lang="scss">
.tt {
  color: red;
  transform: translateX(30px);
}
</style>
