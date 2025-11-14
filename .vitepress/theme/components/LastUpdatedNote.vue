<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const lastUpdatedText = computed(() => page.value.frontmatter?.__lastUpdatedText)
</script>

<template>
  <div v-if="lastUpdatedText" class="last-updated-note">
    <span>最后更新 · {{ lastUpdatedText }}</span>
  </div>
</template>

<style scoped>
.last-updated-note {
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  display: flex;
  justify-content: center;
}
</style>
