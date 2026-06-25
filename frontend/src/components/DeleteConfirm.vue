<template>
  <Teleport to="body">
    <transition name="dialog">
      <div 
        v-if="visible" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        @click.self="handleCancel"
      >
        <div class="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              {{ title || '确认删除' }}
            </h2>
            <button 
              @click="handleCancel"
              class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
              <span class="material-symbols-outlined text-on-error-container text-2xl">warning</span>
            </div>
            <div>
              <p class="text-on-surface font-body-md mb-2">{{ message }}</p>
              <p v-if="subMessage" class="text-on-surface-variant font-body-sm">{{ subMessage }}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              @click="handleCancel"
              class="flex-1 py-3 border border-outline text-on-surface-variant font-body-md rounded-lg hover:bg-surface-container-high transition-all"
              :disabled="loading"
            >
              取消
            </button>
            <button 
              @click="handleConfirm"
              class="flex-1 py-3 bg-error text-on-error font-body-md rounded-lg hover:bg-error/90 transition-all disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? '删除�?..' : (confirmText || '删除') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">

const props = defineProps<{
  visible: boolean;
  title?: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:visible', value: boolean): void;
}>();

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>