<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from './components/TopNavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <TopNavBar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
