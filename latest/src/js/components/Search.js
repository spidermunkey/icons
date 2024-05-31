import axios from "axios";

class SearchPreview {
    constructor() {
        this.element = $('.mini-preview')
    }
}

export class SearchModal {

    constructor() {
        this.state = null;
        this.modal = $('.search-modal')
        this.pInput = $('.search input')
        this.input = $('.search-input input')
        this.btnClose = $('.search-modal .close')
        this.query = $('.search-input input').value
        this.cosm = $('.cosm-search')
        this.content = $('.result-wrapper');
        this.history = $('.history-wrapper');
        this.preview = new SearchPreview()
        this.btnEdit = $('.btn-edit-icon',this.content)
        this.btnClose.addEventListener('click',this.close)
        this.cosm.addEventListener('click',this.close)
        this.input.addEventListener('input', this.handleRequest())
        this.pInput.addEventListener('focus',this.handleInput)
        this.content.addEventListener('click',this.handleClick)
        this.currentElement = null;
    }

    open = async(e) => {
        this.cosm.classList.add('active')
        this.modal.classList.add('active')
        $('.search').classList.remove('active')
        this.state = 'active'
    }

    close = () => {
        this.modal.classList.remove('active')
        this.cosm.classList.remove('active')
        $('.search').classList.add('active')
        this.state = 'inactive'
    }

    toggle = () => {
        this.modal.classList.contains('active') ? closeSearch() : openSearch()
    }

    highlightQuery(name){

            const query = lowercase(this.query)
            // Find the index of the query in name
            var index = name.indexOf(query);
        
            if (index !== -1) {
              // Split the name into three parts: before, matched, after
              var beforeText = name.substring(0, index);
              var matchedText = name.substring(index, index + query.length);
              var afterText = name.substring(index + query.length);
        

              return `<span>${beforeText}<span class="highlighted">${matchedText}</span>${afterText}</span>`
            }
            else return name
          
    }
    
    async copyToClipboard() {
        const notification = $('.mini-preview .notification-copy.success');
        console.log(notification)
        const showNote = [
            { transform: "translateY(30px)"},
            { transform: "translateY(0)", offset: 0.03},
            { transform: "translateY(0)", offset:0.9},
            { transform: "translateY(30px)",easing: "ease-out",offset: 1}
        ]
        
        const timing = {
            duration: 3500,
        }

        const status = await app.copy(this.currentElement.innerHTML)
        console.log(status)
        if(status) notification.animate(showNote,timing)


    }

    updatePreview = (props) => {
        // const svg = document.createElement('div')
        // svg.innerHTML = props.markup;
        const highlightedTitle = this.highlightQuery(lowercase(props.name));
        $('.mini-preview .icon-prev').innerHTML = props.markup;
        $('.mini-preview .icon-prev svg').setAttribute('height','64px')
        $('.mini-preview .icon-prev svg').setAttribute('width','64px')
        $('.icon-prev').dataset.id = props.id;
        $('.mini-preview .icon-name .title').innerHTML = highlightedTitle;
        $('.mini-preview .icon-category .title').textContent = props.category;
        this.currentElement = $('.icon-prev')
    }

    handleClick = async (e) => {
        const icon = e.target.closest('.showcase.svg-wrapper');
        if (icon) {
            const id = icon.dataset.id
            let props;
            const res = await axios.get(`http://localhost:${1279}/icons/all/${id}`)
            const {data} = res;
            console.log(Object.hasOwnProperty(data,'id'))
            if (data.id == id)
                this.updatePreview(data,this.query)
        }
    }

    handleSearch = async (inpvalue) => {

        if (inpvalue === ''){
            this.handleNull();
            return;
        }

        this.showSearchPending()
        const res = await axios.post(`http://localhost:${1279}/icons/all`, {
            query: inpvalue !== undefined ? inpvalue : this.query,
        })
        
        const { query,data } = res.data;

        const queryIsCurrent = this.query === query || this.query === inpvalue;
        console.log(inpvalue === this.query)

        if (queryIsCurrent)
            this.handleResponse(query,data)
    
    }

    handleInput = async (e) => {

        console.log(this.session)
        this.open();
        this.query = e.target.value;
        this.pInput.value = e.target.value;
        this.input.focus();
        console.log(this.query)
        this.showResults();
        this.handleSearch(e.target.value);

        // if (this.query == "") this.showHistory();
        // else await this.handleSearch(e.target.value);
    }

    handleRequest = (e) => {

        let timeoutId;

        // debounced
        return (e) => {

            this.open();
            this.query = e.target.value;
            clearTimeout(timeoutId);
            this.showResults(e.target.value);
            // if (this.query == "") this.showHistory()
            // else this.showResults()

            timeoutId = setTimeout( this.handleInput.bind(this,e), 400 )
        }


    }

    handleResponse = (query,data) => {
        const length = data.length;
        const noResult = length == 0;

        if (noResult) $('.bg-image').classList.add('active')
        else $('.bg-image').classList.remove('active');

        this.showSearchStatus(length,query)
        // $('.results').innerHTML = ` <span>${length == 0 ? 'No Results' : `${length} ${length == 1 ? 'Result' : 'Results'}`} Found For "${query}" </span>`

        this.render(data);

        if (noResult){
            this.handle
        }

        this.updatePreview(data[0])

    }

    handleNull() {
        this.handleResponse("",[]);
    }

    showSearchStatus(length,query){
        $('.results').innerHTML = ` <span>${length == 0 ? 'No Results' : `${length} ${length == 1 ? 'Result' : 'Results'}`} Found For "${query}" </span>`
    }

    showSearchPending() {
        $('.results').innerHTML = 'searching....'
    }
    createIcon(props) {
            let {name,category,id,cid,markup,rebased} = props
            let el = document.createElement('div')
            el.classList.add('showcase')
            el.classList.add('svg-wrapper')
            el.dataset.category = category
            el.dataset.name = name
            el.dataset.cid = cid
            el.dataset.id = id
            el.innerHTML = markup || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z"></path></svg>`
            if (rebased) el.dataset.rebased = rebased
            return el
    }

    render(data) {
        console.log('showing results')
        const wrapper = $('.content-wrapper');
        wrapper.innerHTML = '';
        data.forEach(prop => wrapper.appendChild(this.createIcon(prop)))
    }

    showResults(data) {
        this.content.classList.add('active');
        this.history.classList.remove('active');
        return data
    }

    showHistory() {
        console.log('showing history')
        this.content.classList.remove('active');
        this.history.classList.add('active');
    }
}