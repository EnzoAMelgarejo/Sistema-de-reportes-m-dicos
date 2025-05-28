<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1>Bienvenido a mi app ✨</h1>
      <p>Accedé para ver tus reportes personalizados</p>

      <div class="welcome-description">
        <p class="intro">
          Este es un proyecto fullstack centrado en la implementación de autenticación y control de acceso.
        </p>
        <p class="focus">
          Utiliza <strong>Auth0</strong> para proteger rutas, aplicar <strong>roles personalizados mediante claims</strong>, y gestionar autenticaciones de usuarios y máquinas (M2M).
        </p>
        <p class="purpose">
          El objetivo principal es demostrar habilidades avanzadas en desarrollo web, integrando frontend y backend con <strong>Vue</strong> y <strong>NestJS</strong>.
        </p>
      </div>

      <AuthButton />
    </div>
  </div>
</template>

<script setup>
import AuthButton from '../components/AuthButton.vue';
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '../assets/variables.scss' as *;

.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: $spacing-unit;
  background-color: $color-fondo;
  font-family: $font-base;
}

.welcome-card {
  background-color: white;
  border-radius: 16px;
  padding: $spacing-unit * 2;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 540px;
  width: 100%;
  animation: fadeSlideIn 0.8s ease-out;

  h1 {
    color: $color-principal;
    margin-bottom: $spacing-unit;
    font-size: 2.2rem;
  }

  p {
    color: $color-texto;
    font-size: 1.1rem;
    margin-bottom: $spacing-unit * 1.25;
  }

  button {
    background-color: $color-principal;
    color: white;
    border: none;
    padding: 0.6rem 1.4rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: color.adjust($color-principal, $lightness: 10%);
      transform: translateY(-2px);
    }
  }
}

.welcome-description {
  margin-top: $spacing-unit * 1.25;
  color: $color-texto;
  font-size: 0.95rem;
  text-align: left;

  p {
    margin-bottom: $spacing-unit * 0.75;
    line-height: 1.6;
  }

  strong {
    color: $color-principal;
  }
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
