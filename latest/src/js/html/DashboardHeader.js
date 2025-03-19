export const DashboardHeader = () => 
    ` <div class="dashboard__header">
            <div class="info-bar">
                <div class="info-text">Browse</div>
                <div class="current-tab">Home</div>
                <div class="breadcrumb">Settings</div>
            </div>
            <div class="tool-bar">
                <div class="nav-bar">
                    <a class="home" href="/home" data-link>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="-3 -2 28 28" height="40px" width="40px" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M19.871 12.165l-8.829-9.758c-0.274-0.303-0.644-0.47-1.042-0.47-0 0 0 0 0 0-0.397 0-0.767 0.167-1.042 0.47l-8.829 9.758c-0.185 0.205-0.169 0.521 0.035 0.706 0.096 0.087 0.216 0.129 0.335 0.129 0.136 0 0.272-0.055 0.371-0.165l2.129-2.353v8.018c0 0.827 0.673 1.5 1.5 1.5h11c0.827 0 1.5-0.673 1.5-1.5v-8.018l2.129 2.353c0.185 0.205 0.501 0.221 0.706 0.035s0.221-0.501 0.035-0.706zM12 19h-4v-4.5c0-0.276 0.224-0.5 0.5-0.5h3c0.276 0 0.5 0.224 0.5 0.5v4.5zM16 18.5c0 0.276-0.224 0.5-0.5 0.5h-2.5v-4.5c0-0.827-0.673-1.5-1.5-1.5h-3c-0.827 0-1.5 0.673-1.5 1.5v4.5h-2.5c-0.276 0-0.5-0.224-0.5-0.5v-9.123l5.7-6.3c0.082-0.091 0.189-0.141 0.3-0.141s0.218 0.050 0.3 0.141l5.7 6.3v9.123z">
                            </path>
                        </svg>
                    </a>
                    <!-- MAIN LOGO -->
                    <div class="logo">
                        <!--?xml version="1.0" encoding="utf-8"?-->
                        <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve" height="64px" width="64px">
                            <path d="M8.667,15h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,15,8.667,15z"></path>
                            <path d="M8.667,37h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,37,8.667,37z"></path>
                            <path d="M8.667,26h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,26,8.667,26z"></path>
                        </svg>
                    </div>
                    <div class="search passive-search active">
                        <div class="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" height="16px" width="16px">
                                <path fill-rule="evenodd" d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"></path></svg>
                        </div>
                        <input class="active" type="text" placeholder="Search">
                    </div>
                                    <div class="filter filter-modal">
                        <div class="btn-cancel">
                            <span class="icon">
                                <svg width="24px" height="24px" viewBox="4 5 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m4lw6ve6-01IHH09U9UOO">
                                    <path d="M8.46447 15.5355L15.5355 8.46446" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" pid="m4lw6ve6-01JPIXJRA2BQ" fill="null"></path>
                                    <path d="M8.46447 8.46447L15.5355 15.5355" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" pid="m4lw6ve6-00079WQ8XYP0" fill="null"></path>
                                </svg>
                            </span>
                            <span class="label">cancel search</span>
                        </div>
                    </div>
                </div>
                <div class="panel-settings">
                    <div class="settings-label"> collection settings</div>
                    <div class="settings-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" pid="m1vr1enl-009UGELNY0P0">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.0792L9.7872 5.3687C9.55167 5.61239 9.22729 5.75 8.88839 5.75H5.75V8.88839C5.75 9.2273 5.61239 9.55167 5.3687 9.7872L3.0792 12L5.3687 14.2128C5.61239 14.4483 5.75 14.7727 5.75 15.1116V18.25H8.88839C9.22729 18.25 9.55167 18.3876 9.7872 18.6313L12 20.9208L14.2128 18.6313C14.4483 18.3876 14.7727 18.25 15.1116 18.25H18.25V15.1116C18.25 14.7727 18.3876 14.4483 18.6313 14.2128L20.9208 12L18.6313 9.78721C18.3876 9.55168 18.25 9.2273 18.25 8.8884V5.75H15.1116C14.7727 5.75 14.4483 5.61239 14.2128 5.3687L12 3.0792ZM11.1012 1.85077C11.5926 1.34237 12.4074 1.34237 12.8988 1.85077L15.2177 4.25H18.5C19.1904 4.25 19.75 4.80965 19.75 5.5V8.78234L22.1492 11.1012C22.6576 11.5926 22.6576 12.4074 22.1492 12.8988L19.75 15.2177V18.5C19.75 19.1904 19.1904 19.75 18.5 19.75H15.2177L12.8988 22.1492C12.4074 22.6576 11.5926 22.6576 11.1012 22.1492L8.78233 19.75H5.5C4.80964 19.75 4.25 19.1904 4.25 18.5V15.2177L1.85077 12.8988C1.34237 12.4074 1.34236 11.5926 1.85077 11.1012L4.25 8.78233V5.5C4.25 4.80964 4.80964 4.25 5.5 4.25H8.78233L11.1012 1.85077Z" fill="black" pid="m1vr1enl-02FS7VGI5W4B"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12ZM12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75Z" fill="black" pid="m1vr1enl-02AJOEFIYGW4"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="search-modal">
                <div class="search-input">
                    <input type="text">
                    <!-- <div class="btn-search">go</div> -->
                </div>
                <div class="result-wrapper">
    
                    <div class="search-header">
                        <div class="results"></div>
                        <!-- <div class="advanced">advanced search</div> -->
                        <div class="close">close</div>
                    </div>
                    <div class="content">
                        <div class="bg-image">
                            <img src="./img/no-result-icon-thin-linear-260nw-2088679690.webp" alt="">
                        </div>
                        <div class="mini-preview">
                            <div class="icon-prev"></div>
                            <div class="icon-controls">
                                <div class="btn-copy-icon">copy</div>
                                <div class="btn-edit-icon">edit</div>
                            </div>
    
                            <div class="preview-meta">
                                <div class="icon-name">
                                    <div class="label">Name</div>
                                    <div class="title">...</div>
                                </div>
                                <div class="icon-category">
                                    <div class="label">Category</div>
                                    <div class="title">...</div>
                                </div>
                            </div>
                            <div class="notification-banner">
                                <div class="notification notification-copy success">
                                    <span>Element Copied!</span></div>
                            </div>
                        </div>
                        <div class="content-wrapper"></div>
                    </div>
    
                    <div class="search-footer"></div>
                </div>
                <div class="history-wrapper">
                </div>
            </div>
        </div>`
