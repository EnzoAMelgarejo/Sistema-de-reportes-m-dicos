<template>
    <div>
           {{ logMount() }}
        <h2>Reportes Medicos</h2>
        <div v-if="isLoading">Cargando reportes...</div>
        <ul v-else>
            <li v-for="report in reports" :key="report.id">
                <strong>{{ report.title }}</strong> - {{ report.createdAt }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, watch} from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

interface Report {
    id: number,
    title: string,
    content: string,
    priority: string,
    status: string,
    category: string,
    createdAt: Date,
}

const reports = ref<Report[]>([]);
const isLoading = ref(true);

const logMount = () => {
  console.log('🟢 Componente Reports.vue montado');
  return '';
};

const { getAccessTokenSilently, isAuthenticated } = useAuth0();

// Espera a que isAuthenticated sea true antes de continuar
watch(isAuthenticated, async (auth) => {
  if (!auth) return;

  try {
    const token = await getAccessTokenSilently({
      audience: 'https://reports-api-endpoint/',
    } as any);

    const res = await fetch('http://localhost:3000/reports', {  //La llamada funciona pero no trae nada. Hay que corrobar si estamos usando la url correcta.
      headers: {                                                //Es con la url de ngrok??? O es directamente desde localhost???
        Authorization: `Bearer ${token}`,                       //Probamos con ambas pero la respuesta es la misma
      },                                                        //No hay errores en la consola y la app funciona pero no llega ningun dato
    });

    if (!res.ok) throw new Error('Fallo al obtener los reportes.');

    const data: Report[] = await res.json(); //En esta variable se almacenan los reportes
    console.log('Datos recibidos:', data); //Aca intentamos imprimir los datos para ver si llega algo pero no se imprime absolutamente nada.
    reports.value = data;
  } catch (e) {
    console.error('Ocurrió un error en el servidor', e);
  } finally {
    isLoading.value = false;
  }
});
</script>