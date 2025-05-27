<template>
  <div class="layout" :class="{ 'navbar-collapsed': isNavbarCollapsed }">
    <NavBar @toggle="isNavbarCollapsed = $event" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from './components/Navbar.vue';

const isNavbarCollapsed = ref(false);
</script>

<style scoped lang="scss">
@use './assets/variables.scss' as *;

.layout {
  display: flex;

  .main-content {
    transition: margin-left 0.3s ease;
    margin-left: 220px; // ancho normal del navbar
    padding: 2rem;
    width: 100%;
  }

  &.navbar-collapsed .main-content {
    margin-left: 0;
  }
}
</style>
