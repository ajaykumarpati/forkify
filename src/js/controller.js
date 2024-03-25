import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import BookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarkView from './views/bookmarkView.js';
import { MODAL_CLOSE_TIMEOUT_SECONDS } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPerPage());
    bookmarkView.update(model.state.bookmarks);

    // 1) Loading the recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    //2) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1) Get the search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // 2) Load the results
    await model.loadSearchResults(query);

    // 3) Render the results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPerPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (goto) {
  resultsView.render(model.getSearchResultsPerPage(goto));
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  //Update the recipe servings
  model.updateServings(newServing);

  //Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  //Render Bookmark view
  bookmarkView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render the recipe
    recipeView.render(model.state.recipe);

    //Show success message
    addRecipeView.renderMessage();

    //Add the new recipe to bookmarks
    bookmarkView.render(model.state.bookmarks);

    //Change the ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIMEOUT_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
