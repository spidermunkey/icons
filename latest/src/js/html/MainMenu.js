export const MainMenu = () => 
  `<div class="menu-cosm">
    <div class="menu">
        <div class="nav-list">
            <div class="menu-item"><div class="menu-label" type="nav" role="tab" modal="icons">Icons</div></div>
            <div class="menu-item"><div class="menu-label"  type="nav" role="tab" modal="collections">Collections</div></div>
            <div class="menu-item"><div class="menu-label"  type="nav" role="tab" modal="projects">Projects</div></div>
            <div class="menu-item"><div class="menu-label"  type="nav" role="tab" modal="settings">Settings</div></div>
        </div>
        <div class="menu-modals">
            <div class="menu-modal" type="modal" role="tab" modal="collections">
                <div class="menu-list collections-list">collections</div>
            </div>
            <div class="menu-modal" type="modal" role="tab" modal="projects">
                <div class="menu-list project-list">projects</div>
            </div>
            <div class="menu-modal" type="modal" role="tab" modal="settings">
                <div class="menu-list settings-list">settings</div>
            </div>
            <div class="menu-modal" type="modal" role="tab" modal="icons">
                <div class="menu-list icons-list">
                    <div class="menu-list-item" role="tab" modal="all">All</div>
                    <div class="menu-list-item" role="tab" modal="downloads">Downloaded</div>
                    <div class="menu-list-item" role="tab" modal="recent">Recent</div>
                </div>
            </div>
        </div>
        <div class="menu-previews">
            <div class="peek-modal icons" type="preview" modal="icons">
                <div class="peek-modal-labels"></div>
                <div class="peek-modal-icons"></div>
            </div>
            <div class="peek-modal collections" type="preview" modal="collections">
                <div class="peek-modal-labels"></div>
                <div class="peek-modal-icons"></div>
            </div>
            <div class="peek-modal settings" type="preview" modal ="settings">
                <div class="peek-modal-labels"></div>
                <div class="peek-modal-icons"></div>
            </div>
        </div>
    </div>
</div>`
