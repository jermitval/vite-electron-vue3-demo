<template>
  <div id="app-view">
    <!-- main page -->
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="/.unalive/g">
        <component :is="Component" ref="Page" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
console.log(import.meta.env)
</script>

<style lang="scss">
#app {
  position: relative;
  z-index: 1;
  @include mx-2dsize(100%, 100%);
  @include mx-flex(row nowrap);

  #app-frame-navi {
    position: relative;
    z-index: 3;
  }
  #app-frame-aside {
    position: relative;
    z-index: 2;
    min-width: 100px;
    height: 100%;
  }

  #app-view {
    position: relative;
    z-index: 1;
    flex: 1 !important;
    overflow: hidden !important;
    @include mx-flex(column);

    #app-frame-header {
      position: relative;
      z-index: 4;
    }
    header {
      position: relative;
      z-index: 3;
    }
    main {
      position: relative;
      z-index: 1;
      flex: 1 !important;
    }
    footer {
      position: relative;
      z-index: 2;
    }
  }
}
</style>
