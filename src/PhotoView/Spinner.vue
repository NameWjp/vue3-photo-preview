<template>
  <div class="PhotoView__Spinner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="36"
      height="36"
      fill="white"
    >
      <path
        opacity=".25"
        d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
      />
      <path
        d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z"
      />
    </svg>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>

<style lang="scss">
@keyframes PhotoView__rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes PhotoView__delayShow {
  0%,
  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.PhotoView__Spinner {
  animation: PhotoView__delayShow 0.4s linear both;

  svg {
    display: block;
    animation: PhotoView__rotate 0.6s linear infinite;
  }
}

</style>
