export const ColorInterface = () => {
  return `

  <div class="color-picker cp-mini">
    <div class="cp-header">
        <div class="cp-close">close</div>
    </div>
      <div class="cp-canvas">
          <div class="canvas"><div class="cp-canvas--pointer canvas-pointer"></div></div>
          <div class="hue-bar input-bar slider-track"><div class="hue-thumb input-thumb slider-handle"></div></div>
      </div>
      <div class="cp-inputs">
        <div class="preview-color"></div>
        <div class="hex-input">
            <div class="input">
                <input type="text">
            </div>
            <div class="canvas-copy">
                <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16px" width="16px">
                    <path d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"></path>
                </svg>
                </div>
            </div>
        </div>
      </div>
      <div class="cp-controls updater">
          <div class="btn-update btn">Update</div>
          <div class="btn-reset btn">Reset</div>
          <div class="btn-save btn">Save</div>
          
      </div>
      <div class="pv-action">
        <div class="btn-fs btn">Open Fullscreen</div>
        </div>
  </div>

  <div class="path-preview path-extractor">
      <div class="controls">
          <div class="pv-preview-color"></div>
          <div class="hex-input">
              <div class="pv-inp">
                  <input type="text" placeholder="#hexvalue" value="">
              </div>
              <span class="open-palette icon-label">
                  <!-- <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="10 9 33 33" enable-background="new 0 0 50 50" xml:space="preserve">
                      <path d="M15.243,19.194c0.553,0,1-0.447,1-1s-0.447-1-1-1h-3.77c-0.553,0-1,0.447-1,1v21.951c0,0.553,0.447,1,1,1h21.951
                          c0.553,0,1-0.447,1-1v-3.765c0-0.553-0.447-1-1-1s-1,0.447-1,1v2.765H12.474V19.194H15.243z"></path>
                      <path d="M41.474,9.146H19.522c-0.553,0-1,0.447-1,1v21.951c0,0.553,0.447,1,1,1h21.951c0.553,0,1-0.447,1-1V10.146
                          C42.474,9.593,42.026,9.146,41.474,9.146z M40.474,31.097H20.522V11.146h19.951V31.097z"></path>
                  </svg> -->
                  <svg version="1.1" id="pall" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" height="24px" width="24px">
                      <g id="Icon_12_">
                          <g>
                              <path d="M256,64C150.401,64,64,150.401,64,256c0,105.604,86.401,192,192,192c18.136,0,32-13.864,32-32
                                  c0-8.531-3.198-16-8.531-21.333c-5.333-5.334-8.531-12.803-8.531-21.334c0-18.135,13.864-32,32-32h38.396
                                  c58.667,0,106.667-48,106.667-106.666C448,140.802,361.604,64,256,64z M138.667,256c-18.136,0-32-13.864-32-32s13.864-32,32-32
                                  c18.135,0,32,13.864,32,32S156.802,256,138.667,256z M202.667,170.667c-18.136,0-32-13.865-32-32c0-18.136,13.864-32,32-32
                                  c18.135,0,32,13.864,32,32C234.667,156.802,220.802,170.667,202.667,170.667z M309.333,170.667c-18.135,0-32-13.865-32-32
                                  c0-18.136,13.865-32,32-32c18.136,0,32,13.864,32,32C341.333,156.802,327.469,170.667,309.333,170.667z M373.333,256
                                  c-18.135,0-32-13.864-32-32s13.865-32,32-32c18.136,0,32,13.864,32,32S391.469,256,373.333,256z"></path>
                          </g>
                      </g>
                  </svg>
              </span>
              <div class="canvas-undo">
                  <div class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16px" width="16px" transform="rotate(-15)" data-rotation="undefined">
                          <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.86 0-95.19-15.58-134.2-44.86c-14.14-10.59-17-30.66-6.391-44.81c10.61-14.09 30.69-16.97 44.8-6.375c27.84 20.91 61 31.94 95.89 31.94C344.3 415.8 416 344.1 416 256s-71.67-159.8-159.8-159.8C205.9 96.22 158.6 120.3 128.6 160H192c17.67 0 32 14.31 32 32S209.7 224 192 224H48c-17.67 0-32-14.31-32-32V48c0-17.69 14.33-32 32-32s32 14.31 32 32v70.23C122.1 64.58 186.1 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"></path></svg>
                  </div>
              </div>
              <div class="canvas-redo">
                  <div class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16px" width="16px" transform="rotate(15)">
                      <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 14.31-32 32-32S496 30.31 496 48z"></path></svg>
                  </div>
              </div>
      </div>
      <div class="pv-updater">
        <div class="btn-update btn">Update</div>
        <div class="btn-reset btn">Reset</div>
        <div class="btn-save btn">Save </div>
      </div>


    </div>
</div>`
}
