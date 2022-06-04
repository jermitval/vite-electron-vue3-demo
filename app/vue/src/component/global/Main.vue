<template>
  <main class="gl-main" scrollable widebar>
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
"Main"
</script>

<style lang="scss" scoped>
main {
  -webkit-app-region: no-drag !important;
  background: $-gl-color-bg;
  display: flex;
  flex-direction: column;
}
</style>
