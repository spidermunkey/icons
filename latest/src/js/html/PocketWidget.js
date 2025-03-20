import { Pocket } from "../components/Collection"
export const PocketWidget = async () => {
    const icons = await app.store.getPocket()
    app.store.pocket = new Pocket({icons,meta:{'name':'pocket',size:icons.length}})
  return `<div class="bench-widget widget" id="bench-widget">
    <div class="widget-header">
      <div class="widget-title"><span>pocket</span></div>
      <div class="btn-min">
                                              <!--?xml version="1.0" encoding="utf-8"?-->
              <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                  <g>
                      <line fill="none" stroke-width="4" stroke-miterlimit="10" x1="14" y1="31" x2="50" y2="31"></line>
                  </g>
                  </svg>
      </div>
  </div>
  <div class="widget-content">
      <div class="bench-preview-icons">
          <div class="bp-icon-wrapper">

          </div>
      </div>
      <div>
          <div class="bench-preview-count">
              <span class="bench-count">${icons.length}</span>
              <span class="divider">
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="-8 -16 42 42" height="16px" width="16px">
                  <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>
              </span>
              <span class="bench-count-label">icons saved in pocket</span>
          </div>
          <div class="widget-toggles">
              <div class="tggle tggle-open"><span>open</span><span class="icon-label"></span></div>
              <div class="tggle copy-icon">
                  save
                  <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="12px" width="12px">
                  <path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"></path></svg>
                  </div> -->

              </div>
              <div class="tggle clear-icon">
                  clear
              </div>
          </div>
      </div>

  </div>
          </div>`
}
