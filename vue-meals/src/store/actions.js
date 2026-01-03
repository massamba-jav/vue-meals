// src/store/actions.js
import axiosClient from '../axiosClient';
import { translateMeals, translateMeal } from '../utils/translator';

export async function searchMeals({ commit }, keyword) {
  try {
    const { data } = await axiosClient.get(`search.php?s=${keyword}`);
    
    if (data.meals) {
      const translatedMeals = await translateMeals(data.meals);
      commit('setSearchedMeals', translatedMeals);
    } else {
      commit('setSearchedMeals', []);
    }
  } catch (error) {
    console.error('Error searching meals:', error);
    commit('setSearchedMeals', []);
  }
}

export async function searchMealsByLetter({ commit }, letter) {
  try {
    const { data } = await axiosClient.get(`search.php?f=${letter}`);
    
    if (data.meals) {
      const translatedMeals = await translateMeals(data.meals);
      commit('setMealsByLetter', translatedMeals);
    } else {
      commit('setMealsByLetter', []);
    }
  } catch (error) {
    console.error('Error searching meals by letter:', error);
    commit('setMealsByLetter', []);
  }
}

export async function searchMealsByIngredient({ commit }, ing) {
  try {
    const { data } = await axiosClient.get(`filter.php?i=${ing}`);
    
    if (data.meals) {
      const translatedMeals = await translateMeals(data.meals);
      commit('setMealsByIngredients', translatedMeals);
    } else {
      commit('setMealsByIngredients', []);
    }
  } catch (error) {
    console.error('Error searching meals by ingredient:', error);
    commit('setMealsByIngredients', []);
  }
}