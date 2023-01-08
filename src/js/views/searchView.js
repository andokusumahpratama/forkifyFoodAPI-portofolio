class SearchVIew{
    #parentElement = document.querySelector('.search');  

    #clearInput(){
        this.#parentElement.querySelector('.search__field').value = '';
    }

    getQuery(){ // view digunakan untuk manipulasi DOM html
        const query = this.#parentElement.querySelector('.search__field').value;
        this.#clearInput();        
        return query;
    }

    // Publiser memberikan
    addHandlerSearch(handler){
        this.#parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();  // handler ini adalah handler search dalam kurung tsb
        })
    }
}

export default new SearchVIew();