import View from './view';
import icons from 'url:../../img/icons.svg';
import { mark } from 'regenerator-runtime';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');    
    
    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            
            if (!btn) return;
            // console.log(btn);          
            console.log(btn.dataset.goto, 'ae');  

            const goToPage = +btn.dataset.goto;     // + untuk convert menjadi number                        
            handler(goToPage); // handler ini adalah handler search dalam kurung tsb
        });
    }

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other page
        if(curPage === 1 && numPages > 1){
            return this._generateNextButton(curPage);
        }

        // Page 1, and there are NO other page

        // Last page
        if(curPage === numPages && numPages > 1){
            return this._generatePrevButton(curPage);
        }

        // Other page
        if(curPage < numPages){
            return this._generateNextPrevButton(curPage);
        }

        return '';
    }

    _generateNextPrevButton(curPage){           
        let markup = this._generatePrevButton(curPage);
        markup += this._generateNextButton(curPage);
        return markup;      
    }

    _generateNextButton(curPage){
        return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${curPage + 1}</span>
            </button>
        `;
    }

    _generatePrevButton(curPage){
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
        `;
    }
}

export default new PaginationView();