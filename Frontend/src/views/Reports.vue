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
            :author="report.author"
            :assignee="report.assignee"
            />
          </li>
          <div ref="infiniteScrollTrigger" class="scroll-trigger"></div>
        </ul>
      </div>
      <div v-if="message" :class="['message', messageType]">{{ message }}</div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import ReportsCard from '../components/ReportsCard.vue';
import CreateReportForm from '../components/CreateReportForm.vue';
import { useReportsApi } from '../composables/useReportsApi';
import type { Report } from '../types/Report' 

//Esto es todo del lazy load. Hay que revisarlo porque si bien las transiciones funcionan bien los limites de reportes no se estan aplicando. Aparecen todos los reportes de una.
//Y al bajar hasta el final por alguna razon lo que tendria que hacer aparecer mas reportes me manda al principio de la pagina
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const initObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading.value && !allLoaded.value) {
        page.value++;
        loadReports();
      }
    },
    { root: null, threshold: 1.0 }
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
};

onMounted(() => {
  if (isAuthenticated.value && !authLoading.value) {
    loadReports().then(() => initObserver());
  }
});

onUnmounted(() => {
  if (observer && infiniteScrollTrigger.value) {
    observer.unobserve(infiniteScrollTrigger.value);
  }
});

const { isAuthenticated, isLoading: authLoading } = useAuth0();
const { fetchReports, createReport } = useReportsApi();

const reports = ref<Report[]>([]);
const isLoading = ref(true);

const page = ref(1)
const limit = 5
const allLoaded = ref(false)

const loadReports = async () => {
  try {
    isLoading.value = true
    const newReports = await fetchReports(page.value, limit)  //Algunas lineas de codigo pertenecen a limites de pagina y limites de reportes pero no estan funcionando correctamente. A REVISAR.
    if (newReports.length < limit) {
      allLoaded.value = true
    }
    reports.value.push(...newReports)
  } catch (e) {
    showMessage('❌ Error cargando reportes.', 'error')
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const message = ref('')
const messageType = ref<'success' | 'error' | ''>('')

// Muestra el mensaje durante 3 segundos
function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

const handleCreate = async (formData: Report) => {
  try {
    await createReport(formData)
    showMessage('✅ Reporte creado correctamente.', 'success')
    await loadReports()
  } catch (e) {
    console.error('❌ Error creando reporte:', e)
    showMessage('❌ Error creando reporte.', 'error')
  }
}


onMounted(() => {
  if (isAuthenticated.value && !authLoading.value) {
    loadReports();
  }
});

watch(isAuthenticated, (auth) => {
  if (auth) loadReports();
});
</script>

<style scoped lang="scss">
  @use 'sass:color';
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

  .message {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    text-align: center;
    font-weight: bold;
    &.success {
      background-color: #d4edda;
      color: #155724;
    }
    &.error {
      background-color: #f8d7da;
      color: #721c24;
    }
  }

  //Estos estlios pertenecen al lazy load y la transicion de carga de los reportes. Como hay que revisar la funcion lazy load tal vez se modifiquen estos estilos tambien
  .report-list li {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInUp 0.3s ease forwards;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }


</style>

