export class ContextMenu {
  constructor() {
      this.state = 'inactive';
      this.element = $('.db-context');
      this.overlay = $('.dashboard-cosm');
      this.infoElement = $('.context-card',this.element);
      this.icon = null;
  }

  handleRightClick(event,icon) {
      const clickedContextMenu = eventMaps.clicked(event,'.db-context');
      // handle right click outside
      if ( this.state === 'active' && !clickedContextMenu ) {
          event.preventDefault();
          if (icon) {
              this.updateMouseBasedPosition(event);
              this.update(icon)
              return
          }
          this.close()
          return;
      }
      
      if (this.state === 'inactive' && icon) {
          event.preventDefault();
          // position menu
          this.updateMouseBasedPosition(event);
          this.update(icon)
          // show menu
          this.open();
          return
      }

      this.close();

      return;
  }

  close() {
      this.element.classList.remove('active');
      this.overlay.classList.remove('active');
      $('.db-context .info').classList.remove('active')
      this.state = 'inactive';
      return this.state;
  }

  open() {
      this.element.classList.add('active');
      this.overlay.classList.add('active');
      this.state = 'active';
      return this.state;
  }

  update(props) {
      const { name, category,markup,isFavorite,isBenched} = props;
      console.log(props,this)
      if (name.length > 5) $('.icon-info').classList.add('min-r')
        
      $('.current-icon .card-icon',this.element).innerHTML = markup
      $('.icon-title',this.infoElement).textContent = name
      $('.icon-category',this.infoElement).textContent = category
      // root.style.setProperty('--currentContext', hex)
      this.icon = props;
      console.log(isFavorite)

      isFavorite 
        ? this.showFavorite()
        : this.hideFavorite();
      isBenched
        ? this.showPocket()
        : this.hidePocket();
      
      console.log('updated',this)
      return this.state
  }
  
  updateMouseBasedPosition(event) {

        const {left,top,bottom} = $('.dashboard').getBoundingClientRect();
        const {height} = $('.db-context').getBoundingClientRect();
      (height + event.clientY) > bottom
        ? root.style.setProperty('--context-y', `${bottom - height - 40}px`)
        : root.style.setProperty('--context-y', `${event.clientY - top}px`);

        root.style.setProperty('--context-x', `${event.clientX - left}px`);
  }

  render(props) {
      const { name, category,markup } = props;
      let element = `
      <div class="color-context db-context">
      <div class="alert"></div>
      <div class="info">
          <div class="current-icon context-card">
              <div class="card-icon">
                ${markup}
              </div>
              <div class="icon-info">
                  <div class="icon-title">${name}}</div>
                  <div class="icon-category"><span class="label">${category}</span></div>
              </div>

          </div>
      </div>
      <div class="quick-toggles">
          <div class="btn info">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 22 22" height="24px" width="24px">
                  <path d="M13 7.5a1 1 0 11-2 0 1 1 0 012 0zm-3 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.25h.75a.75.75 0 010 1.5h-3a.75.75 0 010-1.5h.75V12h-.75a.75.75 0 01-.75-.75z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>
          </div>

          <div class="btn copy">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="24px" width="24px">
                  <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M502.6 198.6l-61.25-61.25C435.4 131.4 427.3 128 418.8 128H256C220.7 128 191.1 156.7 192 192l.0065 255.1C192 483.3 220.7 512 256 512h192c35.2 0 64-28.8 64-64l.0098-226.7C512 212.8 508.6 204.6 502.6 198.6zM464 448c0 8.836-7.164 16-16 16h-192c-8.838 0-16-7.164-16-16L240 192.1c0-8.836 7.164-16 16-16h128L384 224c0 17.67 14.33 32 32 32h48.01V448zM317.7 96C310.6 68.45 285.8 48 256 48H215.2C211.3 20.93 188.1 0 160 0C131.9 0 108.7 20.93 104.8 48H64c-35.35 0-64 28.65-64 64V384c0 35.34 28.65 64 64 64h96v-48H64c-8.836 0-16-7.164-16-16V112C48 103.2 55.18 96 64 96h16v16c0 17.67 14.33 32 32 32h61.35C190 115.4 220.6 96 256 96H317.7zM160 72c-8.822 0-16-7.176-16-16s7.178-16 16-16s16 7.176 16 16S168.8 72 160 72z"></path></svg>
          </div>
          <div class="btn favit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="24px" width="24px">
                  <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
              </svg>
          </div>
          <div class="btn delete">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -7 474 542" height="24px" width="24px">
                  <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"></path></svg>
          </div>

      </div>
      <div class="quick-save">
          <ul>
              <div class="list-section center-1">
                  <li>Save To Collection</li>
              </div>
              <div class="list-section">
                  <li>Copy HSL</li>
                  <li>Copy RGB</li>
                  <li>Copy HEX</li>
              </div>

              <div class="list-section center-1">
                  <li>Add / Remove From Pocket</li>
              </div>

              <div class="list-section">
                  <li>Open Fullscreen View</li>
                  <li>Open Gradient View</li>
                  <li>Open Palette View</li>
              </div>
          </ul>
      </div>
                      </div>`

      return element;
  }

  showIcon(){

  }
  
  showInfo(){
    if (!this.icon) return;
  }

  showFavorite(){
    $('.db-context .btn.favit').setAttribute('isFav',true)
  }
  hideFavorite(){
    $('.db-context .btn.favit').setAttribute('isFav','')
  }
  showPocket() {
    $('.db-context .btn.pocket').setAttribute('isBenched',true)
  }
  hidePocket() {
    $('.db-context .btn.pocket').setAttribute('isBenched','')
  }
  handlePocket(status) {
    if (status == null)
        this.hidePocket();
    else if (status.id && status.id == this.icon.id)
        this.showPocket();
    }
}
