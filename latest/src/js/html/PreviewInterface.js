import { ColorInterface } from "./ColorInterface"
import { ComponentInterface } from "./ComponentInterface"
import { ViewboxInterface } from "./ViewboxInterface"
import { PreviewWindow } from "./PreviewWindow"
export const PreviewInterface = () => {
  return `
    <!-- INTERFACE PREVIEW -->
    <div class="preview interface-window" id="PREVIEW">
    <!-- WINDOW --> 
        <div class="preview-window">
            ${PreviewWindow()}
        </div>
        <!-- MODALS -->  
        <div class="preview__modals modals">
            <div class="preview__modals--modal collections" data-role="window" data-tab="collections">
                <div class="btn-create-collection">create collection</div>
                <div class="synced-collection-names"></div>
            </div>
            <!-- MODAL WRAPPER / Color -->
            <div class="preview__modals--modal modals__modal color" data-role="tab" data-tab="color">
                ${ColorInterface()}
                <div class="save-colorset-modal">
                    <div class="current-colorset"></div>
                </div>
            </div>
            <!-- MODAL WRAPPER / Position -->
            <div class="preview__modals--modal modals__modal position" data-role="tab" data-tab="position">
                ${ViewboxInterface()}
            </div>
            <!-- MODAL WRAPPER / Preview -->
            <div class="preview__modals--modal components" data-role="tab" data-tab="components">
                ${ComponentInterface()}
            </div>
        </div>
        <div class="save-preset-modal">
            <div class="current-preset"></div>
        </div>
        <!-- Color Settings -->
        <div class="color-editor cp-fs icon-color-editor" data-role="interface">
            <div class="modal-header">
                <div class="modal-label">Browse Colors</div>
                <div class="color-editor-tab-container">
                    <div class="preset-option color-editor-tab" tab="icons">Icon <span class="preset-count">0</span></div>
                    <div class="preset-option color-editor-tab" tab="collections">Collection <span class="preset-count">0</span></div>
                    <div class="preset-option color-editor-tab" tab="recent">Recently Used <span class="preset-count">0</span></div>
                </div>
            </div>
            <div class="colorset-modals">
                <div class="color-data color-editor-modal" modal="icons">
                    ...loading icon color presets
                </div>
                <div class="color-data color-editor-modal" modal="collections">
                    ...loading collection color presets
                </div>
                <div class="color-data color-editor-modal" modal="recent">
                    ...loading recent color presets
                </div>
            </div>
        </div>
        <!-- Bench Preview -->
        <!-- Settings -->
        <div class="settings-editor" data-role="interface">
            <div class="settings-modals">
                <div class="preset-display-options">
                    <div class="preset-display-options-label">Browse Presets</div>
                    <div class="pdo-options-container">
                        <div class="preset-option icon" tab="icons">Icon <span class="preset-count">0</span></div>
                        <div class="preset-option collection" tab="collections">Collection <span class="preset-count">0</span></div>
                        <div class="preset-option recent" tab="recent">Recently Used <span class="preset-count">0</span></div>
                    </div>
                </div>
                <div class="settings-modal preset-modal">
                    <div class="settings-tab active" role="tab" modal="icons">...loading icon presets</div>
                    <div class="settings-tab" role="tab" modal="collections">...loading collection presets</div>
                    <div class="settings-tab" role="tab" modal="recent">...loading recent settings</div>
                </div>
            </div>
        </div>
        <!-- Collections -->
        </div>`
}
