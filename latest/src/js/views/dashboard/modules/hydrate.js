export async function hydrate(){

    this.dashboard.element.onmousedown = (e) => this.handleDashboardClick(e)
    this.editor.onmousedown = (e) => this.handleEditorInterface(e)
    this.dashboard.element.oncontextmenu = (e) => this.toggleContextMenu(e)
    this.dashboard.element.addEventListener('click',(e) => this.handleClickOutsideContext(e))

    $('.search.passive-search').addEventListener('input',this.search())
    $('.search.passive-search input').focus()
    $('.btn-cancel').addEventListener('click',() => this.cancelSearch())

    $('.collection-menu').addEventListener('click',(e) => this.delegateCollectionMenuEvents(e))
    $('.menu-modals').addEventListener('click',(e) => this.delegateMainMenuEvents(e))

    $('.home').addEventListener('click', () => this.renderCollection(this.tab ? this.tab : 'home'))
    $('.info-bar .info-text').addEventListener('click', () => this.renderCollection('home'))

    $('.preview-widget').addEventListener('click',(e) => this.openPreviewFromWidget(e))
    $('.close-preview').addEventListener('click',(e) => this.closePreview(e))
    $('.bench-widget').addEventListener('click',(e) => this.renderPocket(e))
    $('.current-collection-widget').addEventListener('click',(e) => this.openCollectionMenu(e))
    $('.collection-menu .close-menu').addEventListener('click',(e) => this.closeCollectionMenu(e))
    $('.pinned-widget').addEventListener('click',(e) => this.renderPinnedCollection(e))

    $('.preview .btn-bench.toggler').addEventListener('click',() => this.selected ? this.pocket.add(this.selected): null)
    $('.preview__window--navigator.btn-next').addEventListener('click',() => this.togglePreviewNext())
    $('.preview__window--navigator.btn-prev').addEventListener('click',() => this.togglePreviewPrevious())
    $('[data-role="window"][data-tab="collections"]').addEventListener('click', (event) => this.delegateAddToCollectionWindowEvents(event))
    $('.add-to-collection').addEventListener('click',() => this.openAddToCollectionMenu())
    // open fullscreen color editor
    $('.pv-action').addEventListener('click',() => this.openColorEditor())
    $('.save-preset.action').addEventListener('click', () => this.saveCurrentPreset())
    $('.preset-option.icon').addEventListener('click',() => {
        // show icon presets
    })
    $('.preset-option.collection').addEventListener('click',() =>{
        // show current collection presets
    })
    $('.btn-create-collection').addEventListener('click',() => this.loadCreateCollectionForm())

    $('.db-context .btn.copy').addEventListener('click',(e) => this.copyCurrentIcon(e))
    $('.db-context .btn.pocket').addEventListener('click',() => this.togglePocketFromContext())
    $('.db-context .c-atp').addEventListener('click',() => this.togglePocketFromContext())
    $('.db-context .open-preview').addEventListener('click',() => this.openPreviewFromContext('position'))
    $('.db-context .o-color').addEventListener('click',() => this.openPreviewFromContext('color'))
    $('.db-context .o-position').addEventListener('click',() => this.openPreviewFromContext('position'))
    $('.db-context .o-components').addEventListener('click',() => this.openPreviewFromContext('components'))
    $('.db-context .btn.info').addEventListener('click',() => $('.db-context .info-card').classList.toggle('active'))
    $('.db-context .card-icon').addEventListener('click',() => $('.db-context .card-icon').classList.toggle('active'))

    this.notify('hydrated')
    return this;
}
