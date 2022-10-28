import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import recipeContext from '../context/recipeContext';
import { requestAPI } from '../services/RequestAPI';
import RecipeDetailsComponents from '../components/RecipesDetailsComponets';

export const ENDPOINT_ID_MEALS = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
export const ENDPOINT_ID_DRINKS = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

function RecipeDetails({ match }) {
  const { setIsLoading } = useContext(recipeContext);
  const [mealsDetails, setMealsDetails] = useState([]);
  const [drinksDetails, setDrinksDetails] = useState([]);
  const { params: { id } } = match;
  const history = useHistory();
  const { location: { pathname } } = history;

  useEffect(() => {
    const requestData = async () => {
      setIsLoading(true);
      if (pathname.includes('meals')) {
        const detailsMeals = await requestAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setMealsDetails(detailsMeals.meals);
      }
      if (pathname.includes('drinks')) {
        const detailsDrinks = await requestAPI(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        setDrinksDetails(detailsDrinks.drinks);
      }
      setIsLoading(false);
    };
    requestData();
  }, [id, pathname, setIsLoading]);
  return (
    <div>
      <RecipeDetailsComponents foods={ mealsDetails } drinks={ drinksDetails } />
    </div>
  );
}

RecipeDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default RecipeDetails;
