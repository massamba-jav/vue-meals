// src/utils/translator.js
import axios from 'axios';

// Cache pour éviter de traduire plusieurs fois le même texte
const translationCache = new Map();

/**
 * Traduit un texte de l'anglais vers le français
 */
export async function translateText(text, targetLang = 'fr') {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;

    // Vérifier le cache
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text.substring(0, 500), // Limiter à 500 caractères par requête
                langpair: 'en|fr'
            }
        });

        const translatedText = response.data.responseData.translatedText;
        translationCache.set(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        console.warn('Translation failed:', error.message);
        return text;
    }
}

/**
 * Traduit un objet meal complet
 */
export async function translateMeal(meal) {
    if (!meal) return meal;

    try {
        // Traduire les champs principaux
        const translatedMeal = { ...meal };

        if (meal.strMeal) {
            translatedMeal.strMeal = await translateText(meal.strMeal);
        }

        if (meal.strInstructions) {
            translatedMeal.strInstructions = await translateText(meal.strInstructions);
        }

        return translatedMeal;
    } catch (error) {
        console.error('Error translating meal:', error);
        return meal;
    }
}

/**
 * Traduit un tableau de meals (par batch pour optimiser)
 */
export async function translateMeals(meals) {
    if (!meals || !Array.isArray(meals)) return meals;

    const batchSize = 3;
    const results = [];

    for (let i = 0; i < meals.length; i += batchSize) {
        const batch = meals.slice(i, i + batchSize);
        const translatedBatch = await Promise.all(
            batch.map(meal => translateMeal(meal))
        );
        results.push(...translatedBatch);

        // Délai entre batches pour respecter les limites de l'API
        if (i + batchSize < meals.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return results;
}