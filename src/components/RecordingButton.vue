<template>
  <div class="hello">
    <button @click="$emit('triggerRecording',itemIndex)"  > {{ isRecording ? 'Stop Audio' : 'Start Audio' }}</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isRecording: {
    type: Boolean,
    default: false,
  },
  itemIndex: {
    type: Number,
    required: true,
  },
});

defineEmits(['triggerRecording']);

</script>


<style scoped>
</style>
