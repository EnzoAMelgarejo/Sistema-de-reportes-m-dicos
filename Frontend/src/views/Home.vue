<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { ref } from 'vue';

const { user, isAuthenticated } = useAuth0();

const lastReport = ref({
  title: 'Análisis de sangre',
  date: '2025-05-20',
  status: 'Todo normal',
});

const lastLoginDate = '2025-05-22';
</script>

<template>
  <div class="dashboard">
    <h1>
      Bienvenido{{ isAuthenticated && user?.name ? `, ${user.name}` : '' }} 👋
    </h1>

    <p class="summary">Este es tu panel general. Acá podés ver tu actividad reciente.</p>

    <div class="card-grid">
      <div class="card">
        <h3>📄 Último reporte</h3>
        <p>{{ lastReport.title }}</p>
        <small>{{ lastReport.date }} - {{ lastReport.status }}</small>
      </div>

      <div class="card">
        <h3>📅 Último acceso</h3>
        <p>{{ lastLoginDate }}</p>
      </div>

      <div class="card">
        <h3>ℹ️ Estado del sistema</h3>
        <p>Todo funcionando correctamente ✅</p>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadeSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard {
  padding: 2rem;
  color: #2C2C2C;
  background-color: #F9FAFB;
  text-align: center;
}

.dashboard h1 {
  animation: fadeSlideDown 0.8s ease forwards;
}

.summary {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: #2C2C2C;
}

.card-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.card {
  background: #ECEEF1;
  padding: 1.5rem;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  text-align: left;
  border-left: 5px solid #2E736C;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card h3 {
  color: #2E736C;
  margin-bottom: 0.5rem;
}

.card p {
  margin: 0.3rem 0;
  color: #2C2C2C;
}

.card small {
  font-size: 0.8rem;
  color: #595e66;
}
</style>
