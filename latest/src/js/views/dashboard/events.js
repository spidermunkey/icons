module.exports.eventHandlers = {

  async handleDashboardClick(event) {
    await this.ready;
    let wrapper = event.target.closest('.svg-wrapper');
    let homeLink = event.target.closest('.collection-summary');
    let browseLink = event.target.closest('.info-text');
    // handle cosms
    const cosmPreviewSettings = this.preview.settingsActive == true && (!event.target.closest('#PREVIEW'));
    const cosmColorSettings = (this.preview.colorPicker.fsActive == true || this.preview.colorPicker.active == true) && (!event.target.closest('#PREVIEW'));
    if (cosmPreviewSettings)
        this.preview.closeSettings();
    if (cosmColorSettings)
        this.preview.colorPicker.close();
    if (browseLink){
        await this.renderCollection('all');
        $('.widget-wrapper.active').classList.remove('active');
        $('.widget-main').classList.remove('active');
        $('.widget-pre').classList.add('active');
        return;
    }
    if (homeLink){
        await this.delegateHomePanelEvents(event,homeLink);
        return;
    }
    if (!wrapper) return console.log('no click on wrapper');
    let id = wrapper.dataset.id;
    console.log('herefoo',id)
    if (!id) return console.error('this element doesnt have an id');
    const ctrlClick = event.ctrlKey,
            rightClick = event.buttons === 2,
            leftClick = event.buttons === 1;
    if (leftClick && ctrlClick && this.state.tabName !== 'pocket'){
        this.store.pocket.add(this.state.context.getIcon(id))
    }
    else if (leftClick) {
        let icon = this.state.context.getIcon(id);
        if (!icon && this.state.tabName == 'search'){
            icon = await this.state.searchContext.getIcon(id);
            if (!icon) {
                console.warn('error finding icon',icon)
                return;
            }
        }
        this.preview.update(icon);
        this.state.selected = icon;
        this.state.context.cursor.skipToElement(icon);
        return;
    }
  },
  async handleInterfaceClick(event){
    console.log('menu click')
    let settingsMenu = event.target.closest('.widget-settings.settings-interface.active')
    console.log(settingsMenu)
    if (settingsMenu){
        console.log('SETTINGS EVENT');
        this.delegateSettingsMenuEvent(event,settingsMenu)
        return;
    }
  },
  async delegateCollectionMenuEvents(event){
      const hotlink = event.target.closest('.hot-link');
      const closer = event.target.closest('.close-menu');
      const submenu = event.target.closest('.list-label');
      const filterLink = event.target.closest('.list-item');
      if (filterLink){
          let filter = filterLink.getAttribute('filter');
          let filter_type = filterLink.getAttribute('ftype');
          let filters = this.currentCollection.filters;
          let active = false;
          if (filter_type === 'st'){
              let subtype_filters = filters.subtypes;
              if (subtype_filters.includes(filter)){
                  this.currentCollection.filters.subtypes = subtype_filters.filter(f => f != filter)
                  filterLink.classList.remove('active')
              } else {
                  this.currentCollection.filters.subtypes.push(filter)
                  filterLink.classList.add('active')
              }
          } else if (filter_type === 'sc'){
              let subcollection_filters = filters.sub_collections;
              if (subcollection_filters.includes(filter)){
                  this.currentCollection.filters.sub_collections = subcollection_filters.filter(f => f != filter)
                  filterLink.classList.remove('active')
              } else {
                  this.currentCollection.filters.sub_collections.push(filter)
                  filterLink.classList.add('active')
              }
          }

          console.log(this.currentCollection,this.currentCollection.name)
          console.log('filters pushed',filters)
          this.dashboard.setLoading();
          const collection = this.currentCollection = await this.store.getCollection(this.currentCollection.meta.name, this.currentCollection.filters, true)
          // console.log(this.currentCollection.filters)
          if (collection){
              this.setTab(collection.meta.name)
              this.dashboard.render(collection)
          }
          else this.renderCollection('all')
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
      if(hotlink){
          this.renderCollection(hotlink.getAttribute('collection'))
      }
  },
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
        const collectionName = $('.item-menu-window.active').getAttribute('modal');
        const confirmed = $('.option-delete',event.target.closest('.item-menu-window.active'))
        let response;
        if (collectionName && confirmed)
            response = await this.store.dropPreset(collectionName);
        console.log('DROPPED',response)
        return response;
    }
    if (settings){
        return;
    }
    if (!link) return;
    this.dashboard.setLoading();
    const modalName = link.getAttribute('modal');
    this.menu.close();
    await this.renderCollection(modalName);
  },
  async delegateSettingsMenuEvent(event,element){
    if ($('.dashboard__modal').getAttribute('tab') == 'settings'){
        console.log('settings now are responsive');
        const vbx = event.target.closest('.vb-setting input')
    } else {
        console.log('settings will be applied via selection')
    }
    // save preset => store.saveCollectionPreset()
    // save as default => store.setDefaultPreset()
    // apply preset => dashboard.applySetting(presetname)
    // preview preset => dashboard.previewSetting(presetname)
    // selectAll() => dashboard.select(collection.icons)
    // selectNone() => dashboard.selected = [];
  },
  async delegateHomePanelEvents(event,element){
    console.log('EVENT', event)
    let homeLink = element;
    let target = event.target;
    let closest = target.closest.bind(target);
    let name = homeLink.getAttribute('collection');
    if (!name) return console.warn('no collection name', homeLink);
    let panelLink = closest('.collection-summary .panel-name');
    let browseLink = closest('.info-text');
    let settingsLink = closest('.settings-label');

    if (panelLink){
        let name = panelLink.getAttribute('collection');
        await this.renderCollection(name);
        return;
    }
    if (settingsLink){
        if ($('.settings-interface').classList.contains('active')){
            this.hideCollectionSettings();
            return;
        }
        this.showCollectionSettings(await this.store.getCollection(name));
        $('.dashboard__modal').setAttribute('tab','settings')
        $('.info-bar .current-tab').textContent = name
        // const currentTabBreadCrumbElement = document.createElement('div');
        // currentTabBreadCrumbElement.classList.add('breadcrumb')
        currentTabBreadCrumbElement.textContent = 'Settings'
        $('.info-bar').appendChild(currentTabBreadCrumbElement)
        return;
    }
  },
  async delegateCollectionMenuEvents(event){
      const hotlink = event.target.closest('.hot-link');
      const closer = event.target.closest('.close-menu');
      const submenu = event.target.closest('.list-label');
      const filterLink = event.target.closest('.list-item');
      if (filterLink){
          let filter = filterLink.getAttribute('filter');
          let filter_type = filterLink.getAttribute('ftype');
          let filters = this.currentCollection.filters;
          let active = false;
          if (filter_type === 'st'){
              let subtype_filters = filters.subtypes;
              if (subtype_filters.includes(filter)){
                  this.currentCollection.filters.subtypes = subtype_filters.filter(f => f != filter)
                  filterLink.classList.remove('active')
              } else {
                  this.currentCollection.filters.subtypes.push(filter)
                  filterLink.classList.add('active')
              }
          } else if (filter_type === 'sc'){
              let subcollection_filters = filters.sub_collections;
              if (subcollection_filters.includes(filter)){
                  this.currentCollection.filters.sub_collections = subcollection_filters.filter(f => f != filter)
                  filterLink.classList.remove('active')
              } else {
                  this.currentCollection.filters.sub_collections.push(filter)
                  filterLink.classList.add('active')
              }
          }

          console.log(this.currentCollection,this.currentCollection.name)
          console.log('filters pushed',filters)
          this.dashboard.setLoading();
          const collection = this.currentCollection = await this.store.getCollection(this.currentCollection.meta.name, this.currentCollection.filters, true)
          // console.log(this.currentCollection.filters)
          if (collection){
              this.setTab(collection.meta.name)
              this.dashboard.render(collection)
          }
          else this.renderCollection('all')
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
      if(hotlink){
          this.renderCollection(hotlink.getAttribute('collection'))
      }
  },
  toggleContext(event) {
    const clickedIcon = elementClicked('.dashboard .svg-wrapper',event);
    let icon;
    if (clickedIcon) icon = this.state.context.getIcon(clickedIcon.dataset.id)
    this.state.inspected = icon;
    this.context.handleRightClick(event,icon)
  },
  handleClickOutsideContext(event) {
    if (!event.target.closest('.db-context')) { 
        event.preventDefault(); 
        this.context.close();
    }
  },


  search(){
    const handleSearch = async (event) => {
        const searchQuery = this.state.query = event.target.value;
        if (searchQuery === '') {
            $('.btn-cancel').classList.remove('active');
            return this.renderCollection(this.currentCollection?.meta?.name || 'all');
        }
        $('.btn-cancel').classList.add('active');
        const result = await this.store.search(searchQuery !== undefined ? searchQuery : this.query)
        const { query , data } = result
        const queryIsCurrent = this.state.query === query || this.state.query === searchQuery;

        console.log('SEARCH RESULTS', data,queryIsCurrent)
        if (queryIsCurrent) this.renderSearch({ icons: data , query, meta: { name: 'search' }})
    }
    const inputThrottler = () => {
        let timeoutId;
        // debounced
        return (e) => {
            this.state.query = e.target.value;
            clearTimeout(timeoutId);
            timeoutId = setTimeout( handleSearch.bind(this,e), 400 )
        }
    }
    return inputThrottler();
  },
  cancelSearch(){
    $('.passive-search input').value = '';
    const name = this.currentCollection?.meta.name;
    this.renderCollection(name ? name : 'all');
    $('.btn-cancel').classList.remove('active')
  },


  openPreviewFromContext(tab){
    hideMiniWidgets();
    this.preview.update(this.context.icon)
    this.preview.open(tab);
    this.context.close();
  },
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
  },
  closePreview() {
    if (this.preview.currentModal)
        this.preview.currentModal.classList.remove('active');
    $('.widget-main').classList.remove('active');
    $('.widget-pre').classList.add('active');
    this.preview.close();
  },
  hidePreview(){
      if (this.preview.currentModal)
          this.preview.currentModal.classList.remove('active');
      this.preview.close();
  },
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
    },
    async togglePreviewNext() {
      await this.ready;
      this.preview.update(this.state.context.cursor.skipToNext())
    },
    async togglePreviewPrevious(){
        await this.ready;
        this.preview.update(this.state.context.cursor.skipToPrev())
    },


    async showCollectionSettings(collection){
      let active_interface = this.currentInterface = $('.widget-wrapper.active');
      active_interface.classList.add('settings-open');
      active_interface.classList.remove('active');
      $('.settings-interface').classList.add('active');
      $('.settings-interface .interface-window').classList.add('active');
      await this.settings.render(collection);
      // apply settings from settings interface
      $('.s-ctrl.btn-apply').addEventListener('click',() => {
          console.log('applying collection settings to preview')
          this.preview.setCurrentPreset(this.settings.currentPreset)
      });
      // save preset from settings interface
      $('.s-ctrl.btn-save').addEventListener('click',async () => {
          console.log('saving current preset')
          const preset = this.settings.currentPreset;
          preset.preset_type = 'collection';
          preset.for = collection.name;
          const result = await this.store.savePreset(this.settings.currentPreset);
          console.log('PRESET SENT TO API', result);
      });
    },
    hideCollectionSettings(){
        $('.settings-interface').classList.remove('active');
        this.currentInterface.classList.add('active')
        this.currentInterface.classList.remove('settings-open')
    },
}

