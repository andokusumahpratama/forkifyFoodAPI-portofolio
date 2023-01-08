import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View{
    _data;

    /**
     * Render the received object to the DOM 
     * @param {Object | Object[]} data The data to be rendered 
     * @param {boolean} [render=true]  if false, create markup string instead of rendering to the DOM 
     */
    render(data, render = true){
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data){   /* UPDATE INI UNTUK MERUBAH (button +-) ISI TAMPILAN TANPA  RELOAD */
        // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();        
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));        
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
                
        newElements.forEach((newEl, i) =>{
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));
            
            // Ini untuk merubah/update isi text tanpa reload
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                // console.log('💥 ', newEl.firstChild.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }

            // Ini untuk merubah/update isi atribute pada button data-update-To
            if(!newEl.isEqualNode(curEl)){
                // console.log(Array.from(newEl.attributes));
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }    

    renderSpinner = function(){
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    };

    renderError(message = this._errorMessage){
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message){
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}