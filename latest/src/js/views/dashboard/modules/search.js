export const searchHandler = {
  search(){
    const handleSearch = async (event) => {
        const searchQuery = event.target.value
        this.state.query = searchQuery
        if (searchQuery === '') return this.cancelSearch()

        $('.btn-cancel').classList.add('active')
        const currentQuery = searchQuery ? searchQuery : this.state.query
        const result = await this.store.search(currentQuery)
        const { query , data } = result
        const queryIsCurrent = this.state.query === query || this.state.query === searchQuery

        if (queryIsCurrent) {
            this.dashboard.setLoading()

            const collection = this.store.createCollection({ 
                icons: data, 
                meta: { name: 'search' }
            })

            this.dashboard.setLoading()
            this.state.searchView = collection
            this.dashboard.render(collection)
            this.preview.update(collection.cursor.current)
            this.setTab('search')
        }
    }
    const inputThrottler = () => {
        let timeoutId
        return (e) => {
            this.state.query = e.target.value
            clearTimeout(timeoutId)
            timeoutId = setTimeout( handleSearch.bind(this,e), 400 )
        }
    }
    return inputThrottler()
},
cancelSearch() {
    $('.passive-search input').value = ''
    const name = this.collection.name
    this.renderCollection(name ? name : 'home')
    $('.btn-cancel').classList.remove('active')
}
}
