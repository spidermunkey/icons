export const ViewboxInterface = () => {
  return `
  <!-- VIEWBOX INPUTS -->
  <div class="position__inputs viewbox">
    <div class="preset-header">
        <div class="current-preset">preset</div>
        <div class="save-preset action">
            <svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lnvmyp-008Y2I74Q72F">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M3.48911 6.2367C3.65493 4.81893 4.85617 3.75 6.28361 3.75H17.0263C17.2084 3.75 17.3843 3.81626 17.5211 3.93641L20.2816 6.3602C20.9022 6.90511 21.245 7.70008 21.2154 8.52543L20.8714 18.0988C20.8182 19.5781 19.6035 20.75 18.1232 20.75H6.11291C4.78329 20.75 3.66076 19.762 3.49191 18.4432C2.99542 14.565 2.97403 10.6407 3.42822 6.75728L3.48911 6.2367ZM6.28361 5.25C5.61719 5.25 5.05637 5.74905 4.97895 6.41096L4.91807 6.93153C4.47805 10.6937 4.49877 14.4955 4.97977 18.2527C5.05277 18.8229 5.53807 19.25 6.11291 19.25H6.75V15C6.75 14.0335 7.5335 13.25 8.5 13.25H15.5C16.4665 13.25 17.25 14.0335 17.25 15V19.25H18.1232C18.7961 19.25 19.3482 18.7173 19.3724 18.0449L19.7164 8.47157C19.7298 8.09641 19.574 7.73505 19.2919 7.48737L16.75 5.2555V7.59998C16.75 8.56647 15.9665 9.34998 15 9.34998H9C8.0335 9.34998 7.25 8.56647 7.25 7.59998V5.25H6.28361ZM8.75 5.25V7.59998C8.75 7.73805 8.86193 7.84998 9 7.84998H15C15.1381 7.84998 15.25 7.73805 15.25 7.59998V5.25H8.75ZM15.75 19.25H8.25V15C8.25 14.8619 8.36193 14.75 8.5 14.75H15.5C15.6381 14.75 15.75 14.8619 15.75 15V19.25Z" fill="black" pid="m4lnvmyp-004PXDQAS7TG" stroke="null"></path>
            </svg>
        </div>
        <div class="revert-to-original action">
            <svg width="24px" height="24px" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lo5rs8-00OP23ZTDXMN">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M20.5303 4.53033C20.8232 4.23744 20.8232 3.76256 20.5303 3.46967C20.2374 3.17678 19.7626 3.17678 19.4697 3.46967L3.46967 19.4697C3.17678 19.7626 3.17678 20.2374 3.46967 20.5303C3.76256 20.8232 4.23744 20.8232 4.53033 20.5303L7.37723 17.6834C8.74353 18.3266 10.3172 18.75 12 18.75C14.684 18.75 17.0903 17.6729 18.8206 16.345C19.6874 15.6797 20.4032 14.9376 20.9089 14.2089C21.4006 13.5003 21.75 12.7227 21.75 12C21.75 11.2773 21.4006 10.4997 20.9089 9.79115C20.4032 9.06244 19.6874 8.32028 18.8206 7.65503C18.5585 7.45385 18.2808 7.25842 17.989 7.07163L20.5303 4.53033ZM16.8995 8.16113L15.1287 9.93196C15.5213 10.5248 15.75 11.2357 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C11.2357 15.75 10.5248 15.5213 9.93196 15.1287L8.51524 16.5454C9.58077 16.9795 10.7621 17.25 12 17.25C14.2865 17.25 16.3802 16.3271 17.9073 15.155C18.6692 14.5703 19.2714 13.9374 19.6766 13.3536C20.0957 12.7497 20.25 12.2773 20.25 12C20.25 11.7227 20.0957 11.2503 19.6766 10.6464C19.2714 10.0626 18.6692 9.42972 17.9073 8.84497C17.5941 8.60461 17.2571 8.37472 16.8995 8.16113ZM11.0299 14.0307C11.3237 14.1713 11.6526 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 11.6526 14.1713 11.3237 14.0307 11.0299L11.0299 14.0307Z" fill="black" pid="m4lo5rs8-00F4LH2DZYNA" stroke="null"></path>
                <path fill="currentColor" d="M12 5.25C13.0323 5.25 14.0236 5.40934 14.9511 5.68101C15.1296 5.73328 15.1827 5.95662 15.0513 6.0881L14.2267 6.91265C14.1648 6.97451 14.0752 6.99928 13.99 6.97967C13.3506 6.83257 12.6839 6.75 12 6.75C9.71345 6.75 7.61978 7.67292 6.09267 8.84497C5.33078 9.42972 4.72857 10.0626 4.32343 10.6464C3.90431 11.2503 3.75 11.7227 3.75 12C3.75 12.2773 3.90431 12.7497 4.32343 13.3536C4.67725 13.8635 5.18138 14.4107 5.81091 14.9307C5.92677 15.0264 5.93781 15.2015 5.83156 15.3078L5.12265 16.0167C5.03234 16.107 4.88823 16.1149 4.79037 16.0329C4.09739 15.4517 3.51902 14.8255 3.0911 14.2089C2.59937 13.5003 2.25 12.7227 2.25 12C2.25 11.2773 2.59937 10.4997 3.0911 9.79115C3.59681 9.06244 4.31262 8.32028 5.17941 7.65503C6.90965 6.32708 9.31598 5.25 12 5.25Z" fill="black" pid="m4lo5rs8-02CT5B0Y3UOA" stroke="null"></path>
                <path fill="currentColor" d="M12 8.25C12.1185 8.25 12.2357 8.25549 12.3513 8.26624C12.5482 8.28453 12.6194 8.51991 12.4796 8.6597L11.2674 9.87196C10.6141 10.0968 10.0968 10.6141 9.87196 11.2674L8.6597 12.4796C8.51991 12.6194 8.28453 12.5482 8.26624 12.3513C8.25549 12.2357 8.25 12.1185 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25Z" fill="black" pid="m4lo5rs8-028MI5K4V6ZL" stroke="null"></path>
            </svg>
        </div>

    </div>
      <div class="input-header"><span class="label">View Box</span></div>
          <!-- X/Y INPUTS -->
          <div class="row position__inputs--group input-group">
              <!-- X label/input -->
              <div class="input-field x">
                  <span class="label">x</span>
                  <input class="input input-x" type="text" placeholder="xPos" >
              </div>

              <div class="input-field y">
                  <span class="label">y</span>
                  <input class="input input-y" type="text" placeholder="yPos" >
              </div>
          </div>

          <!-- H/W INPUTS -->
          <div class="row position__inputs--group input-group">
              <div class="input-field w">
                      <span class="label">w</span>
                      <input class="input inp-width" type="text" placeholder="width" >
              </div>
              <div class="input-field h">
                      <span class="label">h</span>
                      <input class="input inp-height" type="text" placeholder="height">
              </div>
          </div>

          <!-- FULL VIEWBOX -->
          <!-- <div class="row position__inputs--group">
                  <div class="input-field v">
                      <div class="input">
                          <span class="label">v</span>
                          <input type="text" placeholder="viewBox" class="inp inp-viewBox">
                      </div>
                </div> -->
        </div>
        <!-- HEIGHT WIDTH INPUTS -->
        <div class="input-group">
            <div class="input-header"><span class="label">Dimensions</span></div>
            <div class="dimension__inputs inputs row">
            <div class="row">
                <div class="dimension__inputs-group input-field height">
                    <span class="label">Height</span>
                    <input class="input input-height" type="text" value="40">
                </div>
                <div class="dimension__inputs-group input-field width">
                    <span class="label">Width</span>
                    <input class="input input-width" type="text" value="40">
                </div>
            </div>
            </div>
        </div>

  <!-- SLIDING INPUTS -->
  <div class="position__sliders transform">
      <!-- ZOOM SLIDER -->
      <div class="row position__sliders--group input-group sliding-group">
          <!-- HEADER -->
          <div class="position__sliders--group-header input-header"><span class="label">Zoom</span></div>
          <!-- WRAPPER -->
          <div class="input-field zoom">
              <!-- ICON LABEL -->
              <div class="label">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                      <g>
                          <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="1,12 1,1 12,1"></polyline>
                          <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="12,63 1,63 1,52"></polyline>
                          <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="63,52 63,63 52,63"></polyline>
                          <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="52,1 63,1 63,12 "></polyline>
                          <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="2" x2="22" y2="22"></line>
                          <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="42" y1="42" x2="62" y2="62"></line>
                          <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="62" x2="22" y2="42"></line>
                          <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="42" y1="22" x2="62" y2="2"></line>
                      </g>
                  </svg>
              </div>
              <!-- SLIDER -->
              <div class="slider r-slider" id="zoomSlider">
                  <div class="toggler slider-track">
                      <div class="toggle_button slider-handle" data-role="slider_button"></div>
                  </div>
              </div>
          </div>
      </div>
      <!-- ROTATE SLIDER -->
      <div class="input-group sliding-group rotate">
          <!-- LABEL -->
          <div class="input-header">
              <span class="label">Rotate</span>
          </div>
          <!-- WRAPPER -->
          <div class="input-field rotate">
              <!-- ICON LABEL -->
              <div class="label">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                      <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M32,1C14.879,1,1,14.879,1,32s13.879,31,31,31"></path>
                      <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M32,1c17.121,0,31,13.879,31,31c0,6.713-2.134,12.926-5.759,18l-5.62,5.621"></path>
                      <polyline fill="none" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="51,45 51,56 62,56 "></polyline>
                  </svg>
              </div>
              <!-- SLIDER -->
              <div class="slider r-slider" id="rotationSlider">
                  <div class="toggler slider-track">
                      <div class="toggle_button slider-handle" data-role="slider_button"></div>
                  </div>
              </div>
          </div>
      </div>
  </div>
`
}
