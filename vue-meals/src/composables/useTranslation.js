import { ref } from 'vue';
import { translateText, translateMeal, translateMeals } from '../utils/translator';

export function useTranslation() {
  const isTranslating = ref(false);
  
  const translate = async (text) => {
    isTranslating.value = true;
    try {
      return await translateText(text);
    } finally {
      isTranslating.value = false;
    }
  };
  
  const translateMealData = async (meal) => {
    isTranslating.value = true;
    try {
      return await translateMeal(meal);
    } finally {
      isTranslating.value = false;
    }
  };
  
  const translateMealsData = async (meals) => {
    isTranslating.value = true;
    try {
      return await translateMeals(meals);
    } finally {
      isTranslating.value = false;
    }
  };
  
  return {
    translate,
    translateMealData,
    translateMealsData,
    isTranslating
  };
}