<template>
  <div 
    class="reading-progress" 
    :style="{ width: progressPercentage + '%' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progressPercentage = ref(0);

const updateProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressPercentage.value = scrolled;
};

onMounted(() => {
  window.addEventListener('scroll', updateProgress);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});
</script>