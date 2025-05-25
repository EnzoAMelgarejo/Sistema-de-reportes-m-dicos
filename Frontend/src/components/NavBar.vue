<template>
  <nav class="navbar">
    <router-link to="/home" class="nav-link" exact>Home</router-link>
    <router-link to="/reports" class="nav-link">Reports</router-link>
    <div class="spacer"></div>
    <AuthButton />
  </nav>
</template>

<script setup>
import AuthButton from './AuthButton.vue';
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 220px;
  height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--color-principal, #2E736C); /* verde petróleo */
  color: var(--color-fondo, #F9FAFB); /* blanco suave */
  position: fixed;
  top: 0;
  left: 0;
  font-family: var(--font-base, 'Segoe UI', sans-serif);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* Usa las clases globales para los enlaces */
.nav-link {
  color: var(--color-fondo-alt, #ECEEF1); /* gris claro */
  text-decoration: none;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link.router-link-active {
  font-weight: 700;
  background-color: var(--color-fondo, #F9FAFB); /* fondo blanco suave */
  color: var(--color-principal, #2E736C);
}

.nav-link:hover {
  background-color: var(--color-fondo, #F9FAFB);
  color: var(--color-principal, #2E736C);
}

.spacer {
  flex-grow: 1;
  width: 100%;
}

/* Ajuste para que AuthButton esté al final */
AuthButton {
  width: 100%;
  margin-top: auto;
}
</style>
