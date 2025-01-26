export class Settings {
  constructor(defaultSetting) {
    this.viewbox = defaultSetting?.viewbox || [0,0,24,24];
    this.height = defaultSetting?.height || '40px';
    this.width = defaultSetting?.width || '40px';
    this.label = defaultSetting?.label || '';
    this.preset = defaultSetting?.name || 'default';
    this.collection = null;
    this.settings = null;
  }

  get currentPreset(){
    return {
      viewbox: this.viewbox,
      vbx: this.viewbox[0],
      vby: this.viewbox[1],
      vbw: this.viewbox[2],
      vbh: this.viewbox[3],
      height: this.height, 
      width: this.width,
    }
  }

  get interface(){
    let preset = this.collection.preset
    if (this.collection?.settings && this.collection.settings['default-01']){
      preset = collection.presets['default-01'];
    } else {
      for (const id in this.settings){
        if (this.settings[id].name === 'default-01'){
            preset = this.settings.currentPreset = this.settings[id]
            break;
        }
    }
    console.log('PRESET',preset)
    }
    const {name,height,width,viewbox} = preset

    return `<div class="preset-settings settings-module">
              <div class="module-header">
                <div class="module-name">Collection Name : ${this.collection.meta.name}</div>
              </div>
              <div class="module-content">
                <div class="setting preset">
                <div class="setting-preset-template">
                
                  <div class="title-header">
                    <div class="ttl"> 
                      <div class="tggle-prev">
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#656565c5" xmlns="http://www.w3.org/2000/svg" pid="m2w9hb2j-01MORNDJ9XWT">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0303 7.46967C14.3232 7.76256 14.3232 8.23744 14.0303 8.53033L10.5607 12L14.0303 15.4697C14.3232 15.7626 14.3232 16.2374 14.0303 16.5303C13.7374 16.8232 13.2626 16.8232 12.9697 16.5303L8.96967 12.5303C8.67678 12.2374 8.67678 11.7626 8.96967 11.4697L12.9697 7.46967C13.2626 7.17678 13.7374 7.17678 14.0303 7.46967Z" fill="#656565c5" pid="m2w9hb2j-0079X5M8EV3K"></path>
                        </svg>
                      </div>
                      <div class="preset-name">
                        preset name: ${name} 
                      </div>
                      <div class="tggle-next">
                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#656565c5" xmlns="http://www.w3.org/2000/svg" pid="m2w9g7o5-00I0LCXPOGPJ">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.96967 7.46967C10.2626 7.17678 10.7374 7.17678 11.0303 7.46967L15.0303 11.4697C15.3232 11.7626 15.3232 12.2374 15.0303 12.5303L11.0303 16.5303C10.7374 16.8232 10.2626 16.8232 9.96967 16.5303C9.67678 16.2374 9.67678 15.7626 9.96967 15.4697L13.4393 12L9.96967 8.53033C9.67678 8.23744 9.67678 7.76256 9.96967 7.46967Z" fill="#656565c5" pid="m2w9g7o6-01BWC0EPG40B"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="create-new"> Create New Preset
                      <div class="create-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                      </div>
                    </div>
                 </div>

                  <div class="ilabel">
                      <div class="setting-label"><span>icon label</span></div>
                      <div class="setting"><span>none</span></div>
                  </div>
                  <div class="pallete">
                      <div class="label-container">
                          <span class="setting-label">pallete</span>
                      </div>
                      <div class="value-container">
                          <span class="box"></span>
                          <span class="box"></span>
                          <span class="box"></span>
                          <span class="box"></span>
                          <span class="box"></span>
                          <span class="box"></span>
                          <span class="box"></span>
                      </div>

                  </div>
                  <div class="row position">
                      <div class="viewbox">
                          <span class="setting-label">viewbox</span><span class="setting vb">
                              <span class="vb-setting" ><input type="text" placeholder="mx" coord="minx" value=${viewbox[0]}></span>
                              <span class="vb-setting" ><input type="text" placeholder="my" coord="miny" value=${viewbox[1]}></span>
                              <span class="vb-setting" ><input type="text" placeholder="w" coord="width" value=${viewbox[2]}></span>
                              <span class="vb-setting" ><input type="text" placeholder="h" coord="height" value=${viewbox[3]}></span>
                          </span>
                      </div>

                  </div>

                  <div class="row dimensions">
                      <div class="block height">
                          <span class="setting-label">height</span>
                          <input type="text" class="dimension" dimension="height" value=${height}></input>
                      </div>
                      <div class="block width">
                          <span class="setting-label width">width</span>
                          <input type="text" class="dimension" dimension="width" value=${width}></input>
                      </div>
                  </div>

              </div>
              </div>
              </div>
              </div>
            <div class="settings-controls">
              <div class="row select">
                  <div class="s-ctrl btn-select-all">select all</div>
                  <div class="s-ctrl btn-select-none">select none</div>
              </div>
              <div class="row apply">
                  <div class="s-ctrl btn-apply">apply</div>
                  <div class="s-ctrl btn-save">save</div>
              </div>
              <div class="row create">
                <div class="s-ctrl">save as new preset</div>
              </div>
              <div class="row def">
                <div class="s-ctrl">save as default</div>
              </div>
            </div>
          `
  }

  get previewModal(){
    return `<div class="preview-settings-modal" collection=${this.collection.meta.name}>
                ${this.collection.icons.reduce((acc,red)=> {
                acc += `<div class="svg-wrapper preview-icon">${red.markup}</div>`;
                return acc;
              },'')}
            </div>`
  }

  async render(collection){
    this.collection = collection;
    this.settings = collection.settings
    // this.settings = await this.store.getCollection();
    $('.settings-interface .interface-window').innerHTML = this.interface;
    // $('.db-res').innerHTML = this.previewModal;
    await this.hydrate();
  }

  async hydrate(){
    const preview = $('.settings-interface .interface-window');
    if (!preview) return;
    preview.addEventListener('keydown',this.delegateInterfaceEvents.bind(this))

  }

  delegateInterfaceEvents(event) {
    const viewboxInput = event.target.closest('.vb-setting input')
    console.log('VB FLAG',viewboxInput)
    const dimensionInput = event.target.closest('input.dimension')
    console.log('DIM FLAG',dimensionInput)
    if (viewboxInput) this.handleViewBoxInputs(event);
    if (dimensionInput) this.handleDimensionInputs(event);
  }

  handleDimensionInputs(event) {
    console.log('handling dims')
    const tab = 9;
    if (event.keyCode === tab || event.which === tab)
      return console.log('tab');
    event.preventDefault();
    const dimInput = event.target.closest('input.dimension');
    const dim = dimInput.getAttribute('dimension');
    let actualValue = event.target.value;
    let key = event.key;
    let constructedValue = event.target.value.toString();
    console.log(event.keyCode, event.code);
    const backspaceKeyCode = 8;
    const leadingZero = /^0+/;
    const keyIsNumber = /^\d$/.test(key);
    const hasNonNumbers = /\D/;
    // ensure value is 0 and never '' on backspace
    if (event.keyCode == backspaceKeyCode && constructedValue.length > 0) {
        const len = constructedValue.length;
        constructedValue = Array.from(constructedValue).slice(0, len - 1).join('')
        if (constructedValue == '') {
          constructedValue = 0;
          event.target.value = 0;
      }
    }
    // handle negative value
    if (key === '-' && (actualValue == 0 || actualValue === '')){
        console.log('no-prefixing');
    }
    // only construct integers
    if (keyIsNumber) {
        console.log('key is number');
        constructedValue = actualValue.toString() + key.toString();
        constructedValue = constructedValue.toString().replace(leadingZero,'');
    }
    event.target.value = constructedValue;
    switch(dim) {
      case 'width' : {
          this.width = Number(constructedValue)
          break;
      }
      case 'height' : {
          this.height = Number(constructedValue)
          break;
      } default: break;
    }
    console.log(this.height,this.width)
    $$('.preview-settings-modal svg').forEach(svg => {
      svg.setAttribute('height', this.height);
      svg.setAttribute('width', this.width);
    }
  )
  console.log('height and width previews applied')
  }
  handleViewBoxInputs(event) {
    console.log('handling viewbox')
    const tab = 9;
    if (event.keyCode === tab || event.which === tab)
      return console.log('tab');
    event.preventDefault();
    const vbInput = event.target.closest('.vb-setting input');
    const coord = vbInput.getAttribute('coord');
    let actualValue = event.target.value;
    let key = event.key;
    let constructedValue = event.target.value.toString();
    console.log(event.keyCode, event.code);
    const backspaceKeyCode = 8;
    const leadingZero = /^0+/;
    const keyIsNumber = /^\d$/.test(key);
    const hasNonNumbers = /\D/;
    let prefix = false;
    // ensure value is 0 and never '' on backspace
    if (event.keyCode == backspaceKeyCode && constructedValue.length > 0) {
        const len = constructedValue.length;
        constructedValue = Array.from(constructedValue).slice(0, len - 1).join('')
        if (constructedValue == '') {
          constructedValue = 0;
          event.target.value = 0;
      }
    }
    // handling negative value
    if (key === '-' && (actualValue == 0 || actualValue === '')){
        console.log('prefixing');
        prefix = true;
        constructedValue = '-';
        event.target.actualValue = '-';
    }
    // only construct number values
    if (keyIsNumber) {
        console.log('key is number');
        constructedValue = actualValue.toString() + key.toString();
        constructedValue = constructedValue.toString().replace(leadingZero,'');
    }
    const validLength = ((constructedValue.toString()[0] === '-' && constructedValue.toString().length <= 4) ||  constructedValue.toString().length <= 3 )
    if (validLength) {
      console.log(constructedValue)
        event.target.value = constructedValue;
        switch(coord) {
                case 'minx' : {
                    this.viewbox[0] = Number(constructedValue)
                    break;
                }
                case 'miny' : {
                    this.viewbox[1] = Number(constructedValue)
                    break;
                }
                case 'width' : {
                    this.viewbox[2] = Number(constructedValue)
                    break;
                }
                case 'height' : {
                    this.viewbox[3] = Number(constructedValue)
                    break;
                } default: break;
            }
            // set all values;
            console.log(this.viewbox)
            $$('.preview-settings-modal svg').forEach(svg => {
              svg.setAttribute('viewBox', this.viewbox.join(' '))
            }
            )
            console.log('viewbox previews applied')
    }
  }
}
