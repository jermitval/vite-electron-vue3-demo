<template>
  <button
    class="gl-button"
    :title="props.title || props.text"
    :text="!!props.text"
    unselectable="off"
  >
    <span v-if="props.text">{{ props.text }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  /** 标题 */
  title: {
    type: String,
    default: null
  },
  /** 文本按钮值 */
  text: {
    type: String,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.gl-button {
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  outline: none;
  border: none;
  padding: 5px 10px;

  &[success],
  &[danger] {
    color: $-gl-color-white;
  }

  &[success] {
    background: $-gl-color-green;
    &:hover {
      background: $-gl-color-green-hover;
    }
    &:active {
      background: $-gl-color-green-active;
    }
  }
  &[danger] {
    background: $-gl-color-red;
    &:hover {
      background: $-gl-color-red-hover;
    }
    &:active {
      background: $-gl-color-red-active;
    }
  }
}
</style>
