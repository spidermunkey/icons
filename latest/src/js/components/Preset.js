import { icons } from "./html/PresetIcons"
class PresetModule {
  constructor(dashboard){
    this.dashboard = dashboard
    this.tab = 'icons'
    this.iconSettingsTab = $('.settings-modal [role="tab"][modal="icons"]')
    this.iconSettingsTabber = $('.preset-option.icon')
    this.collectionSettingsTab = $('.settings-modal [role="tab"][modal="collections"]')
    this.collectionSettingsTabber = $('.preset-option.collection')
    this.recentSettingsTab = $('.settings-modal [role="tab"][modal="recent"]')
    this.recentSettingsTabber = $('.preset-option.recent')
    this.handleTab(this.tab)
  }
  get icon() {
    return this.dashboard.currentIcon
  }
  get collection() {
    return this.dashboard.collection
  }
  get meta(){
    return this.collection.meta
  }
  get cid() {
    return this.meta.cid
  }
  get id() {
    return this.icon.id
  }
  get recentSettings(){
    let recentSettings
    if (this.collection?.recentSettings && Array.isArray(this.collection.recentSettings))
      collection.recentSettings.forEach(setting => recentSettings[setting.pid] = setting)

    return recentSettings
  }
  get iconSettings(){
    return this.icon.settings
  }
  get collectionSettings(){
    return this.collection.settings
  }
  get frozenSettings() {
    return ['original','setting','preset']
  }
  get currentTab() {
    return $(`.settings-modal [role="tab"][modal="${this.tab}"]`)
  }
  getLength(settings){
    const keys = Object.keys(settings).filter(key => !this.frozenSettings.some(i => i === key))
    return keys.length
  }
  handleTab(tabName){
    $$('.pdo-options-container .preset-option').forEach(tab => tab.classList.remove('active'))
    $$('.settings-modal .settings-tab').forEach(tab => tab.classList.remove('active'))
    $(`.preset-option[tab=${tab}`).classList.add('active')
    $(`.settings-modal [role="tab"][modal="${tab}"]`)
    this.tab = tabName
  }
  hydrate() {
    [['icons', this.iconSettingsTabber],['collections', this.collectionSettingsTabber],['recent', this.recentSettingsTabber]]
      .forEach(tab => tab[1].addEventListener('click',() => this.handleTab(tab[0])))
  }

  createPresetElement(setting, presetType = 'icon'){
    const pid = setting?.pid ? setting.pid : null,
        isIconDefault = this.isIconDefault(setting),
        isCollectionDefault = this.isCollectionDefault(setting),
        collectionSettingExists = this.collectionSettingExists(pid);
    if (!pid) return
    const element = document.createElement('div');
    element.setAttribute('pid', pid)
    element.classList.add('preset-preview-element')

    const name = setting?.name ? setting.name : 'untitled',
          viewbox = setting?.viewbox ? setting.viewbox : 'none',
          height = setting?.height ? setting.height : 'none',
          width = setting?.width ? setting.width : 'none'

    const presetNotificationsElement = ` 
      <div class="preset-element-toast">
          <div class="toast success defaultSet"> default setting applied </div>
          <div class="toast clear defaultCleared"> default setting removed </div>
          <div class="toast delete settingRemoved">setting removed </div>
          <div class="toast success settingAdded">setting added</div>
          <div class="toast failure settingError"> error setting preset </div>
          <div class="toast info previewSet">preview applied</div>
      </div>
    `
    const presetDataElement = `
      <div class="preset-val p-name"><span class="p-label name-label">name: </span> <span class="p-val name-val">${name}</span></div>
      <div class="preset-val p-viewbox"><span class="p-label vb-label">viewbox: </span><span class="p-val vb-val">${viewbox}</span></div>
      <div class="preset-val p-height"><span class="p-label height-label">height: </span> <span class="p-val height-val">${height}</span></div>
      <div class="preset-val p-width"><span class="p-label width-label">width: </span><span class="p-val width-val">${width}</span></div>
    `
    const toolBarElement = (presetType) => {
      const presetToolbarElement = `
      <div class="preset-element-option">
        <div class="pre-opt opt-aid iconDefault">
            <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? icons.presetNotDefaultIcon : icons.presetIsDefaultIcon  }</div>
            <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
        </div>
        <div class="pre-opt opt-acd collectionDefault"> 
            <div class="icon">${ isCollectionDefault ? icons.presetIsCollectionDefaultIcon : icons.presetNotCollectionDefaultIcon } </div>
            <div class="tool-tip">${ isCollectionDefault ? 'clear collection default' : 'set collection default' }</div>
        </div>
        <div class="pre-opt opt-a2c ${ collectionSettingExists ? 'removeFromCollection' : 'addToCollection' } "> 
            <div class="icon">${ collectionSettingExists ? icons.removeFromCollectionIcon : icons.addToCollectionIcon } </div>
            <div class="tool-tip">${ collectionSettingExists ? 'remove collection preset' : 'save as collection preset' } </div>
        </div>
        <div class="pre-opt opt-pc previewCollection"> 
            <div class="icon">${icons.previewCollection}</div>
            <div class="tool-tip">preview collection</div>
        </div>
        <div class="pre-opt opt-pi deletePreset">
            <div class="icon">${icons.deletePreset}</div>
            <div class="tool-tip">delete preset</div>
        </div>
      </div>
      `
      const collectionPresetToolbarElement = `
        <div class="pre-opt opt-aid iconDefault">
          <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
          <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
        </div>
        <div class="pre-opt opt-acd collectionDefault">
          <div class="icon" active="${isCollectionDefault ? true : false }">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
          <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
        </div>
        <div class="pre-opt opt-pc previewCollection"> 
          <div class="icon">${icons.previewCollection}</div>
          <div class="tool-tip">preview collection</div>
        </div>
        <div class="pre-opt opt-pi cDeletePreset"> 
          <div class="icon">${icons.deletePreset}</div>
          <div class="tool-tip">delete preset</div>
        </div>
      `
      const recentPresetToolbarElement = `              
        <div class="pre-opt opt-aid iconDefault">
          <div class="icon" active="${isIconDefault ? true : false }">${ isIconDefault ? presetNotDefaultIcon : presetIsDefaultIcon  }</div>
          <div class="tool-tip">${ isIconDefault ? 'ignore as icon default' : 'set as icon default' }</div>
        </div>
        <div class="pre-opt opt-cid collectionDefault">
            <div class="icon" active="${isCollectionDefault ? true : false }">${ isCollectionDefault ? removeCollectionDefaultIcon : saveAsCollectionDefaultIcon  }</div>
            <div class="tool-tip">${ isCollectionDefault ? 'ignore as collection default' : 'set as collection default' }</div>
        </div>
      <div class="pre-opt opt-pc previewCollection"> 
        <div class="icon">${icons.previewCollection}</div>
        <div class="tool-tip">preview collection</div>
      </div>
      `
      if (presetType === 'icon') return presetToolbarElement
      else if (presetType === 'collection') return collectionPresetToolbarElement
      else if (presetType === 'recent') return recentPresetToolbarElement
    }
    element.innerHTML = `${presetNotificationsElement}${toolBarElement(presetType)}${presetDataElement}`
    return element
  }
  hydratePresetElement(event,setting,element){
    let currentAnimation;
    return (event) => {
      event.stopPropagation()
            const applyToIconDefault = event.target.closest('.iconDefault'),
                  addToCollection = event.target.closest('.pre-opt.addToCollection'),
                  previewIcon = event.target.closest('.previewIcon'),
                  toggleCollectionDefault = event.target.closest('.pre-opt.collectionDefault'),
                  presetDelete = event.target.closest('.deletePreset'),
                  collectionPresetDeleteFromIcon = event.target.closest('.removeFromCollection'), 
                  collectionPresetDeleteFromCollection = event.target.closest('.cDeletePreset'),
                  collectionPreview = event.target.closest('.previewCollection'),
                  viewboxSelection = event.target.closest('.preset-val.p-viewbox'),
                  editName = event.target.closest('.preset-val.p-name');

            const icon = this.icon,
                  id = this.id,
                  collectionName = icon.collection,
                  pid = setting.pid; 
    }
  }

  isIconDefault(setting, icon = this.icon){
    return icon?.preset?.pid == setting.pid
  }
  isCollectionDefault(setting, collection = this.collection){
    return collection.meta?.preset?.pid == setting.pid
  }
  collectionSettingExists(settingID, collection = this.collection){
    const collectionHasSettings = 
      !objectIsEmpty(collection.settings) 
      && this.getLength(collection.settings) > 0
      && Object.hasOwn(collection.setting, settingID)
  }

  removePreset(element){
    const removeAnimation = element.animate([
        {transform: `translateX(-200%)`}],
        {duration: 300,easing: 'ease','fill':'forwards'})
  
    removeAnimation.onfinish = () => {
        element.classList.add('deleted')
        element.remove()
    }
  }
  addCollectionPresetElement(setting) {
    let element = this.createPresetElement(setting,'collection')
    if (element) element.addEventListener('click',event => this.hydratePresetElement(event,element,setting) )
    this.collectionSettingsTab.appendChild(element)
  }
  addIconPresetElement(setting){
    let element = this.createPresetElement(setting,'icon')
    if (element) element.addEventListener('click',event => this.hydratePresetElement(event,element,setting) )
    this.iconSettingsTab.appendChild(element)
  }
  addRecentPresetElement(setting){
    let element = this.createPresetElement(setting,'recent')
    if (element) element.addEventListener('click',event => this.hydratePresetElement(event,element,setting) )
    this.recentSettingsTab.appendChild(element)
  }
  notifyPreset(notification,element){
    let animation
    const notify = (toast) => toastElement.animate([
      {transform: 'translateY(-100%', offset: 0},
      {transform: 'translateY(0)', offset:0.015},
      {transform: 'translateY(0)', offset:0.990},
      {transform: 'translateY(-100%', offset:1}],
    {duration: 3000, iterations: 1, easing: 'ease'})
    switch(notification){
      case 'default set': animation = notify($('.toast.defaultSet',element)) ;
      case 'default cleared': animation = notify($('.toast.defaultCleared',element)); 
      case 'setting removed': animation = notify($('.toast.settingRemoved',element));
      case 'setting added': animation = notify($('.toast.settingAdded'),element)
      case 'update error': animation = notify($('.toast.settingError'),element);
      case 'preview set': animation = notify($('.toast.previewSet'),element);
      default: animation = null;
    }
    return animation;
  }

  async toggleIconDefault(setting){
    const icon = this.icon
    const pid = setting.pid
    const collectionName = icon.colleciton
    const presetElement = $(`.preset-preview-element[pid=${pid}]`,this.iconSettingsTab)
    const isDefault = this.isIconDefault(setting)
    if (isDefault){
      let updated = await this.clearDefault(icon,collectionName,pid)
    }
  }

  async setDefault(id,collection,pid){
    return this.dashboard.store.setDefaultIconSetting(id,collection,pid)
  }
  async clearDefault(id,colleciton,icon){
    return this.dashboard.store.clearDefaultSetting(id,collection,pid)
  }
}
