import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import require from 'clipboard-copy';
import recipeContext from './recipeContext';
import { requestAPI,
  URL_REQUEST_CATEGORY_DRINKS,
  URL_REQUEST_CATEGORY_MEALS,
  URL_REQUEST_DRINKS, URL_REQUEST_MEALS } from '../services/RequestAPI';
import { readlocalStorage, saveLocalStore } from '../services/hadleStorage';

const recipesNumberRequest = 12;
const categoryNumberRequest = 5;
const SEC = 1000;

function RecipeProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [renderMeals, setRenderMeals] = useState([]);
  const [renderDrinks, setRenderDrinks] = useState([]);
  const [mirrorMeals, setMirrorMeals] = useState([]);
  const [mirrorDrinks, setMirrorDrinks] = useState([]);
  const [recipeDetail, setRecipeDetail] = useState([]);
  const [mealsCategories, setMealsCategories] = useState([]);
  const [drinkCategories, setDrinkCategories] = useState([]);
  const [showSearchBtn, setShowSearchBtn] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('');
  const [globalIngrd, setGlobalIngrd] = useState([]);
  const [isDesable, setIsDesable] = useState(true);
  const [copyed, setCopyed] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const history = useHistory();
  const { location: { pathname } } = history;

  useEffect(() => {
    const requestData = async () => {
      setIsLoading(true);

      const meals = await requestAPI(URL_REQUEST_MEALS);
      const first12Meals = meals.meals.slice(0, recipesNumberRequest);
      const drinks = await requestAPI(URL_REQUEST_DRINKS);
      const first12Drinks = drinks.drinks.slice(0, recipesNumberRequest);
      const categoriesMeals = await requestAPI(URL_REQUEST_CATEGORY_MEALS);
      const first5MealsCategories = categoriesMeals.meals.slice(0, categoryNumberRequest);
      const categoriesDrinks = await requestAPI(URL_REQUEST_CATEGORY_DRINKS);
      const first5DrinksCategories = categoriesDrinks.drinks
        .slice(0, categoryNumberRequest);

      setRenderMeals(first12Meals);
      setRenderDrinks(first12Drinks);
      setMirrorMeals(first12Meals);
      setMirrorDrinks(first12Drinks);
      setMealsCategories(first5MealsCategories);
      setDrinkCategories(first5DrinksCategories);
      setIsLoading(false);
    };
    requestData();
  }, []);

  const copy = require('clipboard-copy');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const copyUrl = (type, id) => {
    setCopyed(true);
    const URL = `http://localhost:3000${pathname}`;
    if (pathname.includes('/done-recipes') || pathname.includes('/favorite-recipes')) {
      copy(URL.replace(pathname, `/${type}s/${id}`));
    } else {
      copy(URL.replace('/in-progress', ''));
    }
    setTimeout(() => setCopyed(false), SEC);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFavorite = (currentRecipe) => {
    const current = pathname.includes('meals') ? {
      id: currentRecipe.idMeal,
      type: 'meal',
      nationality: currentRecipe.strArea,
      category: currentRecipe.strCategory,
      alcoholicOrNot: '',
      name: currentRecipe.strMeal,
      image: currentRecipe.strMealThumb,
    } : {
      id: currentRecipe.idDrink,
      type: 'drink',
      nationality: '',
      category: currentRecipe.strCategory,
      alcoholicOrNot: currentRecipe.strAlcoholic,
      name: currentRecipe.strDrink,
      image: currentRecipe.strDrinkThumb };
    if (readlocalStorage('favoriteRecipes')
    && readlocalStorage('favoriteRecipes').length > 0
    && !readlocalStorage('favoriteRecipes')?.some((recipe) => recipe.id === current.id)) {
      saveLocalStore(
        'favoriteRecipes',
        [...readlocalStorage('favoriteRecipes'), current],
      );
      setFavorited(true);
    } else if (readlocalStorage('favoriteRecipes')
    && readlocalStorage('favoriteRecipes').length > 0
    && readlocalStorage('favoriteRecipes')?.some((recipe) => recipe.id === current.id)) {
      saveLocalStore('favoriteRecipes', readlocalStorage('favoriteRecipes')
        .filter((recipe) => recipe.id !== current.id));
      setFavorited(false);
    } else {
      saveLocalStore('favoriteRecipes', [current]);
      setFavorited(true);
    }
  };

  const state = useMemo(() => ({
    setHeaderTitle,
    setRecipeDetail,
    copyed,
    setCopyed,
    setFavorited,
    favorited,
    copyUrl,
    handleFavorite,
    recipeDetail,
    showSearchBtn,
    isDesable,
    setIsDesable,
    setShowSearchBtn,
    headerTitle,
    userInfo,
    setUserInfo,
    setIsLoading,
    globalIngrd,
    setGlobalIngrd,
    setRenderMeals,
    setRenderDrinks,
    renderMeals,
    renderDrinks,
    isLoading,
    mirrorMeals,
    mirrorDrinks,
    mealsCategories,
    drinkCategories,
    history,
  }), [userInfo, renderMeals, renderDrinks,
    isLoading, mirrorMeals, mirrorDrinks,
    mealsCategories, drinkCategories,
    setRecipeDetail,
    globalIngrd,
    recipeDetail,
    favorited,
    handleFavorite,
    setUserInfo,
    headerTitle,
    setHeaderTitle,
    showSearchBtn,
    setShowSearchBtn,
    copyUrl,
    history,
    isDesable,
    copyed,
  ]);

  return (
    <recipeContext.Provider value={ state }>{children}</recipeContext.Provider>
  );
}

export default RecipeProvider;

RecipeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};
