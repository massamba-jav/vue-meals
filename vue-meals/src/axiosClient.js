import axios from 'axios';
import { translateMeal } from './utils/translator';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Intercepteur de réponse pour traduire automatiquement
axiosClient.interceptors.response.use(
  async (response) => {
    // Si la réponse contient des meals, les traduire automatiquement
    if (response.data && response.data.meals) {
      if (Array.isArray(response.data.meals)) {
        // Pour lookup.php?i= (détails d'un meal)
        if (response.data.meals.length === 1) {
          const translatedMeal = await translateMeal(response.data.meals[0]);
          response.data.meals = [translatedMeal];
        }
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;