export const PreviewWindow = () => {
  return `                   <!-- HEADER -->
  <div class="preview-controls">
  <div class="preview-options">
      <div class="preview-settings"><svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" pid="m37q62l0-01UMT3P3GRP2">
      <path fill="#141414b5" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.0792L9.7872 5.3687C9.55167 5.61239 9.22729 5.75 8.88839 5.75H5.75V8.88839C5.75 9.2273 5.61239 9.55167 5.3687 9.7872L3.0792 12L5.3687 14.2128C5.61239 14.4483 5.75 14.7727 5.75 15.1116V18.25H8.88839C9.22729 18.25 9.55167 18.3876 9.7872 18.6313L12 20.9208L14.2128 18.6313C14.4483 18.3876 14.7727 18.25 15.1116 18.25H18.25V15.1116C18.25 14.7727 18.3876 14.4483 18.6313 14.2128L20.9208 12L18.6313 9.78721C18.3876 9.55168 18.25 9.2273 18.25 8.8884V5.75H15.1116C14.7727 5.75 14.4483 5.61239 14.2128 5.3687L12 3.0792ZM11.1012 1.85077C11.5926 1.34237 12.4074 1.34237 12.8988 1.85077L15.2177 4.25H18.5C19.1904 4.25 19.75 4.80965 19.75 5.5V8.78234L22.1492 11.1012C22.6576 11.5926 22.6576 12.4074 22.1492 12.8988L19.75 15.2177V18.5C19.75 19.1904 19.1904 19.75 18.5 19.75H15.2177L12.8988 22.1492C12.4074 22.6576 11.5926 22.6576 11.1012 22.1492L8.78233 19.75H5.5C4.80964 19.75 4.25 19.1904 4.25 18.5V15.2177L1.85077 12.8988C1.34237 12.4074 1.34236 11.5926 1.85077 11.1012L4.25 8.78233V5.5C4.25 4.80964 4.80964 4.25 5.5 4.25H8.78233L11.1012 1.85077Z" fill="black" pid="m37q62l0-00T4I2853O9U"></path>
      <path fill="#141414b5" fill-rule="evenodd" clip-rule="evenodd" d="M7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12ZM12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75Z" fill="black" pid="m37q62l0-02E0LYMB8PHL"></path>
      </svg></div>
  </div>

  <div class="close-preview">close</div></div>
  <div class="preview__window--container preview__window">
      <!-- WRAPPER --> 
      <div class="preview__window--display current-icon-display" data-role="iconDisplay">
              <!-- ICON --> 
              <div class="preview__window--display-current current-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="102px" width="102px">
                      <path d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z"></path>
                  </svg>
              </div>
      </div>
          <!-- NEXT --> 
          <div class="preview__window--navigator btn-next">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="34px" height="34px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                  <g>
                      <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="27,15 44,32 27,49"></polyline>
                  </g>
              </svg>
          </div>
          <!-- PREV --> 
          <div class="preview__window--navigator btn-prev">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="34px" height="34px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                  <g>
                      <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="37,15 20,32 37,49 	"></polyline>
                  </g>
              </svg>
          </div>

      </div>
      <!-- DESCRIPTION -->
      <div class="preview__description">
          <!-- NAME/CATEGORY -->
          <div class="group column preview__description--meta titles">
              <!-- NAME -->
              <div class="title-group__name "><span class="label name">Name</span></div>
              <!-- CATEGORY --> 
              <div class="title-group__category"><span class="label category">Category</span></div>
          </div>
          <!-- QUICK TOGGLES -->
          <div class="group row preview__description--snackbar togglers">
              <!-- SHOW BORDER -->
              <div class="btn-border preview__description--snackbar-button toggler">
                  <span class="icon border">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="20px" width="20px">
                          <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
                          <path d="M0 112C0 67.82 35.82 32 80 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H80C71.16 96 64 103.2 64 112V448C64 465.7 49.67 480 32 480C14.33 480 0 465.7 0 448V112zM128 480C110.3 480 96 465.7 96 448C96 430.3 110.3 416 128 416C145.7 416 160 430.3 160 448C160 465.7 145.7 480 128 480zM320 480C302.3 480 288 465.7 288 448C288 430.3 302.3 416 320 416C337.7 416 352 430.3 352 448C352 465.7 337.7 480 320 480zM256 448C256 465.7 241.7 480 224 480C206.3 480 192 465.7 192 448C192 430.3 206.3 416 224 416C241.7 416 256 430.3 256 448zM416 480C398.3 480 384 465.7 384 448C384 430.3 398.3 416 416 416C433.7 416 448 430.3 448 448C448 465.7 433.7 480 416 480zM416 288C398.3 288 384 273.7 384 256C384 238.3 398.3 224 416 224C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288zM448 352C448 369.7 433.7 384 416 384C398.3 384 384 369.7 384 352C384 334.3 398.3 320 416 320C433.7 320 448 334.3 448 352zM416 192C398.3 192 384 177.7 384 160C384 142.3 398.3 128 416 128C433.7 128 448 142.3 448 160C448 177.7 433.7 192 416 192z"></path>
                      </svg>
                  </span>
              </div>
              <!-- COPY -->
              <div class="btn-copy preview__description--snackbar-button toggler">
                  <span class="icon copy">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20px" width="20px">
                          <path d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"></path>
                      </svg>
                  </span>
              </div>
              <!-- ADD TO BENCH -->
              <div class="btn-bench preview__description--snackbar-button toggler">
                  <span class="icon bench">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="64px" width="64px">
                          <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M407.6 64h-367C18.5 64 0 82.5 0 104.6v135.2C0 364.5 99.7 464 224.2 464c124 0 223.8-99.5 223.8-224.2V104.6c0-22.4-17.7-40.6-40.4-40.6zm-162 268.5c-12.4 11.8-31.4 11.1-42.4 0C89.5 223.6 88.3 227.4 88.3 209.3c0-16.9 13.8-30.7 30.7-30.7 17 0 16.1 3.8 105.2 89.3 90.6-86.9 88.6-89.3 105.5-89.3 16.9 0 30.7 13.8 30.7 30.7 0 17.8-2.9 15.7-114.8 123.2z"></path></svg>
                  </span>
              </div>
              <!-- ADD TO FAVORITES -->
              <div class="btn-favit preview__description--snackbar-button toggler">
                  <span class="icon favorite">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="20px" width="20px">
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                      </svg>
                  </span>
              </div>
          </div>

      </div>

      <div class="add-to-collection">add to collection</div>
      <!-- TAB BAR --> 
      <div class="preview__tabber row">
              <!-- POSITION -->
              <div class="preview__tabber--tab tab" data-role="tab" data-tab="position"><div class="preview__tabber--tab-label label">Position</div></div>
              <!-- PREVIEW -->
              <div class="preview__tabber--tab tab" data-role="tab" data-tab="components"><div class="preview__tabber--tab-label label">Preview</div></div>
              <!-- Color -->
              <div class="preview__tabber--tab tab" data-role="tab" data-tab="color"><div class="preview__tabber--tab-label label">Color</div></div>
      </div>`
}
