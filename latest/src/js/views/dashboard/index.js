
import { View } from '../../view.js'

import { Preview } from './../../components/Preview.js'
import { ContextMenu } from '../../components/Context.js'
import { Menu } from '../../components/Menu.js'
import { Collection, CollectionWidget } from '../../components/Collection.js'
import { ColorPicker } from '../../components/ColorPicker.js'
import { CollectionPreview } from '../../components/CollectionPreview.js'

import { MainMenu } from '../../html/MainMenu.js'
import { COSM } from '../../html/cosm.js'
import { ContextMenuElement } from '../../html/ContextMenu.js'
import { DashboardHeader } from '../../html/DashboardHeader.js'
import { DashboardModal } from '../../html/DashboardModal.js'
import { InterfaceNotificationBar } from '../../html/InterfaceNotificationBar.js'
import { SettingsInterface } from '../../html/SettingsInterface.js'
import { CurrentCollectionWidget } from '../../html/CurrentCollectionWidget.js'
import { PreviewWidget } from '../../html/PreviewWidget.js'
import { PinnedCollectionWidget } from '../../html/PinnedCollectionWidget.js'
import { PocketWidget } from '../../html/PocketWidget.js'

import { CollectionInterface } from '../../html/CollectionInterface.js'
import { PreviewInterface } from '../../html/PreviewInterface.js'
import { icons } from '../../html/PresetIcons.js'
export class Dashboard extends View {
  constructor(store) {
    super(store)
    this.state = {
        tabName: 'home',
        group: undefined,
        clicked: undefined,
        context: {},
        collection: new Collection({}),
        pocket: this.store.pocket,
        mode: 'click',
        pinned: 'favorites',
        cursor: undefined,
        ccActive: false,
        cSettingsActive: false,
        previousTab:{},
        query: '',
        searchView: {},
        preset: {},
    }
    this.on('rendered',() => {

        this.preview = new Preview()
        this.collectionPreview = new CollectionPreview()
        this.colorPicker = new ColorPicker({})
        this.contextMenu = new ContextMenu()
        this.menu = new Menu()

        this.collectionSettingsWindow = $('.widget-settings.widget-wrapper')
        this.element = $('#DASHBOARD');
        this.panel = $('.db-res',this.element);
    })
  }
    get collection(){
        return this.state.collection
    }
    get currentView(){
        return this.tab === 'search' ? this.state.searchView : this.state.collection
    }
    get currentIcon() {
        if (!objectIsEmpty(this.currentView)) return this.currentView.cursor.current
    }
    get cursor(){
        return this.currentView.cursor
    }
    get tab(){
        return this.state.tabName
    }
    get selected() {
        return this.state.selected
    }
    get pocket(){
        return this.state.pocket
    }

    async render(collectionID = 'home'){
        $('#app').innerHTML = this.getHTML()
        this.notify('rendered')
        await this.hydrate()
        await this.load(collectionID)
        return this
    }
    async hydrate(){
        this.element.onmousedown = (e) => this.handleDashboardClick(e)
        this.element.oncontextmenu = (e) => this.toggleContextMenu(e)
        this.element.addEventListener('click',(e) => this.handleClickOutsideContext(e))
        // handle preview
        this.preview.on('viewbox changed',this.updateSavedPreset.bind(this))
        this.preview.on('icon updated',(icon,targetElement) => {
            this.state.preset.name = 'untitled'
            this.colorPicker.update(icon,targetElement)
        })
        this.preview.on('close',() => {
            if (this.colorPicker.active)
                this.colorPicker.close()
            if (this.colorPicker.fsActive)
                this.colorPicker.closeFS()
        })
        $$('.preview__tabber--tab').forEach( tab => {
            tab.addEventListener('click',(e) => {
                $$('.preview__tabber--tab').forEach(tab => tab.classList.remove('active'))
                tab.classList.add('active')
                const tabName = tab.dataset.tab
                this.preview.openTab(tabName)
                if (tabName !== 'color') this.colorPicker.close()
            })
        })
            // preview cosm
        this.preview.element.addEventListener('click', (event) => {
            const cosmSettings = this.preview.settingsActive == true && (
                !event.target.closest('.settings-editor') 
                && !event.target.closest('.preview-settings') 
                && !event.target.closest('[data-tab="presets"]')
                && !event.target.closest('.preset-header .current-preset')
            );
            const cosmColorPicker = (this.colorPicker.active || this.colorPicker.fsActive) && !event.target.closest('.preview__modals--modal.color') && !event.target.closest('.color-editor')
            
            if (cosmSettings) {
                this.preview.closeSettings()
            }
            if (cosmColorPicker){
                this.colorPicker.close()
            }
        })

        $('.color-settings-controller .btn-setting.save-colorset').addEventListener('click',async () => {

            let colorset = this.collectionPreview.currentColorSet
            let collection = this.state.collection
            let colorSetID = uuid()
            let colors = {
                csid:colorSetID,
                name: 'untitled',
                colorset_type: 'global',
                ...colorset,
            }
            console.log('saving colorset to collection....')
            const response = await this.store.saveCollectionColorset(collection.meta.cid,colors)
            console.log('SAVE ACTION RESPONSE....',response)
            collection.colors = {
                ...collection.colors,
                [colorSetID]: colors
            }
        })
        // icons settings menu
        const settingsTabs = $$('.settings-tab')
        const settingsModals = $$('.settings-interface .settings-modal')
        settingsTabs.forEach(tab => {
            tab.addEventListener('click',() => {
                settingsTabs.forEach(tab => tab.classList.remove('active'))
                settingsModals.forEach(modal => modal.classList.remove('active'))
                const modal = $(`.settings-modal[modal=${tab.getAttribute('tab')}]`)
                if (modal){
                    modal.classList.add('active')
                    tab.classList.add('active')
                }
            })
        })
        $('.search.passive-search').addEventListener('input',this.search())
        $('.search.passive-search input').focus()
        $('.btn-cancel').addEventListener('click',() => this.cancelSearch())

        $('.collection-menu').addEventListener('click',(e) => this.handleCollectionFilters(e))
        $('.menu-modals').addEventListener('click',(e) => this.delegateMainMenuEvents(e))

        $('.home').addEventListener('click', () => this.renderCollection(this.tab ? this.tab : 'home'))

        $('.preview-widget').addEventListener('click',(e) => this.openPreviewFromWidget(e))
        $('.close-preview').addEventListener('click',(e) => this.closePreview(e))
        $('.bench-widget').addEventListener('click',(e) => this.renderPocket(e))
        $('.current-collection-widget').addEventListener('click',(e) => this.openCollectionMenu(e))
        $('.collection-menu .close-menu').addEventListener('click',(e) => this.closeCollectionMenu(e))
        $('.pinned-widget').addEventListener('click',(e) => this.renderPinnedCollection(e))
        // collection settings menu
        $('.preview .btn-bench.toggler').addEventListener('click',() => this.selected ? this.state.bench.add(this.selected): null)
        $('.preview__window--navigator.btn-next').addEventListener('click',() => this.togglePreviewNext())
        $('.preview__window--navigator.btn-prev').addEventListener('click',() => this.togglePreviewPrevious())
        $('[data-role="window"][data-tab="collections"]').addEventListener('click', (event) => this.delegateAddToCollectionWindowEvents(event))
        $('.add-to-collection').addEventListener('click',() => this.openAddToCollectionMenu())
        // open fullscreen color editor
        $('.pv-action').addEventListener('click',() => this.openColorEditor())
        $('.icon-label.open-colors').addEventListener('click',() => this.toggleColorEditor())
        $('.save-preset-modal').addEventListener('click', this.handleSavePreset() )
        $('.save-preset.action').addEventListener('click', async () => {
            await this.ready
            const showSavePopup = () => savePresetModal.classList.toggle('active')
            const savePresetModal = $('.save-preset-modal')
            showSavePopup()
        })
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
    async load(collectionID) {
        this.preview.close()
        if (this.tab === 'pocket') this.renderPocket()
        else await this.renderCollection( collectionID ? collectionID : this.tab ) 
        this.notify('loaded')
        return this.state
    }

    setLoading(){
        this.panel.innerHTML = `loading...`
    }
    setReady(){
        this.panel.classList.add('active')
    }

    async copyFromWidget(){
        if (!this.preview.icon) return
        await this.preview.copyToClipboard()
    }
    async copyCurrentIcon(e){
        if (!this.currentIcon || !this.currentIcon.markup) return
        await window.navigator.clipboard.writeText(this.currentIcon.markup)
        console.log('element copied')
    }

    search(){
        this.state.searchActive = true;
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
                this.setLoading()
                const collection = new Collection({ 
                    icons: data, 
                    meta: { name: 'search',cid:'search' }
                })
                this.state.searchView = collection
                collection.render()
                this.preview.update(collection.cursor.current)
                this.setTab(collection)
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
    }
    cancelSearch() {
        $('.passive-search input').value = ''
        const name = this.collection.name
        if (name == 'all' || name == 'home') {
            this.renderDashboardHome()
        }
        else {
            this.collection.render()
        }
        $('.btn-cancel').classList.remove('active')
        this.searchActive = false
    }

    togglePocketFromContext(){
        if (!this.context.icon) return;
        this.state.pocket.add((this.context.icon))
    }
    toggleContextMenu(event) {
        const clickedIcon = clicked('.dashboard .svg-wrapper',event)
        let icon;
        if (clickedIcon) icon = this.state.context.find(clickedIcon.dataset.id)
        this.state.inspected = icon;
       this.contextMenu.handleRightClick(event,icon)
    }
    openPreviewFromContext(tab){
        hideMiniWidgets()
        this.preview.update(this.state.context.icon)
        this.preview.open(tab)
       this.contextMenu.close()
    }
    handleClickOutsideContext(event) {
        if (!event.target.closest('.db-context')) { 
            event.preventDefault()
           this.contextMenu.close()
        }
    }

    loadCollectionColors(){
        let colorDataContainer = $('.icon-color-editor .color-data');
            colorDataContainer.innerHTML = ''
        let collectionColors = this.state.collection.colors
        let collectionPresetHTML = (colorset,type) => {
            const container = document.createElement('div')
            container.classList.add('colorset')
            if (type === 'collection') {
                container.innerHTML = `
                <div class="type-container colorset-data">
                    <div class="preset-type-label">Preset Name:</div>
                    <div class="preset-type">
                        ${ colorset?.name || 'untitled' }
                    </div>
                </div>
                <div class="colorset-colors">
                    <div class="global-fill-container reflector">
                        <div class="gf-label">Global Fill</div>
                        <div class="gf-reflector">${colorset.shapes.fill}</div>
                    </div>
                    <div class="global-stroke-container reflector">
                        <div class="gf-label">Global Stroke</div>
                        <div class="gf-reflector">${colorset.shapes.stroke}</div>
                    </div>
                </div>
                <div class="colorset-controls">
                    <div class="btn-apply-colorset">apply colorset</div>
                </div> 
                `
                $('.global-fill-container .gf-reflector',container).style.background = colorset.shapes.fill;
                $('.global-stroke-container .gf-reflector',container).style.background = colorset.shapes.stroke;
                $('.btn-apply-colorset',container).addEventListener('click', () => {
                    this.colorPicker.updateFillGroup(colorset.shapes.fill)
                    this.colorPicker.updateStrokeGroup(colorset.shapes.stroke)
                })
            } 
            return container
        }
        for (const id in collectionColors){
            let colorset = collectionColors[id]
            console.log('APPENDING COLORSET [COLLECTION]',collectionColors,colorset)
            colorDataContainer.appendChild(collectionPresetHTML(colorset,'collection'))
        }
    }
    loadColorMenu(){
        let currentAnimation
        const collection = this.currentView
        const meta = collection.meta
        const currentIcon = this.currentIcon
        const collectionID = meta.cid
        const iconColors = currentIcon?.colors
        const collectionColors = collection?.colors

        const iconColorsTab = $('.color-editor-modal[modal="icons"]')
        const collectionColorsTab = $('.color-editor-modal[modal="collections"]')
        const recentColorsTab = $('.color-editor-modal[modal="recent"]')
        const iconColorsTabber = $('.color-editor-tab[tab="icons"]')
        const collectionColorsTabber = $('.color-editor-tab[tab="collections"]')
        const recentColorsTabber = $('.color-editor-tab[tab="recent"]')
        const tab = collection.state?.colorsetTab || 'collections'
        const currentTab = $(`.color-editor-modal[modal="${tab}"]`)
        const tabs = [
            ['icons',iconColorsTab,iconColorsTabber],
            ['collections',collectionColorsTab,collectionColorsTabber],
            ['recent',recentColorsTab,recentColorsTabber],
        ]
        tabs.forEach(tab => tab[2].addEventListener('click', () => {
            tabs.forEach(tab => {
                tab[2].classList.remove('active')
                tab[1].classList.remove('active')
            })
            tab[1].classList.add('active')
            tab[2].classList.add('active')
            collection.state.colorsetTab = tab[0]
        }))
        currentTab.classList.add('active')
        console.log(tab)
        $(`.color-editor .preset-option[tab=${tab}]`).classList.add('active')

        const colorDataContainer = $('.color-editor .color-data')

        const presetIsDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lgxgw9-0265D74VQICG"><path d="M10.5 16C10.5 15.1716 11.1716 14.5 12 14.5C12.8284 14.5 13.5 15.1716 13.5 16C13.5 16.8284 12.8284 17.5 12 17.5C11.1716 17.5 10.5 16.8284 10.5 16Z" fill="black" pid="m4lgxgw9-00NA2554UM3C" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.81049 4.00497C10.0428 3.91246 10.2852 3.8475 10.5327 3.81144C12.006 3.59678 13.4327 4.42661 13.9745 5.81335L14.0495 6.00537C14.1424 6.2433 14.2087 6.4908 14.2472 6.74334L14.4638 8.16565L15.9467 7.9398L15.7301 6.51749C15.675 6.15544 15.5799 5.80062 15.4466 5.45951L15.3716 5.26749C14.5758 3.23066 12.4804 2.01182 10.3165 2.32712C9.95295 2.38008 9.59691 2.47548 9.25563 2.61137C7.22397 3.42026 6.01867 5.52354 6.34793 7.68538L6.37897 7.88919C6.43411 8.25123 6.52918 8.60605 6.66245 8.94716L7.3166 10.6215L6.93512 10.6519C5.85239 10.7384 4.96829 11.5523 4.79277 12.6242C4.4267 14.8598 4.4267 17.1401 4.79277 19.3758C4.96829 20.4477 5.85239 21.2616 6.93512 21.348L8.43125 21.4675C10.8066 21.6571 13.1934 21.6571 15.5687 21.4675L17.0649 21.348C18.1476 21.2616 19.0317 20.4477 19.2072 19.3758C19.5733 17.1401 19.5733 14.8598 19.2072 12.6242C19.0317 11.5523 18.1476 10.7384 17.0649 10.6519L15.5687 10.5325C13.3426 10.3548 11.1065 10.3436 8.87916 10.499L8.0596 8.4013C7.96665 8.16337 7.90033 7.91587 7.86187 7.66334L7.83083 7.45953C7.60666 5.98768 8.42727 4.55569 9.81049 4.00497ZM15.4494 12.0277C13.1534 11.8445 10.8466 11.8445 8.55062 12.0277L7.05449 12.1472C6.65956 12.1787 6.33708 12.4756 6.27306 12.8666C5.93327 14.9417 5.93327 17.0583 6.27306 19.1334C6.33708 19.5244 6.65956 19.8213 7.05449 19.8528L8.55062 19.9722C10.8465 20.1555 13.1534 20.1555 15.4494 19.9722L16.9455 19.8528C17.3404 19.8213 17.6629 19.5244 17.7269 19.1334C18.0667 17.0583 18.0667 14.9417 17.7269 12.8666C17.6629 12.4756 17.3404 12.1787 16.9455 12.1472L15.4494 12.0277Z" fill="black" pid="m4lgxgw9-01EYDRNJVEAJ" stroke="null"></path></svg>'
        const presetNotDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lgxgw6-003EWOTOIWH9"><path d="M10.5 16C10.5 15.1716 11.1716 14.5 12 14.5C12.8284 14.5 13.5 15.1716 13.5 16C13.5 16.8284 12.8284 17.5 12 17.5C11.1716 17.5 10.5 16.8284 10.5 16Z" fill="black" pid="m4lgxgw6-02FPUN3FPP0X" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.62165 10.5971L7.30621 7.75816C7.26577 7.39418 7.26577 7.02684 7.30621 6.66286L7.32898 6.45796C7.57046 4.28457 9.27907 2.56492 11.4509 2.30941C11.8157 2.26649 12.1843 2.26649 12.5491 2.30941C14.7209 2.56492 16.4295 4.28458 16.671 6.45797L16.6937 6.66286C16.7342 7.02684 16.7342 7.39418 16.6937 7.75815L16.3783 10.5971L17.0649 10.6519C18.1476 10.7384 19.0317 11.5523 19.2073 12.6242C19.5733 14.8598 19.5733 17.1401 19.2073 19.3758C19.0317 20.4477 18.1476 21.2616 17.0649 21.348L15.5688 21.4675C13.1934 21.6571 10.8067 21.6571 8.43128 21.4675L6.93515 21.348C5.85242 21.2616 4.96832 20.4477 4.7928 19.3758C4.42673 17.1401 4.42673 14.8598 4.7928 12.6242C4.96832 11.5523 5.85242 10.7384 6.93515 10.6519L7.62165 10.5971ZM11.6261 3.79914C11.8745 3.76992 12.1255 3.76992 12.3738 3.79914C13.8525 3.97309 15.0157 5.1439 15.1802 6.62361L15.2029 6.82851C15.2311 7.08239 15.2311 7.33862 15.2029 7.59251L14.8818 10.483C12.9626 10.3594 11.0374 10.3594 9.1182 10.483L8.79704 7.59251C8.76883 7.33862 8.76883 7.08239 8.79704 6.82851L8.8198 6.62361C8.98422 5.1439 10.1475 3.97309 11.6261 3.79914ZM15.4494 12.0277C13.1535 11.8445 10.8466 11.8445 8.55065 12.0277L7.05452 12.1472C6.65959 12.1787 6.33711 12.4756 6.27309 12.8666C5.9333 14.9417 5.9333 17.0583 6.27309 19.1334C6.33711 19.5244 6.65959 19.8213 7.05452 19.8528L8.55065 19.9722C10.8466 20.1555 13.1535 20.1555 15.4494 19.9722L16.9455 19.8528C17.3405 19.8213 17.6629 19.5244 17.727 19.1334C18.0668 17.0583 18.0668 14.9417 17.727 12.8666C17.6629 12.4756 17.3405 12.1787 16.9455 12.1472L15.4494 12.0277Z" fill="black" pid="m4lgxgw6-002BR93QMXFL" stroke="null"></path></svg>'
        const presetIsCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lhje14-011M3D6DXUR4"><path d="M18.68 9.98322C18.7196 10.231 18.7546 10.4792 18.7851 10.7279C18.8028 10.8722 18.8961 10.9956 19.0278 11.0569C19.3826 11.2219 19.7185 11.4206 20.0315 11.6488C20.174 11.7528 20.3819 11.6471 20.3678 11.4712C20.3215 10.8947 20.2527 10.3194 20.1613 9.74679L20.0972 9.34535C19.8913 8.05533 18.7786 7.10612 17.4722 7.10612L9.15777 7.10612C8.95226 6.04846 8.02099 5.25 6.90323 5.25H4.61167C3.25538 5.25 2.11298 6.26343 1.95127 7.61004L1.67879 9.87915C1.38913 12.2913 1.46388 14.7333 1.90055 17.1232C2.11607 18.3027 3.10258 19.1869 4.2986 19.2725L5.81261 19.3808C7.53657 19.5041 9.26382 19.5659 10.9911 19.5661C11.1458 19.5661 11.2421 19.3969 11.1709 19.2596C11.0216 18.9719 10.8949 18.6706 10.7932 18.358C10.7375 18.1866 10.5813 18.0651 10.4011 18.0636C8.90627 18.051 7.4117 17.9914 5.91965 17.8846L4.40565 17.7763C3.89217 17.7396 3.46865 17.36 3.37612 16.8536C2.96649 14.6116 2.89636 12.3208 3.16809 10.058L3.44057 7.78888C3.51176 7.19611 4.01464 6.75 4.61167 6.75H6.90323C7.34328 6.75 7.7 7.10672 7.7 7.54677C7.7 8.13183 8.17429 8.60612 8.75936 8.60612H17.4722C18.0414 8.60612 18.5262 9.0197 18.6159 9.58178L18.68 9.98322Z" fill="black" pid="m4lhje14-02G8MUTWRREV" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.5C12 17.4719 12.3081 18.3718 12.8319 19.1074C13.1238 19.5173 13.4827 19.8762 13.8926 20.1681C14.6282 20.6919 15.5281 21 16.5 21C18.9853 21 21 18.9853 21 16.5C21 15.5281 20.6919 14.6282 20.1681 13.8926C19.8762 13.4827 19.5173 13.1238 19.1074 12.8319C18.3718 12.3081 17.4719 12 16.5 12C14.0147 12 12 14.0147 12 16.5ZM16.5 19.5C15.9436 19.5 15.4227 19.3486 14.976 19.0846L19.0846 14.976C19.3486 15.4227 19.5 15.9436 19.5 16.5C19.5 18.1569 18.1569 19.5 16.5 19.5ZM13.9154 18.024L18.024 13.9154C17.5773 13.6514 17.0564 13.5 16.5 13.5C14.8431 13.5 13.5 14.8431 13.5 16.5C13.5 17.0564 13.6514 17.5773 13.9154 18.024Z" fill="black" pid="m4lhje14-02B47GTRSP3K" stroke="null"></path></svg>'
        const presetNotCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lhje15-00TIO5N7LRCX"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 11.25C17.2275 11.25 16.1285 12.14 15.864 13.3847L15.8418 13.4891C15.7739 13.8088 15.7619 14.1379 15.8064 14.4617L15.9594 15.5744C15.9023 15.5813 15.8451 15.5885 15.788 15.5959C14.9083 15.7102 14.25 16.4595 14.25 17.3466V19.6534C14.25 20.5405 14.9083 21.2899 15.788 21.4041C17.5884 21.6379 19.4116 21.6379 21.212 21.4041C22.0917 21.2899 22.75 20.5405 22.75 19.6534V17.3466C22.75 16.4595 22.0917 15.7102 21.212 15.5959C21.1549 15.5885 21.0977 15.5813 21.0406 15.5744L21.1936 14.4617C21.2381 14.1379 21.2261 13.8088 21.1582 13.4891L21.136 13.3847C20.8715 12.14 19.7724 11.25 18.5 11.25ZM19.5441 15.4464L19.7076 14.2574C19.7284 14.1054 19.7228 13.951 19.6909 13.8009L19.6688 13.6965C19.5515 13.1446 19.0642 12.75 18.5 12.75C17.9358 12.75 17.4485 13.1446 17.3312 13.6965L17.3091 13.8009C17.2772 13.951 17.2715 14.1054 17.2924 14.2574L17.4559 15.4464C18.1515 15.4119 18.8484 15.4119 19.5441 15.4464ZM15.9812 17.0834C17.6534 16.8663 19.3466 16.8663 21.0188 17.0834C21.151 17.1006 21.25 17.2132 21.25 17.3466V19.6534C21.25 19.7868 21.151 19.8994 21.0188 19.9166C19.3466 20.1338 17.6534 20.1338 15.9812 19.9166C15.849 19.8994 15.75 19.7868 15.75 19.6534V17.3466C15.75 17.2132 15.849 17.1006 15.9812 17.0834Z" fill="black" pid="m4lhje15-0029CY6QDQ9D" stroke="null"></path><path d="M12.75 18.3653C12.75 18.1984 12.6138 18.0637 12.4468 18.0647C10.6034 18.0763 8.7596 18.0163 6.91965 17.8846L5.40565 17.7763C4.89217 17.7396 4.46865 17.36 4.37612 16.8536C3.96649 14.6116 3.89636 12.3208 4.16809 10.058L4.44057 7.78888C4.51176 7.19611 5.01464 6.75 5.61167 6.75H7.90323C8.34328 6.75 8.7 7.10672 8.7 7.54677C8.7 8.13183 9.17429 8.60612 9.75936 8.60612H18.4722C19.0414 8.60612 19.5262 9.0197 19.6159 9.58178L19.6293 9.66531C19.6537 9.8182 19.7647 9.94169 19.9105 9.99377C20.2621 10.1194 20.5933 10.2908 20.8961 10.5016C21.0468 10.6066 21.2677 10.4888 21.2434 10.3067C21.2184 10.1198 21.191 9.93317 21.1613 9.74679L21.0972 9.34535C20.8913 8.05533 19.7786 7.10612 18.4722 7.10612L10.1578 7.10612C9.95226 6.04846 9.02099 5.25 7.90323 5.25H5.61167C4.25538 5.25 3.11298 6.26343 2.95127 7.61004L2.67879 9.87915C2.38913 12.2913 2.46388 14.7333 2.90055 17.1232C3.11607 18.3027 4.10258 19.1869 5.2986 19.2725L6.81261 19.3808C8.69028 19.5151 10.5719 19.5764 12.4531 19.5647C12.6176 19.5637 12.75 19.4298 12.75 19.2653V18.3653Z" fill="black" pid="m4lhje15-020YA1B619UI" stroke="null"></path></svg>'
        const hidePresetIcon = '<svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lo5rs8-00OP23ZTDXMN"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.5303 4.53033C20.8232 4.23744 20.8232 3.76256 20.5303 3.46967C20.2374 3.17678 19.7626 3.17678 19.4697 3.46967L3.46967 19.4697C3.17678 19.7626 3.17678 20.2374 3.46967 20.5303C3.76256 20.8232 4.23744 20.8232 4.53033 20.5303L7.37723 17.6834C8.74353 18.3266 10.3172 18.75 12 18.75C14.684 18.75 17.0903 17.6729 18.8206 16.345C19.6874 15.6797 20.4032 14.9376 20.9089 14.2089C21.4006 13.5003 21.75 12.7227 21.75 12C21.75 11.2773 21.4006 10.4997 20.9089 9.79115C20.4032 9.06244 19.6874 8.32028 18.8206 7.65503C18.5585 7.45385 18.2808 7.25842 17.989 7.07163L20.5303 4.53033ZM16.8995 8.16113L15.1287 9.93196C15.5213 10.5248 15.75 11.2357 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C11.2357 15.75 10.5248 15.5213 9.93196 15.1287L8.51524 16.5454C9.58077 16.9795 10.7621 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C17.5941 8.60461 17.2571 8.37472 16.8995 8.16113ZM11.0299 14.0307C11.3237 14.1713 11.6526 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 11.6526 14.1713 11.3237 14.0307 11.0299L11.0299 14.0307Z" pid="m4lo5rs8-00F4LH2DZYNA" stroke="null"></path><path fill="currentColor" d="M12 5.25C13.0323 5.25 14.0236 5.40934 14.9511 5.68101C15.1296 5.73328 15.1827 5.95662 15.0513 6.0881L14.2267 6.91265C14.1648 6.97451 14.0752 6.99928 13.99 6.97967C13.3506 6.83257 12.6839 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.67725 13.8635 5.18138 14.4107 5.81091 14.9307C5.92677 15.0264 5.93781 15.2015 5.83156 15.3078L5.12265 16.0167C5.03234 16.107 4.88823 16.1149 4.79037 16.0329C4.09739 15.4517 3.51902 14.8255 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25Z" pid="m4lo5rs8-02CT5B0Y3UOA" stroke="null"></path><path fill="currentColor" d="M12 8.25C12.1185 8.25 12.2357 8.25549 12.3513 8.26624C12.5482 8.28453 12.6194 8.51991 12.4796 8.6597L11.2674 9.87196C10.6141 10.0968 10.0968 10.6141 9.87196 11.2674L8.6597 12.4796C8.51991 12.6194 8.28453 12.5482 8.26624 12.3513C8.25549 12.2357 8.25 12.1185 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z" pid="m4lo5rs8-028MI5K4V6ZL" stroke="null"></path></svg>'
        const saveAsCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69q4n3v-00RDW2RAYPMU"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 11.25C17.2275 11.25 16.1285 12.14 15.864 13.3847L15.8418 13.4891C15.7739 13.8088 15.7619 14.1379 15.8064 14.4617L15.9594 15.5744C15.9023 15.5813 15.8451 15.5885 15.788 15.5959C14.9083 15.7102 14.25 16.4595 14.25 17.3466V19.6534C14.25 20.5405 14.9083 21.2899 15.788 21.4041C17.5884 21.6379 19.4116 21.6379 21.212 21.4041C22.0917 21.2899 22.75 20.5405 22.75 19.6534V17.3466C22.75 16.4595 22.0917 15.7102 21.212 15.5959C21.1549 15.5885 21.0977 15.5813 21.0406 15.5744L21.1936 14.4617C21.2381 14.1379 21.2261 13.8088 21.1582 13.4891L21.136 13.3847C20.8715 12.14 19.7724 11.25 18.5 11.25ZM19.5441 15.4464L19.7076 14.2574C19.7284 14.1054 19.7228 13.951 19.6909 13.8009L19.6688 13.6965C19.5515 13.1446 19.0642 12.75 18.5 12.75C17.9358 12.75 17.4485 13.1446 17.3312 13.6965L17.3091 13.8009C17.2772 13.951 17.2715 14.1054 17.2924 14.2574L17.4559 15.4464C18.1515 15.4119 18.8484 15.4119 19.5441 15.4464ZM15.9812 17.0834C17.6534 16.8663 19.3466 16.8663 21.0188 17.0834C21.151 17.1006 21.25 17.2132 21.25 17.3466V19.6534C21.25 19.7868 21.151 19.8994 21.0188 19.9166C19.3466 20.1338 17.6534 20.1338 15.9812 19.9166C15.849 19.8994 15.75 19.7868 15.75 19.6534V17.3466C15.75 17.2132 15.849 17.1006 15.9812 17.0834Z" fill="black" pid="m69q4n3v-01NJ1I89COBG" stroke="null"></path><path d="M12.75 18.3653C12.75 18.1984 12.6138 18.0637 12.4468 18.0647C10.6034 18.0763 8.7596 18.0163 6.91965 17.8846L5.40565 17.7763C4.89217 17.7396 4.46865 17.36 4.37612 16.8536C3.96649 14.6116 3.89636 12.3208 4.16809 10.058L4.44057 7.78888C4.51176 7.19611 5.01464 6.75 5.61167 6.75H7.90323C8.34328 6.75 8.7 7.10672 8.7 7.54677C8.7 8.13183 9.17429 8.60612 9.75936 8.60612H18.4722C19.0414 8.60612 19.5262 9.0197 19.6159 9.58178L19.6293 9.66531C19.6537 9.8182 19.7647 9.94169 19.9105 9.99377C20.2621 10.1194 20.5933 10.2908 20.8961 10.5016C21.0468 10.6066 21.2677 10.4888 21.2434 10.3067C21.2184 10.1198 21.191 9.93317 21.1613 9.74679L21.0972 9.34535C20.8913 8.05533 19.7786 7.10612 18.4722 7.10612L10.1578 7.10612C9.95226 6.04846 9.02099 5.25 7.90323 5.25H5.61167C4.25538 5.25 3.11298 6.26343 2.95127 7.61004L2.67879 9.87915C2.38913 12.2913 2.46388 14.7333 2.90055 17.1232C3.11607 18.3027 4.10258 19.1869 5.2986 19.2725L6.81261 19.3808C8.69028 19.5151 10.5719 19.5764 12.4531 19.5647C12.6176 19.5637 12.75 19.4298 12.75 19.2653V18.3653Z" fill="black" pid="m69q4n3v-00NKXI5S6E2P" stroke="null"></path></svg>'
        const removeCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69q4n3u-021JUMZVM3JV"><path d="M18.68 9.98322C18.7196 10.231 18.7546 10.4792 18.7851 10.7279C18.8028 10.8722 18.8961 10.9956 19.0278 11.0569C19.3826 11.2219 19.7185 11.4206 20.0315 11.6488C20.174 11.7528 20.3819 11.6471 20.3678 11.4712C20.3215 10.8947 20.2527 10.3194 20.1613 9.74679L20.0972 9.34535C19.8913 8.05533 18.7786 7.10612 17.4722 7.10612L9.15777 7.10612C8.95226 6.04846 8.02099 5.25 6.90323 5.25H4.61167C3.25538 5.25 2.11298 6.26343 1.95127 7.61004L1.67879 9.87915C1.38913 12.2913 1.46388 14.7333 1.90055 17.1232C2.11607 18.3027 3.10258 19.1869 4.2986 19.2725L5.81261 19.3808C7.53657 19.5041 9.26382 19.5659 10.9911 19.5661C11.1458 19.5661 11.2421 19.3969 11.1709 19.2596C11.0216 18.9719 10.8949 18.6706 10.7932 18.358C10.7375 18.1866 10.5813 18.0651 10.4011 18.0636C8.90627 18.051 7.4117 17.9914 5.91965 17.8846L4.40565 17.7763C3.89217 17.7396 3.46865 17.36 3.37612 16.8536C2.96649 14.6116 2.89636 12.3208 3.16809 10.058L3.44057 7.78888C3.51176 7.19611 4.01464 6.75 4.61167 6.75H6.90323C7.34328 6.75 7.7 7.10672 7.7 7.54677C7.7 8.13183 8.17429 8.60612 8.75936 8.60612H17.4722C18.0414 8.60612 18.5262 9.0197 18.6159 9.58178L18.68 9.98322Z" fill="black" pid="m69q4n3u-011XLEIB0F8E" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.5C12 17.4719 12.3081 18.3718 12.8319 19.1074C13.1238 19.5173 13.4827 19.8762 13.8926 20.1681C14.6282 20.6919 15.5281 21 16.5 21C18.9853 21 21 18.9853 21 16.5C21 15.5281 20.6919 14.6282 20.1681 13.8926C19.8762 13.4827 19.5173 13.1238 19.1074 12.8319C18.3718 12.3081 17.4719 12 16.5 12C14.0147 12 12 14.0147 12 16.5ZM16.5 19.5C15.9436 19.5 15.4227 19.3486 14.976 19.0846L19.0846 14.976C19.3486 15.4227 19.5 15.9436 19.5 16.5C19.5 18.1569 18.1569 19.5 16.5 19.5ZM13.9154 18.024L18.024 13.9154C17.5773 13.6514 17.0564 13.5 16.5 13.5C14.8431 13.5 13.5 14.8431 13.5 16.5C13.5 17.0564 13.6514 17.5773 13.9154 18.024Z" fill="black" pid="m69q4n3u-014LY68EEF08" stroke="null"></path></svg>'
        const removeFromCollectionIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69qqotf-005USGAM7PMH"><path d="M9.70191 11.2019C9.9948 10.909 10.4697 10.909 10.7626 11.2019L12 12.4393L13.2374 11.2019C13.5303 10.909 14.0052 10.909 14.2981 11.2019C14.591 11.4948 14.591 11.9697 14.2981 12.2626L13.0607 13.5L14.2981 14.7374C14.591 15.0303 14.591 15.5052 14.2981 15.7981C14.0052 16.091 13.5303 16.091 13.2374 15.7981L12 14.5607L10.7626 15.7981C10.4697 16.091 9.9948 16.091 9.70191 15.7981C9.40901 15.5052 9.40901 15.0303 9.70191 14.7374L10.9393 13.5L9.70191 12.2626C9.40902 11.9697 9.40902 11.4948 9.70191 11.2019Z" fill="black" pid="m69qqotf-02A1LON86UDH" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1613 9.74679C21.5581 12.233 21.5297 14.7686 21.0771 17.2453C20.8748 18.353 19.9484 19.1833 18.8253 19.2636L17.1874 19.3808C13.7335 19.6279 10.2665 19.6279 6.81261 19.3808L5.2986 19.2725C4.10258 19.1869 3.11607 18.3027 2.90055 17.1232C2.46388 14.7333 2.38913 12.2913 2.67879 9.87915L2.95127 7.61004C3.11298 6.26343 4.25538 5.25 5.61167 5.25H7.90323C9.02099 5.25 9.95226 6.04846 10.1578 7.10612L18.4722 7.10612C19.7786 7.10612 20.8913 8.05533 21.0972 9.34535L21.1613 9.74679ZM19.6016 16.9757C20.0236 14.6662 20.0501 12.3017 19.68 9.98322L19.6159 9.58178C19.5262 9.0197 19.0414 8.60612 18.4722 8.60612H9.75936C9.17429 8.60612 8.7 8.13183 8.7 7.54677C8.7 7.10672 8.34328 6.75 7.90323 6.75H5.61167C5.01464 6.75 4.51176 7.19611 4.44057 7.78888L4.16809 10.058C3.89636 12.3208 3.96649 14.6116 4.37612 16.8536C4.46865 17.36 4.89217 17.7396 5.40565 17.7763L6.91965 17.8846C10.3022 18.1266 13.6978 18.1266 17.0804 17.8846L18.7182 17.7674C19.1588 17.7359 19.5222 17.4102 19.6016 16.9757Z" fill="black" pid="m69qqotf-01QUMYO3BSAD" stroke="null"></path></svg>'
        const addToCollectionIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69qu6q2-02A7JGMVLEMP"><path d="M8.75 13.5C8.75 13.0858 9.08579 12.75 9.5 12.75H11.25V11C11.25 10.5858 11.5858 10.25 12 10.25C12.4142 10.25 12.75 10.5858 12.75 11V12.75H14.5C14.9142 12.75 15.25 13.0858 15.25 13.5C15.25 13.9142 14.9142 14.25 14.5 14.25H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V14.25H9.5C9.08579 14.25 8.75 13.9142 8.75 13.5Z" fill="black" pid="m69qu6q2-017MOA1JU5V4" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1613 9.74679C21.5581 12.233 21.5297 14.7686 21.0771 17.2453C20.8748 18.353 19.9484 19.1833 18.8253 19.2636L17.1874 19.3808C13.7335 19.6279 10.2665 19.6279 6.81261 19.3808L5.2986 19.2725C4.10258 19.1869 3.11607 18.3027 2.90055 17.1232C2.46388 14.7333 2.38913 12.2913 2.67879 9.87915L2.95127 7.61004C3.11298 6.26343 4.25538 5.25 5.61167 5.25H7.90323C9.02099 5.25 9.95226 6.04846 10.1578 7.10612L18.4722 7.10612C19.7786 7.10612 20.8913 8.05533 21.0972 9.34535L21.1613 9.74679ZM19.6016 16.9757C20.0236 14.6662 20.0501 12.3017 19.68 9.98322L19.6159 9.58178C19.5262 9.0197 19.0414 8.60612 18.4722 8.60612H9.75936C9.17429 8.60612 8.7 8.13183 8.7 7.54677C8.7 7.10672 8.34328 6.75 7.90323 6.75H5.61167C5.01464 6.75 4.51176 7.19611 4.44057 7.78888L4.16809 10.058C3.89636 12.3208 3.96649 14.6116 4.37612 16.8536C4.46865 17.36 4.89217 17.7396 5.40565 17.7763L6.91965 17.8846C10.3022 18.1266 13.6978 18.1266 17.0804 17.8846L18.7182 17.7674C19.1588 17.7359 19.5222 17.4102 19.6016 16.9757Z" fill="black" pid="m69qu6q2-007LBGPNOWUH" stroke="null"></path></svg>'

        // const collectionColors = this.state.collection.colors
        const createColorsetWrapper = (colors,destination)=>{
            const createColorsetElement = (colorset) => {
                console.log('COLORSET TYPE: ',colorset.colorset_type)
                const container = document.createElement('div')
                const element_id = colorset?.csid ? colorset.csid : null
                const preset_type = colorset?.colorset_type || 'global'
                const isIconDefault = currentIcon?.color?.csid == colorset.csid
                const isCollectionDefault = meta?.color?.csid == colorset.csid
                const collectionSettingExists = !objectIsEmpty(collectionColors) && Object.hasOwn(collectionColors,colorset.csid)
                const inverterSet = new Set();

                if (preset_type === 'variable') {
                
                    for (const id in colorset){
                        if (!Array.isArray(colorset[id])){
                        // do you refactor all places where the preset is created and used
                        // or do you just write a buggy patch like this
                        // what design pattern / principles should have been in place for this not to happen?
                        // below code was implimented before meta properties were created
                        // how do you know and define object meta properties ahead of functionality
                            continue
                        }
                        let fill = colorset[id][0]
                        let stroke = colorset[id][1]
                        console.log(fill,stroke)
                        if (fill && fill !== 'none')
                            inverterSet.add(fill)
                        if (stroke && stroke !== 'none')
                            inverterSet.add(stroke)
                    }
                }
                container.classList.add('colorset')
                container.setAttribute('csid',element_id)
                container.innerHTML = `
                <div class="preset-element-toast">
                    <div class="toast success defaultSet"> default setting applied </div>
                    <div class="toast failure settingError"> error setting preset </div>
                    <div class="toast clear defaultCleared"> default setting removed </div>
                    <div class="toast delete removeCollectionSetting"> collection setting removed </div>
                    <div class="toast success collectionDefault"> collection setting saved</div>
                    <div class="toast info previewCollection">collection preview applied</div>
                    <div class="toast success nameChange">name successfully changed</div>
                    <div class="toast failure nameChangeError">error saving name</div>
                </div>
                <div class="preset-element-option">
                    <div class="pre-opt opt-aid iconDefault">
                        <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
                        <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
                    </div>
                    <div class="pre-opt opt-acd collectionDefault"> 
                        <div class="icon">${ isCollectionDefault ? presetIsCollectionDefaultIcon : presetNotCollectionDefaultIcon } </div>
                        <div class="tool-tip">${ isCollectionDefault ? 'clear collection default' : 'set collection default' }</div>
                    </div>
                    <div class="pre-opt opt-pi previewIcon"> 
                        <div class="icon">${ icons.previewIcon } </div>
                        <div class="tool-tip">preview icon</div>
                    </div>
                    <div class="pre-opt opt-pc previewCollection">
                        <div class="icon">${icons.previewCollection}</div>
                        <div class="tool-tip">preview collection</div>
                    </div>
                    <div class="pre-opt opt-dp deletePreset"> 
                            <div class="icon"><svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lkyhp9-02ABXVVV5HTN">
                            <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="black" pid="m4lkyhp9-01CH2FKOVM1P" stroke="null"></path>
                            <path d="M13.0607 15L14.5303 16.4697C14.8232 16.7626 14.8232 17.2374 14.5303 17.5303C14.2374 17.8232 13.7626 17.8232 13.4697 17.5303L12 16.0607L10.5303 17.5303C10.2374 17.8232 9.76257 17.8232 9.46968 17.5303C9.17678 17.2374 9.17678 16.7626 9.46968 16.4697L10.9393 15L9.46967 13.5303C9.17678 13.2374 9.17678 12.7626 9.46967 12.4697C9.76256 12.1768 10.2374 12.1768 10.5303 12.4697L12 13.9393L13.4697 12.4697C13.7626 12.1768 14.2374 12.1768 14.5303 12.4697C14.8232 12.7626 14.8232 13.2374 14.5303 13.5303L13.0607 15Z" fill="black" pid="m4lkyhp9-01VZPDFEMFGW" stroke="null"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="black" pid="m4lkyhp9-01OHI2KX2T3R" stroke="null"></path>
                            </svg></div>
                        <div class="tool-tip">delete preset</div>
                    </div>
                </div>
                <div class="preset-val p-type"><span class="p-label type-label">type</span>${preset_type}</div>
                <div class="preset-val p-name"><span class="p-label name-label">name</span> <span class="p-val name-val">${colorset?.name ? colorset.name : 'untitled' }</span></div>
                ${preset_type === 'global' 
                    ? `<div class="preset-val p-stroke">
                            <span class="p-label stroke-label">stroke</span>
                            <span class="global-stroke-reflector gf-reflector"></span>
                            <span class="p-val stroke-val">${colorset?.shapes?.stroke ? colorset.shapes.stroke : 'none'}</span>
                        </div>
                        <div class="preset-val p-fill">
                            <span class="p-label fill-label">fill</span>
                            <span class="global-fill-reflector gf-reflector"></span>
                            <span class="p-val vb-val">${colorset?.shapes?.fill ? colorset.shapes.fill : 'none'}</span>
                        </div>`
                    : `<div class="preset-val colors-list">
                            <div class="p-label inverter-label">colors</div>
                            <div class="p-val inverter-val"></div>
                        </div>`
                    }

    
                `
                if (preset_type === 'global') {
                    $('.global-fill-reflector',container).style.background = colorset.shapes.fill;
                    $('.global-stroke-reflector',container).style.background = colorset.shapes.stroke;
                } else if (preset_type === 'variable'){
                    inverterSet.forEach(color => {
                        const colorElement = document.createElement('div');
                        colorElement.classList.add("inverter-color")
                        $('.colors-list .inverter-val',container).appendChild(colorElement)
                        colorElement.style.background = color
                    })
                }

                // $('.btn-apply-colorset',container).addEventListener('click', () => {
                //     this.colorPicker.updateFillGroup(colorset.shapes.fill)
                //     this.colorPicker.updateStrokeGroup(colorset.shapes.stroke)
                // })
                return container
            }
            const hydrate = async (event,element,preset) => {
                event.stopPropagation();

                const currentNameElement = $('.preset-val.p-name',element)

                const icon = currentIcon.id == this.preview.icon.id ? currentIcon : null
                let id = icon.id
                let collection = icon.collection
                let csid = preset.csid
                let frozenSettings = ['original','setting','preset']

                const notify = (toastElement) => {
                    if (currentAnimation && currentAnimation.playState === 'running')
                        currentAnimation.cancel()
                    currentAnimation = toastElement.animate([
                        {transform: 'translateY(-100%, offset:0'},
                        {transform: 'translateY(0)', offset:0.025},
                        {transform: 'translateY(0)', offset:0.990},
                        {transform: 'translateY(-100%', offset:1}
                    ],{duration:1500,iterations:1,easing:'ease'})
                    return currentAnimation
                }
                const removePreset = (element) => {
                    const removeAnimation = element.animate([
                        {transform: `translateX(-200%)`},
                    ],{duration: 300,easing: 'ease','fill':'forwards'})
                    removeAnimation.onfinish = () => {
                        element.classList.add('deleted')
                        element.remove()
                    }
                }
                const addNewPreset = (setting) => {
                    let element = createColorsetElement(setting)
                    if (element) element.addEventListener('click', event => hydrate(event,element,setting))
                    collectionColorsTab.appendChild(element)
                }
                const setPresetDefault = async () => {
                    const icon = currentIcon.id == this.preview.icon.id ? currentIcon : null;
                    let presetActive = icon.color?.csid === preset.csid
                    let isActiveIcon = $('.pre-opt.opt-aid',element)

                    const notifyDefaultApplied = () => notify($('.toast.defaultSet',element))
                    const notifyDefaultCleared = () => notify($('.toast.defaultCleared',element))
                    const showLockedPreset = () => {
                        const iconPresetTab = $('.color-editor-modal[modal="icons"]')
                        const presetElements = $$('.pre-opt.opt-aid',iconPresetTab)
                        presetElements.forEach(element => {
                            element.innerHTML = `<div class="icon">${presetIsDefaultIcon}</div>
                            <div class="tool-tip"> set as icon default </div>
                            `
                            el.setAttribute('active',false)
                        })
                        isActiveIcon.setAttribute('active','true')
                        isActiveIcon.innerHTML = `<div class="icon">${presetNotCollectionDefaultIcon}</div>
                        <div class="tool-tip">ignore as icon default</div>`
                    }
                    const showUnlockedPreset = () => {
                        isActiveIcon.setAttribute('active','false')
                        isActiveIcon.innerHTML = `<div class="icon">${presetIsDefaultIcon}</div><div class="tool-tip"> set as icon default </div>`
                    }
                    if (presetActive){
                        console.warn('preset already active')
                        console.log('removing default preset...')
                        // let updated = await this.store.clearDefaultSetting(id,collection,icon)
                        // let updatedSuccess = updated.id === currentIcon
                        let updatedSuccess = true;
                        if (updatedSuccess){
                            icon.color = icon.colors.original
                            showUnlockedPreset()
                            notifyDefaultCleared()
                        }
                    } else {
                        console.log('setting default color...')
                        let updated = await this.store.setDefaultIconColor(id,collection,csid)
                        let updateSuccess = updated.id === currentIcon.id
                        if (updateSuccess){
                            icon.color = preset
                            console.log('preset updated')
                            showLockedPreset()
                            notifyDefaultApplied()
                        } else {
                            console.error('something went wrong setting default color')
                        }
                    }
                }
                const toggleCollectionDefaultSetting = async () => {
                    if (preset.preset_type !== 'global'){
                        console.warn('can only add global colorsets to collections')
                        notify($('.toast.settingError',element))
                        return;
                    }
                    const isCollectionDefault = this.collection.meta?.color?.csid === preset.csid
                    console.log('TOGGLING COLLECTION DEFAULT', isCollectionDefault,this.collection.meta)
                    if (isCollectionDefault){
                        const updated = await this.store.clearCollectionDefaultColor(collection)
                        const updateSuccess = updated.cid === meta.cid
                        if (updateSuccess){
                            this.collection.meta.color = {}
                            console.log('default successfully cleared',updated)
                        } else {
                            console.error('something went wrong applying collection default')
                        }
                    } else {
                        // const updated = await this.store.setCollectionDefault(collection,preset)
                        // const updateSuccess = updated.cid === meta.cid
                        const updateSuccess = true;
                        if (updateSuccess){
                            this.collection.meta.color = preset;
                            console.log('default applied', updated)
                        } else {
                            console.warn('something wen wrong applying collection default')
                        }

                        // this.preview.setCollectionColor(this.collection.meta.color)
                    }
                    updateCollectionIsDefaultIcon()

                }
                const updateCollectionIsDefaultIcon = () => {
                    const defaultPid = this.collection.meta?.color?.csid
                    const csid = preset.csid
                    const isCollectionDefault = defaultPid = csid
                    const iPreviewElement = $(`.preset-preview-element[csid=${csid}] .pre-opt.collectionDefault`,iconColorsTab)
                    const cPreviewElement = $(`.preset-preview-element[csid=${csid}] .pre-opt.collectionDefault`,collectionColorsTab)
                    const updatedHTML = `<div class="pre-opt opt-acd collectionDefault">
                        <div active="${isCollectionDefault ? true : false}" class="icon">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
                        <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
                    </div>`
                    console.log(csid,isCollectionDefault,cPreviewElement)
                    const activeButtons = $$('.pre-opt.collectionDefault .icon[active="true"]')
                    console.log(activeButtons)
                    activeButtons.forEach(btn => {
                        btn.setAttribute('active',false);
                        btn.innerHTML = saveAsCollectionDefaultIcon
                    })
                    if (iPreviewElement) iPreviewElement.outerHTML = updatedHTML
                    if (cPreviewElement) cPreviewElement.outerHTML = updatedHTML
                }
                const addCollectionPreset = async () => {
                    if (preset.preset_type !== 'global'){
                        console.warn('can only add global colorsets to collections')
                        notify($('.toast.settingError',element))
                        return;
                    }
                    const updated = await this.store.saveCollectionColorset( collectionID , preset )
                    console.log('COLLECTION PRESET SAVED',updated)
                    const updateSuccess = updated.cid === collectionID;
                    console.log('UPDATE STATUS', updateSuccess)
                    // let updateSuccess = true;
                    if (updateSuccess){
                        notify($('.toast.collectionDefault',element))
                        this.collection.meta.colors[csid] = preset
                        recentSettings = updated.recent_settings
                        addNewPreset(preset)
                        updateCollectionPresetExistIcon(element,true)
                        rerenderRecentSettings()
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.colors)
                    } else {
                        console.error('something went wrong adding collection color')
                    }
                }
                const deleteCollectionPreset = async () => {
                    if (preset.csid === 'original') {
                        console.warn('cannot delete original')
                        notify($('.toast.settingError',element))
                        return;
                    }
                    const updated = await this.store.deleteCollectionColor( collectionID , csid);
                    console.log('COLLECTION PRESET DELETED', updated)
                    const updateSuccess = updated.cid === collectionID && updated.colors[csid] == undefined;
                    console.log('UPDATE STATUS', updateSuccess)
                    // const updateSuccess = true;
                    if (updateSuccess){
                        const existingPresetIcon = $(`.preset-preview-element[csid=${csid}]`,collectionColorsTab)
                        if (existingPresetIcon)
                            updateCollectionPresetExistIcon(element,false)
                        removePreset(element)
                        notify($('.toast.delete',element))
                        delete this.collection.meta.colors[csid]
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.colors)
                    } else {
                        console.warn('update failed')
                        notify($('.toast.failure'),element)
                    }
                }
                const removeCollectionPreset = async () => {
                    // const updated = await this.store.deleteCollectionPreset( collectionID , csid);
                    // console.log('COLLECTION PRESET SAVED',updated)
                    // const updateSuccess = updated.cid === collectionID && updated.settings[csid] == undefined;
                    const updateSuccess = true
                    console.log('UPDATE STATUS',updateSuccess)
                    if (updateSuccess){
                        const existingPresetIcon = $(`.preset-preview-element[csid=${csid}]`,collectionColorsTab)
                        if (existingPresetIcon)
                            updateCollectionPresetExistIcon(element,false)
                        removePreset(element)
                        delete this.collection.meta.colors[csid]
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.settings)
                    } else {
                        console.warn('update failed')
                    }
                }
                const previewCollection = async () => {
                    console.log('here')
                    this.colorPicker.setCollectionColor(preset)
                    this.colorPicker.applyColors(preset)
                    notify($('.toast.previewCollection',element))
                }
                const deleteIconPreset = async () => {
                    const deleted = await this.store.deleteIconColorset(id,collection,csid)
                    console.log('DELETED',deleted)
                    if (deleted?.id === id){
                        console.log('delete operation successful',deleted.settings.csid)
                        console.log(this.currentIcon.colors[csid])
                        console.log(deleted)
                        delete this.currentIcon.colors[csid]
                        removePreset(element)
                        $('.preset-option[tab="icons"] .preset-count').textContent = getLength(this.currentIcon.colors)
                        if (this.currentIcon.color?.csid === csid){
                            this.currentIcon.preset = {}
                        }
                    }
                }
                const updateCollectionPresetExistIcon = (element,doesExist) => {
                    $('.pre-opt.opt-a2c',element).outerHTML = `                    
                    <div class="pre-opt opt-a2c ${ doesExist ? 'removeFromCollection' : 'addToCollection' } "> 
                        <div class="icon">${ doesExist ? removeFromCollectionIcon : addToCollectionIcon } </div>
                        <div class="tool-tip">${ doesExist ? 'remove collection preset' : 'save as collection preset' } </div>
                    </div>`
                }

                const handleNameChange = () => {
                    currentNameElement.classList.add('active')
                    currentNameElement.innerHTML = `<input type="text" class="edit-save-name" placeholder="${preset.name}"><span class="btn-save-name">save</span>`
                    $('input.edit-save-name',currentNameElement).focus()
                    $('input.edit-save-name',currentNameElement).addEventListener('keyup',(event) => {
                        // throttle
                        const enter = event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
                        if (enter) updateName()
                    })
                }
                const updateName = async () => {
                    const input = $('input.edit-save-name',currentNameElement)
                    if (input) {
                        const value = input.value
                        console.log('UPDATING NAME', value)
                        // const update = await this.store.updatePresetName({id,collection,csid,name:value})
                        // console.log(update)
                        // const updateSuccess = update.iconSetting.found && update.iconSetting.updated;
                        const updateSuccess = true;
                        if (updateSuccess){
                            preset.name = value
                            hideInput()
                            console.log('herefoo')
                            const correspondingElement = $$(`.preset-preview-element[csid=${csid}] .preset-val.p-name`).forEach(presetName => presetName.innerHTML = `<span class="p-label name-label">name</span><span class="p-val name-val">${value}</span>`)
                            notify($('.toast.nameChange',element))
                        } else {
                            notify($('.toast.nameChangeError',element))
                        }
                        // const uppdateCollection = update.collectionColors.found && update.collectionColors.updated
                        const updateCollection = true;
                        if (updateCollection){
                            this.collection.colors[csid].name = value;
                        }
                        // const updateRecent = update.recentSetting.found;
                        const updateRecent = true;
                        if (updatedRecent){
                            this.collection.meta.recent_colors = this.collection.meta.recent_colors.map(
                                setting => {
                                    if (setting.csid == csid) setting.name = value
                                    return setting
                                }
                            )
                        }

                    }
                }

                const hideInput = () => {
                    currentNameElement.classList.remove('active')
                    currentNameElement.innerHTML = `<span class="p-label name-label">name</span><span class="p-val name-val">${preset?.name}</span>`
                }
                const getLength = (settings) => {
                    const keys = Object.keys(settings).filter(key => !frozenSettings.some(i => i === key))
                    return keys.length
                }

                const applyToIconDefault = event.target.closest('.iconDefault')
                const addToCollection = event.target.closest('.pre-opt.addToCollection')
                const previewIcon = event.target.closest('.previewIcon')
                const toggleCollectionDefault = event.target.closest('.pre-opt.collectionDefault')
                const presetDelete = event.target.closest('.deletePreset')
                const collectionPreview = event.target.closest('.previewCollection')
                const editName = event.target.closest('.preset-val.p-name')
                const saveName = event.target.closest('.btn-save-name')

                if (!preset) return
                if (!icon) return

                if (saveName) await updateName()
                else if (editName && !currentNameElement.classList.contains('active')) handleNameChange()
                else hideInput()

                if (collectionPreview) {
                    console.log('applying preset to preview default...', preset )
                    if (preset.colorset_type !== 'global'){
                        console.warn('cannot preview preset...')
                        console.warn(' invalid preset type...')
                    } else {
                        console.log('previewing global preset.....')
                        this.colorPicker.setCollectionColor(preset)
                        this.colorPicker.applyFromColorset(preset)
                        console.log()
                    }
                    // previewCollection()
                }
                else if (previewIcon){
                    console.log('applying icon preview....')
                    if (preset.colorset_type !== 'global' && preset.name !== 'original'){
                        console.warn('cannot preview preset...')
                        console.warn(' invalid preset type...')
                    } else {
                        console.log('previewing global preset.....')
                        this.colorPicker.applyFromColorset(preset)
                    }
                }
                else if(applyToIconDefault) {
                    console.log('setting default icon preset', preset )
                    console.log('preset type.....', preset.colorset_type )
                    // setPresetDefault()
                } 
                else if(addToCollection) {
                    console.log('adding preset to collection', preset)
                    if (preset.colorset_type !== 'global') {
                        console.warn('cannot add preset to collection...')
                        console.warn(' invalid preset type...')
                    } else {
                        console.log('adding preset to collection...')
                        // addCollectionPreset()
                    }
                }
                else if (toggleCollectionDefault) {
                    console.log('toggling default collection colors...',preset)
                    if (preset.colorset_type !== 'global') {
                        console.warn('cannot add preset to collection...')
                        console.warn(' invalid preset type...')
                    } else if (preset.colorset_type === 'variable') {
                        console.log('adding preset to collection...')
                        // toggleCollectionDefaultSetting()
                    } else {
                        console.warn('preset type not supported')
                    }
                }
                else if (presetDelete) {
                    console.log('deleting preset...',preset)
                    if (preset.colorset_type === 'global'){
                        console.log('searching for preset in collection...')
                        console.log(collection)
                        // removeCollectionPreset()
                    } else if (preset.colorset_type === 'variable'){
                        console.log('deleting icon preset....')
                        // deleteIconPreset()
                    } else {
                        console.log('preset not supported')
                    }
                }
                else return;
            }
            destination.innerHTML = ''
            let rendered = 0
            for (const id in colors){
                let colorset = colors[id]
                console.log('APPENDING COLORSET [COLLECTION]',colors,colorset)
                const element = createColorsetElement(colorset)
                element.addEventListener('click', event => hydrate(event,element,colorset))
                destination.appendChild(element)
                rendered += 1
            }
            if (rendered === 0) destination.innerHTML = 'no presets to show'
        }
        if (!objectIsFalsey(collectionColors)) createColorsetWrapper(collectionColors,collectionColorsTab,'collections')
        if (!objectIsFalsey(iconColors)) createColorsetWrapper(iconColors,iconColorsTab,'icons')
        $('.color-editor .preset-option[tab="collections"] .preset-count').textContent = objectLength(collectionColors)
        $('.color-editor .preset-option[tab="icons"] .preset-count').textContent = objectLength(iconColors)
    }
    openColorEditor(){
        this.colorPicker.openFS()
        this.preview.closeSettings()
        this.loadColorMenu()
    }
    toggleColorEditor(){
        if (this.colorPicker.fsActive){
            this.colorPicker.closeFS()
        } else {
            this.openColorEditor()
        }
    }
    handleSaveIconColorset(csid){
        const preset = this.currentIcon.colors[csid];
        console.log('SAVING PRESET');
    }

    handleSavePreset() {
        let currentAnimation
        return (event) => {
            const currentIcon = this.currentIcon
            const collectionID = this.collection.meta.cid
            const icon = currentIcon.id == this.preview.icon.id ? currentIcon : null
            const id = icon.id
            const collection = icon.collection

            const nameField = $('.preset-val.p-name')
            const currentNameElement = $('.name-val',nameField)
            const currentPresetElement = $('.save-preset-modal .current-preset')

            const editName = event.target.closest('.preset-val.p-name')
            const addToCollection = event.target.closest('.save-opt.save-collection')
            const addToIcon = event.target.closest('.save-opt.save-icon')

            let setting = this.state.preset

            const notify = (toastElement) => {
                if (currentAnimation && currentAnimation.playState === 'running')
                    currentAnimation.cancel()
                currentAnimation = toastElement.animate([
                    {transform: 'translateY(-100%', offset: 0},
                    {transform: 'translateY(0)', offset:0.015},
                    {transform: 'translateY(0)', offset:0.990},
                    {transform: 'translateY(-100%', offset:1}
                ],{duration: 3000, iterations: 1, easing: 'ease'})
                return currentAnimation
            }
            const addCollectionPreset = async () => {
                const setting = this.handleCurrentSetting()
                const pid = setting.pid;
                console.log('SAVING ICON PRESET', collectionID,setting)
                const updated = await this.store.saveCollectionPreset( collectionID , { preset: setting , usePreset: true });
                console.log('COLLECTION PRESET SAVED',updated)
                const updateSuccess = updated.cid === collectionID;
                console.log('UPDATE STATUS',updateSuccess)
                if (updateSuccess){
                    notify($('.toast.collectionSetting',currentPresetElement))
                    this.collection.meta.settings[pid] = setting
                    this.loadPresetMenu()
                }
            }
            const addIconPreset = async () => {
                const setting = this.handleCurrentSetting()
                console.log('SAVING ICON PRESET', id,collection,setting)
                const testResult = await this.store.saveIconPreset( id, collection, setting )
                console.log('save result',testResult)
                // overwrite current icon;  
                console.log(collectionID,testResult?.cid)
                if (testResult?.cid == collectionID){
                        let updated = this.currentIcon.addPreset(setting)
                        if (updated){
                            this.preview.icon.settings = updated.settings
                            notify($('.toast.iconSetting',currentPresetElement))
                            this.loadPresetMenu()
                            console.log('preset successfully saved')
                        }
                    } else {
                        console.error('error saving preset' , testResult)
                    }
            }
            const handleNameChange = () => {
                currentNameElement.classList.add('active')
                currentNameElement.innerHTML = `<input type="text" class="edit-save-name" placeholder="${setting.name}">`
                $('input.edit-save-name',currentNameElement).focus()
                $('input.edit-save-name',currentNameElement).addEventListener('keyup',(event) => {
                    setting.name = event.target.value
                    // throttle
                    const enter = event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
                    if (enter) updateName()
                })
            }
            const updateName = () => {
                currentNameElement.classList.remove('active')
                currentNameElement.innerHTML = `<span>${setting.name}</span>`
                console.log(setting.name)
            }
            if (editName && !currentNameElement.classList.contains('active')) 
                handleNameChange() 
            else {
                updateName()
                if (addToIcon) addIconPreset()
                else if (addToCollection) addCollectionPreset()
              }
        }
    }
    handleCurrentSetting() {
        let details = {
            name: this.state.preset.name,
            pid: this.state.preset?.pid || uuid(),
            created_at: Date.now(),
        }
        let data = this.preview.currentPreset
        let setting = {
            ...data,
            ...details
        }
        return setting;
    }
    updateSavedPreset(){
        const setting = this.handleCurrentSetting()
        const currentPresetElement = $('.save-preset-modal .current-preset')
        const createPresetElement = (setting) => {
            const element = document.createElement('div');
            const element_id = setting?.pid ? setting.pid : null
            if (!element_id) return
            element.setAttribute('pid', element_id)
            element.innerHTML = ` 
            <div class="preset-preview-element">
            <div class="preset-element-toast">
                <div class="toast success defaultSet"> default setting applied </div>
                <div class="toast failure settingError"> error setting preset </div>
                <div class="toast clear defaultCleared"> default setting removed </div>
                <div class="toast delete removeCollectionSetting"> collection setting removed </div>
                <div class="toast success iconSetting">icon setting saved</div>
                <div class="toast success collectionSetting"> collection setting saved</div>
                <div class="toast info previewCollection">collection preview applied</div>
            </div>
          
            <div class="preset-val p-name"><span class="p-label name-label">name: </span> <span class="p-val name-val">${setting?.name ? setting.name : 'untitled' }</span><span class="edit-name-icon"><svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m6a6n1eq-00GH4PNFFBN9">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4549 5.41575C21.6471 5.70687 21.615 6.10248 21.3588 6.35876L12.1664 15.5511C12.0721 15.6454 11.9545 15.7128 11.8256 15.7465L7.99716 16.7465C7.87229 16.7791 7.74358 16.7784 7.62265 16.7476C7.49408 16.7149 7.37431 16.6482 7.27729 16.5511C7.08902 16.3629 7.01468 16.0889 7.08197 15.8313L8.08197 12.0028C8.11144 11.89 8.16673 11.7786 8.24322 11.6912L17.4697 2.46967C17.5504 2.38891 17.6477 2.32846 17.7536 2.29163C17.8321 2.26432 17.9153 2.25 18 2.25C18.1989 2.25 18.3897 2.32902 18.5303 2.46967L21.3588 5.2981C21.3954 5.33471 21.4274 5.37416 21.4549 5.41575ZM19.7678 5.82843L18 4.06066L9.48184 12.5788L8.85685 14.9716L11.2496 14.3466L19.7678 5.82843Z" fill="black" pid="m6a6n1eq-00UB44AV8TI7" stroke="null"></path>
            <path d="M19.6414 17.1603C19.9148 14.8227 20.0018 12.4688 19.9023 10.1208C19.8976 10.0084 19.9399 9.89898 20.0194 9.81942L21.0027 8.83609C21.1236 8.71519 21.3302 8.79194 21.3415 8.96254C21.5265 11.7522 21.4563 14.5545 21.1312 17.3346C20.8946 19.3571 19.2703 20.9421 17.2583 21.167C13.7917 21.5544 10.2083 21.5544 6.74177 21.167C4.72971 20.9421 3.10538 19.3571 2.86883 17.3346C2.45429 13.7903 2.45429 10.2097 2.86883 6.66543C3.10538 4.6429 4.72971 3.05789 6.74177 2.83301C9.37152 2.5391 12.0685 2.46815 14.7306 2.62016C14.9022 2.62996 14.9804 2.83757 14.8589 2.95909L13.8664 3.95165C13.7877 4.03034 13.6798 4.07261 13.5685 4.06885C11.3421 3.99376 9.10055 4.07872 6.90838 4.32373C5.57827 4.47239 4.51278 5.522 4.35867 6.83968C3.95767 10.2682 3.95767 13.7318 4.35867 17.1603C4.51278 18.478 5.57827 19.5276 6.90838 19.6763C10.2642 20.0513 13.7358 20.0513 17.0916 19.6763C18.4218 19.5276 19.4872 18.478 19.6414 17.1603Z" fill="black" pid="m6a6n1eq-005VNPO0IXRL" stroke="null"></path>
            </svg></span></div>
            <div class="preset-val p-viewbox"><span class="p-label vb-label">viewbox: </span><span class="p-val vb-val">${setting?.viewbox ? setting.viewbox : 'none'}</span></div>
            <div class="preset-val p-height"><span class="p-label height-label">height: </span> <span class="p-val height-val">${setting?.height ? setting.height : 'none'}</span></div>
            <div class="preset-val p-width"><span class="p-label width-label">width: </span><span class="p-val width-val">${setting?.width ? setting.width : 'none'}</span></div>
            </div>
            
            <div class="save-options">
                <div class="save-opt save-icon">save as icon preset</div>
                <div class="save-opt save-collection">save as collection preset</div>
            </div>
            `
            return element
        }
        currentPresetElement.innerHTML = createPresetElement(setting).outerHTML
        return setting
    }
    async saveCurrentPreset(){
        const id = this.currentIcon.id
        const name = this.currentIcon.collection
        let details = {
            name: 'untitled',
            preset_type: 'icon',
            usePreset: false,
            created_at: Date.now(),
            pid: uuid(),
        }
        let data = this.preview.currentPreset
        let setting = {
            ...data,
            ...details
        }
        console.log('SAVING PRESEET', setting, 'to', id, name)
        const testResult = await this.store.saveIconPreset( id, name, setting )
        console.log('save result',testResult)
        // overwrite current icon;
        if (testResult?.id == this.currentIcon.id){
                let updated = this.currentIcon.addPreset(setting)
                if (updated){
                    this.preview.icon.settings = updated.settings
                    this.loadPresetMenu()
                    console.log('preset successfully saved')
                }
            } else {
                console.error('error saving preset' , testResult)
            }
        // console.log('RESULT',testResult.data)
    }
    async loadPresetMenu() {
        const collection = this.currentView
        const meta = collection.meta
        const currentIcon = this.currentIcon
        const collectionID = meta.cid
        const iconSettings = currentIcon?.settings
        const collectionSettings = collection?.settings
        let recentSettings = {}
        if (collection?.recentSettings && Array.isArray(collection.recentSettings))
            collection.recentSettings.forEach(setting => recentSettings[setting.pid] = setting)
        let currentAnimation
        const presetIsDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lgxgw9-0265D74VQICG"><path d="M10.5 16C10.5 15.1716 11.1716 14.5 12 14.5C12.8284 14.5 13.5 15.1716 13.5 16C13.5 16.8284 12.8284 17.5 12 17.5C11.1716 17.5 10.5 16.8284 10.5 16Z" fill="black" pid="m4lgxgw9-00NA2554UM3C" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.81049 4.00497C10.0428 3.91246 10.2852 3.8475 10.5327 3.81144C12.006 3.59678 13.4327 4.42661 13.9745 5.81335L14.0495 6.00537C14.1424 6.2433 14.2087 6.4908 14.2472 6.74334L14.4638 8.16565L15.9467 7.9398L15.7301 6.51749C15.675 6.15544 15.5799 5.80062 15.4466 5.45951L15.3716 5.26749C14.5758 3.23066 12.4804 2.01182 10.3165 2.32712C9.95295 2.38008 9.59691 2.47548 9.25563 2.61137C7.22397 3.42026 6.01867 5.52354 6.34793 7.68538L6.37897 7.88919C6.43411 8.25123 6.52918 8.60605 6.66245 8.94716L7.3166 10.6215L6.93512 10.6519C5.85239 10.7384 4.96829 11.5523 4.79277 12.6242C4.4267 14.8598 4.4267 17.1401 4.79277 19.3758C4.96829 20.4477 5.85239 21.2616 6.93512 21.348L8.43125 21.4675C10.8066 21.6571 13.1934 21.6571 15.5687 21.4675L17.0649 21.348C18.1476 21.2616 19.0317 20.4477 19.2072 19.3758C19.5733 17.1401 19.5733 14.8598 19.2072 12.6242C19.0317 11.5523 18.1476 10.7384 17.0649 10.6519L15.5687 10.5325C13.3426 10.3548 11.1065 10.3436 8.87916 10.499L8.0596 8.4013C7.96665 8.16337 7.90033 7.91587 7.86187 7.66334L7.83083 7.45953C7.60666 5.98768 8.42727 4.55569 9.81049 4.00497ZM15.4494 12.0277C13.1534 11.8445 10.8466 11.8445 8.55062 12.0277L7.05449 12.1472C6.65956 12.1787 6.33708 12.4756 6.27306 12.8666C5.93327 14.9417 5.93327 17.0583 6.27306 19.1334C6.33708 19.5244 6.65956 19.8213 7.05449 19.8528L8.55062 19.9722C10.8465 20.1555 13.1534 20.1555 15.4494 19.9722L16.9455 19.8528C17.3404 19.8213 17.6629 19.5244 17.7269 19.1334C18.0667 17.0583 18.0667 14.9417 17.7269 12.8666C17.6629 12.4756 17.3404 12.1787 16.9455 12.1472L15.4494 12.0277Z" fill="black" pid="m4lgxgw9-01EYDRNJVEAJ" stroke="null"></path></svg>'
        const presetNotDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lgxgw6-003EWOTOIWH9"><path d="M10.5 16C10.5 15.1716 11.1716 14.5 12 14.5C12.8284 14.5 13.5 15.1716 13.5 16C13.5 16.8284 12.8284 17.5 12 17.5C11.1716 17.5 10.5 16.8284 10.5 16Z" fill="black" pid="m4lgxgw6-02FPUN3FPP0X" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.62165 10.5971L7.30621 7.75816C7.26577 7.39418 7.26577 7.02684 7.30621 6.66286L7.32898 6.45796C7.57046 4.28457 9.27907 2.56492 11.4509 2.30941C11.8157 2.26649 12.1843 2.26649 12.5491 2.30941C14.7209 2.56492 16.4295 4.28458 16.671 6.45797L16.6937 6.66286C16.7342 7.02684 16.7342 7.39418 16.6937 7.75815L16.3783 10.5971L17.0649 10.6519C18.1476 10.7384 19.0317 11.5523 19.2073 12.6242C19.5733 14.8598 19.5733 17.1401 19.2073 19.3758C19.0317 20.4477 18.1476 21.2616 17.0649 21.348L15.5688 21.4675C13.1934 21.6571 10.8067 21.6571 8.43128 21.4675L6.93515 21.348C5.85242 21.2616 4.96832 20.4477 4.7928 19.3758C4.42673 17.1401 4.42673 14.8598 4.7928 12.6242C4.96832 11.5523 5.85242 10.7384 6.93515 10.6519L7.62165 10.5971ZM11.6261 3.79914C11.8745 3.76992 12.1255 3.76992 12.3738 3.79914C13.8525 3.97309 15.0157 5.1439 15.1802 6.62361L15.2029 6.82851C15.2311 7.08239 15.2311 7.33862 15.2029 7.59251L14.8818 10.483C12.9626 10.3594 11.0374 10.3594 9.1182 10.483L8.79704 7.59251C8.76883 7.33862 8.76883 7.08239 8.79704 6.82851L8.8198 6.62361C8.98422 5.1439 10.1475 3.97309 11.6261 3.79914ZM15.4494 12.0277C13.1535 11.8445 10.8466 11.8445 8.55065 12.0277L7.05452 12.1472C6.65959 12.1787 6.33711 12.4756 6.27309 12.8666C5.9333 14.9417 5.9333 17.0583 6.27309 19.1334C6.33711 19.5244 6.65959 19.8213 7.05452 19.8528L8.55065 19.9722C10.8466 20.1555 13.1535 20.1555 15.4494 19.9722L16.9455 19.8528C17.3405 19.8213 17.6629 19.5244 17.727 19.1334C18.0668 17.0583 18.0668 14.9417 17.727 12.8666C17.6629 12.4756 17.3405 12.1787 16.9455 12.1472L15.4494 12.0277Z" fill="black" pid="m4lgxgw6-002BR93QMXFL" stroke="null"></path></svg>'
        const presetIsCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lhje14-011M3D6DXUR4"><path d="M18.68 9.98322C18.7196 10.231 18.7546 10.4792 18.7851 10.7279C18.8028 10.8722 18.8961 10.9956 19.0278 11.0569C19.3826 11.2219 19.7185 11.4206 20.0315 11.6488C20.174 11.7528 20.3819 11.6471 20.3678 11.4712C20.3215 10.8947 20.2527 10.3194 20.1613 9.74679L20.0972 9.34535C19.8913 8.05533 18.7786 7.10612 17.4722 7.10612L9.15777 7.10612C8.95226 6.04846 8.02099 5.25 6.90323 5.25H4.61167C3.25538 5.25 2.11298 6.26343 1.95127 7.61004L1.67879 9.87915C1.38913 12.2913 1.46388 14.7333 1.90055 17.1232C2.11607 18.3027 3.10258 19.1869 4.2986 19.2725L5.81261 19.3808C7.53657 19.5041 9.26382 19.5659 10.9911 19.5661C11.1458 19.5661 11.2421 19.3969 11.1709 19.2596C11.0216 18.9719 10.8949 18.6706 10.7932 18.358C10.7375 18.1866 10.5813 18.0651 10.4011 18.0636C8.90627 18.051 7.4117 17.9914 5.91965 17.8846L4.40565 17.7763C3.89217 17.7396 3.46865 17.36 3.37612 16.8536C2.96649 14.6116 2.89636 12.3208 3.16809 10.058L3.44057 7.78888C3.51176 7.19611 4.01464 6.75 4.61167 6.75H6.90323C7.34328 6.75 7.7 7.10672 7.7 7.54677C7.7 8.13183 8.17429 8.60612 8.75936 8.60612H17.4722C18.0414 8.60612 18.5262 9.0197 18.6159 9.58178L18.68 9.98322Z" fill="black" pid="m4lhje14-02G8MUTWRREV" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.5C12 17.4719 12.3081 18.3718 12.8319 19.1074C13.1238 19.5173 13.4827 19.8762 13.8926 20.1681C14.6282 20.6919 15.5281 21 16.5 21C18.9853 21 21 18.9853 21 16.5C21 15.5281 20.6919 14.6282 20.1681 13.8926C19.8762 13.4827 19.5173 13.1238 19.1074 12.8319C18.3718 12.3081 17.4719 12 16.5 12C14.0147 12 12 14.0147 12 16.5ZM16.5 19.5C15.9436 19.5 15.4227 19.3486 14.976 19.0846L19.0846 14.976C19.3486 15.4227 19.5 15.9436 19.5 16.5C19.5 18.1569 18.1569 19.5 16.5 19.5ZM13.9154 18.024L18.024 13.9154C17.5773 13.6514 17.0564 13.5 16.5 13.5C14.8431 13.5 13.5 14.8431 13.5 16.5C13.5 17.0564 13.6514 17.5773 13.9154 18.024Z" fill="black" pid="m4lhje14-02B47GTRSP3K" stroke="null"></path></svg>'
        const presetNotCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lhje15-00TIO5N7LRCX"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 11.25C17.2275 11.25 16.1285 12.14 15.864 13.3847L15.8418 13.4891C15.7739 13.8088 15.7619 14.1379 15.8064 14.4617L15.9594 15.5744C15.9023 15.5813 15.8451 15.5885 15.788 15.5959C14.9083 15.7102 14.25 16.4595 14.25 17.3466V19.6534C14.25 20.5405 14.9083 21.2899 15.788 21.4041C17.5884 21.6379 19.4116 21.6379 21.212 21.4041C22.0917 21.2899 22.75 20.5405 22.75 19.6534V17.3466C22.75 16.4595 22.0917 15.7102 21.212 15.5959C21.1549 15.5885 21.0977 15.5813 21.0406 15.5744L21.1936 14.4617C21.2381 14.1379 21.2261 13.8088 21.1582 13.4891L21.136 13.3847C20.8715 12.14 19.7724 11.25 18.5 11.25ZM19.5441 15.4464L19.7076 14.2574C19.7284 14.1054 19.7228 13.951 19.6909 13.8009L19.6688 13.6965C19.5515 13.1446 19.0642 12.75 18.5 12.75C17.9358 12.75 17.4485 13.1446 17.3312 13.6965L17.3091 13.8009C17.2772 13.951 17.2715 14.1054 17.2924 14.2574L17.4559 15.4464C18.1515 15.4119 18.8484 15.4119 19.5441 15.4464ZM15.9812 17.0834C17.6534 16.8663 19.3466 16.8663 21.0188 17.0834C21.151 17.1006 21.25 17.2132 21.25 17.3466V19.6534C21.25 19.7868 21.151 19.8994 21.0188 19.9166C19.3466 20.1338 17.6534 20.1338 15.9812 19.9166C15.849 19.8994 15.75 19.7868 15.75 19.6534V17.3466C15.75 17.2132 15.849 17.1006 15.9812 17.0834Z" fill="black" pid="m4lhje15-0029CY6QDQ9D" stroke="null"></path><path d="M12.75 18.3653C12.75 18.1984 12.6138 18.0637 12.4468 18.0647C10.6034 18.0763 8.7596 18.0163 6.91965 17.8846L5.40565 17.7763C4.89217 17.7396 4.46865 17.36 4.37612 16.8536C3.96649 14.6116 3.89636 12.3208 4.16809 10.058L4.44057 7.78888C4.51176 7.19611 5.01464 6.75 5.61167 6.75H7.90323C8.34328 6.75 8.7 7.10672 8.7 7.54677C8.7 8.13183 9.17429 8.60612 9.75936 8.60612H18.4722C19.0414 8.60612 19.5262 9.0197 19.6159 9.58178L19.6293 9.66531C19.6537 9.8182 19.7647 9.94169 19.9105 9.99377C20.2621 10.1194 20.5933 10.2908 20.8961 10.5016C21.0468 10.6066 21.2677 10.4888 21.2434 10.3067C21.2184 10.1198 21.191 9.93317 21.1613 9.74679L21.0972 9.34535C20.8913 8.05533 19.7786 7.10612 18.4722 7.10612L10.1578 7.10612C9.95226 6.04846 9.02099 5.25 7.90323 5.25H5.61167C4.25538 5.25 3.11298 6.26343 2.95127 7.61004L2.67879 9.87915C2.38913 12.2913 2.46388 14.7333 2.90055 17.1232C3.11607 18.3027 4.10258 19.1869 5.2986 19.2725L6.81261 19.3808C8.69028 19.5151 10.5719 19.5764 12.4531 19.5647C12.6176 19.5637 12.75 19.4298 12.75 19.2653V18.3653Z" fill="black" pid="m4lhje15-020YA1B619UI" stroke="null"></path></svg>'
        const hidePresetIcon = '<svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lo5rs8-00OP23ZTDXMN"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.5303 4.53033C20.8232 4.23744 20.8232 3.76256 20.5303 3.46967C20.2374 3.17678 19.7626 3.17678 19.4697 3.46967L3.46967 19.4697C3.17678 19.7626 3.17678 20.2374 3.46967 20.5303C3.76256 20.8232 4.23744 20.8232 4.53033 20.5303L7.37723 17.6834C8.74353 18.3266 10.3172 18.75 12 18.75C14.684 18.75 17.0903 17.6729 18.8206 16.345C19.6874 15.6797 20.4032 14.9376 20.9089 14.2089C21.4006 13.5003 21.75 12.7227 21.75 12C21.75 11.2773 21.4006 10.4997 20.9089 9.79115C20.4032 9.06244 19.6874 8.32028 18.8206 7.65503C18.5585 7.45385 18.2808 7.25842 17.989 7.07163L20.5303 4.53033ZM16.8995 8.16113L15.1287 9.93196C15.5213 10.5248 15.75 11.2357 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C11.2357 15.75 10.5248 15.5213 9.93196 15.1287L8.51524 16.5454C9.58077 16.9795 10.7621 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C17.5941 8.60461 17.2571 8.37472 16.8995 8.16113ZM11.0299 14.0307C11.3237 14.1713 11.6526 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 11.6526 14.1713 11.3237 14.0307 11.0299L11.0299 14.0307Z" pid="m4lo5rs8-00F4LH2DZYNA" stroke="null"></path><path fill="currentColor" d="M12 5.25C13.0323 5.25 14.0236 5.40934 14.9511 5.68101C15.1296 5.73328 15.1827 5.95662 15.0513 6.0881L14.2267 6.91265C14.1648 6.97451 14.0752 6.99928 13.99 6.97967C13.3506 6.83257 12.6839 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.67725 13.8635 5.18138 14.4107 5.81091 14.9307C5.92677 15.0264 5.93781 15.2015 5.83156 15.3078L5.12265 16.0167C5.03234 16.107 4.88823 16.1149 4.79037 16.0329C4.09739 15.4517 3.51902 14.8255 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25Z" pid="m4lo5rs8-02CT5B0Y3UOA" stroke="null"></path><path fill="currentColor" d="M12 8.25C12.1185 8.25 12.2357 8.25549 12.3513 8.26624C12.5482 8.28453 12.6194 8.51991 12.4796 8.6597L11.2674 9.87196C10.6141 10.0968 10.0968 10.6141 9.87196 11.2674L8.6597 12.4796C8.51991 12.6194 8.28453 12.5482 8.26624 12.3513C8.25549 12.2357 8.25 12.1185 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z" pid="m4lo5rs8-028MI5K4V6ZL" stroke="null"></path></svg>'
        const saveAsCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69q4n3v-00RDW2RAYPMU"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 11.25C17.2275 11.25 16.1285 12.14 15.864 13.3847L15.8418 13.4891C15.7739 13.8088 15.7619 14.1379 15.8064 14.4617L15.9594 15.5744C15.9023 15.5813 15.8451 15.5885 15.788 15.5959C14.9083 15.7102 14.25 16.4595 14.25 17.3466V19.6534C14.25 20.5405 14.9083 21.2899 15.788 21.4041C17.5884 21.6379 19.4116 21.6379 21.212 21.4041C22.0917 21.2899 22.75 20.5405 22.75 19.6534V17.3466C22.75 16.4595 22.0917 15.7102 21.212 15.5959C21.1549 15.5885 21.0977 15.5813 21.0406 15.5744L21.1936 14.4617C21.2381 14.1379 21.2261 13.8088 21.1582 13.4891L21.136 13.3847C20.8715 12.14 19.7724 11.25 18.5 11.25ZM19.5441 15.4464L19.7076 14.2574C19.7284 14.1054 19.7228 13.951 19.6909 13.8009L19.6688 13.6965C19.5515 13.1446 19.0642 12.75 18.5 12.75C17.9358 12.75 17.4485 13.1446 17.3312 13.6965L17.3091 13.8009C17.2772 13.951 17.2715 14.1054 17.2924 14.2574L17.4559 15.4464C18.1515 15.4119 18.8484 15.4119 19.5441 15.4464ZM15.9812 17.0834C17.6534 16.8663 19.3466 16.8663 21.0188 17.0834C21.151 17.1006 21.25 17.2132 21.25 17.3466V19.6534C21.25 19.7868 21.151 19.8994 21.0188 19.9166C19.3466 20.1338 17.6534 20.1338 15.9812 19.9166C15.849 19.8994 15.75 19.7868 15.75 19.6534V17.3466C15.75 17.2132 15.849 17.1006 15.9812 17.0834Z" fill="black" pid="m69q4n3v-01NJ1I89COBG" stroke="null"></path><path d="M12.75 18.3653C12.75 18.1984 12.6138 18.0637 12.4468 18.0647C10.6034 18.0763 8.7596 18.0163 6.91965 17.8846L5.40565 17.7763C4.89217 17.7396 4.46865 17.36 4.37612 16.8536C3.96649 14.6116 3.89636 12.3208 4.16809 10.058L4.44057 7.78888C4.51176 7.19611 5.01464 6.75 5.61167 6.75H7.90323C8.34328 6.75 8.7 7.10672 8.7 7.54677C8.7 8.13183 9.17429 8.60612 9.75936 8.60612H18.4722C19.0414 8.60612 19.5262 9.0197 19.6159 9.58178L19.6293 9.66531C19.6537 9.8182 19.7647 9.94169 19.9105 9.99377C20.2621 10.1194 20.5933 10.2908 20.8961 10.5016C21.0468 10.6066 21.2677 10.4888 21.2434 10.3067C21.2184 10.1198 21.191 9.93317 21.1613 9.74679L21.0972 9.34535C20.8913 8.05533 19.7786 7.10612 18.4722 7.10612L10.1578 7.10612C9.95226 6.04846 9.02099 5.25 7.90323 5.25H5.61167C4.25538 5.25 3.11298 6.26343 2.95127 7.61004L2.67879 9.87915C2.38913 12.2913 2.46388 14.7333 2.90055 17.1232C3.11607 18.3027 4.10258 19.1869 5.2986 19.2725L6.81261 19.3808C8.69028 19.5151 10.5719 19.5764 12.4531 19.5647C12.6176 19.5637 12.75 19.4298 12.75 19.2653V18.3653Z" fill="black" pid="m69q4n3v-00NKXI5S6E2P" stroke="null"></path></svg>'
        const removeCollectionDefaultIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69q4n3u-021JUMZVM3JV"><path d="M18.68 9.98322C18.7196 10.231 18.7546 10.4792 18.7851 10.7279C18.8028 10.8722 18.8961 10.9956 19.0278 11.0569C19.3826 11.2219 19.7185 11.4206 20.0315 11.6488C20.174 11.7528 20.3819 11.6471 20.3678 11.4712C20.3215 10.8947 20.2527 10.3194 20.1613 9.74679L20.0972 9.34535C19.8913 8.05533 18.7786 7.10612 17.4722 7.10612L9.15777 7.10612C8.95226 6.04846 8.02099 5.25 6.90323 5.25H4.61167C3.25538 5.25 2.11298 6.26343 1.95127 7.61004L1.67879 9.87915C1.38913 12.2913 1.46388 14.7333 1.90055 17.1232C2.11607 18.3027 3.10258 19.1869 4.2986 19.2725L5.81261 19.3808C7.53657 19.5041 9.26382 19.5659 10.9911 19.5661C11.1458 19.5661 11.2421 19.3969 11.1709 19.2596C11.0216 18.9719 10.8949 18.6706 10.7932 18.358C10.7375 18.1866 10.5813 18.0651 10.4011 18.0636C8.90627 18.051 7.4117 17.9914 5.91965 17.8846L4.40565 17.7763C3.89217 17.7396 3.46865 17.36 3.37612 16.8536C2.96649 14.6116 2.89636 12.3208 3.16809 10.058L3.44057 7.78888C3.51176 7.19611 4.01464 6.75 4.61167 6.75H6.90323C7.34328 6.75 7.7 7.10672 7.7 7.54677C7.7 8.13183 8.17429 8.60612 8.75936 8.60612H17.4722C18.0414 8.60612 18.5262 9.0197 18.6159 9.58178L18.68 9.98322Z" fill="black" pid="m69q4n3u-011XLEIB0F8E" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.5C12 17.4719 12.3081 18.3718 12.8319 19.1074C13.1238 19.5173 13.4827 19.8762 13.8926 20.1681C14.6282 20.6919 15.5281 21 16.5 21C18.9853 21 21 18.9853 21 16.5C21 15.5281 20.6919 14.6282 20.1681 13.8926C19.8762 13.4827 19.5173 13.1238 19.1074 12.8319C18.3718 12.3081 17.4719 12 16.5 12C14.0147 12 12 14.0147 12 16.5ZM16.5 19.5C15.9436 19.5 15.4227 19.3486 14.976 19.0846L19.0846 14.976C19.3486 15.4227 19.5 15.9436 19.5 16.5C19.5 18.1569 18.1569 19.5 16.5 19.5ZM13.9154 18.024L18.024 13.9154C17.5773 13.6514 17.0564 13.5 16.5 13.5C14.8431 13.5 13.5 14.8431 13.5 16.5C13.5 17.0564 13.6514 17.5773 13.9154 18.024Z" fill="black" pid="m69q4n3u-014LY68EEF08" stroke="null"></path></svg>'
        const removeFromCollectionIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69qqotf-005USGAM7PMH"><path d="M9.70191 11.2019C9.9948 10.909 10.4697 10.909 10.7626 11.2019L12 12.4393L13.2374 11.2019C13.5303 10.909 14.0052 10.909 14.2981 11.2019C14.591 11.4948 14.591 11.9697 14.2981 12.2626L13.0607 13.5L14.2981 14.7374C14.591 15.0303 14.591 15.5052 14.2981 15.7981C14.0052 16.091 13.5303 16.091 13.2374 15.7981L12 14.5607L10.7626 15.7981C10.4697 16.091 9.9948 16.091 9.70191 15.7981C9.40901 15.5052 9.40901 15.0303 9.70191 14.7374L10.9393 13.5L9.70191 12.2626C9.40902 11.9697 9.40902 11.4948 9.70191 11.2019Z" fill="black" pid="m69qqotf-02A1LON86UDH" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1613 9.74679C21.5581 12.233 21.5297 14.7686 21.0771 17.2453C20.8748 18.353 19.9484 19.1833 18.8253 19.2636L17.1874 19.3808C13.7335 19.6279 10.2665 19.6279 6.81261 19.3808L5.2986 19.2725C4.10258 19.1869 3.11607 18.3027 2.90055 17.1232C2.46388 14.7333 2.38913 12.2913 2.67879 9.87915L2.95127 7.61004C3.11298 6.26343 4.25538 5.25 5.61167 5.25H7.90323C9.02099 5.25 9.95226 6.04846 10.1578 7.10612L18.4722 7.10612C19.7786 7.10612 20.8913 8.05533 21.0972 9.34535L21.1613 9.74679ZM19.6016 16.9757C20.0236 14.6662 20.0501 12.3017 19.68 9.98322L19.6159 9.58178C19.5262 9.0197 19.0414 8.60612 18.4722 8.60612H9.75936C9.17429 8.60612 8.7 8.13183 8.7 7.54677C8.7 7.10672 8.34328 6.75 7.90323 6.75H5.61167C5.01464 6.75 4.51176 7.19611 4.44057 7.78888L4.16809 10.058C3.89636 12.3208 3.96649 14.6116 4.37612 16.8536C4.46865 17.36 4.89217 17.7396 5.40565 17.7763L6.91965 17.8846C10.3022 18.1266 13.6978 18.1266 17.0804 17.8846L18.7182 17.7674C19.1588 17.7359 19.5222 17.4102 19.6016 16.9757Z" fill="black" pid="m69qqotf-01QUMYO3BSAD" stroke="null"></path></svg>'
        const addToCollectionIcon = '<svg width="24px" height="24px" viewBox="-3 -3 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m69qu6q2-02A7JGMVLEMP"><path d="M8.75 13.5C8.75 13.0858 9.08579 12.75 9.5 12.75H11.25V11C11.25 10.5858 11.5858 10.25 12 10.25C12.4142 10.25 12.75 10.5858 12.75 11V12.75H14.5C14.9142 12.75 15.25 13.0858 15.25 13.5C15.25 13.9142 14.9142 14.25 14.5 14.25H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V14.25H9.5C9.08579 14.25 8.75 13.9142 8.75 13.5Z" fill="black" pid="m69qu6q2-017MOA1JU5V4" stroke="null"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1613 9.74679C21.5581 12.233 21.5297 14.7686 21.0771 17.2453C20.8748 18.353 19.9484 19.1833 18.8253 19.2636L17.1874 19.3808C13.7335 19.6279 10.2665 19.6279 6.81261 19.3808L5.2986 19.2725C4.10258 19.1869 3.11607 18.3027 2.90055 17.1232C2.46388 14.7333 2.38913 12.2913 2.67879 9.87915L2.95127 7.61004C3.11298 6.26343 4.25538 5.25 5.61167 5.25H7.90323C9.02099 5.25 9.95226 6.04846 10.1578 7.10612L18.4722 7.10612C19.7786 7.10612 20.8913 8.05533 21.0972 9.34535L21.1613 9.74679ZM19.6016 16.9757C20.0236 14.6662 20.0501 12.3017 19.68 9.98322L19.6159 9.58178C19.5262 9.0197 19.0414 8.60612 18.4722 8.60612H9.75936C9.17429 8.60612 8.7 8.13183 8.7 7.54677C8.7 7.10672 8.34328 6.75 7.90323 6.75H5.61167C5.01464 6.75 4.51176 7.19611 4.44057 7.78888L4.16809 10.058C3.89636 12.3208 3.96649 14.6116 4.37612 16.8536C4.46865 17.36 4.89217 17.7396 5.40565 17.7763L6.91965 17.8846C10.3022 18.1266 13.6978 18.1266 17.0804 17.8846L18.7182 17.7674C19.1588 17.7359 19.5222 17.4102 19.6016 16.9757Z" fill="black" pid="m69qu6q2-007LBGPNOWUH" stroke="null"></path></svg>'
        // * NEED TO HANDLE STATE CHANGES WHEN CHANGING COLLECTIONS! * //
        const iconSettingsTab = $('.settings-modal [role="tab"][modal="icons"]')
        const iconSettingsTabber = $('.settings-editor .preset-option.icon')
        const collectionSettingsTab = $('.settings-modal [role="tab"][modal="collections"]')
        const collectionSettingsTabber = $('.settings-editor .preset-option.collection')
        const recentSettingsTab = $('.settings-modal [role="tab"][modal="recent"]')
        const recentSettingsTabber = $('.settings-editor .preset-option.recent')
        const tab = collection.state?.presetTab || 'icons'
        const currentTab = $(`.settings-modal [role="tab"][modal="${tab}"]`)
        const tabs = [
            ['icons',iconSettingsTab,iconSettingsTabber],
            ['collections',collectionSettingsTab,collectionSettingsTabber],
            ['recent',recentSettingsTab,recentSettingsTabber]
        ]
        tabs.forEach(tab => tab[2].addEventListener('click', () => {
            tabs.forEach(tab => {
                tab[2].classList.remove('active')
                tab[1].classList.remove('active')
            })
            tab[1].classList.add('active')
            tab[2].classList.add('active')
            collection.state.presetTab = tab[0]
        }))
        currentTab.classList.add('active')
        $(`.settings-editor .preset-option[tab=${tab}]`).classList.add('active')
        const createPresetWrapper = (settings,destination,type) => {
            const createPresetElement = (setting) => {
                const element = document.createElement('div');
                const element_id = setting?.pid ? setting.pid : null
                const isIconDefault = currentIcon?.preset?.pid == setting.pid
                const isCollectionDefault = meta?.preset?.pid == setting.pid
                const collectionSettingExists = !objectIsEmpty(collectionSettings) && Object.hasOwn(collectionSettings,setting.pid)
                element.classList.add('preset-preview-element')
                if (!element_id) return
                element.setAttribute('pid', element_id)
                element.innerHTML = ` 
                <div class="preset-element-toast">
                    <div class="toast success defaultSet"> default setting applied </div>
                    <div class="toast failure settingError"> error setting preset </div>
                    <div class="toast clear defaultCleared"> default setting removed </div>
                    <div class="toast delete removeCollectionSetting"> collection setting removed </div>
                    <div class="toast success collectionDefault"> collection setting saved</div>
                    <div class="toast info previewCollection">collection preview applied</div>
                    <div class="toast success nameChange">name successfully changed</div>
                    <div class="toast failure nameChangeError">error saving name</div>
                </div>
                <div class="preset-element-option">

                    <div class="pre-opt opt-aid iconDefault">
                        <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
                        <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
                    </div>
                    <div class="pre-opt opt-acd collectionDefault"> 
                        <div class="icon">${ isCollectionDefault ? presetIsCollectionDefaultIcon : presetNotCollectionDefaultIcon } </div>
                        <div class="tool-tip">${ isCollectionDefault ? 'clear collection default' : 'set collection default' }</div>
                    </div>
                    <div class="pre-opt opt-a2c ${ collectionSettingExists ? 'removeFromCollection' : 'addToCollection' } "> 
                        <div class="icon">${ collectionSettingExists ? removeFromCollectionIcon : addToCollectionIcon } </div>
                        <div class="tool-tip">${ collectionSettingExists ? 'remove collection preset' : 'save as collection preset' } </div>
                    </div>
                    <div class="pre-opt opt-pc previewCollection"> 
                        <div class="icon">
                            <svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lmp9jk-01TQPUCN0DL1">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="black" pid="m4lmp9jk-01SOYBUFQE8O" stroke="null"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.72857 13.9374 5.33078 14.5703 6.09267 15.155C7.61978 16.3271 9.71345 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C16.3802 7.67292 14.2865 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464ZM5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25C14.684 5.25 17.0903 6.32708 18.8206 7.65503C19.6874 8.32028 20.4032 9.06244 20.9089 9.79115C21.4006 10.4997 21.75 11.2773 21.75 12C21.75 12.7227 21.4006 13.5003 20.9089 14.2089C20.4032 14.9376 19.6874 15.6797 18.8206 16.345C17.0903 17.6729 14.684 18.75 12 18.75C9.31598 18.75 6.90965 17.6729 5.17941 16.345C4.31262 15.6797 3.59681 14.9376 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503Z" fill="black" pid="m4lmp9jk-00LSTYQMKI2E" stroke="null"></path>
                            </svg>
                        </div>
                        <div class="tool-tip">preview collection</div>
                    </div>
                    <div class="pre-opt opt-pi deletePreset"> 
                            <div class="icon"><svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lkyhp9-02ABXVVV5HTN">
                            <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="black" pid="m4lkyhp9-01CH2FKOVM1P" stroke="null"></path>
                            <path d="M13.0607 15L14.5303 16.4697C14.8232 16.7626 14.8232 17.2374 14.5303 17.5303C14.2374 17.8232 13.7626 17.8232 13.4697 17.5303L12 16.0607L10.5303 17.5303C10.2374 17.8232 9.76257 17.8232 9.46968 17.5303C9.17678 17.2374 9.17678 16.7626 9.46968 16.4697L10.9393 15L9.46967 13.5303C9.17678 13.2374 9.17678 12.7626 9.46967 12.4697C9.76256 12.1768 10.2374 12.1768 10.5303 12.4697L12 13.9393L13.4697 12.4697C13.7626 12.1768 14.2374 12.1768 14.5303 12.4697C14.8232 12.7626 14.8232 13.2374 14.5303 13.5303L13.0607 15Z" fill="black" pid="m4lkyhp9-01VZPDFEMFGW" stroke="null"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="black" pid="m4lkyhp9-01OHI2KX2T3R" stroke="null"></path>
                            </svg></div>
                        <div class="tool-tip">delete preset</div>
                    </div>
                </div>
                <div class="preset-val p-name"><span class="p-label name-label">name: </span> <span class="p-val name-val">${setting?.name ? setting.name : 'untitled' }</span></div>
                <div class="preset-val p-viewbox"><span class="p-label vb-label">viewbox: </span><span class="p-val vb-val">${setting?.viewbox ? setting.viewbox : 'none'}</span></div>
                <div class="preset-val p-height"><span class="p-label height-label">height: </span> <span class="p-val height-val">${setting?.height ? setting.height : 'none'}</span></div>
                <div class="preset-val p-width"><span class="p-label width-label">width: </span><span class="p-val width-val">${setting?.width ? setting.width : 'none'}</span></div>
                `
                return element
            }
            const createCollectionPresetElement = (setting) => {
                const element = document.createElement('div');
                const element_id = setting?.pid ? setting.pid : null
                const isIconDefault = currentIcon?.preset?.pid == setting.pid
                const isCollectionDefault = meta?.preset?.pid == setting.pid
                element.classList.add('preset-preview-element')
                if (!element_id) return
                element.setAttribute('pid', element_id)
                element.innerHTML = ` 
                <div class="preset-element-toast">
                    <div class="toast success defaultSet"> default setting applied </div>
                    <div class="toast failure settingError"> error setting preset </div>
                    <div class="toast clear defaultCleared"> default setting removed </div>
                    <div class="toast info previewIcon">icon preview applied</div>
                    <div class="toast info previewCollection">collection preview applied</div>
                    <div class="toast success nameChange">name successfully changed</div>
                    <div class="toast failure nameChangeError">error saving name</div>
                </div>
                <div class="preset-element-option">
                    <div class="pre-opt opt-aid iconDefault">
                        <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
                        <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
                    </div>
                    <div class="pre-opt opt-acd collectionDefault">
                        <div class="icon" active="${isCollectionDefault ? true : false }">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
                        <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
                    </div>
                    <div class="pre-opt opt-pc previewCollection"> 
                        <div class="icon">
                            <svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lmp9jk-01TQPUCN0DL1">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="black" pid="m4lmp9jk-01SOYBUFQE8O" stroke="null"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.72857 13.9374 5.33078 14.5703 6.09267 15.155C7.61978 16.3271 9.71345 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C16.3802 7.67292 14.2865 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464ZM5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25C14.684 5.25 17.0903 6.32708 18.8206 7.65503C19.6874 8.32028 20.4032 9.06244 20.9089 9.79115C21.4006 10.4997 21.75 11.2773 21.75 12C21.75 12.7227 21.4006 13.5003 20.9089 14.2089C20.4032 14.9376 19.6874 15.6797 18.8206 16.345C17.0903 17.6729 14.684 18.75 12 18.75C9.31598 18.75 6.90965 17.6729 5.17941 16.345C4.31262 15.6797 3.59681 14.9376 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503Z" fill="black" pid="m4lmp9jk-00LSTYQMKI2E" stroke="null"></path>
                            </svg>
                        </div>
                        <div class="tool-tip">preview collection</div>
                    </div>
                    <div class="pre-opt opt-pi cDeletePreset"> 
                            <div class="icon"><svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lkyhp9-02ABXVVV5HTN">
                            <path d="M10 2.25C9.58579 2.25 9.25 2.58579 9.25 3V3.75H5C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25H19C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75H14.75V3C14.75 2.58579 14.4142 2.25 14 2.25H10Z" fill="black" pid="m4lkyhp9-01CH2FKOVM1P" stroke="null"></path>
                            <path d="M13.0607 15L14.5303 16.4697C14.8232 16.7626 14.8232 17.2374 14.5303 17.5303C14.2374 17.8232 13.7626 17.8232 13.4697 17.5303L12 16.0607L10.5303 17.5303C10.2374 17.8232 9.76257 17.8232 9.46968 17.5303C9.17678 17.2374 9.17678 16.7626 9.46968 16.4697L10.9393 15L9.46967 13.5303C9.17678 13.2374 9.17678 12.7626 9.46967 12.4697C9.76256 12.1768 10.2374 12.1768 10.5303 12.4697L12 13.9393L13.4697 12.4697C13.7626 12.1768 14.2374 12.1768 14.5303 12.4697C14.8232 12.7626 14.8232 13.2374 14.5303 13.5303L13.0607 15Z" fill="black" pid="m4lkyhp9-01VZPDFEMFGW" stroke="null"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99142 7.91718C6.03363 7.53735 6.35468 7.25 6.73684 7.25H17.2632C17.6453 7.25 17.9664 7.53735 18.0086 7.91718L18.2087 9.71852C18.5715 12.9838 18.5715 16.2793 18.2087 19.5446L18.189 19.722C18.045 21.0181 17.0404 22.0517 15.7489 22.2325C13.2618 22.5807 10.7382 22.5807 8.25108 22.2325C6.95954 22.0517 5.955 21.0181 5.81098 19.722L5.79128 19.5446C5.42846 16.2793 5.42846 12.9838 5.79128 9.71852L5.99142 7.91718ZM7.40812 8.75L7.2821 9.88417C6.93152 13.0394 6.93152 16.2238 7.2821 19.379L7.3018 19.5563C7.37011 20.171 7.84652 20.6612 8.45905 20.747C10.8082 21.0758 13.1918 21.0758 15.5409 20.747C16.1535 20.6612 16.6299 20.171 16.6982 19.5563L16.7179 19.379C17.0685 16.2238 17.0685 13.0394 16.7179 9.88417L16.5919 8.75H7.40812Z" fill="black" pid="m4lkyhp9-01OHI2KX2T3R" stroke="null"></path>
                            </svg></div>
                        <div class="tool-tip">delete preset</div>
                    </div>
                </div>
                <div class="preset-val p-name"><span class="p-label name-label">name: </span> <span class="p-val name-val">${setting?.name ? setting.name : 'untitled' }</span></div>
                <div class="preset-val p-viewbox"><span class="p-label vb-label">viewbox: </span><span class="p-val vb-val">${setting?.viewbox ? setting.viewbox : 'none'}</span></div>
                <div class="preset-val p-height"><span class="p-label height-label">height: </span> <span class="p-val height-val">${setting?.height ? setting.height : 'none'}</span></div>
                <div class="preset-val p-width"><span class="p-label width-label">width: </span><span class="p-val width-val">${setting?.width ? setting.width : 'none'}</span></div>
                `
                return element
            }
            const createRecentPresetElement = (setting) => {
                const element = document.createElement('div');
                const isIconDefault = currentIcon?.preset?.pid == setting.pid
                const isCollectionDefault = meta?.preset?.pid == setting.pid
                element.classList.add('preset-preview-element');
                const element_id = setting?.pid ? setting.pid : null
                if (!element_id) return
                element.setAttribute('pid', element_id)
                element.innerHTML = ` 
                <div class="preset-element-toast">
                    <div class="toast success defaultSet"> default setting applied </div>
                    <div class="toast failure settingError"> error setting preset </div>
                    <div class="toast clear defaultCleared"> default setting removed </div>
                    <div class="toast delete defaultCleared"> setting removed </div>
                    <div class="toast info previewIcon">icon preview applied</div>
                    <div class="toast success nameChange">name successfully changed</div>
                    <div class="toast failure nameChangeError">error saving name</div>
                </div>
                <div class="preset-element-option">
                    <div class="pre-opt opt-aid iconDefault">
                        <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
                        <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
                    </div>
                    <div class="pre-opt opt-cid collectionDefault">
                        <div class="icon" active="${isCollectionDefault ? true : false }">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
                        <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
                    </div>
                    <div class="pre-opt opt-pc previewCollection"> 
                        <div class="icon">
                            <svg width="24px" height="24px" viewBox="-4 -4 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lmp9jk-01TQPUCN0DL1">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="black" pid="m4lmp9jk-01SOYBUFQE8O" stroke="null"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.72857 13.9374 5.33078 14.5703 6.09267 15.155C7.61978 16.3271 9.71345 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C16.3802 7.67292 14.2865 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464ZM5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25C14.684 5.25 17.0903 6.32708 18.8206 7.65503C19.6874 8.32028 20.4032 9.06244 20.9089 9.79115C21.4006 10.4997 21.75 11.2773 21.75 12C21.75 12.7227 21.4006 13.5003 20.9089 14.2089C20.4032 14.9376 19.6874 15.6797 18.8206 16.345C17.0903 17.6729 14.684 18.75 12 18.75C9.31598 18.75 6.90965 17.6729 5.17941 16.345C4.31262 15.6797 3.59681 14.9376 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503Z" fill="black" pid="m4lmp9jk-00LSTYQMKI2E" stroke="null"></path>
                            </svg>
                        </div>
                        <div class="tool-tip">preview collection</div>
                    </div>
                </div>
                <div class="preset-val p-name"><span class="p-label name-label">name: </span> <span class="p-val name-val">${setting?.name ? setting.name : 'untitled' }</span></div>
                <div class="preset-val p-viewbox"><span class="p-label vb-label">viewbox: </span><span class="p-val vb-val">${setting?.viewbox ? setting.viewbox : 'none'}</span></div>
                <div class="preset-val p-height"><span class="p-label height-label">height: </span> <span class="p-val height-val">${setting?.height ? setting.height : 'none'}</span></div>
                <div class="preset-val p-width"><span class="p-label width-label">width: </span><span class="p-val width-val">${setting?.width ? setting.width : 'none'}</span></div>
                `
                return element
            }
            const hydrate = async (event,element,preset) => {
                event.stopPropagation()
                const applyToIconDefault = event.target.closest('.iconDefault')
                const addToCollection = event.target.closest('.pre-opt.addToCollection')
                const previewIcon = event.target.closest('.previewIcon')
                const toggleCollectionDefault = event.target.closest('.pre-opt.collectionDefault')
                const presetDelete = event.target.closest('.deletePreset')
                const collectionPresetDeleteFromIcon = event.target.closest('.removeFromCollection') 
                const collectionPresetDeleteFromCollection = event.target.closest('.cDeletePreset')
                const collectionPreview = event.target.closest('.previewCollection')
                const viewboxSelection = event.target.closest('.preset-val.p-viewbox')
                const editName = event.target.closest('.preset-val.p-name')
                const saveName = event.target.closest('.btn-save-name')
                const currentNameElement = $('.preset-val.p-name',element)

                const icon = currentIcon.id == this.preview.icon.id ? currentIcon : null
                let id = icon.id
                let collection = icon.collection
                let pid = preset.pid
                let frozenSettings = ['original','setting','preset']

                const notify = (toastElement) => {
                    if (currentAnimation && currentAnimation.playState === 'running')
                        currentAnimation.cancel()
                    currentAnimation = toastElement.animate([
                        {transform: 'translateY(-100%', offset: 0},
                        {transform: 'translateY(0)', offset:0.025},
                        {transform: 'translateY(0)', offset:0.990},
                        {transform: 'translateY(-100%', offset:1}
                    ],{duration: 1500, iterations: 1, easing: 'ease'})
                    return currentAnimation
                }
                const removePreset = (element) => {
                    const removeAnimation = element.animate([
                        {transform: `translateX(-200%)`},
                    ],{duration: 300,easing: 'ease','fill':'forwards'})
                    removeAnimation.onfinish = () => {
                        element.classList.add('deleted')
                        element.remove()
                    }
                }
                const addNewCollectionPreset = (setting) => {
                    let element = createCollectionPresetElement(setting)
                    if (element) element.addEventListener('click',event => hydrate(event,element,setting) )
                    collectionSettingsTab.appendChild(element)
                }
                const setPresetDefault = async () => {
                    const icon = currentIcon.id == this.preview.icon.id ? currentIcon : null
                    let presetActive = icon.preset?.pid === preset.pid
                    let isActiveIcon = $('.pre-opt.opt-aid',element)
                        
                    const notifyDefaultApplied = () => notify($('.toast.defaultSet',element))
                    const notifyDefaultCleared = () => notify($('.toast.defaultCleared',element))
                    const showLockedPreset = () => {
                        const iconPresetTab = $('.settings-tab[modal="icons"]')
                        const presetElements =  $$('.pre-opt.opt-aid',iconPresetTab)
                        presetElements.forEach(el => {
                                el.innerHTML = `<div class="icon">
                                ${presetIsDefaultIcon}</div>
                                <div class="tool-tip"> set as icon default </div>`
                                el.setAttribute('active',false)
                            })
                        isActiveIcon.setAttribute('active','true')
                        isActiveIcon.innerHTML = `<div class="icon">${presetNotDefaultIcon}</div>
                        <div class="tool-tip"> ignore as icon default </div>`

                    }
                    const showUnlockedPreset = () => {
                        isActiveIcon.setAttribute('active','false')
                        isActiveIcon.innerHTML = `<div class="icon">${presetIsDefaultIcon}</div><div class="tool-tip"> set as icon default </div>`
                    }
                    if (presetActive){
                        console.warn('preset already active')
                        console.log('removing default preset...')
                        let updated = await this.store.clearDefaultSetting(id,collection,icon)
                        let updateSuccess = updated.id === currentIcon.id
                        if (updateSuccess){
                            icon.preset = icon.settings.original
                            console.log('preset updated and reset to original...', icon.preset)
                            icon.preset = icon.settings.original
                            showUnlockedPreset()
                            notifyDefaultCleared()
                            // notify "original preset applied" -- grey
                        }
                    } else {
                        console.log('setting default preset...')
                        let updated = await this.store.setDefaultIconSetting(id,collection,pid)
                        let updateSuccess = updated.id === currentIcon.id
                        if (updateSuccess){
                            icon.preset = preset
                            console.log('preset updated')
                            showLockedPreset()
                            notifyDefaultApplied()
                        }
                    }
                }
                const toggleCollectionDefaultSetting = async () => {
                    const isCollectionDefault = this.collection.meta?.preset?.pid == preset.pid
                    console.log('TOGGLING COLLECTION DEFAULT',isCollectionDefault,this.collection.meta)
                    if (isCollectionDefault){
                        const updated = await this.store.clearCollectionDefault(collection)
                        const updateSuccess = updated.cid === meta.cid
                        if (updateSuccess){
                            this.collection.meta.preset = {}
                            console.log('default successfully cleared',updated)
                        } else {
                            console.warn('something went wrong applying collection default')
                        }
                    } else {
                        const updated = await this.store.setCollectionDefault(collection,preset)
                        const updateSuccess = updated.cid === meta.cid
                        if (updateSuccess){
                            this.collection.meta.preset = preset
                            console.log('default applied',updated)
                        } else {
                            console.warn('something went wrong applying collection default')
                        }

                        this.preview.setCollectionPreset(this.collection.meta.preset)

                    }
                    updateCollectionIsDefaultIcon()
                }
                const addCollectionPreset = async () => {
                    const updated = await this.store.saveCollectionPreset( collectionID , { preset: preset , usePreset: true });
                    console.log('COLLECTION PRESET SAVED',updated)
                    const updateSuccess = updated.cid === collectionID;
                    console.log('UPDATE STATUS',updateSuccess)
                    if (updateSuccess){
                        notify($('.toast.collectionDefault',element))
                        this.collection.meta.settings[pid] = preset
                        recentSettings = updated.recent_settings
                        addNewCollectionPreset(preset)
                        updateCollectionPresetExistIcon(element,true)
                        rerenderRecentSettings()
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.settings)

                    }
                }
                const deleteCollectionPreset = async () => {
                    const updated = await this.store.deleteCollectionPreset( collectionID , pid);
                    console.log('COLLECTION PRESET SAVED',updated)
                    const updateSuccess = updated.cid === collectionID && updated.settings[pid] == undefined;
                    console.log('UPDATE STATUS',updateSuccess)
                    if (updateSuccess){
                        const existingPresetIcon = $(`.preset-preview-element[pid=${pid}]`,collectionSettingsTab)
                        if (existingPresetIcon)
                            updateCollectionPresetExistIcon(element,false)
                        removePreset(element)
                        notify($('.toast.delete',element))
                        delete this.collection.meta.settings[pid]
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.settings)

                    } else {
                        console.warn('update failed')
                        notify($('.toast.failure'),element)
                    }
                }
                const removeCollectionPreset = async () => {
                    const updated = await this.store.deleteCollectionPreset( collectionID , pid);
                    console.log('COLLECTION PRESET SAVED',updated)
                    const updateSuccess = updated.cid === collectionID && updated.settings[pid] == undefined;
                    console.log('UPDATE STATUS',updateSuccess)
                    if (updateSuccess){
                        const existingPresetIcon = $(`.preset-preview-element[pid=${pid}]`,iconSettingsTab)
                        if (existingPresetIcon)
                            updateCollectionPresetExistIcon(existingPresetIcon,false)
                        removePreset(element)
                        delete this.collection.meta.settings[pid]
                        $('.preset-option[tab="collections"] .preset-count').textContent = getLength(this.collection.meta.settings)

                    } else {
                        console.warn('update failed')
                    }
                }
                const previewCollection = async () => {
                    this.preview.setCollectionPreset(preset)
                    this.preview.setPresetMode('collection')
                    this.preview.applySetting(preset)
                    notify($('.toast.previewCollection',element))
                }
                const deleteIconPreset = async () => {
                    const deleted = await this.store.deleteIconPreset(id,collection,pid)
                    console.log('DELETED',deleted)
                    if (deleted?.id === id ){
                        console.log('delete operation successful',deleted.settings.pid)
                        console.log(this.currentIcon.settings[pid])
                        console.log(deleted)
                        delete this.currentIcon.settings[pid]
                        removePreset(element)
                        $('.preset-option[tab="icons"] .preset-count').textContent = getLength(this.currentIcon.settings)
                        if (this.currentIcon.preset?.pid === pid){
                            this.currentIcon.preset = {}
                        }
                    }
                }
                const updateCollectionPresetExistIcon = (element,doesExist) => {
                    $('.pre-opt.opt-a2c',element).outerHTML = `                    
                    <div class="pre-opt opt-a2c ${ doesExist ? 'removeFromCollection' : 'addToCollection' } "> 
                        <div class="icon">${ doesExist ? removeFromCollectionIcon : addToCollectionIcon } </div>
                        <div class="tool-tip">${ doesExist ? 'remove collection preset' : 'save as collection preset' } </div>
                    </div>`
                }
                const updateCollectionIsDefaultIcon = () => {
                    const defaultPid = this.collection.meta?.preset?.pid
                    const pid = preset.pid
                    const isCollectionDefault = defaultPid == pid
                    const iPreviewElement = $(`.preset-preview-element[pid=${pid}] .pre-opt.collectionDefault`,iconSettingsTab)
                    const cPreviewElement = $(`.preset-preview-element[pid=${pid}] .pre-opt.collectionDefault`,collectionSettingsTab)
                    const updatedHTML = `<div class="pre-opt opt-acd collectionDefault">
                                            <div class="icon" active="${isCollectionDefault ? true : false }">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
                                            <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
                                        </div>`
                    console.log(pid,isCollectionDefault,cPreviewElement)
                    const activeButtons = $$('.pre-opt.collectionDefault .icon[active="true"]')
                    console.log(activeButtons)
                    activeButtons.forEach(btn => {btn.setAttribute('active',false);btn.innerHTML = saveAsCollectionDefaultIcon})
                    if (iPreviewElement) iPreviewElement.outerHTML = updatedHTML
                    if (cPreviewElement) cPreviewElement.outerHTML = updatedHTML
                }
                const rerenderRecentSettings = () => {
                    if (!objectIsFalsey(recentSettings)) {
                        createPresetWrapper(recentSettings,recentSettingsTab,'recent')
                        $('.preset-option[tab="recent"] .preset-count').textContent = getLength(recentSettings)

                    }
                }
                const handleNameChange = () => {
                    currentNameElement.classList.add('active')
                    currentNameElement.innerHTML = `<input type="text" class="edit-save-name" placeholder="${preset.name}"><span class="btn-save-name">save</span>`
                    $('input.edit-save-name',currentNameElement).focus()
                    $('input.edit-save-name',currentNameElement).addEventListener('keyup',(event) => {
                        // throttle
                        const enter = event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
                        if (enter) updateName()
                    })
                }
                const updateName = async () => {
                    const input = $('input.edit-save-name')
                    if (input) {
                        const value = input.value
                        console.log('UPDATING NAME', value)
                        const update = await this.store.updatePresetName({id,collection,pid,name:value});
                        /* NEEDS BETTER METHOD OF UPDATING */
                        console.log(update)
                        const updateSuccess = update.iconSetting.found && update.iconSetting.updated;
                        if (updateSuccess){
                            preset.name = value
                            hideInput()
                            const correspondingElement = $$(`.preset-preview-element[pid=${pid}] .preset-val.p-name`).forEach(presetName => presetName.innerHTML =`<span class="p-label name-label">name:</span><span class="p-val name-val"> ${value}</span>`)
                            notify($('.toast.nameChange',element))
                        } else {
                            notify($('.toast.nameChangeError',element))
                        }
                        const updatedCollection = update.collectionSetting.found && update.collectionSetting.updated
                        if (updatedCollection){
                            this.collection.settings[pid].name = value;
                        }
                        const updatedRecent = update.recentSetting.found
                        if (updatedRecent){
                            this.collection.meta.recent_settings = this.collection.meta.recent_settings.map(
                                setting => {
                                    if (setting.pid == pid) setting.name = value
                                    return setting
                                }
                            )
                        }

                    }
                }
                const hideInput = () => {
                    currentNameElement.classList.remove('active')
                    currentNameElement.innerHTML = `<span class="p-val name-val">${preset?.name}</span>`
                    console.log(preset.name)
                }
                const getLength = (settings) => {
                    const keys = Object.keys(settings).filter(key => !frozenSettings.some(i => i === key))
                    return keys.length
                }

                if (!preset) return
                if (!icon) return
                // handle input
                if (saveName) await updateName()
                else if (editName && !currentNameElement.classList.contains('active')) handleNameChange()
                else hideInput()
                
                if(collectionPreview) previewCollection()
                    
                else if(applyToIconDefault) setPresetDefault()
                else if(addToCollection) addCollectionPreset()
                else if (toggleCollectionDefault) toggleCollectionDefaultSetting()
                else if (presetDelete) deleteIconPreset()
                else if (collectionPresetDeleteFromIcon) deleteCollectionPreset()
                else if (collectionPresetDeleteFromCollection) removeCollectionPreset()
                else if(viewboxSelection) {
                    $('.preset-val.p-viewbox.active')?.classList.remove('active')
                    this.preview.applySetting(preset)
                    viewboxSelection.classList.add('active')
                }
                else return;
            }
            destination.innerHTML = ''
            let rendered = 0
            for (const pid in settings){
                // ignore default-setting]
                let frozenSettings = ['original','setting','preset']
                let preset = settings[pid]
                let shouldRender = !frozenSettings.some(i => i === pid) && !pid.startsWith('_meta')
                let validSetting = !objectIsFalsey(preset)
                if (validSetting && shouldRender) {
                    let element
                    if(type === 'icon')
                        element = createPresetElement(preset)
                    else if (type === 'collection') 
                        element = createCollectionPresetElement(preset);
                    else if (type === 'recent')
                        element = createRecentPresetElement(preset)
                    if (element) {
                        element.addEventListener('click', event => hydrate(event,element,preset) )
                        destination.appendChild(element)
                    }
                    rendered += 1
                }
            }
            if (rendered === 0) destination.innerHTML = 'no presets to show'
        }
        
        let frozenSettings = ['original','setting','preset']
        if (!objectIsFalsey(iconSettings)) createPresetWrapper(iconSettings,iconSettingsTab,'icon')
        if (!objectIsFalsey(this.currentView.settings)) createPresetWrapper(collectionSettings,collectionSettingsTab,'collection')
        if (!objectIsFalsey(recentSettings)) createPresetWrapper(recentSettings,recentSettingsTab,'recent')
        $('.settings-editor .preset-option[tab="icons"] .preset-count').textContent = objectLength(iconSettings,frozenSettings)
        $('.settings-editor .preset-option[tab="collections"] .preset-count').textContent = objectLength(collectionSettings,frozenSettings)
        $('.settings-editor .preset-option[tab="recent"] .preset-count').textContent = objectLength(recentSettings,frozenSettings)
    }
    async toggleCollectionSettingsMenu(){
        console.log('SETTINGS ACTIVE')
        if (this.state.cSettingsActive){
            this.closeCollectionSettingsMenu()
            return
        }
        await this.openCollectionSettingsMenu()
    }
    closeCollectionSettingsMenu(){
        this.collectionSettingsWindow.classList.remove('active')
        this.state.cSettingsActive = false;
    }
    async openCollectionSettingsMenu(){
        this.collectionSettingsWindow.classList.add('active')
        this.state.cSettingsActive = true
    }


    closeCollectionMenu(event){
        $('.interface-window.collection-menu').classList.remove('active');
        $('.widget-pre').insertBefore($('.preview-widget'),$('.current-collection-widget'));
        $('.widget-main').classList.remove('active');
        $('.widget-pre').classList.add('active');
    }
    openCollectionMenu(event){
        // close preview
        this.hidePreview();
        $('.widget-pre').classList.remove('active');
        $('.widget-main').classList.add('active');
        $('.widget-main').append($('.preview-widget'));
        $('.interface-window.collection-menu').classList.add('active');
        $('.interface-window.preview').classList.remove('active');

    }

    openPreviewFromWidget(event){
        let tab = 
            event?.target.closest('.tggle.color-icon') ? 'color' :
            event?.target.closest('.tggle-open') ? 'position' :
            ''
        // CHECK IF ITS OPENED FROM MENU THEN PUT IT BACK
        if ($('.collection-menu').classList.contains('active'))
            $('.widget-pre').insertBefore($('.preview-widget'),$('.current-collection-widget'));
        this.preview.open(tab)
        hideMiniWidgets()
        $('.interface-window.collection-menu').classList.remove('active');
    }
    openPreview(event,tab) {
        if (event?.target.closest('.copy-icon'))
            return this.copyFromWidget()
        else if(event?.target.closest('.widget-preview-icon'))
            return this.toggleBorderFromWidget()
        else if (event?.target.closest('.tggle.color-icon') || tab === 'color')
            this.preview.open('color')
        else if (event?.target.closest('.tggle-open') || tab === 'position')
            this.preview.open('position')
        else this.preview.open()
        $('.widget-pre').classList.remove('active')
        $('.widget-main').classList.add('active');
        $('.interface-window.collection-menu').classList.remove('active')
    }
    closePreview() {
        if (this.preview.currentModal)
            this.preview.currentModal.classList.remove('active')
        $('.widget-main').classList.remove('active')
        $('.widget-pre').classList.add('active')
        this.preview.close()
    }
    hidePreview(){
        if (this.preview.currentModal)
            this.preview.currentModal.classList.remove('active')
        this.preview.close()
    }
    showPreview(event){
        if (event.target.closest('.copy-icon'))
            return this.copyFromWidget()
        else if(event.target.closest('.widget-preview-icon'))
            return this.toggleBorderFromWidget()
        else if (event.target.closest('.tggle.color-icon'))
            this.preview.open('color')
        else if (event.target.closest('.tggle-open'))
            this.preview.open('position')
        else 
            this.preview.open('position')
    }
    async togglePreviewNext() {
        await this.ready
        this.preview.update(this.cursor.skipToNext())
    }
    async togglePreviewPrevious(){
        await this.ready
        this.preview.update(this.cursor.skipToPrev())
    }

    renderPocket() {
        this.setLoading()
        const collection = this.store.pocket
        this.state.context = collection
        collection.render()
        this.preview.update(this.currentIcon)
        this.setTab(collection)
    }


    async renderDashboardHome(){
        const homePanel = $('#DASHBOARD .db-res');

        homePanel.innerHTML = '... fetching data';
        const collectionInfo = await this.store.getMeta();
        const {locals,index,projects} = collectionInfo;
        const flattened = [
            ...filterObjects(locals,'cid'),
            ...filterObjects(projects,'cid'),
            ...filterObjects(index,'cid')
        ]
        const data = await this.store.getCollectionSample(flattened[0])
        const firstCollection = new Collection(data)
        homePanel.innerHTML = ''
        const widgets = flattened
            .map(async name => {
                const widgetSkeleton = CollectionWidget.getSkeleton()
                homePanel.appendChild(widgetSkeleton)
                const data = (await this.store.getCollectionSample(name,1,39))
                const widget = new CollectionWidget(data);
                const element = await widget.getElement();
                widgetSkeleton.replaceWith(element)
                return widget;
            })
        
        this.closeCollectionSettingsMenu()
        firstCollection.renderInfo()
        this.state.context = firstCollection
        this.state.collection = firstCollection
        this.state.selected = this.currentIcon
        this.preview.update(this.currentIcon)

        this.setTab({name:'home',cid:'home'})
        $('.dashboard__header .panel-settings').classList.remove('active')
        // $('.collection-menu').innerHTML = `
        // <div class="menu-controls">
        //     <div class="close-menu">close</div>
        // </div>
        // <div class="quick-links">
        //     ${(collection_names).reduce((a,b)=> {
        //         return a + `<div class="hot-link" collection=${b}>${b}</div>`
        //     },'')}               
        // </div>`
        // hide settings breadcrumb
        $('.breadcrumb').classList.remove('active')
        history.pushState(null,null,window.location)

    }
    async renderCollection(cid) {
        await this.ready
        if (this.active) {
            try {
                if ( cid === 'home' || cid === 'all'){
                    await this.renderDashboardHome()
                    return
                } else {
                    const collection = await this.store.getCollection(cid)
                    console.log(collection)
                    this.state.collection = collection
                    this.preview.setCollectionPreset(collection.preset)
                    this.colorPicker.setCollectionColor(collection.color)
                    this.collectionPreview.update(collection)
                    this.state.context = collection
                    this.collection.render()
                    this.preview.update(this.currentIcon)
                    this.state.selected = this.currentIcon
                    this.setTab(collection)
                    $('.dashboard__header .panel-settings').classList.add('active')
                }
                this.setReady()
                this.preview.setReady()
                this.loadPresetMenu()
                history.pushState(null,null,window.location)
            } catch(e){
                console.log('error rendering collection',e)
        } 
        } else {
        console.log('try rendering from app');
    }
    }

    setTab({name,cid}){
        $('.dashboard__modal').setAttribute('tab',cid)
        this.state.tabName = cid
        if(cid !== 'search'){
            $('.btn-cancel').classList.remove('active')
            $('.passive-search input').value = ''
        }
        $('.info-bar .current-tab').textContent = name
        if (cid !== 'search'){
            console.log('going home')
            // history.pushState(null,null,window.location)
        }

    }
    updateCollectionInfo(collection){
            const getAgo = msDate => ago(msDate).string;
            const {meta} = collection
            let { collection_type, subtypes, sub_collections, size,name, uploaded_at = undefined, created_at = null, updated_on = null} = meta;
            let lastUpdate = 
                updated_on ? getAgo(updated_on)
                : created_at ? getAgo(created_at)
                : uploaded_at ? getAgo(uploaded_at)
                : 'never'
            $('.current-collection-widget .content-title').textContent = name;
            $('.current-collection-widget .widget-content').innerHTML = `
                <div class="content-title">${name} <span class="footnote">Last Updated ${lastUpdate}</span></div>
                <div class="widget-data">
                    <div class="data-field collection-size">Saved Icons: <span class="data-set"> ${size}</span></div>
                    <div class="data-field sub-cols"><span class="data-set">Sub-collections: ${sub_collections.length}</span></div>
                    <div class="data-field sub-types"><span class="data-set">Sub-types: ${subtypes.length}</span> </span></div>
                    <div class="data-field col-type"><span></span><span class="data-set">Collection Type: ${collection_type}</span></div>
                </div>
                <div class="btn-open">show more</div>
        `
    }
    async handleDashboardClick(event) {
        await this.ready;
        let wrapper = event.target.closest('.svg-wrapper');
        let homeLink = event.target.closest('.collection-summary');
        let browseLink = event.target.closest('.info-text');
        let settingsLink = event.target.closest('.settings-label');
        let settingsWidgetLink = event.target.closest('.dropdown-option[opt="open-settings"]')
        // handle cosms
        const cosmPreviewSettings = this.preview.settingsActive == true && (!event.target.closest('#PREVIEW'));
        const cosmColorSettings = (this.colorPicker.fsActive == true || this.colorPicker.active == true) && (!event.target.closest('#PREVIEW'));
        if (cosmPreviewSettings)
            this.preview.closeSettings();
        if (cosmColorSettings){
            this.colorPicker.close();
            console.log('COSM COLOR PICKER')
        }
        if (browseLink){
            await this.renderDashboardHome()
            $('.widget-wrapper.active').classList.remove('active')
            $('.widget-main').classList.remove('active')
            $('.widget-pre').classList.add('active')
            return
        }
        if (settingsLink){
            console.log('LINKR',settingsLink)
            await this.toggleCollectionSettingsMenu()
            return
        } 
        if (homeLink){
            let name = homeLink.getAttribute('collection');
            let cid = homeLink.getAttribute('cid');
            if (!name) return console.warn('no collection name', homeLink);
            let panelLink = event.target.closest('.collection-summary .panel-name');
            if (panelLink){
                let cid = panelLink.getAttribute('cid');
                await this.renderCollection(cid);
                // hide settings breadcrumb
                $('.breadcrumb').classList.remove('active')
                return;
            } else if (settingsWidgetLink){
                    await this.renderCollection(cid);
                    this.openCollectionSettingsMenu();
                    return;
            }
            return;
        }
        if (!wrapper) return
        onWrapper.call(this)
        function onWrapper(){
            let id = wrapper.dataset.id;
            if (!id) return console.error('this element doesnt have an id')
            const ctrlClick = event.ctrlKey,
                    rightClick = event.buttons === 2,
                    leftClick = event.buttons === 1;
            if (leftClick && ctrlClick && this.state.tabName !== 'pocket') this.store.pocket.toggle(this.state.context.find(id))
            else if (leftClick) {
                console.log(this.currentView)
                let icon = this.currentView.find(id)
                this.preview.update(icon)
                this.state.selected = icon
                this.cursor.skipToElement(icon)
                this.loadPresetMenu()
                return
            }
        }
    }
    async handleCollectionFilters(event){
        const hotlink = event.target.closest('.hot-link');
        const closer = event.target.closest('.close-menu');
        const submenu = event.target.closest('.list-label');
        const filterLink = event.target.closest('.list-item');
        if (filterLink){
            let filter = filterLink.getAttribute('filter');
            let filter_type = filterLink.getAttribute('ftype');
            let filters = this.collection.filters;
            if (filter_type === 'st'){
                let subtype_filters = filters.subtypes;
                if (subtype_filters.includes(filter)){
                    this.collection.filters.subtypes = subtype_filters.filter(f => f != filter)
                    filterLink.classList.remove('active')
                } else {
                    this.collection.filters.subtypes.push(filter)
                    filterLink.classList.add('active')
                }
            } else if (filter_type === 'sc'){
                let subcollection_filters = filters.sub_collections;
                if (subcollection_filters.includes(filter)){
                    this.collection.filters.sub_collections = subcollection_filters.filter(f => f != filter)
                    filterLink.classList.remove('active')
                } else {
                    this.collection.filters.sub_collections.push(filter)
                    filterLink.classList.add('active')
                }
            }
            console.log('filters pushed',filters)
            this.collection.renderIcons();
            return
        }
        if (submenu){
            let tab = submenu.getAttribute('tab')
            if (tab === 'subtypes'){
                $('.st-filters .sc-list').classList.toggle('active')
                submenu.parentElement.classList.toggle('active')
            } else if (tab === 'subcollections'){
                $('.sc-filters .sc-list').classList.toggle('active')
                submenu.parentElement.classList.toggle('active')
            }
            return;
        }
        if (closer) this.closeCollectionMenu();
        if(hotlink) this.renderCollection(hotlink.getAttribute('cid'))
    }
    async delegateAddToCollectionWindowEvents(event) {
        let clicked = event.target.closest('.preview-a2c-item');
        let close = event.target.closest('.close-cc-form');
        let create = event.target.closest('.btn-create-collection');
        let upload = event.target.closest('.btn-upload');
        if (clicked){
            let icon = this.selected;
            let collection = event.target.getAttribute('collection');
            await this.addToCollection(collection,icon);
        } else if (close){
            console.log('closing')
            await this.loadCollectionNames();
            this.state.ccActive = false;
        } else if (create){
            await this.loadCreateCollectionForm();
            this.state.ccActive = true;
        } else if (upload){
            await this.addToNewCollection();
        }
    }
    async delegateHomePanelEvents(event,element){
        console.log('EVENT', event)
        let homeLink = element;
        let target = event.target;

    }
    async delegateMainMenuEvents(event){
        const link = event.target.closest('.menu-list-item[role="tab"]') || event.target.closest('.quick-list-item');
        // const quickLink = event.target.closest('.quick-link')
        const settings = event.target.closest('.menu-list-item[role="tab"] .btn-menu');
        const menu_actions = event.target.closest('.btn-menu');
        const dropRequest = event.target.closest('.item-menu-window .option-delete');
        if (menu_actions){
            console.log('ACTION',menu_actions)
            let current = $('.item-menu-window',menu_actions.parentElement);
            let active = current.classList.contains('active');
            $$('.item-menu-window').forEach(tooltip => tooltip.classList.remove('active'));
            if (active) current.classList.remove('active');
            else current.classList.add('active')
            return;
        }
        if (dropRequest){
            const id = $('.item-menu-window.active').getAttribute('cid');
            const confirmed = $('.option-delete',event.target.closest('.item-menu-window.active'))
            
            let response;
            if (id && confirmed){
                response = await this.store.dropCollection(id);
                console.log('DROPPED',response)
            }
            return response;
        }
        if (settings){
            return;
        }
        if (!link) return;
        this.setLoading();
        const cid = link.getAttribute('cid');
        this.menu.close();
        await this.renderCollection(cid);
    }
    async addToCollection(collection,icon) {
        let result
        if (collection && icon) result = await this.store.addToCollection({ destination: collection, icons:[icon] })
        this.notify('icon added',{ icon,collection, result })
    }
    async addToNewCollection(){
        const name = $('.create-cc-form input').value;
        let result;
        console.log('adding to new collection',name);
        console.log('using state',this.state)
        try {
            if (!name) throw new Error('invalid input name value');
            if (!this.state.selected) throw new Error('invalid icon selection')

            this.store.ready = false;
            result = await this.store.saveCollection(name, [this.state.selected] )
        } catch(e){ console.log(e) }
        if (result.name === name) {
            console.log('collection created',result.data)
            console.log('updating menus....',result.data)
            this.menu.render();
        }
    }
    openAddToCollectionMenu() {
        this.preview.toggleWindow('collections');
        this.loadCollectionNames();
    }
    async loadCreateCollectionForm(){
        let addToCollectionWindow = $('[data-role="window"][data-tab="collections"]')

            addToCollectionWindow.innerHTML = `
            <div class="close-cc-form">
                <div class="label">close</div>
                <div class="icon">
                
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m12eufgc-00DSPWXAEPZU">
                    <path d="M8.46967 8.46966C8.76256 8.17677 9.23744 8.17677 9.53033 8.46966L12 10.9393L14.4697 8.46967C14.7626 8.17678 15.2374 8.17678 15.5303 8.46967C15.8232 8.76256 15.8232 9.23744 15.5303 9.53033L13.0607 12L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7626 15.8232 14.4697 15.5303L12 13.0607L9.53034 15.5303C9.23744 15.8232 8.76257 15.8232 8.46968 15.5303C8.17678 15.2374 8.17678 14.7626 8.46968 14.4697L10.9393 12L8.46967 9.53032C8.17678 9.23743 8.17678 8.76255 8.46967 8.46966Z" fill="black" pid="m12eufgc-0041X7MD1MJO"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.31673 3.76876C10.4043 3.42368 13.5957 3.42368 16.6832 3.76876C18.5096 3.97288 19.9845 5.41153 20.1994 7.24849C20.5686 10.4054 20.5686 13.5946 20.1994 16.7515C19.9845 18.5885 18.5096 20.0271 16.6832 20.2313C13.5957 20.5763 10.4043 20.5763 7.31673 20.2313C5.49035 20.0271 4.01545 18.5885 3.8006 16.7515C3.43137 13.5946 3.43137 10.4054 3.8006 7.24849C4.01545 5.41153 5.49035 3.97288 7.31673 3.76876ZM16.5166 5.25948C13.5398 4.92677 10.4602 4.92677 7.48334 5.25948C6.33891 5.38738 5.42286 6.29063 5.29045 7.42274C4.93476 10.4639 4.93476 13.5361 5.29045 16.5773C5.42286 17.7094 6.33891 18.6126 7.48334 18.7405C10.4602 19.0732 13.5398 19.0732 16.5166 18.7405C17.6611 18.6126 18.5771 17.7094 18.7095 16.5773C19.0652 13.5361 19.0652 10.4639 18.7095 7.42274C18.5771 6.29063 17.6611 5.38738 16.5166 5.25948Z" fill="black" pid="m12eufgc-00VU7YPHZK6Q"></path>
                </svg>
            </div>

                <div class="create-cc-form">
                    <div class="name">
                        <div class="label">Collection Name</div>
                        <div class="inp"><input type="text"></div>
                        <div class="btn-upload">
                            <div class="label">upload</div>
                            <div class="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" pid="m12e3899-02FRSRJ3ROKW">
                                    <path clip-rule="evenodd" d="M10.7379 16.6273C9.96427 16.6273 9.31895 16.036 9.2514 15.2654C9.11015 13.6541 9.07441 12.0356 9.14427 10.4203C9.05994 10.4147 8.97563 10.4088 8.89133 10.4026L7.40178 10.2941C6.44973 10.2247 5.91752 9.16309 6.43151 8.35871C7.5277 6.6432 9.53693 4.72314 11.1904 3.53541C11.6742 3.18786 12.3258 3.18786 12.8097 3.53541C14.4631 4.72314 16.4723 6.64319 17.5685 8.35871C18.0825 9.16309 17.5503 10.2247 16.5983 10.2941L15.1087 10.4026C15.0244 10.4088 14.9401 10.4147 14.8558 10.4203C14.9256 12.0356 14.8899 13.6541 14.7486 15.2654C14.6811 16.036 14.0358 16.6273 13.2622 16.6273H10.7379ZM10.6815 9.76253C10.5678 11.5498 10.589 13.3431 10.745 15.1273H13.255C13.411 13.3431 13.4323 11.5498 13.3186 9.76253C13.3058 9.56216 13.3739 9.36505 13.5077 9.21531C13.6414 9.06556 13.8296 8.9757 14.0301 8.96582C14.3535 8.94989 14.6767 8.93015 14.9997 8.90661L16.0815 8.82775C15.1219 7.41445 13.9204 6.1802 12.5313 5.18235L12 4.80071L11.4687 5.18235C10.0796 6.1802 8.87813 7.41446 7.91858 8.82775L9.00038 8.90661C9.32337 8.93015 9.64656 8.94989 9.9699 8.96582C10.1704 8.9757 10.3586 9.06556 10.4924 9.21531C10.6261 9.36505 10.6942 9.56216 10.6815 9.76253Z" fill="black" pid="m12e3899-01PVDQBJXY27"></path>
                                    <path d="M5.75 17C5.75 16.5858 5.41421 16.25 5 16.25C4.58579 16.25 4.25 16.5858 4.25 17V19C4.25 19.9665 5.0335 20.75 6 20.75H18C18.9665 20.75 19.75 19.9665 19.75 19V17C19.75 16.5858 19.4142 16.25 19 16.25C18.5858 16.25 18.25 16.5858 18.25 17V19C18.25 19.1381 18.1381 19.25 18 19.25H6C5.86193 19.25 5.75 19.1381 5.75 19V17Z" fill="black" pid="m12e3899-01D02LAD7QUX"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }
    async loadCollectionNames() {
        let addToCollectionWindow = $('[data-role="window"][data-tab="collections"]')
        addToCollectionWindow.innerHTML = `
            <div class="btn-create-collection">create collection</div>
            <div class="synced-collection-names">
                ...loading collections
            </div>
        `
        const names = await this.store.getCollectionNames('projects');
        console.log('NAMES',names)
        if (names.length > 0)
            $('.synced-collection-names').innerHTML = `${names.reduce((acc,red)=> acc + `<div class="preview-a2c-item" collection=${red}>${red}</div>`, '' )}`
    }

    getHTML() {
    return `
            <!--          MENU AND THINGS        -->
            ${COSM()}
            ${MainMenu()}
            <!--            DASHBOARD                 -->
            <div class="dashboard" id="DASHBOARD">
                ${ContextMenuElement()}
                ${DashboardHeader()}
                ${DashboardModal()}
            </div>
            <!--                INTERACTIVE INTERFACE           -->
            <div class="interface" id="INTERFACE">
                ${InterfaceNotificationBar()}
                <div class="widget-pre widget-wrapper active">
                        ${PreviewWidget()}
                        ${CurrentCollectionWidget()}
                        ${PocketWidget()}
                        ${PinnedCollectionWidget()}
                </div>
                <div class="widget-main widget-wrapper ">
                    ${PreviewInterface()}
                    ${CollectionInterface()}
                </div>
                <div class="widget-settings widget-wrapper settings-interface">
                    <div class="interface-window">
                    ${SettingsInterface()}
                    </div>
                </div>


                <div class="widget-pocket widget-wrapper pocket-interface">
                    Pocet Interface
                </div>
            </div>
            `
  }
}

function hideMiniWidgets(){
    $('.widget-pre').classList.remove('active');
    $('.widget-main').classList.add('active');
}

function showMiniWidgets(){
    $('.widget-pre').classList.remove('active');
    $('.widget-main').classList.add('active');
}
