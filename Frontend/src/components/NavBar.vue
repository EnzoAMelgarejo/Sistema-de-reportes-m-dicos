<template>
  <nav :class="['navbar', { collapsed: isCollapsed }]">
    <button class="toggle-button" @click="toggleNavbar">
      {{ isCollapsed ? '☰' : '✖' }}
    </button>

    <div v-if="!isCollapsed" class="content">
      <router-link to="/home" class="nav-link" exact>Home</router-link>
      <router-link to="/reports" class="nav-link">Reports</router-link>
      <div class="spacer"></div>
      <AuthButton />
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import AuthButton from './AuthButton.vue';
import { watch } from 'vue';

const isCollapsed = ref(false);

const toggleNavbar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const emit = defineEmits(['toggle']);

watch(isCollapsed, (newVal) => {
  emit('toggle', newVal);
});

</script>

<style scoped lang="scss">
@use 'sass:color';
@use '../assets/variables.scss' as *;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 220px;
  background-color: $color-principal;
  color: $color-fondo;
  font-family: $font-base;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.3s ease-in-out;

  &.collapsed {
    transform: translateX(-100%);
  }
}

.toggle-button {
  position: absolute;
  top: 1rem;
  right: -2rem;
  background-color: $color-principal;
  color: $color-fondo;
  border: none;
  padding: 0.5rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  z-index: 101;
  transition: background-color 0.3s;

  &:hover {
    background-color: color.adjust($color-principal, $lightness: 10%);
;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
}

.nav-link {
  color: $color-fondo-alt;
  text-decoration: none;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;

  &.router-link-active {
    font-weight: 700;
    background-color: $color-fondo;
    color: $color-principal;
  }

  &:hover {
    background-color: $color-fondo;
    color: $color-principal;
  }
}

.spacer {
  flex-grow: 1;
  width: 100%;
}

::v-deep(AuthButton) {
  width: 100%;
  margin-top: auto;
}
</style>
