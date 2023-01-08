// import { from } from "core-js/fn/array";
import { keys } from "regenerator-runtime";
import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAX} from './helper';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmark: [],
};

const createRecipeObject = function(data){
    const recipe = data.data.recipe;    // CARA 1 BISA JUGA MENGGUNAKAN CARA (const {recipe} = data.data;)
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}),   // Lihat di latihan Data Strukture Logical Assigment
        
    };
}

export const loadRecipe = async function(id){

    try{
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

        state.recipe = createRecipeObject(data);

        if(state.bookmark.some(bookmark => bookmark.id === id)){
            state.recipe.bookmarked = true;
        }else state.recipe.bookmarked = false;

        console.log(state);
    }catch(err){
        // Temp Error        
        throw err;
    }    
}

export const loadSearchResult = async function(query){
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);
        
        state.search.results = data.data.recipes.map(rec =>{
            return{
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key}),
            };
        });
        state.search.page = 1;        
    } catch (err) {        
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    
    return state.search.results.slice(start, end);  // membatasi tampilan array
}

export const updateServings = function(newServings){    
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);
        // newQt = oldQt * newServings / oldServings    // Rumus        
    });

    state.recipe.servings = newServings;    
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarkss', JSON.stringify(state.bookmark))
}

export const addBookmark = function(recipe){
    // Add Bookmark
    state.bookmark.push(recipe);    

    // Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id){
    const index = state.bookmark.findIndex(el => el.id === id);
    state.bookmark.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

// Untuk menyimpan kedalam localstorage
const init = function(){
    const storage = localStorage.getItem('bookmarkss');

    if (storage) {
        state.bookmark = JSON.parse(storage);
    }
}
init();

// Ini untuk membersihkan data dari localstorage
const clearBookmarks = function(){
    localStorage.clear('bookmarkss');
}
// clearBookmarks();

export const uploadRecipe = async function(newRecipe){
    try {
        // console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe).filter(       // Conver Object to Array dan mencari / memfilter data
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing =>{
            const ingArr = ing[1].split(',').map(el => el.trim()) 
            // const ingArr = ing[1].replaceAll(' ','').split(',');     // 0.5,Kg,Rice output = {quantity: '0.5', unit: 'Kg', description: 'Rice'}

            if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format');

            const [quantity, unit, description] = ingArr
            return {quantity: quantity ? +quantity : null, unit, description};
        })        
        // console.log(ingredients);

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceURL,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients, 
        };        
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        // console.log(state.recipe);
        addBookmark(state.recipe)

    } catch (error) {
        throw error;
    }

    
}