import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// ini utk menghilangkan console.log()  module.hot berasal dari parcel
if (module.hot) {
    module.hot.accept();
}

const { async } = require("regenerator-runtime");

const controlRecipe = async function(){
    try{                        
        const id = window.location.hash.slice(1);        

        // Untuk dilakukan handling error ketika tidak melakukan request
        if(!id) return;

        // 0) Dilakukan render Spinner
        recipeView.renderSpinner();

        // 1) Update result view to mark selected search result
        resultView.update(model.getSearchResultsPage());    // Untuk tidak reload saat di klik menu pada hasil search ke dalam recipeview
        
        // 2) Updating bookmarks view        
        bookmarksView.update(model.state.bookmark);

        // 3) Loading Recipe        
        await model.loadRecipe(id);     // menggunakan await untuk menunggu dan menghasilkan output yg dikirmkan. ver(ES22)
        const {recipe} = model.state;
        
        // 4) Rendering recipe
        recipeView.render(model.state.recipe);     
        

    } catch(err){                
        recipeView.renderError();
    }
}

const controlSearchResult = async function(){    

    try {
        resultView.renderSpinner();

        // 1) Get search Query
        const query = searchView.getQuery();

        if (!query) return;        

        // 2) Load search result
        await model.loadSearchResult(query);

        // 3) Render Result                
        // resultView.render(model.state.search.results);
        resultView.render(model.getSearchResultsPage());

        // 4) Render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
}

const controlPagination = function(goToPage){
    // console.log(goToPage);
        // 1) Render New Result                        
        resultView.render(model.getSearchResultsPage(goToPage));

        // 2) Render New pagination buttons
        paginationView.render(model.state.search);    
}

const controlServings = function(newServings){
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe);    
    recipeView.update(model.state.recipe);  //KETIKA TOMBOL BUTTON + - DIKLIK
}

const controlBookmark = function(){

    // 1) Add/Remove bookmarks    
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    
    // 2) Update recipe view
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks 
    bookmarksView.render(model.state.bookmark)
}

const controlBookmarks = function(){
    bookmarksView.render(model.state.bookmark);
}

const controlAddRecipe = async function(newRecipe){    
    try {        
        // Show loading spinner
        addRecipeView.renderSpinner();

        // Upload the new recipe data
        await model.uploadRecipe(newRecipe)  
        // console.log(model.state.recipe);          

        // render recipe
        recipeView.render(model.state.recipe);        

        // Success message
        addRecipeView.renderMessage();

        // Render bookmark view
        bookmarksView.render(model.state.bookmark);

        // Change ID in URL Browser
        window.history.pushState(null, '', `#${model.state.recipe.id}`);        

        // Close Form window
        setTimeout(function(){
            addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC * 1000)
    } catch (error) {
        console.log(`💥`, error);   
        addRecipeView.renderError(error.message);
    }    
}

/* Cara ini disebut publisher - Subcriber Pattern */
const init = function(){
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlBookmark);
    searchView.addHandlerSearch(controlSearchResult);
    paginationView.addHandlerClick(controlPagination);    
    addRecipeView.addHandlerUpload(controlAddRecipe);    
}
init();

