<template>
  <div>
    {{ logMount() }}
    <h2>Reportes Médicos</h2>
    <div v-if="isLoading">Cargando reportes...</div>
    <ul v-else>
      <li v-for="report in reports" :key="report.id">
        <ReportsCard
          :title="report.title"
          :createdAt="report.createdAt"
          :priority="report.priority"
          :status="report.status"
          :category="report.category"
          :content="report.content"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import ReportsCard from '../components/ReportsCard.vue';

interface Report {
  id: number;
  title: string;
  content: string;
  priority: string;
  status: string;
  category: string;
  createdAt: string;
}

const reports = ref<Report[]>([]);
const isLoading = ref(true);

const logMount = () => {
  console.log('🟢 Componente Reports.vue montado');
  return '';
};

const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();

const fetchReports = async () => {
  try {
    const token = await getAccessTokenSilently({
      audience: 'https://reports-api-endpoint/',
    } as any);

    const res = await fetch('http://localhost:3000/reports', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Fallo al obtener los reportes.');

    const data: Report[] = await res.json();
    console.log('📦 Datos recibidos:', data);
    reports.value = data;
  } catch (e) {
    console.error('❌ Error en servidor o en la autenticación:', e);
  } finally {
    isLoading.value = false;
  }
};

// 🔁 Si ya está autenticado cuando se monta
onMounted(() => {
  if (isAuthenticated.value && !authLoading.value) {
    fetchReports();
  }
});

// 🔁 Si cambia a autenticado después
watch(isAuthenticated, (auth) => {
  if (auth) fetchReports();
});
</script>
