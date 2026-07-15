<script setup lang="ts">
defineProps<{
  padding?: string
}>()
</script>

<template>
  <div class="glass-card" :style="padding ? { padding } : {}">
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
}
</style>
