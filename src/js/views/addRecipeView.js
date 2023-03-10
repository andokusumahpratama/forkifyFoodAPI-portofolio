import View from './view';
import icons from 'url:../../img/icons.svg';
import { mark } from 'regenerator-runtime';

class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded';          

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArr = [...new FormData(this)];   // Untuk mendapatkan data/value dari form 
            const data = Object.fromEntries(dataArr)    // Convert array to object
            handler(data);
        })
    }

    _generateMarkup(){

    }
}

export default new AddRecipeView();