<template>
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    :round="round"
    :plain="plain"
    @click="$emit('click', $event)"
  >
    <slot name="icon"></slot>
    <span v-if="text">{{ text }}</span>
    <slot v-else></slot>
  </el-button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'default'
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script> 