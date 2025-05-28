<template>
  <div class="report-card">
    <h3>{{ title }}</h3>
    <p class="date">{{ formattedDate }}</p>
    <p class="category">{{ category }}</p>
    
    <div class="tags">
      <span class="tag" :class="priorityClass">{{ priority }}</span>
      <span class="tag status">{{ status }}</span>
    </div>
    
    <p v-if="content" class="content">{{ content }}</p>
    
    <p class="author">Autor: {{ props.author.name }} ({{ props.author.email }})</p>
    <p v-if="props.assignee" class="assignee">Asignado a: {{ props.assignee.name }}</p>
  
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  createdAt: string;
  priority: string;
  status: string;
  category: string;
  content?: string;
  author: {
    name: string;
    email: string;
  };
  assignee?: {
    name: string;
    email: string;
  };
}>();

const formattedDate = computed(() =>
  new Date(props.createdAt).toLocaleDateString()
);

const priorityClass = computed(() => props.priority);
</script>

<style lang="scss" scoped>
@use '../assets/variables' as *;
@use 'sass:color';

.report-card {
  background-color: $color-fondo-alt; // Fondo alternativo para las cards
  color: $color-texto;
  padding: $spacing-unit;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px color.adjust($color-principal, $alpha: -0.8);
  max-width: 320px;
  margin: 1rem auto;

  h3 {
    color: $color-secundario;
    margin-bottom: 0.25rem;
  }

  .date,
  .category {
    font-size: 0.875rem;
    opacity: 0.7;
    margin: 0;
  }

  .tags {
    margin: $spacing-unit 0;
    display: flex;
    gap: 0.5rem;

    .tag {
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      user-select: none;
      text-transform: capitalize;

      &.low {
        background-color: $color-principal;
      }

      &.medium {
        background-color: $color-advertencia;
        color: $color-texto;
      }

      &.high {
        background-color: $color-error;
      }

      &.status {
        background-color: color.scale($color-secundario, $lightness: -30%);
        color: $color-texto;
      }
    }
  }

  .content {
    font-size: 1rem;
    margin-top: $spacing-unit;
  }
}
</style>
