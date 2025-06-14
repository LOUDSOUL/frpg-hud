import { STORAGE_KEYS } from "../constants";


export let returnRate = GM_getValue(STORAGE_KEYS.RETURN_RATE, 1.45);
export const setReturnRate = (rate) => returnRate = rate;

export let recipes = GM_getValue(STORAGE_KEYS.RECIPES, {});
export const setRecipes = (newRecipes) => recipes = newRecipes;
