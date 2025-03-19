export const ColorSaveMenu = () => {
  return `
  <div class="colorset-name colorset-data">untitled</div>
  <div class="colorset-global-shape colorset-data cd-color-data">
    <div class="colorset-data-label">Global Shape Color</div>
    <div class="colorset-data-colors">
      <div class="colorset-global-shape-fill cd-selector">
        <div class="shape-fill-label cd-label">fill</div>
        <div class="shape-fill-reflector cd-reflector shape-reflector" reflector="fill"></div>
      </div>
      <div class="colorset-global-shape-stroke cd-selector">
        <div class="shape-stroke-label cd-label">stroke</div>
        <div class="shape-stroke-reflector shape-reflector cd-reflector" reflector="stroke"></div>
      </div>
    </div>
    </div>

  <div class="colorset-global-element colorset-data cd-color-data">
    <div class="colorset-data-label">Global Element Color</div>
    <div class="colorset-data-colors">
      <div class="colorset-global-element-fill cd-selector">
        <div class="element-fill-label cd-label">fill</div>
        <div class="element-fill-reflector element-reflector cd-reflector" reflector="fill"></div>
      </div>
      <div class="colorset-global-element-stroke cd-selector">
        <div class="element-stroke-label cd-label">stroke</div>
        <div class="element-stroke-reflector element-reflector cd-reflector" reflector="stroke"></div>
      </div>
    </div>
  </div>

  <div class="color-settings-controller">
    <div class="btn-setting">Apply Collection Default</div>
    <div class="btn-setting">Apply Collection Preview</div>
    <div class="btn-setting">Save As New Colorset</div>
  </div>
`
}
