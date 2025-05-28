<template>
  <form @submit.prevent="handleSubmit" class="create-report-form">
    <label>
      Título:
      <input v-model="form.title" type="text" required />
    </label>

    <label>
      Contenido:
      <textarea v-model="form.content" rows="4" required></textarea>
    </label>

    <label>
      Prioridad:
      <select v-model="form.priority" required>
        <option value="" disabled>Seleccioná prioridad</option>
        <option value="LOW">Baja</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="CRITICAL">Critico</option>
      </select>
    </label>

    <label>
      Estado:
      <select v-model="form.status" required>
        <option value="" disabled>Seleccioná estado</option>
        <option value="PENDING">Pendiente</option>
        <option value="IN_PROGRESS">En progreso</option>
        <option value="RESOLVED">Resuelto</option>
        <option value="CLOSED">Cerrado</option>
      </select>
    </label>

    <label>
      Categoría:
      <select v-model="form.category" required>
        <option value="" disabled>Seleccioná estado</option>
        <option value="BUG">Bug</option>
        <option value="TASK">Task</option>
        <option value="DOCUMENTATION">Documentation</option>
        <option value="IMPROVEMENT">Improvement</option>
        <option value="STORY">Story</option>
      </select>
    </label>

    <button type="submit" :disabled="loading">{{ loading ? 'Creando...' : 'Crear Reporte' }}</button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

const emit = defineEmits(['created']);

const form = reactive({
  title: '',
  content: '',
  priority: '',
  status: '',
  category: '',
});

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;

  try {
    // Emitimos el objeto del nuevo reporte para que el componente padre maneje la creación
    emit('created', {
      ...form,
      createdAt: new Date().toISOString(),
    });

    // Limpiamos el formulario
    form.title = '';
    form.content = '';
    form.priority = '';
    form.status = '';
    form.category = '';
  } catch (error) {
    console.error('Error al crear reporte', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '../assets/variables.scss' as *;

.create-report-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-unit;
  max-width: 400px;
  margin: auto;
  background-color: $color-fondo-alt;
  padding: $spacing-unit * 2;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: $font-base;
  color: $color-texto;

  label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    color: $color-principal;
    font-size: 0.95rem;
  }

  input,
  textarea,
  select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid color.adjust($color-principal, $lightness: 20%);
    background-color: white;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: $color-principal;
      box-shadow: 0 0 0 2px rgba($color-principal, 0.2);
    }
  }

  button {
    max-width: 150px;
    padding: 0.5rem 1rem;
    background-color: $color-principal;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color.adjust($color-principal, $lightness: 10%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
      background-color: color.adjust($color-principal, $lightness: 20%);
    }
  }
}
</style>

