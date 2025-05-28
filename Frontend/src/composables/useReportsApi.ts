// composables/useReportsApi.ts
import { useAuth0 } from '@auth0/auth0-vue';
import { ref } from 'vue';
import type { Report } from '../types/Report';

const API_URL = 'http://localhost:3000/reports';

export function useReportsApi() {
  const { getAccessTokenSilently } = useAuth0();

  const getAuthHeaders = async () => {
    const token = await getAccessTokenSilently({
      audience: 'https://reports-api-endpoint/',
    } as any);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchReports = async (page = 1, limit = 5): Promise<Report[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}?_page=${page}&_limit=${limit}`, { headers }); //Los parametros agregados dentro de la funcion pertenecen a los limites de pagina y reportes. A REVISAR
    if (!response.ok) throw new Error('Error al obtener reportes');
    return await response.json();
  };

  const createReport = async (formData: Report) => {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Error al crear reporte');
    return await response.json();
  };

  return {
    fetchReports,
    createReport,
  };
}
