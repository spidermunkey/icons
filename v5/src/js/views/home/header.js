const html = `<div class="dashboard__header">
                <div class="info-bar"></div>
                <div class="tool-bar">
                    <div class="home">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="-3 -2 28 28" height="40px" width="40px" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M19.871 12.165l-8.829-9.758c-0.274-0.303-0.644-0.47-1.042-0.47-0 0 0 0 0 0-0.397 0-0.767 0.167-1.042 0.47l-8.829 9.758c-0.185 0.205-0.169 0.521 0.035 0.706 0.096 0.087 0.216 0.129 0.335 0.129 0.136 0 0.272-0.055 0.371-0.165l2.129-2.353v8.018c0 0.827 0.673 1.5 1.5 1.5h11c0.827 0 1.5-0.673 1.5-1.5v-8.018l2.129 2.353c0.185 0.205 0.501 0.221 0.706 0.035s0.221-0.501 0.035-0.706zM12 19h-4v-4.5c0-0.276 0.224-0.5 0.5-0.5h3c0.276 0 0.5 0.224 0.5 0.5v4.5zM16 18.5c0 0.276-0.224 0.5-0.5 0.5h-2.5v-4.5c0-0.827-0.673-1.5-1.5-1.5h-3c-0.827 0-1.5 0.673-1.5 1.5v4.5h-2.5c-0.276 0-0.5-0.224-0.5-0.5v-9.123l5.7-6.3c0.082-0.091 0.189-0.141 0.3-0.141s0.218 0.050 0.3 0.141l5.7 6.3v9.123z">
                            </path>
                        </svg>
                    </div>
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
                    <div class="btn-filter">
                        <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px">
                            <path d="M2.75 6a.75.75 0 000 1.5h18.5a.75.75 0 000-1.5H2.75zM6 11.75a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm4 4.938a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"></path></svg>
                        </span>
                        <span class="label">filter</span>
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
