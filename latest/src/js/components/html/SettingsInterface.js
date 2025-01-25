
export const SettingsInterface = (settings) => {
        return `
        <div class="widget-settings widget-wrapper settings-interface">
          <div class="widget-header">Collection Settings</div>
        <div class="interface-window">
          <div class="preset-settings settings-module">
            <div class="module-header">
              <div class="module-name">Collection Name</div>
            </div>
            <div class="module-content">
              <div class="setting preset">
                <div class="setting-label"><span>preset</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>default</span></div>
              </div>
              <div class="setting color">
                <div class="setting-label"><span>colors</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>none</span></div>
              </div>
              <div class="setting viewbox">
                <div class="setting-label"><span>viewbox</span></div>
                <div class="divder"> : </div>
                <div class="setting-value">
                  <span><input type="text"></span>
                  <span><input type="text"></span>
                  <span><input type="text"></span>
                  <span><input type="text"></span>
                
                
                </div>
              </div>
              <div class="setting height">
                <div class="setting-label"><span>height</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>none</span></div>
              </div>
              <div class="setting width">
                <div class="setting-label"><span>width</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>none</span></div>
              </div>
              <div class="setting ilabel">
                <div class="setting-label"><span>icon label</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>none</span></div>
              </div>
              <div class="setting elabel">
                <div class="setting-label"><span>element label</span></div>
                <div class="divder"> : </div>
                <div class="setting-value"><span>none</span></div>
              </div>
          </div>
          <div class="settings-controls settings-module">
            <div class="module-header">
              <div class="module-name">Controls</div>
            </div>
            <div class="module-content">
              <span>save/use preset</span>
              <span>select all</span>
              <span>select none</span>
              <span>open fullscreen preview</span>
            </div>
          </div>
        </div>
    </div>
    `
}
