<template>
  <div class="container">
    <div class="header">
      <h2>Reportes Médicos</h2>
    </div>
    <div class="main-content">
      <div class="functions">
        <CreateReportForm @created="handleCreate" />
      </div>

      <div class="reports">
        <div v-if="isLoading">Cargando reportes...</div>
        <ul v-else class="report-list">
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
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import ReportsCard from '../components/ReportsCard.vue';
import CreateReportForm from '../components/CreateReportForm.vue';

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

const handleCreate = async(formData: Report) => {
  try {
    const token = await getAccessTokenSilently({
      audience: 'https://reports-api-endpoint/',
    } as any);

    const res = await fetch(`http://localhost:3000/reports`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(formData),

    });

    if(!res.ok) throw new Error('Error al crear reporte.');
    console.log('✅ Reporte creado correctamente.');
    fetchReports();

  } catch (error) {
    console.error('❌ Error al crear reporte.', error);
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

<style scoped lang="scss">
  @use '../assets/variables.scss' as *;

  .main-content {
    display: flex;
    gap: 2rem;
    padding: 1rem;

    // Distribuye columnas
    .functions {
      flex: 1;
      max-width: 300px; // ajustable
    }

    .reports {
      flex: 3;
    }
  }

  .report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-content {
    margin-left: 200px;
  }

  .header {
    text-align: center;
  }


</style>

