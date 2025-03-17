// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"gcbWt":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "3d981e51ffc03c4e";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets, assetsToDispose, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets); // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                } // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle, id) {
    // Execute the module.
    bundle(id); // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            }); // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"gLLPy":[function(require,module,exports) {
var _domHelpersJs = require("./js/utils/DOM-helpers.js");
var _ramda = require("ramda");
var _storeJs = require("./store.js");
var _structsJs = require("./js/utils//Structs.js");
var _previewJs = require("./js/components/preview.js");
var _panelJs = require("./js/components/panel.js");
var _menuListItemJs = require("./js/components/MenuListItem.js");
var _domJs = require("./js/utils/DOM.js");
var _observersJs = require("./js/utils/Observers.js");
console.log("%cICONS -- PORT 2222", "color: yellow; font-family: arial; font-size:20px");
const API_PORT = 1279, store = new (0, _storeJs.SvgModel)(), // modalGroups
CATEGORY_MODALS = new Map(), COLLECTION_MODALS = new Map(), // tabs
menuTabber = new (0, _domJs.Tabber)(), dashBoardTabber = new (0, _domJs.Tabber)(), contextTabber = new (0, _domJs.Tabber)(), previewTabber = new (0, _domJs.Tabber)(), previewActionTabber = new (0, _domJs.Tabber)(), // elements
dashboard = $("#DASHBOARD"), previewElement = $("#PREVIEW"), // menu-list containers
contextMenu = $(".icon-context-menu"), categoryMenu = $("#CATEGORIES .modal__menu--items"), collectionMenu = $("#COLLECTIONS .modal__menu--items"), addToCollectionMenu = $(".add-to-collection .list-of-names", previewElement), createCollectionOverlay = $(".modal.create-collection"), // modals
chooseCollectionPanel = new (0, _domJs.Modal)($(".menu--choose-collection", contextMenu)), showPreviewPanel = new (0, _domJs.Modal)($(".menu--show-previews", contextMenu)), createCollectionModal = new (0, _domJs.Modal)($(".modal.create-collection"));
// modal togglers
chooseCollectionPanel.bindToggler($(".btn-snack.a2c"), contextMenu);
showPreviewPanel.bindToggler($(".btn-snack.qp"), contextMenu);
createCollectionModal.bindToggler($(".menu__actions-button.create-collection")).bindCloser($(".close", createCollectionOverlay), $(".cc-cancel", createCollectionOverlay)).bindTabber(menuTabber).onOpen(showModal).onClose(hideModal);
createCollectionOverlay.addEventListener("click", closeOnClickOutside);
$("form", createCollectionOverlay).onsubmit = async (e1)=>{
    e1.preventDefault();
    let name = String(document.getElementById("cc-name").value);
    console.log(e1);
    console.log(name);
    await app.createCollection(name);
    document.getElementById("cc-name").value = "";
};
// components
let categoryMenuComponent, collectionMenuComponent, addToCollectionComponent;
const modelReady = store.init();
const categoriesReady = createCategoryLinksThenPopulate();
const menuReady = createCollectionLinksThenPopulate();
const app = {
    emitter: new (0, _observersJs.EventEmitter)(),
    state: {
        tab: "",
        group: undefined,
        clicked: undefined,
        context: undefined,
        bench: new (0, _structsJs.Bucket)(),
        mode: "click"
    },
    "updatePreview": ({ event , type , key: key1 , tabName: tabName1  })=>{
        let collection;
        let node;
        console.dir("updating preview with", {
            event,
            type,
            key: key1,
            tabName: tabName1
        });
        // find which bucket the clicked icon came from
        if (type === "category") collection = store.categories[tabName1];
        else if (type === "collection") collection = store.collections[tabName1];
        else if (type === "all") collection = store.all;
        else collection = undefined;
        // console.log(collection)
        if (collection) {
            node = collection.use(key1);
            console.log(node);
            (0, _previewJs.preview).update(node);
            app.state.clicked = node;
            updateFavoriteIcons();
        }
    },
    "updateContext": ({ event , type , key: key1 , tabName: tabName1  })=>{
        let collection, node, isFavorite;
        console.dir("updating context with", {
            event,
            type,
            key: key1,
            tabName: tabName1
        });
        // find which bucket the clicked icon came from
        if (type === "category") collection = store.categories[tabName1];
        else if (type === "collection") collection = store.collections[tabName1];
        else if (type === "all") collection = store.all;
        else {
            console.error("collection undefined");
            return;
        }
        node = collection.use(key1);
        isFavorite = node.isFavorite;
        app.state.context = node;
        console.log(node, "isFavorite:", isFavorite);
    },
    "toggleFavorite": async ()=>{
        if (!undefined.state.context) return;
        let node = undefined.state.context, isFav = node.isFavorite;
        node.isFavorite = !isFav;
        console.dir({
            isfavorite: isFav,
            node,
            kc: node.knownCollections
        });
        await app.save("favorites");
        updateFavoriteIcons();
    },
    "save": async (destination, node = (0, _previewJs.preview).currentIcon)=>{
        console.log("saving to", destination, store.collections[destination]);
        let savingToFavorites = destination === "favorites";
        if (savingToFavorites) node.isFavorite = true;
        node = node.save();
        let { name , rebased  } = node;
        let message = await store.addToCollection({
            destination,
            name: rebased ? rebased : name,
            meta: node,
            onSuccess: (message)=>{
                console.log(message);
                COLLECTION_MODALS.get(destination).notifyChange();
                console.log(COLLECTION_MODALS);
            },
            onFailure: (message)=>console.error(message)
        });
        if (message.success === true) {
            if (savingToFavorites) updateFavoriteIcons();
        }
        return message;
    },
    "handleClick": (event)=>{
        let wrapper = event.target.closest(".svg-wrapper");
        if (!wrapper) return;
        let { name , rebased  } = wrapper.dataset;
        let key1 = rebased ? rebased : name ? name : undefined;
        if (!key1) {
            console.error("this element doesnt have a key");
            return;
        }
        app.updatePreview({
            event,
            type: "category",
            key: key1,
            tabName
        });
    },
    "createCollection": async (name)=>{
        $(".cc-button").innerHTML = `<div class="cc-loader--container"><span>waiting for server</span><div class="cc-loader"></div></div>`;
        await modelReady;
        await menuReady;
        await categoriesReady;
        const success = await store.createCollection(name);
        if (success) {
            console.log("collection successfully created... creating links");
            console.log(menuReady, collectionMenuComponent);
            const cLink = collectionMenuComponent.addItem(name);
            const a2cLink = addToCollectionComponent.addItem(name, 0);
            console.log("added", cLink, "to", collectionMenuComponent);
            console.log("added", a2cLink.element, "to", addToCollectionComponent);
            // Create Dynamic Modal For Newly created links inside menu
            const panel = document.createElement("div");
            const tabName1 = cLink.dataset.tab;
            panel.classList.add("dashboard__modal");
            panel.dataset.tab = tabName1;
            dashboard.appendChild(panel);
            panel.addEventListener("mousedown", (event)=>{
                let wrapper = event.target.closest(".svg-wrapper");
                if (!wrapper) return;
                let { name , rebased  } = wrapper.dataset;
                key = rebased ? rebased : name;
                app.updatePreview({
                    event: e,
                    type: "collection",
                    key,
                    tabName: tabName1
                });
            });
            const modal = new (0, _domJs.DynamicModal)(panel, {
                type: "lazy",
                endpoint: resolveCollectionEndpoint(tabName1),
                dataHandler: (0, _panelJs.DashboardPanel)
            });
            modal.bindOpener(cLink).bindTabber(dashBoardTabber).onOpen(showModal).onClose(hideModal);
            a2cLink.element.addEventListener("click", ()=>app.save(name));
            COLLECTION_MODALS.set(tabName1, modal);
            console.log("closing", createCollectionModal);
            $(".cc-button").innerHTML = `Create Collection`;
            createCollectionModal.close();
        }
    }
};
// preview.init
$(".btn-border").onclick = ()=>(0, _previewJs.preview).toggleBorder();
$(".btn-copy").onclick = ()=>(0, _previewJs.preview).copyToClipboard();
$(".btn-favit").onclick = ()=>app.save("favorites");
$(".btn-snack.favit").onclick = ()=>app.toggleFavorite();
intializeAllTab();
initializeContextMenu();
// init sidebar tab functionality
$$(".sidebar .tab[data-type='nested']").map((group)=>{
    const tButton = $(".tab__button", group), tModal = $(".tab__modal", group), tCloser = $(".btn.close-modal", tModal), modal = new (0, _domJs.Modal)(tModal);
    if (tCloser) modal.bindCloser(tCloser);
    modal.bindOpener(tButton).bindTabber(menuTabber).onOpen(showModal).onClose(hideModal);
});
// init contextmenu tab functionality
[
    chooseCollectionPanel,
    showPreviewPanel
].forEach((modal)=>{
    modal.bindTabber(contextTabber).onOpen(function openNearMouseClick(event) {
        // MOUSE COORDS
        let { clientX , clientY  } = event, // WIN DIMS
        { innerWidth , innerHeight  } = window, // COMP DIMS
        { height , width  } = this.element.getBoundingClientRect(), // BUFFER HEIGHT
        snackBarSize = 90;
        let noRoomForWindowRight = innerWidth - clientX < height + snackBarSize, noRoomForWindowBottom = innerHeight - clientY < width + snackBarSize, windowIsVertical = this.element.parentElement.parentElement.classList.contains("vert");
        if (windowIsVertical && noRoomForWindowRight) this.element.parentElement.classList.add("left");
        else if (!windowIsVertical && noRoomForWindowBottom) this.element.parentElement.classList.add("top");
        this.element.parentElement.classList.add("active");
        this.element.classList.add("active-bottom");
    });
});
// init preview tab functionality
$$('.preview__modals > [data-role="tab"]', previewElement).map((modal)=>{
    const tabName1 = modal.dataset.tab, tModal = new (0, _domJs.Modal)(modal), tabber = $(`.preview__tabber--tab[data-tab="${tabName1}"]`);
    tModal.bindOpener(tabber).bindTabber(previewTabber).onOpen(function() {
        tabber.classList.add("active");
        this.element.classList.add("active");
    }).onClose(function() {
        tabber.classList.remove("active");
        this.element.classList.remove("active");
    });
    if (tabName1 == "position") tModal.open();
});
// init preview action "sub-tabs"
$$(".preview-action__window").map((modal)=>{
    const tabName1 = modal.dataset.tab, tModal = new (0, _domJs.Modal)(modal), tabber = $(`.preview-action__button[data-tab="${tabName1}"]`);
    tModal.bindOpener(tabber).bindTabber(previewActionTabber).onOpen(function() {
        tabber.classList.add("active");
        this.element.classList.add("active");
    }).onClose(function() {
        tabber.classList.remove("active");
        this.element.classList.remove("active");
    });
});
async function createCategoryLinksThenPopulate() {
    // get list of names from db
    const cNames = await store.getCategoryNames(), sorted = cNames.sort(), categoryMenuComponent = new (0, _menuListItemJs.MenuList)(cNames);
    categoryMenuComponent.appendTo(categoryMenu);
    categoryMenuComponent.links.forEach((link)=>{
        // Create Dynamic Modal For Newly created links inside menu
        const panel = _domHelpersJs.divit(), tabName1 = link.dataset.tab, modal = new (0, _domJs.DynamicModal)(panel, {
            type: "eager",
            endpoint: resolveCategoryEndpoint(tabName1),
            dataHandler: (0, _panelJs.DashboardPanel)
        });
        dashboard.appendChild(panel);
        panel.classList.add("dashboard__modal");
        panel.dataset.tab = tabName1;
        panel.dataset.type = "category";
        panel.addEventListener("mousedown", handleModalClick("category", tabName1));
        modal.bindOpener(link).bindTabber(dashBoardTabber).onOpen(showModal).onClose(hideModal);
        CATEGORY_MODALS.set(tabName1, modal);
    });
    return true;
}
async function createCollectionLinksThenPopulate() {
    // get list of names from db
    const names = await store.getCollectionNames();
    collectionMenuComponent = new (0, _menuListItemJs.MenuList)(names);
    collectionMenuComponent.appendTo(collectionMenu);
    collectionMenuComponent.cloneTo(chooseCollectionPanel.element);
    collectionMenuComponent.links.forEach((link)=>{
        // Create Dynamic Modal For Newly created links inside menu
        const panel = document.createElement("div");
        const tabName1 = link.dataset.tab;
        panel.classList.add("dashboard__modal");
        panel.dataset.tab = tabName1;
        panel.dataset.type = "collection";
        dashboard.appendChild(panel);
        panel.addEventListener("mousedown", handleModalClick("collection", tabName1));
        const modal = new (0, _domJs.DynamicModal)(panel, {
            type: "lazy",
            endpoint: resolveCollectionEndpoint(tabName1),
            dataHandler: (0, _panelJs.DashboardPanel)
        });
        modal.bindOpener(link).bindTabber(dashBoardTabber).onOpen(showModal).onClose(hideModal);
        COLLECTION_MODALS.set(tabName1, modal);
    });
    await modelReady;
    addToCollectionComponent = new (0, _menuListItemJs.A2CMenuList)([]);
    addToCollectionMenu.innerHTML = "";
    names.map((name)=>{
        let collectionSize = store.collections[name].size;
        let link = addToCollectionComponent.addItem(name, collectionSize);
        link.element.addEventListener("click", ()=>app.save(name));
    });
    addToCollectionComponent.appendTo(addToCollectionMenu);
    return true;
}
async function intializeAllTab() {
    const tabName1 = "all", frag = _domHelpersJs.frag(), dash = _domHelpersJs.divit();
    frag.appendChild(dash);
    dash.classList.add("dashboard__modal");
    dash.dataset.tab = "all";
    dash.dataset.type = "all";
    dash.addEventListener("mousedown", handleModalClick("all", "all"));
    const modal = new (0, _domJs.DynamicModal)(dash, {
        type: "eager",
        endpoint: resolveCategoryEndpoint("all"),
        dataHandler: (0, _panelJs.DashboardPanel)
    });
    // add event listener to link button
    modal.bindOpener(document.getElementById("HOME")).bindTabber(dashBoardTabber).onOpen(showModal).onClose(hideModal).open();
    dashboard.prepend(frag);
    CATEGORY_MODALS.set("all", modal);
}
function initializeAddToCollectionModal() {}
function initializeContextMenu() {
    chooseCollectionPanel.bindToggler($(".btn-snack.a2c"), contextMenu);
    showPreviewPanel.bindToggler($(".btn-snack.qp"), contextMenu);
    _ramda.forEach((modal)=>{
        modal.bindTabber(contextTabber);
        modal.openTimeLine.subscribe(function(e1) {
            // MOUSE COORDS
            let { clientX , clientY  } = e1;
            // WIN DIMS
            let { innerWidth , innerHeight  } = window;
            // COMP DIMS
            let { height , width  } = this.element.getBoundingClientRect();
            // BUFFER HEIGHT
            let snackBarSize = 90;
            const noRoomForWindowRight = innerWidth - clientX < height + snackBarSize;
            const noRoomForWindowBottom = innerHeight - clientY < width + snackBarSize;
            const windowIsVertical = this.element.parentElement.parentElement.classList.contains("vert");
            if (windowIsVertical && noRoomForWindowRight) this.element.parentElement.classList.add("left");
            else if (!windowIsVertical && noRoomForWindowBottom) this.element.parentElement.classList.add("top");
            this.element.parentElement.classList.add("active");
            this.element.classList.add("active-bottom");
        });
        modal.closeTimeLine.subscribe(function(e1) {
            this.element.parentElement.classList.remove("left", "top");
            this.element.parentElement.classList.remove("active");
            this.element.classList.remove("active-bottom");
        });
    }, [
        chooseCollectionPanel,
        showPreviewPanel
    ]);
    contextMenu.addEventListener("contextmenu", (e1)=>e1.preventDefault());
    dashboard.addEventListener("contextmenu", (e1)=>{
        let wrapper = e1.target.closest(".svg-wrapper");
        if (!wrapper) return;
        let { name , rebased  } = wrapper.dataset;
        let key1 = rebased ? rebased : name ? name : undefined;
        if (!key1) {
            console.error("this element doesnt have a key");
            return;
        }
        e1.preventDefault();
        const width = Number(getComputedStyle(contextMenu).getPropertyValue("width").split("p")[0]);
        contextMenu.style.top = `${e1.clientY - 25}px`;
        contextMenu.style.left = `${e1.clientX - width / 2 - 48}px`;
        contextMenu.classList.add("active");
        contextMenu.addEventListener("mouseleave", ()=>{
            contextTabber.closeActive();
            contextMenu.classList.remove("active");
        });
    });
}
function onDashboardClick(event) {
    let wrapper = event.target.closest(".svg-wrapper");
    if (!wrapper) return;
    let { name , rebased  } = wrapper.dataset;
    let key1 = rebased ? rebased : name ? name : undefined;
    if (!key1) {
        console.error("this element doesnt have a key");
        return;
    }
    // app.broadcast('icon clicked',{ event, type:'all', key, tabName })
    app.updatePreview({
        event,
        type: "category",
        key: key1,
        tabName
    });
}
function showModal() {
    this.element.classList.add("active");
    // app.emit('Tab Open)
    app.state.tab = this.element.dataset.tab;
    app.state.type = this.element.type;
}
function hideModal() {
    this.element.classList.remove("active");
    // app.emit('Tab Closed')
    app.state.tab = undefined;
    app.state.type = undefined;
}
function handleModalClick(type, tabName1) {
    return function(event) {
        let wrapper = event.target.closest(".svg-wrapper");
        if (!wrapper) return;
        let { name , rebased  } = wrapper.dataset;
        let key1 = rebased ? rebased : name;
        if (!key1) {
            console.error("this element doesnt have a key");
            return;
        }
        const meta = {
            event,
            type,
            key: key1,
            tabName: tabName1
        };
        const ctrlClick = event.ctrlKey;
        const rightClick = event.buttons === 2;
        const leftClick = event.buttons === 1;
        if (leftClick && ctrlClick) {
            // app.toggleBench(meta)
            console.log("control click");
            return; // app.toggleBench();
        } else if (rightClick) {
            console.log("right click");
            app.updateContext(meta);
            return; // app.updateContext();
        } else if (leftClick) {
            console.log("left click");
            app.updatePreview(meta);
            return;
        }
    };
}
function updateFavoriteIcons() {
    if (app.state.context && app.state.context.isFavorite) $(".btn-snack.favit").classList.add("icon-is-favorite");
    else $(".btn-snack.favit").classList.remove("icon-is-favorite");
    if ((0, _previewJs.preview).currentIcon.isFavorite || (0, _previewJs.preview).currentIcon.knownCollections.includes("favorites")) $(".btn-favit").classList.add("icon-is-favorite");
    else $(".btn-favit").classList.remove("icon-is-favorite");
}
function initCOSM() {
    document.addEventListener("click", closeOnClickOutside);
}
function closeCOSM() {
    document.removeEventListener("click", closeOnClickOutside);
}
function closeOnClickOutside(e1) {
    console.log(e1.target.closest(".create-collection__form"));
    if (!e1.target.closest(".create-collection__form")) createCollectionModal.close();
}
function resolveEP(ep) {
    return `http://localhost:${API_PORT}/icons/${ep}`;
}
function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`collections/${categoryName}`);
}
function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`);
}

},{"./store.js":"d8qyu","./js/components/preview.js":"6CzCI","./js/components/panel.js":"jYair","./js/components/MenuListItem.js":"34b3R","./js/utils/DOM.js":"eC8U0","./js/utils/DOM-helpers.js":"e6U0L","ramda":"2eWAO","./js/utils//Structs.js":"62IGe","./js/utils/Observers.js":"4cTQY"}],"d8qyu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SvgModel", ()=>SvgModel) // function deepClone(obj, hash = new WeakMap()) {
 //     if (Object(obj) !== obj) return obj; // primitives
 //     if (hash.has(obj)) return hash.get(obj); // cyclic reference
 //     const result = obj instanceof Set ? new Set(obj) // See note about this!
 //                  : obj instanceof Map ? new Map(Array.from(obj, ([key, val]) => 
 //                                         [key, deepClone(val, hash)])) 
 //                  : obj instanceof Date ? new Date(obj)
 //                  : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
 //                  // ... add here any specific treatment for other classes ...
 //                  // and finally a catch-all:
 //                  : obj.constructor ? new obj.constructor() 
 //                  : Object.create(null);
 //     hash.set(obj, result);
 //     return Object.assign(result, ...Object.keys(obj).map(
 //         key => ({ [key]: deepClone(obj[key], hash) }) ));
 // }
;
var _domHelpersJs = require("./js/utils/DOM-helpers.js");
var _collection = require("./js/utils/structs/Collection");
var _collectionDefault = parcelHelpers.interopDefault(_collection);
var _apiJs = require("./API.js");
var _apiJsDefault = parcelHelpers.interopDefault(_apiJs);
var _iconJs = require("./js/utils/structs/Icon.js");
class SvgModel {
    constructor(){
        this.duplicates = {};
        this.dupeCount = 0;
        this.all = new (0, _collectionDefault.default)();
        this.categorySet = new Set();
        this.categories = {};
        this.collectionSet = new Set(), this.collections = {};
        this.state = {};
        this.ready = false;
    }
    // Populating Collections with deep copies
    async createCollection(name) {
        console.log("creating collection", name);
        if (typeof name != "string") {
            console.error("type of collection name must be a string... got:" + typeof name);
            return "name must be a string";
        }
        if (this.collectionSet.has(name)) {
            console.error("tried to create collection by the name of", name, "but it already exists");
            return "name already exist, choose a different collection name";
        }
        this.collectionSet.add(name);
        const collection = new (0, _collectionDefault.default)();
        this.collections[name] = collection;
        console.log("collection optimistically created... communicating with server", collection, this.collections[name]);
        const res = await (0, _apiJsDefault.default).createCollection(name);
        console.log(res);
        return collection;
    }
    removeCollection(name) {
        delete this.collections[name];
    }
    checkCollection(dest, key) {
        return this.collections[dest].has(key);
    }
    async addToCollection({ destination , name , meta , onSuccess , onFailure  }) {
        let collection = this.collections[destination];
        if (!collection) {
            console.log("collection doesnt exist... creating it now");
            collection = await this.createCollection(destination);
            if (typeof collection == "string") {
                const message = {
                    message: `error creating collection: ${collection}`,
                    success: false,
                    reason: "unknown",
                    from: "VM"
                };
                if (onFailure) onFailure(message);
                return message;
            }
        } else if (this.collections[destination].has(name)) {
            const message = {
                message: "this name already exists",
                success: false,
                reason: "duplicate name",
                from: "VM"
            };
            if (onFailure) onFailure(message);
            return message;
        }
        let copy = meta.save();
        if (destination === "favorites") {
            meta.isFavorite = true;
            copy.isFavorite = true;
            copy.observer.isFavorite = true;
        }
        meta.knownCollections.push(destination);
        copy.category = destination;
        copy.observer.category = destination;
        const addedToViewModel = collection.add(name, copy);
        if (!addedToViewModel) {
            const message = {
                message: "something went wrong with optimistic update",
                success: false,
                reason: "could not be added to viewModel",
                from: "VM"
            };
            if (onFailure) onFailure(message);
            return message;
        }
        console.log("optimistic update successful... asynchronously adding to database now");
        const res = (0, _apiJsDefault.default).addToCollection(destination, copy, meta);
        console.log(res);
        const message = {
            message: "optimistic update successful... asynchronously adding to database now",
            success: true,
            promise: res,
            size: collection.size
        };
        if (onSuccess) onSuccess(message);
        return message;
    }
    addManyToCollection(collection, array) {
        array.forEach((obj)=>{
            const { name , rebased  } = obj;
            // console.log('adding',collection,'as a known collection to',name)
            const node = new (0, _iconJs.IconNode)(obj);
            node.knownCollections.push(collection);
            this.collections[collection].add(rebased ? rebased : name, node);
        });
        console.log("finished adding", array, "to", collection);
    }
    removeFromCollection(name, collection) {
        this.collections[collection].remove(name);
    }
    // calls to api
    async getCategoryNames() {
        return (0, _apiJsDefault.default).getCategoryNames();
    }
    async getCollectionNames() {
        const names = await (0, _apiJsDefault.default).getCollectionNames();
        console.log("NAMES", names);
        return names;
    }
    async init() {
        var data;
        // const conn = await API.ping();
        // console.log(conn)
        // if (!conn) {
        //     console.log('%cICONS -- PORT=OFFLINE ... connection refused', "color: orange; font-family: arial; font-size:20px")
        //     var data = await fetch('./data/icons.json')            
        //         .then((res) => { 
        //             console.log(res)
        //             const data = JSON.parse(res);
        //             console.log('DATA',data)
        //             return res.json()})
        //         .then((data) => {
        //             console.log('DATA',data)
        //             data.forEach(el => {
        //                 list.push(el)
        //                 // console.log(el);
        //             })})
        //     console.log(data,'here')
        //     return {}
        // }
        var { data  } = await (0, _apiJsDefault.default).getCategory("all");
        let icons = data[0].icons;
        console.log("DATA", data);
        // setting static properties
        // and building the dataset
        for(let i = 0; i < icons.length; i++){
            let backpack = icons[i];
            // element props
            let key = backpack.name;
            // let obj = Object.create(IconProto)
            let meta = new (0, _iconJs.IconNode)(backpack);
            // let meta = Object.assign(obj,props);
            // Populate Categories with orignal references
            if (!this.categorySet.has(meta.category)) {
                // keeping track of different categories
                this.categorySet.add(meta.category);
                this.categories[meta.category] = new (0, _collectionDefault.default)();
            }
            // handling duplicate names
            if (this.all.has(key)) {
                // if known duplicate doesn't exist create an object for it
                if (!this.duplicates.hasOwnProperty(key)) {
                    this.duplicates[key] = {
                        count: 1,
                        categoryCount: 0,
                        dupes: new Map()
                    };
                    // setting the existing element first
                    this.duplicates[key].dupes.set(key, this.all.use(key));
                }
                // then the new element with a modified name
                let newKey = `${key}--${meta.category}`;
                // handling duplicates withing categories
                if (this.duplicates[key].dupes.has(newKey)) // console.log('category dupe found!')
                newKey = `${newKey}--${++this.duplicates[key].categoryCount + 1}`;
                // add a property showing that the name has been modified
                meta.rebased = newKey;
                // proceed mapping operations
                this.duplicates[key].dupes.set(newKey, meta);
                this.all.add(newKey, meta);
                this.categories[meta.category].add(newKey, meta);
                // update count
                this.duplicates[key].count = this.duplicates[key].count + 1;
                this.dupeCount++;
            } else {
                // ...otherwise
                this.all.add(key, meta);
                this.categories[meta.category].add(key, meta);
            }
        }
        // set property indicating if svgs of the same name exist
        if (this.dupeCount > 0) {
            for(let name in this.duplicates)this.duplicates[name].dupes.forEach((value)=>{
                // setting a reference back to all the icons of the same name
                value.others = this.duplicates[name];
                if (this.duplicates[name].categoryCount > 0) value.othersInSameCategory = this.duplicates[name].categoryCount;
            });
            function log_duplicates() {
            // console.log('found',this.dupeCount,'duplicates');
            // console.log('here they are', this.duplicates);
            }
        }
        const userCollections = await this.getCollectionNames();
        for (const name of userCollections){
            this.collectionSet.add(name);
            const collection = new (0, _collectionDefault.default)();
            this.collections[name] = collection;
            const { data  } = await (0, _apiJsDefault.default).getCollection(name);
            if (data[0]?.icons.length > 0) {
                console.log("DAT", data[0].icons);
                this.addManyToCollection(name, data[0].icons);
            }
        }
        this.ready = true;
        console.log(this);
        return this;
    }
    async update() {
        const { data  } = await (0, _apiJsDefault.default).getCategory("all");
    }
    async updateCollection(name) {
        if (store.collections[name]) {
            const { data  } = await (0, _apiJsDefault.default).getCollection(name);
            const collection = store.collections[name];
            collection.drop();
            addManyToCollection(collection, data);
        }
    }
}

},{"./js/utils/DOM-helpers.js":"e6U0L","./js/utils/structs/Collection":"ikjnb","./API.js":"a6bNq","./js/utils/structs/Icon.js":"g6IEx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ikjnb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bucketJs = require("./Bucket.js");
var _cursorJs = require("./Cursor.js");
class Collection {
    constructor(){
        this.bucket = new (0, _bucketJs.Bucket)();
        this.cursor = new (0, _cursorJs.Cursor)([]);
        this.indexes = {};
    }
    get size() {
        return this.items.size;
    }
    get keys() {
        return this.bucket.keys;
    }
    get values() {
        return this.bucket.values;
    }
    get items() {
        return this.bucket.items;
    }
    use(key) {
        return this.bucket.use(key);
    }
    useValue(key) {
        return this.bucket.useValue(key);
    }
    add(key, value) {
        let status = this.bucket.push(key, value);
        if (status === "success") this.cursor.addOne(key);
        return status;
    }
    spread(map) {
        let status = this.bucket.spread(map);
        if (status) this.cursor.spread(Array.from(map.keys()));
        return status;
    }
    has(key) {
        return this.bucket.has(key);
    }
    remove(key) {
        let status = this.bucket.pluck(key);
        if (status) this.cursor.pluck(this.items.useKeys().indexOf(key));
    }
    drop() {
        this.items = new (0, _bucketJs.Bucket)();
        this.cursor = new (0, _cursorJs.Cursor)([]);
    }
}
exports.default = Collection;

},{"./Bucket.js":"d3Iuv","./Cursor.js":"lvUnV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d3Iuv":[function(require,module,exports) {
/*
    Holds references, trying to be fancy creating my own datastructure

*/ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Bucket", ()=>Bucket);
class Bucket {
    constructor(){
        this.items = new Map();
        this.identity = "bucket";
        this.idn = 0;
    }
    get size() {
        return this.items.size;
    }
    get keys() {
        return Array.from(this.items.keys());
    }
    get values() {
        return Array.from(this.items.values());
    }
    get copies() {
        return Array.from(this.items.values()).map(structuredClone);
    }
    push(key, value) {
        if (!key) return `item not pushed bucket... invalid key`;
        if (!value) return `item not pushed to bucket... invalid value`;
        if (this.items.has(key)) return `item not pushed to bucket... duplicate key`;
        this.items.set(key, value);
        return "success";
    }
    pluck(key) {
        return this.items.delete(key);
    }
    has(key) {
        return this.items.has(key);
    }
    use(key) {
        return this.items.get(key);
    }
    useValue(key) {
        return structuredClone(this.items.get(key));
    }
    spread(map) {
        let duplicates = this.compare(map);
        if (duplicates.length > 0) {
            console.error(`${duplicates.length} duplicates found in the keyset. No items were added`, duplicates);
            return duplicates;
        }
        map.forEach((value, key)=>this.push(key, value));
        return this;
    }
    compare(map) {
        return Array.from(map.keys()).filter(this.has);
    }
    wipe() {
        this.items = new Map();
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lvUnV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Cursor", ()=>Cursor);
class Cursor {
    // Allows extends a basic array allowing easy access to the next and previous elements in a list 
    // according to a pointer in memory
    // EXPECTS INDEXES TO START FROM 1 INSTEAD OF ZERO
    // INDEX OF 0 == "FIRST"
    // INDEX OF length-1 = "LAST"
    // expects callers to add one when using array indexes 
    constructor(array, startingIndex = 1){
        if (!Array.isArray(array)) throw new Error(`Cursor instance canceled... was expecting an array you passed ${array}`);
        else if (isNaN(startingIndex)) throw new Error(`Cursor instance canceled.... expecting a number for startingIndex you passed ${startingIndex}`);
        let pointer;
        let items;
        if (startingIndex !== 0 && startingIndex < array.length - 1) this.pointer = startingIndex;
        if (array.length === 1 || array.length === 0) this.pointer = 1;
        this.items = [
            "first",
            ...array,
            "last"
        ];
    }
    get first() {
        return this.items[1];
    }
    get last() {
        return this.items[this.items.length - 2];
    }
    get next() {
        return this.items[this.pointer + 1];
    }
    get prev() {
        return this.items[this.pointer - 1];
    }
    get current() {
        return this.items[this.pointer];
    }
    get all() {
        return this.items.filter((index)=>index !== "first" && index !== "last");
    }
    get size() {
        return this.items.length - 2;
    }
    get isEmpty() {
        return this.size === 0;
    }
    validIndex(index) {
        if (isNaN(index)) return NaN;
        // console.log(`\nskip function was expecting a number... you passed ${index}`)
        if (index > this.size || index < 0) return undefined;
        // console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 0 to ${this.size}\n`);
        return true;
    }
    setPointer(index) {
        if (!this.validIndex(index)) return;
        this.pointer = index;
        return this.items[index];
    }
    skipToIndex(index) {
        if (!this.validIndex(index)) return;
        return this.setPointer(index);
    }
    getIndexOf(index) {
        if (!this.validIndex(index)) return;
        return this.items[index];
    }
    skipToNext() {
        if (this.next == "last") return this.setPointer(1);
        return this.setPointer(this.pointer + 1);
    }
    skipToPrev() {
        if (this.prev == "first") return this.setPointer(this.size);
        return this.setPointer(this.pointer - 1);
    }
    skipToLast() {
        return this.setPointer(this.size);
    }
    skipToFirst() {
        return this.setPointer(1);
    }
    pluck(index) {
        this.items = this.items.splice(index + 1, 1);
        return this;
    }
    addOne(element) {
        this.items.pop();
        this.items.push(element);
        this.items.push("last");
        return this;
    }
    addMany(elements) {
        this.items.pop();
        this.items.push(...elements);
        this.items.push("last");
        return this;
    }
    update(elements, startingIndex = 1) {
        let index = this.validateCursor(elements, startingIndex);
        if (index) {
            this.pointer = index;
            this.items = [
                "first",
                ...elements,
                "last"
            ];
        }
        return this;
    }
    nthSuffix(num) {
        if (!isNaN(num)) {
            let n = num;
            let suff;
            if (num > 20) {
                // convert to string
                let d = num.toString();
                // grab the last digit
                n = d[d.length - 1];
            }
            n == 1 ? suff = "st" : n == 2 ? suff = "nd" : n == 3 ? suff = "rd" : suff = "th";
            return num.toString() + suff;
        }
        return `this function expects numbers`;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"a6bNq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _ramda = require("ramda");
var _ramdaDefault = parcelHelpers.interopDefault(_ramda);
const PORT = 1279;
// FETCH
async function ping() {
    try {
        console.log("pinging server");
        (0, _axiosDefault.default).get("http://localhost/1279");
    } catch (e) {
        console.log("connection failed");
        return null;
    }
}
function resolveEP(ep) {
    return `http://localhost:${PORT}/icons/${ep}`;
}
function resolveCategoryEndpoint(categoryName) {
    return resolveEP(`collections/${categoryName}`);
}
function resolveCollectionEndpoint(collectionName) {
    return resolveEP(`collections/${collectionName}`);
}
async function getCategoryNames() {
    try {
        const collections = await (0, _axiosDefault.default).get(`http://localhost:${PORT}/icons/info/collections`);
        console.log(collections.data);
        return [
            ...collections.data
        ].filter((name)=>name !== "test");
    } catch (e) {
        console.log("error fetching category names");
        console.log("REQUESTING OFFLINE SERVICE");
        return [];
    }
}
async function getCollectionNames() {
    try {
        const collections = await (0, _axiosDefault.default).get(`http://localhost:${PORT}/icons/info/collections`);
        console.log(collections.data);
        return [
            ...collections.data
        ].filter((name)=>name !== "test");
    } catch (e) {
        console.log("error fetching collection names");
        console.log("REQUESTING OFFLINE SERVICE");
        return [];
    }
}
async function createCollection(title) {
    const response = await (0, _axiosDefault.default).post(resolveEP(`/collections/create`), {
        payload: {
            name: title
        }
    });
    return response;
}
async function getCollection(title) {
    const response = await (0, _axiosDefault.default).get(resolveCollectionEndpoint(`${title}`));
    return response;
}
async function getCategory(title) {
    try {
        const response = await (0, _axiosDefault.default).get(resolveCategoryEndpoint(`${title}`));
        return response;
    } catch (e) {
        console.log("error fetching category data", e);
        console.log("requesting offline service...");
        return [];
    }
}
async function addToCollection(title, props, original) {
    const { data  } = await (0, _axiosDefault.default).post(resolveCollectionEndpoint(title), {
        payload: {
            props,
            original
        }
    });
    console.log(data);
}
const dropCollection = ()=>"no";
const api = {
    ping,
    getCollectionNames,
    getCategoryNames,
    createCollection,
    addToCollection,
    getCollection,
    getCategory
};
exports.default = api;

},{"axios":"jo6P5","ramda":"2eWAO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jo6P5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _axiosJsDefault.default));
parcelHelpers.export(exports, "Axios", ()=>Axios);
parcelHelpers.export(exports, "AxiosError", ()=>AxiosError);
parcelHelpers.export(exports, "CanceledError", ()=>CanceledError);
parcelHelpers.export(exports, "isCancel", ()=>isCancel);
parcelHelpers.export(exports, "CancelToken", ()=>CancelToken);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
parcelHelpers.export(exports, "all", ()=>all);
parcelHelpers.export(exports, "Cancel", ()=>Cancel);
parcelHelpers.export(exports, "isAxiosError", ()=>isAxiosError);
parcelHelpers.export(exports, "spread", ()=>spread);
parcelHelpers.export(exports, "toFormData", ()=>toFormData);
parcelHelpers.export(exports, "AxiosHeaders", ()=>AxiosHeaders);
parcelHelpers.export(exports, "HttpStatusCode", ()=>HttpStatusCode);
parcelHelpers.export(exports, "formToJSON", ()=>formToJSON);
parcelHelpers.export(exports, "mergeConfig", ()=>mergeConfig);
var _axiosJs = require("./lib/axios.js");
var _axiosJsDefault = parcelHelpers.interopDefault(_axiosJs);
// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const { Axios , AxiosError , CanceledError , isCancel , CancelToken , VERSION , all , Cancel , isAxiosError , spread , toFormData , AxiosHeaders , HttpStatusCode , formToJSON , mergeConfig  } = (0, _axiosJsDefault.default);

},{"./lib/axios.js":"63MyY","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"63MyY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _bindJs = require("./helpers/bind.js");
var _bindJsDefault = parcelHelpers.interopDefault(_bindJs);
var _axiosJs = require("./core/Axios.js");
var _axiosJsDefault = parcelHelpers.interopDefault(_axiosJs);
var _mergeConfigJs = require("./core/mergeConfig.js");
var _mergeConfigJsDefault = parcelHelpers.interopDefault(_mergeConfigJs);
var _indexJs = require("./defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _formDataToJSONJs = require("./helpers/formDataToJSON.js");
var _formDataToJSONJsDefault = parcelHelpers.interopDefault(_formDataToJSONJs);
var _canceledErrorJs = require("./cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _cancelTokenJs = require("./cancel/CancelToken.js");
var _cancelTokenJsDefault = parcelHelpers.interopDefault(_cancelTokenJs);
var _isCancelJs = require("./cancel/isCancel.js");
var _isCancelJsDefault = parcelHelpers.interopDefault(_isCancelJs);
var _dataJs = require("./env/data.js");
var _toFormDataJs = require("./helpers/toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _axiosErrorJs = require("./core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _spreadJs = require("./helpers/spread.js");
var _spreadJsDefault = parcelHelpers.interopDefault(_spreadJs);
var _isAxiosErrorJs = require("./helpers/isAxiosError.js");
var _isAxiosErrorJsDefault = parcelHelpers.interopDefault(_isAxiosErrorJs);
var _axiosHeadersJs = require("./core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _httpStatusCodeJs = require("./helpers/HttpStatusCode.js");
var _httpStatusCodeJsDefault = parcelHelpers.interopDefault(_httpStatusCodeJs);
"use strict";
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */ function createInstance(defaultConfig) {
    const context = new (0, _axiosJsDefault.default)(defaultConfig);
    const instance = (0, _bindJsDefault.default)((0, _axiosJsDefault.default).prototype.request, context);
    // Copy axios.prototype to instance
    (0, _utilsJsDefault.default).extend(instance, (0, _axiosJsDefault.default).prototype, context, {
        allOwnKeys: true
    });
    // Copy context to instance
    (0, _utilsJsDefault.default).extend(instance, context, null, {
        allOwnKeys: true
    });
    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
        return createInstance((0, _mergeConfigJsDefault.default)(defaultConfig, instanceConfig));
    };
    return instance;
}
// Create the default instance to be exported
const axios = createInstance((0, _indexJsDefault.default));
// Expose Axios class to allow class inheritance
axios.Axios = (0, _axiosJsDefault.default);
// Expose Cancel & CancelToken
axios.CanceledError = (0, _canceledErrorJsDefault.default);
axios.CancelToken = (0, _cancelTokenJsDefault.default);
axios.isCancel = (0, _isCancelJsDefault.default);
axios.VERSION = (0, _dataJs.VERSION);
axios.toFormData = (0, _toFormDataJsDefault.default);
// Expose AxiosError class
axios.AxiosError = (0, _axiosErrorJsDefault.default);
// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;
// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = (0, _spreadJsDefault.default);
// Expose isAxiosError
axios.isAxiosError = (0, _isAxiosErrorJsDefault.default);
// Expose mergeConfig
axios.mergeConfig = (0, _mergeConfigJsDefault.default);
axios.AxiosHeaders = (0, _axiosHeadersJsDefault.default);
axios.formToJSON = (thing)=>(0, _formDataToJSONJsDefault.default)((0, _utilsJsDefault.default).isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = (0, _httpStatusCodeJsDefault.default);
axios.default = axios;
// this module should only have a default export
exports.default = axios;

},{"./utils.js":"5By4s","./helpers/bind.js":"haRQb","./core/Axios.js":"cpqD8","./core/mergeConfig.js":"b85oP","./defaults/index.js":"hXfHM","./helpers/formDataToJSON.js":"01RfH","./cancel/CanceledError.js":"9PwCG","./cancel/CancelToken.js":"45wzn","./cancel/isCancel.js":"a0VmF","./env/data.js":"h29L9","./helpers/toFormData.js":"ajoez","./core/AxiosError.js":"3u8Tl","./helpers/spread.js":"dyQ8N","./helpers/isAxiosError.js":"eyiLq","./core/AxiosHeaders.js":"cgSSx","./helpers/HttpStatusCode.js":"fdR61","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5By4s":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bindJs = require("./helpers/bind.js");
var _bindJsDefault = parcelHelpers.interopDefault(_bindJs);
var global = arguments[3];
"use strict";
// utils is a library of generic helper functions non-specific to axios
const { toString  } = Object.prototype;
const { getPrototypeOf  } = Object;
const kindOf = ((cache)=>(thing)=>{
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));
const kindOfTest = (type)=>{
    type = type.toLowerCase();
    return (thing)=>kindOf(thing) === type;
};
const typeOfTest = (type)=>(thing)=>typeof thing === type;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */ const { isArray  } = Array;
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */ const isUndefined = typeOfTest("undefined");
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */ function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */ const isArrayBuffer = kindOfTest("ArrayBuffer");
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */ function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
    else result = val && val.buffer && isArrayBuffer(val.buffer);
    return result;
}
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */ const isString = typeOfTest("string");
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */ const isFunction = typeOfTest("function");
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */ const isNumber = typeOfTest("number");
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */ const isObject = (thing)=>thing !== null && typeof thing === "object";
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */ const isBoolean = (thing)=>thing === true || thing === false;
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */ const isPlainObject = (val)=>{
    if (kindOf(val) !== "object") return false;
    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */ const isDate = kindOfTest("Date");
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFile = kindOfTest("File");
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */ const isBlob = kindOfTest("Blob");
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFileList = kindOfTest("FileList");
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */ const isStream = (val)=>isObject(val) && isFunction(val.pipe);
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */ const isFormData = (thing)=>{
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */ const isURLSearchParams = kindOfTest("URLSearchParams");
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */ const trim = (str)=>str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */ function forEach(obj, fn, { allOwnKeys =false  } = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === "undefined") return;
    let i;
    let l;
    // Force an array if not already something iterable
    if (typeof obj !== "object") /*eslint no-param-reassign:0*/ obj = [
        obj
    ];
    if (isArray(obj)) // Iterate over array values
    for(i = 0, l = obj.length; i < l; i++)fn.call(null, obj[i], i, obj);
    else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for(i = 0; i < len; i++){
            key = keys[i];
            fn.call(null, obj[key], key, obj);
        }
    }
}
function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while(i-- > 0){
        _key = keys[i];
        if (key === _key.toLowerCase()) return _key;
    }
    return null;
}
const _global = (()=>{
    /*eslint no-undef:0*/ if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context)=>!isUndefined(context) && context !== _global;
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */ function merge() {
    const { caseless  } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key)=>{
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) result[targetKey] = merge(result[targetKey], val);
        else if (isPlainObject(val)) result[targetKey] = merge({}, val);
        else if (isArray(val)) result[targetKey] = val.slice();
        else result[targetKey] = val;
    };
    for(let i = 0, l = arguments.length; i < l; i++)arguments[i] && forEach(arguments[i], assignValue);
    return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */ const extend = (a, b, thisArg, { allOwnKeys  } = {})=>{
    forEach(b, (val, key)=>{
        if (thisArg && isFunction(val)) a[key] = (0, _bindJsDefault.default)(val, thisArg);
        else a[key] = val;
    }, {
        allOwnKeys
    });
    return a;
};
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */ const stripBOM = (content)=>{
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    return content;
};
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */ const inherits = (constructor, superConstructor, props, descriptors)=>{
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
};
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */ const toFlatObject = (sourceObj, destObj, filter, propFilter)=>{
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;
    do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while(i-- > 0){
            prop = props[i];
            if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                destObj[prop] = sourceObj[prop];
                merged[prop] = true;
            }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
    }while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
};
/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */ const endsWith = (str, searchString, position)=>{
    str = String(str);
    if (position === undefined || position > str.length) position = str.length;
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};
/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */ const toArray = (thing)=>{
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while(i-- > 0)arr[i] = thing[i];
    return arr;
};
/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */ // eslint-disable-next-line func-names
const isTypedArray = ((TypedArray)=>{
    // eslint-disable-next-line func-names
    return (thing)=>{
        return TypedArray && thing instanceof TypedArray;
    };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */ const forEachEntry = (obj, fn)=>{
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while((result = iterator.next()) && !result.done){
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
    }
};
/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */ const matchAll = (regExp, str)=>{
    let matches;
    const arr = [];
    while((matches = regExp.exec(str)) !== null)arr.push(matches);
    return arr;
};
/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */ const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str)=>{
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
    });
};
/* Creating a function that will check if an object has a property. */ const hasOwnProperty = (({ hasOwnProperty  })=>(obj, prop)=>hasOwnProperty.call(obj, prop))(Object.prototype);
/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */ const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer)=>{
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name)=>{
        if (reducer(descriptor, name, obj) !== false) reducedDescriptors[name] = descriptor;
    });
    Object.defineProperties(obj, reducedDescriptors);
};
/**
 * Makes all methods read-only
 * @param {Object} obj
 */ const freezeMethods = (obj)=>{
    reduceDescriptors(obj, (descriptor, name)=>{
        // skip restricted props in strict mode
        if (isFunction(obj) && [
            "arguments",
            "caller",
            "callee"
        ].indexOf(name) !== -1) return false;
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
            descriptor.writable = false;
            return;
        }
        if (!descriptor.set) descriptor.set = ()=>{
            throw Error("Can not rewrite read-only method '" + name + "'");
        };
    });
};
const toObjectSet = (arrayOrString, delimiter)=>{
    const obj = {};
    const define = (arr)=>{
        arr.forEach((value)=>{
            obj[value] = true;
        });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
};
const noop = ()=>{};
const toFiniteNumber = (value, defaultValue)=>{
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT)=>{
    let str = "";
    const { length  } = alphabet;
    while(size--)str += alphabet[Math.random() * length | 0];
    return str;
};
/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */ function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj)=>{
    const stack = new Array(10);
    const visit = (source, i)=>{
        if (isObject(source)) {
            if (stack.indexOf(source) >= 0) return;
            if (!("toJSON" in source)) {
                stack[i] = source;
                const target = isArray(source) ? [] : {};
                forEach(source, (value, key)=>{
                    const reducedValue = visit(value, i + 1);
                    !isUndefined(reducedValue) && (target[key] = reducedValue);
                });
                stack[i] = undefined;
                return target;
            }
        }
        return source;
    };
    return visit(obj, 0);
};
exports.default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject
};

},{"./helpers/bind.js":"haRQb","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"haRQb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function bind(fn, thisArg) {
    return function wrap() {
        return fn.apply(thisArg, arguments);
    };
}
exports.default = bind;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cpqD8":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _buildURLJs = require("../helpers/buildURL.js");
var _buildURLJsDefault = parcelHelpers.interopDefault(_buildURLJs);
var _interceptorManagerJs = require("./InterceptorManager.js");
var _interceptorManagerJsDefault = parcelHelpers.interopDefault(_interceptorManagerJs);
var _dispatchRequestJs = require("./dispatchRequest.js");
var _dispatchRequestJsDefault = parcelHelpers.interopDefault(_dispatchRequestJs);
var _mergeConfigJs = require("./mergeConfig.js");
var _mergeConfigJsDefault = parcelHelpers.interopDefault(_mergeConfigJs);
var _buildFullPathJs = require("./buildFullPath.js");
var _buildFullPathJsDefault = parcelHelpers.interopDefault(_buildFullPathJs);
var _validatorJs = require("../helpers/validator.js");
var _validatorJsDefault = parcelHelpers.interopDefault(_validatorJs);
var _axiosHeadersJs = require("./AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
"use strict";
const validators = (0, _validatorJsDefault.default).validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */ class Axios {
    constructor(instanceConfig){
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new (0, _interceptorManagerJsDefault.default)(),
            response: new (0, _interceptorManagerJsDefault.default)()
        };
    }
    /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */ request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === "string") {
            config = config || {};
            config.url = configOrUrl;
        } else config = configOrUrl || {};
        config = (0, _mergeConfigJsDefault.default)(this.defaults, config);
        const { transitional , paramsSerializer , headers  } = config;
        if (transitional !== undefined) (0, _validatorJsDefault.default).assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
        if (paramsSerializer != null) {
            if ((0, _utilsJsDefault.default).isFunction(paramsSerializer)) config.paramsSerializer = {
                serialize: paramsSerializer
            };
            else (0, _validatorJsDefault.default).assertOptions(paramsSerializer, {
                encode: validators.function,
                serialize: validators.function
            }, true);
        }
        // Set config.method
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders;
        // Flatten headers
        contextHeaders = headers && (0, _utilsJsDefault.default).merge(headers.common, headers[config.method]);
        contextHeaders && (0, _utilsJsDefault.default).forEach([
            "delete",
            "get",
            "head",
            "post",
            "put",
            "patch",
            "common"
        ], (method)=>{
            delete headers[method];
        });
        config.headers = (0, _axiosHeadersJsDefault.default).concat(contextHeaders, headers);
        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
            const chain = [
                (0, _dispatchRequestJsDefault.default).bind(this),
                undefined
            ];
            chain.unshift.apply(chain, requestInterceptorChain);
            chain.push.apply(chain, responseInterceptorChain);
            len = chain.length;
            promise = Promise.resolve(config);
            while(i < len)promise = promise.then(chain[i++], chain[i++]);
            return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        i = 0;
        while(i < len){
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
                newConfig = onFulfilled(newConfig);
            } catch (error) {
                onRejected.call(this, error);
                break;
            }
        }
        try {
            promise = (0, _dispatchRequestJsDefault.default).call(this, newConfig);
        } catch (error) {
            return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while(i < len)promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        return promise;
    }
    getUri(config) {
        config = (0, _mergeConfigJsDefault.default)(this.defaults, config);
        const fullPath = (0, _buildFullPathJsDefault.default)(config.baseURL, config.url);
        return (0, _buildURLJsDefault.default)(fullPath, config.params, config.paramsSerializer);
    }
}
// Provide aliases for supported request methods
(0, _utilsJsDefault.default).forEach([
    "delete",
    "get",
    "head",
    "options"
], function forEachMethodNoData(method) {
    /*eslint func-names:0*/ Axios.prototype[method] = function(url, config) {
        return this.request((0, _mergeConfigJsDefault.default)(config || {}, {
            method,
            url,
            data: (config || {}).data
        }));
    };
});
(0, _utilsJsDefault.default).forEach([
    "post",
    "put",
    "patch"
], function forEachMethodWithData(method) {
    /*eslint func-names:0*/ function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
            return this.request((0, _mergeConfigJsDefault.default)(config || {}, {
                method,
                headers: isForm ? {
                    "Content-Type": "multipart/form-data"
                } : {},
                url,
                data
            }));
        };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
exports.default = Axios;

},{"./../utils.js":"5By4s","../helpers/buildURL.js":"3bwC2","./InterceptorManager.js":"1VRIM","./dispatchRequest.js":"6sjJ6","./mergeConfig.js":"b85oP","./buildFullPath.js":"1I5TW","../helpers/validator.js":"9vgkY","./AxiosHeaders.js":"cgSSx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3bwC2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosURLSearchParamsJs = require("../helpers/AxiosURLSearchParams.js");
var _axiosURLSearchParamsJsDefault = parcelHelpers.interopDefault(_axiosURLSearchParamsJs);
"use strict";
/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */ function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/ if (!params) return url;
    const _encode = options && options.encode || encode;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) serializedParams = serializeFn(params, options);
    else serializedParams = (0, _utilsJsDefault.default).isURLSearchParams(params) ? params.toString() : new (0, _axiosURLSearchParamsJsDefault.default)(params, options).toString(_encode);
    if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}
exports.default = buildURL;

},{"../utils.js":"5By4s","../helpers/AxiosURLSearchParams.js":"hz84m","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hz84m":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _toFormDataJs = require("./toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
"use strict";
/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */ function encode(str) {
    const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
    });
}
/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */ function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && (0, _toFormDataJsDefault.default)(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
    this._pairs.push([
        name,
        value
    ]);
};
prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
};
exports.default = AxiosURLSearchParams;

},{"./toFormData.js":"ajoez","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ajoez":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored
var _formDataJs = require("../platform/node/classes/FormData.js");
var _formDataJsDefault = parcelHelpers.interopDefault(_formDataJs);
var Buffer = require("23101cef20ba98ac").Buffer;
"use strict";
/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */ function isVisitable(thing) {
    return (0, _utilsJsDefault.default).isPlainObject(thing) || (0, _utilsJsDefault.default).isArray(thing);
}
/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */ function removeBrackets(key) {
    return (0, _utilsJsDefault.default).endsWith(key, "[]") ? key.slice(0, -2) : key;
}
/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */ function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
}
/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */ function isFlatArray(arr) {
    return (0, _utilsJsDefault.default).isArray(arr) && !arr.some(isVisitable);
}
const predicates = (0, _utilsJsDefault.default).toFlatObject((0, _utilsJsDefault.default), {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
});
/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/ /**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */ function toFormData(obj, formData, options) {
    if (!(0, _utilsJsDefault.default).isObject(obj)) throw new TypeError("target must be an object");
    // eslint-disable-next-line no-param-reassign
    formData = formData || new ((0, _formDataJsDefault.default) || FormData)();
    // eslint-disable-next-line no-param-reassign
    options = (0, _utilsJsDefault.default).toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
    }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !(0, _utilsJsDefault.default).isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && (0, _utilsJsDefault.default).isSpecCompliantForm(formData);
    if (!(0, _utilsJsDefault.default).isFunction(visitor)) throw new TypeError("visitor must be a function");
    function convertValue(value) {
        if (value === null) return "";
        if ((0, _utilsJsDefault.default).isDate(value)) return value.toISOString();
        if (!useBlob && (0, _utilsJsDefault.default).isBlob(value)) throw new (0, _axiosErrorJsDefault.default)("Blob is not supported. Use a Buffer instead.");
        if ((0, _utilsJsDefault.default).isArrayBuffer(value) || (0, _utilsJsDefault.default).isTypedArray(value)) return useBlob && typeof Blob === "function" ? new Blob([
            value
        ]) : Buffer.from(value);
        return value;
    }
    /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */ function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
            if ((0, _utilsJsDefault.default).endsWith(key, "{}")) {
                // eslint-disable-next-line no-param-reassign
                key = metaTokens ? key : key.slice(0, -2);
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
            } else if ((0, _utilsJsDefault.default).isArray(value) && isFlatArray(value) || ((0, _utilsJsDefault.default).isFileList(value) || (0, _utilsJsDefault.default).endsWith(key, "[]")) && (arr = (0, _utilsJsDefault.default).toArray(value))) {
                // eslint-disable-next-line no-param-reassign
                key = removeBrackets(key);
                arr.forEach(function each(el, index) {
                    !((0, _utilsJsDefault.default).isUndefined(el) || el === null) && formData.append(// eslint-disable-next-line no-nested-ternary
                    indexes === true ? renderKey([
                        key
                    ], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
                });
                return false;
            }
        }
        if (isVisitable(value)) return true;
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
    });
    function build(value, path) {
        if ((0, _utilsJsDefault.default).isUndefined(value)) return;
        if (stack.indexOf(value) !== -1) throw Error("Circular reference detected in " + path.join("."));
        stack.push(value);
        (0, _utilsJsDefault.default).forEach(value, function each(el, key) {
            const result = !((0, _utilsJsDefault.default).isUndefined(el) || el === null) && visitor.call(formData, el, (0, _utilsJsDefault.default).isString(key) ? key.trim() : key, path, exposedHelpers);
            if (result === true) build(el, path ? path.concat(key) : [
                key
            ]);
        });
        stack.pop();
    }
    if (!(0, _utilsJsDefault.default).isObject(obj)) throw new TypeError("data must be an object");
    build(obj);
    return formData;
}
exports.default = toFormData;

},{"23101cef20ba98ac":"fCgem","../utils.js":"5By4s","../core/AxiosError.js":"3u8Tl","../platform/node/classes/FormData.js":"aFlee","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fCgem":[function(require,module,exports) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ /* eslint-disable no-proto */ "use strict";
var base64 = require("4ed775aa2d0004e8");
var ieee754 = require("fd939025d2b2794a");
var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" // eslint-disable-line dot-notation
 ? Symbol["for"]("nodejs.util.inspect.custom") // eslint-disable-line dot-notation
 : null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */ Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        var arr = new Uint8Array(1);
        var proto = {
            foo: function() {
                return 42;
            }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
Object.defineProperty(Buffer.prototype, "parent", {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
    }
});
Object.defineProperty(Buffer.prototype, "offset", {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > K_MAX_LENGTH) throw new RangeError('The value "' + length + '" is invalid for option "size"');
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192 // not used by this implementation
;
function from(value, encodingOrOffset, length) {
    if (typeof value === "string") return fromString(value, encodingOrOffset);
    if (ArrayBuffer.isView(value)) return fromArrayView(value);
    if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof value === "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
    var b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
    if (typeof size !== "number") throw new TypeError('"size" argument must be of type number');
    else if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) return createBuffer(size);
    if (fill !== undefined) // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */ Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") encoding = "utf8";
    if (!Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
    var length = byteLength(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
    return buf;
}
function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for(var i = 0; i < length; i += 1)buf[i] = array[i] & 255;
    return buf;
}
function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
        var copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
    if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
    var buf;
    if (byteOffset === undefined && length === undefined) buf = new Uint8Array(array);
    else if (length === undefined) buf = new Uint8Array(array, byteOffset);
    else buf = new Uint8Array(array, byteOffset, length);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) return buf;
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj.length !== undefined) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) return createBuffer(0);
        return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) return fromArrayLike(obj.data);
}
function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) length = 0;
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
    ;
};
Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (a === b) return 0;
    var x = a.length;
    var y = b.length;
    for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (list.length === 0) return Buffer.alloc(0);
    var i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i)length += list[i].length;
    }
    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for(i = 0; i < list.length; ++i){
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) Buffer.from(buf).copy(buffer, pos);
            else Uint8Array.prototype.set.call(buffer, buf, pos);
        } else if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
        else buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) return string.length;
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
    if (typeof string !== "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    // Use a for loop to avoid recursion
    var loweredCase = false;
    for(;;)switch(encoding){
        case "ascii":
        case "latin1":
        case "binary":
            return len;
        case "utf8":
        case "utf-8":
            return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return len * 2;
        case "hex":
            return len >>> 1;
        case "base64":
            return base64ToBytes(string).length;
        default:
            if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
            ;
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    var loweredCase = false;
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) start = 0;
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) return "";
    if (end === undefined || end > this.length) end = this.length;
    if (end <= 0) return "";
    // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;
    if (end <= start) return "";
    if (!encoding) encoding = "utf8";
    while(true)switch(encoding){
        case "hex":
            return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
            return utf8Slice(this, start, end);
        case "ascii":
            return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
            return latin1Slice(this, start, end);
        case "base64":
            return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return utf16leSlice(this, start, end);
        default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
    }
}
// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for(var i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for(var i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0) return "";
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    var str = "";
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max) str += " ... ";
    return "<Buffer " + str + ">";
};
if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
    if (!Buffer.isBuffer(target)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
    if (start === undefined) start = 0;
    if (end === undefined) end = target ? target.length : 0;
    if (thisStart === undefined) thisStart = 0;
    if (thisEnd === undefined) thisEnd = this.length;
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
    if (thisStart >= thisEnd && start >= end) return 0;
    if (thisStart >= thisEnd) return -1;
    if (start >= end) return 1;
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;
    // Normalize byteOffset
    if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
    else if (byteOffset < -2147483648) byteOffset = -2147483648;
    byteOffset = +byteOffset // Coerce to Number.
    ;
    if (numberIsNaN(byteOffset)) // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    // Normalize val
    if (typeof val === "string") val = Buffer.from(val, encoding);
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) return -1;
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
        val = val & 0xFF // Search for a byte value [0-255]
        ;
        if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) return buf[i];
        else return buf.readUInt16BE(i * indexSize);
    }
    var i;
    if (dir) {
        var foundIndex = -1;
        for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i = byteOffset; i >= 0; i--){
            var found = true;
            for(var j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
            }
            if (found) return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) length = remaining;
    else {
        length = Number(length);
        if (length > remaining) length = remaining;
    }
    var strLen = string.length;
    if (length > strLen / 2) length = strLen / 2;
    for(var i = 0; i < length; ++i){
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = "utf8";
        } else {
            encoding = length;
            length = undefined;
        }
    } else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    if (!encoding) encoding = "utf8";
    var loweredCase = false;
    for(;;)switch(encoding){
        case "hex":
            return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
            return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
            return asciiWrite(this, string, offset, length);
        case "base64":
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return ucs2Write(this, string, offset, length);
        default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
    else return base64.fromByteArray(buf.slice(start, end));
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while(i < end){
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 0x80) codePoint = firstByte;
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                        if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                    }
            }
        }
        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    ;
    // Decode in chunks to avoid "call stack size exceeded".
    var res = "";
    var i = 0;
    while(i < len)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    return res;
}
function asciiSlice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i] & 0x7F);
    return ret;
}
function latin1Slice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
    return ret;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = "";
    for(var i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
    return out;
}
function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = "";
    // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
    for(var i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) start = len;
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) end = len;
    if (end < start) end = start;
    var newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */ function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset + --byteLength];
    var mul = 1;
    while(byteLength > 0 && (mul *= 0x100))val += this[offset + --byteLength] * mul;
    return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 0x100))val += this[offset + i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while(i > 0 && (mul *= 0x100))val += this[offset + --i] * mul;
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100))this[offset + i] = value / mul & 0xFF;
    return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
    if (offset < 0) throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -340282346638528860000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError("argument should be a Buffer");
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    // Fatal error conditions
    if (targetStart < 0) throw new RangeError("targetStart out of bounds");
    if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
    if (end < 0) throw new RangeError("sourceEnd out of bounds");
    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) end = target.length - targetStart + start;
    var len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
    else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    return len;
};
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === "string") {
        if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
        }
        if (encoding !== undefined && typeof encoding !== "string") throw new TypeError("encoding must be a string");
        if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code;
        }
    } else if (typeof val === "number") val = val & 255;
    else if (typeof val === "boolean") val = Number(val);
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
    if (end <= start) return this;
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;
    if (typeof val === "number") for(i = start; i < end; ++i)this[i] = val;
    else {
        var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        var len = bytes.length;
        if (len === 0) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
    }
    return this;
};
// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split("=")[0];
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, "");
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return "";
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while(str.length % 4 !== 0)str = str + "=";
    return str;
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for(var i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }
                // valid lead
                leadSurrogate = codePoint;
                continue;
            }
            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }
            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) // valid bmp char, but last char was a lead
        {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }
        leadSurrogate = null;
        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else throw new Error("Invalid code point");
    }
    return bytes;
}
function asciiToBytes(str) {
    var byteArray = [];
    for(var i = 0; i < str.length; ++i)// Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
    return byteArray;
}
function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for(var i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    for(var i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
    ;
}
// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = function() {
    var alphabet = "0123456789abcdef";
    var table = new Array(256);
    for(var i = 0; i < 16; ++i){
        var i16 = i * 16;
        for(var j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
    }
    return table;
}();

},{"4ed775aa2d0004e8":"eIiSV","fd939025d2b2794a":"cO95r"}],"eIiSV":[function(require,module,exports) {
"use strict";
exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join("");
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + "==");
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + "=");
    }
    return parts.join("");
}

},{}],"cO95r":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
    if (e === 0) e = 1 - eBias;
    else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
    else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) value += rt / c;
        else value += rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    buffer[offset + i - d] |= s * 128;
};

},{}],"3u8Tl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */ function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    else this.stack = new Error().stack;
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
}
(0, _utilsJsDefault.default).inherits(AxiosError, Error, {
    toJSON: function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: (0, _utilsJsDefault.default).toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
        };
    }
});
const prototype = AxiosError.prototype;
const descriptors = {};
[
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
].forEach((code)=>{
    descriptors[code] = {
        value: code
    };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", {
    value: true
});
// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps)=>{
    const axiosError = Object.create(prototype);
    (0, _utilsJsDefault.default).toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
    }, (prop)=>{
        return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
};
exports.default = AxiosError;

},{"../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aFlee":[function(require,module,exports) {
// eslint-disable-next-line strict
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1VRIM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
class InterceptorManager {
    constructor(){
        this.handlers = [];
    }
    /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */ use(fulfilled, rejected, options) {
        this.handlers.push({
            fulfilled,
            rejected,
            synchronous: options ? options.synchronous : false,
            runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
    }
    /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */ eject(id) {
        if (this.handlers[id]) this.handlers[id] = null;
    }
    /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */ clear() {
        if (this.handlers) this.handlers = [];
    }
    /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */ forEach(fn) {
        (0, _utilsJsDefault.default).forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) fn(h);
        });
    }
}
exports.default = InterceptorManager;

},{"./../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6sjJ6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _transformDataJs = require("./transformData.js");
var _transformDataJsDefault = parcelHelpers.interopDefault(_transformDataJs);
var _isCancelJs = require("../cancel/isCancel.js");
var _isCancelJsDefault = parcelHelpers.interopDefault(_isCancelJs);
var _indexJs = require("../defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _canceledErrorJs = require("../cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _adaptersJs = require("../adapters/adapters.js");
var _adaptersJsDefault = parcelHelpers.interopDefault(_adaptersJs);
"use strict";
/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */ function throwIfCancellationRequested(config) {
    if (config.cancelToken) config.cancelToken.throwIfRequested();
    if (config.signal && config.signal.aborted) throw new (0, _canceledErrorJsDefault.default)(null, config);
}
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = (0, _axiosHeadersJsDefault.default).from(config.headers);
    // Transform request data
    config.data = (0, _transformDataJsDefault.default).call(config, config.transformRequest);
    if ([
        "post",
        "put",
        "patch"
    ].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
    const adapter = (0, _adaptersJsDefault.default).getAdapter(config.adapter || (0, _indexJsDefault.default).adapter);
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        // Transform response data
        response.data = (0, _transformDataJsDefault.default).call(config, config.transformResponse, response);
        response.headers = (0, _axiosHeadersJsDefault.default).from(response.headers);
        return response;
    }, function onAdapterRejection(reason) {
        if (!(0, _isCancelJsDefault.default)(reason)) {
            throwIfCancellationRequested(config);
            // Transform response data
            if (reason && reason.response) {
                reason.response.data = (0, _transformDataJsDefault.default).call(config, config.transformResponse, reason.response);
                reason.response.headers = (0, _axiosHeadersJsDefault.default).from(reason.response.headers);
            }
        }
        return Promise.reject(reason);
    });
}
exports.default = dispatchRequest;

},{"./transformData.js":"eRqJY","../cancel/isCancel.js":"a0VmF","../defaults/index.js":"hXfHM","../cancel/CanceledError.js":"9PwCG","../core/AxiosHeaders.js":"cgSSx","../adapters/adapters.js":"d7JxI","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eRqJY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _indexJs = require("../defaults/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
"use strict";
function transformData(fns, response) {
    const config = this || (0, _indexJsDefault.default);
    const context = response || config;
    const headers = (0, _axiosHeadersJsDefault.default).from(context.headers);
    let data = context.data;
    (0, _utilsJsDefault.default).forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
    headers.normalize();
    return data;
}
exports.default = transformData;

},{"./../utils.js":"5By4s","../defaults/index.js":"hXfHM","../core/AxiosHeaders.js":"cgSSx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hXfHM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _transitionalJs = require("./transitional.js");
var _transitionalJsDefault = parcelHelpers.interopDefault(_transitionalJs);
var _toFormDataJs = require("../helpers/toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _toURLEncodedFormJs = require("../helpers/toURLEncodedForm.js");
var _toURLEncodedFormJsDefault = parcelHelpers.interopDefault(_toURLEncodedFormJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _formDataToJSONJs = require("../helpers/formDataToJSON.js");
var _formDataToJSONJsDefault = parcelHelpers.interopDefault(_formDataToJSONJs);
"use strict";
const DEFAULT_CONTENT_TYPE = {
    "Content-Type": undefined
};
/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */ function stringifySafely(rawValue, parser, encoder) {
    if ((0, _utilsJsDefault.default).isString(rawValue)) try {
        (parser || JSON.parse)(rawValue);
        return (0, _utilsJsDefault.default).trim(rawValue);
    } catch (e) {
        if (e.name !== "SyntaxError") throw e;
    }
    return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
    transitional: (0, _transitionalJsDefault.default),
    adapter: [
        "xhr",
        "http"
    ],
    transformRequest: [
        function transformRequest(data, headers) {
            const contentType = headers.getContentType() || "";
            const hasJSONContentType = contentType.indexOf("application/json") > -1;
            const isObjectPayload = (0, _utilsJsDefault.default).isObject(data);
            if (isObjectPayload && (0, _utilsJsDefault.default).isHTMLForm(data)) data = new FormData(data);
            const isFormData = (0, _utilsJsDefault.default).isFormData(data);
            if (isFormData) {
                if (!hasJSONContentType) return data;
                return hasJSONContentType ? JSON.stringify((0, _formDataToJSONJsDefault.default)(data)) : data;
            }
            if ((0, _utilsJsDefault.default).isArrayBuffer(data) || (0, _utilsJsDefault.default).isBuffer(data) || (0, _utilsJsDefault.default).isStream(data) || (0, _utilsJsDefault.default).isFile(data) || (0, _utilsJsDefault.default).isBlob(data)) return data;
            if ((0, _utilsJsDefault.default).isArrayBufferView(data)) return data.buffer;
            if ((0, _utilsJsDefault.default).isURLSearchParams(data)) {
                headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
                return data.toString();
            }
            let isFileList;
            if (isObjectPayload) {
                if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return (0, _toURLEncodedFormJsDefault.default)(data, this.formSerializer).toString();
                if ((isFileList = (0, _utilsJsDefault.default).isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
                    const _FormData = this.env && this.env.FormData;
                    return (0, _toFormDataJsDefault.default)(isFileList ? {
                        "files[]": data
                    } : data, _FormData && new _FormData(), this.formSerializer);
                }
            }
            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType("application/json", false);
                return stringifySafely(data);
            }
            return data;
        }
    ],
    transformResponse: [
        function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === "json";
            if (data && (0, _utilsJsDefault.default).isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;
                try {
                    return JSON.parse(data);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === "SyntaxError") throw (0, _axiosErrorJsDefault.default).from(e, (0, _axiosErrorJsDefault.default).ERR_BAD_RESPONSE, this, null, this.response);
                        throw e;
                    }
                }
            }
            return data;
        }
    ],
    /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */ timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: (0, _indexJsDefault.default).classes.FormData,
        Blob: (0, _indexJsDefault.default).classes.Blob
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            "Accept": "application/json, text/plain, */*"
        }
    }
};
(0, _utilsJsDefault.default).forEach([
    "delete",
    "get",
    "head"
], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
(0, _utilsJsDefault.default).forEach([
    "post",
    "put",
    "patch"
], function forEachMethodWithData(method) {
    defaults.headers[method] = (0, _utilsJsDefault.default).merge(DEFAULT_CONTENT_TYPE);
});
exports.default = defaults;

},{"../utils.js":"5By4s","../core/AxiosError.js":"3u8Tl","./transitional.js":"lM32f","../helpers/toFormData.js":"ajoez","../helpers/toURLEncodedForm.js":"9hjry","../platform/index.js":"7tDev","../helpers/formDataToJSON.js":"01RfH","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lM32f":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
exports.default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9hjry":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _toFormDataJs = require("./toFormData.js");
var _toFormDataJsDefault = parcelHelpers.interopDefault(_toFormDataJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
"use strict";
function toURLEncodedForm(data, options) {
    return (0, _toFormDataJsDefault.default)(data, new (0, _indexJsDefault.default).classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
            if ((0, _indexJsDefault.default).isNode && (0, _utilsJsDefault.default).isBuffer(value)) {
                this.append(key, value.toString("base64"));
                return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
        }
    }, options));
}
exports.default = toURLEncodedForm;

},{"../utils.js":"5By4s","./toFormData.js":"ajoez","../platform/index.js":"7tDev","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7tDev":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _indexJsDefault.default));
var _indexJs = require("./node/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);

},{"./node/index.js":"cVeqE","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cVeqE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _urlsearchParamsJs = require("./classes/URLSearchParams.js");
var _urlsearchParamsJsDefault = parcelHelpers.interopDefault(_urlsearchParamsJs);
var _formDataJs = require("./classes/FormData.js");
var _formDataJsDefault = parcelHelpers.interopDefault(_formDataJs);
var _blobJs = require("./classes/Blob.js");
var _blobJsDefault = parcelHelpers.interopDefault(_blobJs);
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */ const isStandardBrowserEnv = (()=>{
    let product;
    if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) return false;
    return typeof window !== "undefined" && typeof document !== "undefined";
})();
/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */ const isStandardBrowserWebWorkerEnv = (()=>{
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
exports.default = {
    isBrowser: true,
    classes: {
        URLSearchParams: (0, _urlsearchParamsJsDefault.default),
        FormData: (0, _formDataJsDefault.default),
        Blob: (0, _blobJsDefault.default)
    },
    isStandardBrowserEnv,
    isStandardBrowserWebWorkerEnv,
    protocols: [
        "http",
        "https",
        "file",
        "blob",
        "url",
        "data"
    ]
};

},{"./classes/URLSearchParams.js":"5cIHE","./classes/FormData.js":"7i1jd","./classes/Blob.js":"8chF6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5cIHE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axiosURLSearchParamsJs = require("../../../helpers/AxiosURLSearchParams.js");
var _axiosURLSearchParamsJsDefault = parcelHelpers.interopDefault(_axiosURLSearchParamsJs);
"use strict";
exports.default = typeof URLSearchParams !== "undefined" ? URLSearchParams : (0, _axiosURLSearchParamsJsDefault.default);

},{"../../../helpers/AxiosURLSearchParams.js":"hz84m","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7i1jd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
exports.default = typeof FormData !== "undefined" ? FormData : null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8chF6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
exports.default = typeof Blob !== "undefined" ? Blob : null;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"01RfH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */ function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return (0, _utilsJsDefault.default).matchAll(/\w+|\[(\w*)]/g, name).map((match)=>{
        return match[0] === "[]" ? "" : match[1] || match[0];
    });
}
/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */ function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for(i = 0; i < len; i++){
        key = keys[i];
        obj[key] = arr[key];
    }
    return obj;
}
/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */ function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && (0, _utilsJsDefault.default).isArray(target) ? target.length : name;
        if (isLast) {
            if ((0, _utilsJsDefault.default).hasOwnProp(target, name)) target[name] = [
                target[name],
                value
            ];
            else target[name] = value;
            return !isNumericKey;
        }
        if (!target[name] || !(0, _utilsJsDefault.default).isObject(target[name])) target[name] = [];
        const result = buildPath(path, value, target[name], index);
        if (result && (0, _utilsJsDefault.default).isArray(target[name])) target[name] = arrayToObject(target[name]);
        return !isNumericKey;
    }
    if ((0, _utilsJsDefault.default).isFormData(formData) && (0, _utilsJsDefault.default).isFunction(formData.entries)) {
        const obj = {};
        (0, _utilsJsDefault.default).forEachEntry(formData, (name, value)=>{
            buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
    }
    return null;
}
exports.default = formDataToJSON;

},{"../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cgSSx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _parseHeadersJs = require("../helpers/parseHeaders.js");
var _parseHeadersJsDefault = parcelHelpers.interopDefault(_parseHeadersJs);
"use strict";
const $internals = Symbol("internals");
function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
    if (value === false || value == null) return value;
    return (0, _utilsJsDefault.default).isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while(match = tokensRE.exec(str))tokens[match[1]] = match[2];
    return tokens;
}
const isValidHeaderName = (str)=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if ((0, _utilsJsDefault.default).isFunction(filter)) return filter.call(this, value, header);
    if (isHeaderNameFilter) value = header;
    if (!(0, _utilsJsDefault.default).isString(value)) return;
    if ((0, _utilsJsDefault.default).isString(filter)) return value.indexOf(filter) !== -1;
    if ((0, _utilsJsDefault.default).isRegExp(filter)) return filter.test(value);
}
function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str)=>{
        return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
    const accessorName = (0, _utilsJsDefault.default).toCamelCase(" " + header);
    [
        "get",
        "set",
        "has"
    ].forEach((methodName)=>{
        Object.defineProperty(obj, methodName + accessorName, {
            value: function(arg1, arg2, arg3) {
                return this[methodName].call(this, header, arg1, arg2, arg3);
            },
            configurable: true
        });
    });
}
class AxiosHeaders {
    constructor(headers){
        headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
        const self = this;
        function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) throw new Error("header name must be a non-empty string");
            const key = (0, _utilsJsDefault.default).findKey(self, lHeader);
            if (!key || self[key] === undefined || _rewrite === true || _rewrite === undefined && self[key] !== false) self[key || _header] = normalizeValue(_value);
        }
        const setHeaders = (headers, _rewrite)=>(0, _utilsJsDefault.default).forEach(headers, (_value, _header)=>setHeader(_value, _header, _rewrite));
        if ((0, _utilsJsDefault.default).isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
        else if ((0, _utilsJsDefault.default).isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders((0, _parseHeadersJsDefault.default)(header), valueOrRewrite);
        else header != null && setHeader(valueOrRewrite, header, rewrite);
        return this;
    }
    get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
            const key = (0, _utilsJsDefault.default).findKey(this, header);
            if (key) {
                const value = this[key];
                if (!parser) return value;
                if (parser === true) return parseTokens(value);
                if ((0, _utilsJsDefault.default).isFunction(parser)) return parser.call(this, value, key);
                if ((0, _utilsJsDefault.default).isRegExp(parser)) return parser.exec(value);
                throw new TypeError("parser must be boolean|regexp|function");
            }
        }
    }
    has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
            const key = (0, _utilsJsDefault.default).findKey(this, header);
            return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
    }
    delete(header, matcher) {
        const self = this;
        let deleted = false;
        function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
                const key = (0, _utilsJsDefault.default).findKey(self, _header);
                if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
                    delete self[key];
                    deleted = true;
                }
            }
        }
        if ((0, _utilsJsDefault.default).isArray(header)) header.forEach(deleteHeader);
        else deleteHeader(header);
        return deleted;
    }
    clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while(i--){
            const key = keys[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                delete this[key];
                deleted = true;
            }
        }
        return deleted;
    }
    normalize(format) {
        const self = this;
        const headers = {};
        (0, _utilsJsDefault.default).forEach(this, (value, header)=>{
            const key = (0, _utilsJsDefault.default).findKey(headers, header);
            if (key) {
                self[key] = normalizeValue(value);
                delete self[header];
                return;
            }
            const normalized = format ? formatHeader(header) : String(header).trim();
            if (normalized !== header) delete self[header];
            self[normalized] = normalizeValue(value);
            headers[normalized] = true;
        });
        return this;
    }
    concat(...targets) {
        return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
        const obj = Object.create(null);
        (0, _utilsJsDefault.default).forEach(this, (value, header)=>{
            value != null && value !== false && (obj[header] = asStrings && (0, _utilsJsDefault.default).isArray(value) ? value.join(", ") : value);
        });
        return obj;
    }
    [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
        return Object.entries(this.toJSON()).map(([header, value])=>header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
        return "AxiosHeaders";
    }
    static from(thing) {
        return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target)=>computed.set(target));
        return computed;
    }
    static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
            accessors: {}
        };
        const accessors = internals.accessors;
        const prototype = this.prototype;
        function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
                buildAccessors(prototype, _header);
                accessors[lHeader] = true;
            }
        }
        (0, _utilsJsDefault.default).isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
    }
}
AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
]);
(0, _utilsJsDefault.default).freezeMethods(AxiosHeaders.prototype);
(0, _utilsJsDefault.default).freezeMethods(AxiosHeaders);
exports.default = AxiosHeaders;

},{"../utils.js":"5By4s","../helpers/parseHeaders.js":"kqDd5","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kqDd5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = (0, _utilsJsDefault.default).toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
]);
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */ exports.default = (rawHeaders)=>{
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) return;
        if (key === "set-cookie") {
            if (parsed[key]) parsed[key].push(val);
            else parsed[key] = [
                val
            ];
        } else parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    });
    return parsed;
};

},{"./../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"a0VmF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function isCancel(value) {
    return !!(value && value.__CANCEL__);
}
exports.default = isCancel;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9PwCG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */ function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    (0, _axiosErrorJsDefault.default).call(this, message == null ? "canceled" : message, (0, _axiosErrorJsDefault.default).ERR_CANCELED, config, request);
    this.name = "CanceledError";
}
(0, _utilsJsDefault.default).inherits(CanceledError, (0, _axiosErrorJsDefault.default), {
    __CANCEL__: true
});
exports.default = CanceledError;

},{"../core/AxiosError.js":"3u8Tl","../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d7JxI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _httpJs = require("./http.js");
var _httpJsDefault = parcelHelpers.interopDefault(_httpJs);
var _xhrJs = require("./xhr.js");
var _xhrJsDefault = parcelHelpers.interopDefault(_xhrJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
const knownAdapters = {
    http: (0, _httpJsDefault.default),
    xhr: (0, _xhrJsDefault.default)
};
(0, _utilsJsDefault.default).forEach(knownAdapters, (fn, value)=>{
    if (fn) {
        try {
            Object.defineProperty(fn, "name", {
                value
            });
        } catch (e) {
        // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, "adapterName", {
            value
        });
    }
});
exports.default = {
    getAdapter: (adapters)=>{
        adapters = (0, _utilsJsDefault.default).isArray(adapters) ? adapters : [
            adapters
        ];
        const { length  } = adapters;
        let nameOrAdapter;
        let adapter;
        for(let i = 0; i < length; i++){
            nameOrAdapter = adapters[i];
            if (adapter = (0, _utilsJsDefault.default).isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) break;
        }
        if (!adapter) {
            if (adapter === false) throw new (0, _axiosErrorJsDefault.default)(`Adapter ${nameOrAdapter} is not supported by the environment`, "ERR_NOT_SUPPORT");
            throw new Error((0, _utilsJsDefault.default).hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`);
        }
        if (!(0, _utilsJsDefault.default).isFunction(adapter)) throw new TypeError("adapter is not a function");
        return adapter;
    },
    adapters: knownAdapters
};

},{"../utils.js":"5By4s","./http.js":"aFlee","./xhr.js":"ldm57","../core/AxiosError.js":"3u8Tl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ldm57":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _settleJs = require("./../core/settle.js");
var _settleJsDefault = parcelHelpers.interopDefault(_settleJs);
var _cookiesJs = require("./../helpers/cookies.js");
var _cookiesJsDefault = parcelHelpers.interopDefault(_cookiesJs);
var _buildURLJs = require("./../helpers/buildURL.js");
var _buildURLJsDefault = parcelHelpers.interopDefault(_buildURLJs);
var _buildFullPathJs = require("../core/buildFullPath.js");
var _buildFullPathJsDefault = parcelHelpers.interopDefault(_buildFullPathJs);
var _isURLSameOriginJs = require("./../helpers/isURLSameOrigin.js");
var _isURLSameOriginJsDefault = parcelHelpers.interopDefault(_isURLSameOriginJs);
var _transitionalJs = require("../defaults/transitional.js");
var _transitionalJsDefault = parcelHelpers.interopDefault(_transitionalJs);
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
var _canceledErrorJs = require("../cancel/CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
var _parseProtocolJs = require("../helpers/parseProtocol.js");
var _parseProtocolJsDefault = parcelHelpers.interopDefault(_parseProtocolJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
var _axiosHeadersJs = require("../core/AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
var _speedometerJs = require("../helpers/speedometer.js");
var _speedometerJsDefault = parcelHelpers.interopDefault(_speedometerJs);
"use strict";
function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = (0, _speedometerJsDefault.default)(50, 250);
    return (e)=>{
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
            loaded,
            total,
            progress: total ? loaded / total : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
            event: e
        };
        data[isDownloadStream ? "download" : "upload"] = true;
        listener(data);
    };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
exports.default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = (0, _axiosHeadersJsDefault.default).from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
            if (config.cancelToken) config.cancelToken.unsubscribe(onCanceled);
            if (config.signal) config.signal.removeEventListener("abort", onCanceled);
        }
        if ((0, _utilsJsDefault.default).isFormData(requestData) && ((0, _indexJsDefault.default).isStandardBrowserEnv || (0, _indexJsDefault.default).isStandardBrowserWebWorkerEnv)) requestHeaders.setContentType(false); // Let the browser set it
        let request = new XMLHttpRequest();
        // HTTP basic authentication
        if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
        }
        const fullPath = (0, _buildFullPathJsDefault.default)(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), (0, _buildURLJsDefault.default)(fullPath, config.params, config.paramsSerializer), true);
        // Set the request timeout in MS
        request.timeout = config.timeout;
        function onloadend() {
            if (!request) return;
            // Prepare the response
            const responseHeaders = (0, _axiosHeadersJsDefault.default).from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
            const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            };
            (0, _settleJsDefault.default)(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
            // Clean up request
            request = null;
        }
        if ("onloadend" in request) // Use onloadend if available
        request.onloadend = onloadend;
        else // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) return;
            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) return;
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
        };
        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            if (!request) return;
            reject(new (0, _axiosErrorJsDefault.default)("Request aborted", (0, _axiosErrorJsDefault.default).ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Handle low level network errors
        request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(new (0, _axiosErrorJsDefault.default)("Network Error", (0, _axiosErrorJsDefault.default).ERR_NETWORK, config, request));
            // Clean up request
            request = null;
        };
        // Handle timeout
        request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
            const transitional = config.transitional || (0, _transitionalJsDefault.default);
            if (config.timeoutErrorMessage) timeoutErrorMessage = config.timeoutErrorMessage;
            reject(new (0, _axiosErrorJsDefault.default)(timeoutErrorMessage, transitional.clarifyTimeoutError ? (0, _axiosErrorJsDefault.default).ETIMEDOUT : (0, _axiosErrorJsDefault.default).ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if ((0, _indexJsDefault.default).isStandardBrowserEnv) {
            // Add xsrf header
            const xsrfValue = (config.withCredentials || (0, _isURLSameOriginJsDefault.default)(fullPath)) && config.xsrfCookieName && (0, _cookiesJsDefault.default).read(config.xsrfCookieName);
            if (xsrfValue) requestHeaders.set(config.xsrfHeaderName, xsrfValue);
        }
        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);
        // Add headers to the request
        if ("setRequestHeader" in request) (0, _utilsJsDefault.default).forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
        });
        // Add withCredentials to request if needed
        if (!(0, _utilsJsDefault.default).isUndefined(config.withCredentials)) request.withCredentials = !!config.withCredentials;
        // Add responseType to request if needed
        if (responseType && responseType !== "json") request.responseType = config.responseType;
        // Handle progress if needed
        if (typeof config.onDownloadProgress === "function") request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
        // Not all browsers support upload events
        if (typeof config.onUploadProgress === "function" && request.upload) request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
        if (config.cancelToken || config.signal) {
            // Handle cancellation
            // eslint-disable-next-line func-names
            onCanceled = (cancel)=>{
                if (!request) return;
                reject(!cancel || cancel.type ? new (0, _canceledErrorJsDefault.default)(null, config, request) : cancel);
                request.abort();
                request = null;
            };
            config.cancelToken && config.cancelToken.subscribe(onCanceled);
            if (config.signal) config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
        const protocol = (0, _parseProtocolJsDefault.default)(fullPath);
        if (protocol && (0, _indexJsDefault.default).protocols.indexOf(protocol) === -1) {
            reject(new (0, _axiosErrorJsDefault.default)("Unsupported protocol " + protocol + ":", (0, _axiosErrorJsDefault.default).ERR_BAD_REQUEST, config));
            return;
        }
        // Send the request
        request.send(requestData || null);
    });
};

},{"./../utils.js":"5By4s","./../core/settle.js":"dD9aC","./../helpers/cookies.js":"4WJjt","./../helpers/buildURL.js":"3bwC2","../core/buildFullPath.js":"1I5TW","./../helpers/isURLSameOrigin.js":"lxXtv","../defaults/transitional.js":"lM32f","../core/AxiosError.js":"3u8Tl","../cancel/CanceledError.js":"9PwCG","../helpers/parseProtocol.js":"7NfWU","../platform/index.js":"7tDev","../core/AxiosHeaders.js":"cgSSx","../helpers/speedometer.js":"gQeo1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dD9aC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _axiosErrorJs = require("./AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
"use strict";
function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
    else reject(new (0, _axiosErrorJsDefault.default)("Request failed with status code " + response.status, [
        (0, _axiosErrorJsDefault.default).ERR_BAD_REQUEST,
        (0, _axiosErrorJsDefault.default).ERR_BAD_RESPONSE
    ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
}
exports.default = settle;

},{"./AxiosError.js":"3u8Tl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4WJjt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
"use strict";
exports.default = (0, _indexJsDefault.default).isStandardBrowserEnv ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
    return {
        write: function write(name, value, expires, path, domain, secure) {
            const cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if ((0, _utilsJsDefault.default).isNumber(expires)) cookie.push("expires=" + new Date(expires).toGMTString());
            if ((0, _utilsJsDefault.default).isString(path)) cookie.push("path=" + path);
            if ((0, _utilsJsDefault.default).isString(domain)) cookie.push("domain=" + domain);
            if (secure === true) cookie.push("secure");
            document.cookie = cookie.join("; ");
        },
        read: function read(name) {
            const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
            this.write(name, "", Date.now() - 86400000);
        }
    };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
    return {
        write: function write() {},
        read: function read() {
            return null;
        },
        remove: function remove() {}
    };
}();

},{"./../utils.js":"5By4s","../platform/index.js":"7tDev","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1I5TW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _isAbsoluteURLJs = require("../helpers/isAbsoluteURL.js");
var _isAbsoluteURLJsDefault = parcelHelpers.interopDefault(_isAbsoluteURLJs);
var _combineURLsJs = require("../helpers/combineURLs.js");
var _combineURLsJsDefault = parcelHelpers.interopDefault(_combineURLsJs);
"use strict";
function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !(0, _isAbsoluteURLJsDefault.default)(requestedURL)) return (0, _combineURLsJsDefault.default)(baseURL, requestedURL);
    return requestedURL;
}
exports.default = buildFullPath;

},{"../helpers/isAbsoluteURL.js":"jD6NM","../helpers/combineURLs.js":"brOWK","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jD6NM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
exports.default = isAbsoluteURL;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"brOWK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
exports.default = combineURLs;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lxXtv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _indexJs = require("../platform/index.js");
var _indexJsDefault = parcelHelpers.interopDefault(_indexJs);
"use strict";
exports.default = (0, _indexJsDefault.default).isStandardBrowserEnv ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */ function resolveURL(url) {
        let href = url;
        if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    originURL = resolveURL(window.location.href);
    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */ return function isURLSameOrigin(requestURL) {
        const parsed = (0, _utilsJsDefault.default).isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
        return true;
    };
}();

},{"./../utils.js":"5By4s","../platform/index.js":"7tDev","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7NfWU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
}
exports.default = parseProtocol;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gQeo1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */ function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== undefined ? min : 1000;
    return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) firstSampleTS = now;
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while(i !== head){
            bytesCount += bytes[i++];
            i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) tail = (tail + 1) % samplesCount;
        if (now - firstSampleTS < min) return;
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
}
exports.default = speedometer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"b85oP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
var _axiosHeadersJs = require("./AxiosHeaders.js");
var _axiosHeadersJsDefault = parcelHelpers.interopDefault(_axiosHeadersJs);
"use strict";
const headersToObject = (thing)=>thing instanceof (0, _axiosHeadersJsDefault.default) ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
        if ((0, _utilsJsDefault.default).isPlainObject(target) && (0, _utilsJsDefault.default).isPlainObject(source)) return (0, _utilsJsDefault.default).merge.call({
            caseless
        }, target, source);
        else if ((0, _utilsJsDefault.default).isPlainObject(source)) return (0, _utilsJsDefault.default).merge({}, source);
        else if ((0, _utilsJsDefault.default).isArray(source)) return source.slice();
        return source;
    }
    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, caseless) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(a, b, caseless);
        else if (!(0, _utilsJsDefault.default).isUndefined(a)) return getMergedValue(undefined, a, caseless);
    }
    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(undefined, b);
    }
    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
        if (!(0, _utilsJsDefault.default).isUndefined(b)) return getMergedValue(undefined, b);
        else if (!(0, _utilsJsDefault.default).isUndefined(a)) return getMergedValue(undefined, a);
    }
    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
        if (prop in config2) return getMergedValue(a, b);
        else if (prop in config1) return getMergedValue(undefined, a);
    }
    const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b)=>mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };
    (0, _utilsJsDefault.default).forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        (0, _utilsJsDefault.default).isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
}
exports.default = mergeConfig;

},{"../utils.js":"5By4s","./AxiosHeaders.js":"cgSSx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9vgkY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _dataJs = require("../env/data.js");
var _axiosErrorJs = require("../core/AxiosError.js");
var _axiosErrorJsDefault = parcelHelpers.interopDefault(_axiosErrorJs);
"use strict";
const validators = {};
// eslint-disable-next-line func-names
[
    "object",
    "boolean",
    "number",
    "function",
    "string",
    "symbol"
].forEach((type, i)=>{
    validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
});
const deprecatedWarnings = {};
/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */ validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
        return "[Axios v" + (0, _dataJs.VERSION) + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    // eslint-disable-next-line func-names
    return (value, opt, opts)=>{
        if (validator === false) throw new (0, _axiosErrorJsDefault.default)(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), (0, _axiosErrorJsDefault.default).ERR_DEPRECATED);
        if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            // eslint-disable-next-line no-console
            console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
    };
};
/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */ function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") throw new (0, _axiosErrorJsDefault.default)("options must be an object", (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION_VALUE);
    const keys = Object.keys(options);
    let i = keys.length;
    while(i-- > 0){
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
            const value = options[opt];
            const result = value === undefined || validator(value, opt, options);
            if (result !== true) throw new (0, _axiosErrorJsDefault.default)("option " + opt + " must be " + result, (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION_VALUE);
            continue;
        }
        if (allowUnknown !== true) throw new (0, _axiosErrorJsDefault.default)("Unknown option " + opt, (0, _axiosErrorJsDefault.default).ERR_BAD_OPTION);
    }
}
exports.default = {
    assertOptions,
    validators
};

},{"../env/data.js":"h29L9","../core/AxiosError.js":"3u8Tl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h29L9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VERSION", ()=>VERSION);
const VERSION = "1.3.6";

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"45wzn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _canceledErrorJs = require("./CanceledError.js");
var _canceledErrorJsDefault = parcelHelpers.interopDefault(_canceledErrorJs);
"use strict";
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */ class CancelToken {
    constructor(executor){
        if (typeof executor !== "function") throw new TypeError("executor must be a function.");
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        const token = this;
        // eslint-disable-next-line func-names
        this.promise.then((cancel)=>{
            if (!token._listeners) return;
            let i = token._listeners.length;
            while(i-- > 0)token._listeners[i](cancel);
            token._listeners = null;
        });
        // eslint-disable-next-line func-names
        this.promise.then = (onfulfilled)=>{
            let _resolve;
            // eslint-disable-next-line func-names
            const promise = new Promise((resolve)=>{
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        };
        executor(function cancel(message, config, request) {
            if (token.reason) // Cancellation has already been requested
            return;
            token.reason = new (0, _canceledErrorJsDefault.default)(message, config, request);
            resolvePromise(token.reason);
        });
    }
    /**
   * Throws a `CanceledError` if cancellation has been requested.
   */ throwIfRequested() {
        if (this.reason) throw this.reason;
    }
    /**
   * Subscribe to the cancel signal
   */ subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        if (this._listeners) this._listeners.push(listener);
        else this._listeners = [
            listener
        ];
    }
    /**
   * Unsubscribe from the cancel signal
   */ unsubscribe(listener) {
        if (!this._listeners) return;
        const index = this._listeners.indexOf(listener);
        if (index !== -1) this._listeners.splice(index, 1);
    }
    /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */ static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
exports.default = CancelToken;

},{"./CanceledError.js":"9PwCG","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dyQ8N":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
"use strict";
function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
}
exports.default = spread;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eyiLq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utilsJs = require("./../utils.js");
var _utilsJsDefault = parcelHelpers.interopDefault(_utilsJs);
"use strict";
function isAxiosError(payload) {
    return (0, _utilsJsDefault.default).isObject(payload) && payload.isAxiosError === true;
}
exports.default = isAxiosError;

},{"./../utils.js":"5By4s","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fdR61":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value])=>{
    HttpStatusCode[value] = key;
});
exports.default = HttpStatusCode;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"g6IEx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "IconNode", ()=>IconNode);
class IconNode {
    constructor(props){
        this.name = props.name;
        this.category = props.category;
        this.markup = props.markup;
        this.isFavorite = props.isFavorite || false;
        this.knownCollections = props.knownCollections || [];
        this.id = props.id || undefined;
        this.cid = props.cid || undefined;
        this.values = this.parseElement(this.createWrapper(props));
        this.versions = new Map();
        this.observer = structuredClone({
            ...props,
            isFavorite: this.isFavorite,
            knownCollections: Array.from(this.knownCollections),
            id: this.id,
            cid: this.cid,
            values: this.values,
            versions: this.versions
        });
    }
    get props() {
        return this.observer;
    }
    set props(value) {
        this.observer = {
            ...this.observer,
            ...value
        };
    }
    get showcase() {
        let element = this.createWrapper();
        element.dataset.role = "svg_wrapper";
        element.classList.add("svg-wrapper");
        return element;
    }
    get bench() {
        let element = this.createWrapper(this.observer);
        element.dataset.role = "bench_preview";
        element.classList.add("comp--bench", "button--sm");
        return element;
    }
    get previews() {
        let markup = this.observer.markup;
        let components = {
            all: `<div class="preview-group">
                    <div class="label">
                        <span>Logos</span>
                    </div>
                    <div class="preview-components logo">
                        <div class="logo--lg comp pb-component showcase">
                            ${markup}
                        </div>
                        <div class="logo--md comp pb-component sg-1">
                            ${markup}
                        </div>
                        <div class="logo--sm comp pb-component sg-2">
                            ${markup}
                        </div>
                        <div class="logo--xs comp pb-component sg-3">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Squared</span>
                    </div>
                    <div class="preview-components squared">
                        <div class="squared--lg comp">
                            ${markup}
                        </div>
                        <div class="squared--md comp">
                            ${markup}
                        </div>
                        <div class="squared--sm comp">
                            ${markup}
                        </div>
                        <div class="squared--xs comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Squared (Rounded)</span>
                    </div>
                    <div class="preview-components squared-rounded">
                        <div class="squared-rounded--xs comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--sm comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--md comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Round</span>
                    </div>
                    <div class="preview-components round">
                        <div class="round--xs comp">
                            ${markup}
                        </div>
                        <div class="round--sm comp">
                            ${markup}
                        </div>
                        <div class="round--md comp">
                            ${markup}
                        </div>
                        <div class="round--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Button</span>
                    </div>
                    <div class="preview-components button">
                        <div class="button--sm comp">
                            ${markup}
                        </div>
                        <div class="button--md comp">
                            ${markup}
                        </div>
                        <div class="button--lg comp">
                            ${markup}
                        </div>
                    </div>
                </div>
                <div class="preview-group">
                    <div class="label">
                        <span>Nested</span>
                    </div>
                    <div class="preview-components nested">
                        <div class="nested--right comp">
                            ${markup}
                        </div>
                        <div class="nested--left comp">
                            ${markup}
                        </div>
                    </div>
                </div>`,
            logo: {
                all: `<div class="preview-components logo">
                        <div class="logo--lg comp pb-component showcase">
                            ${markup}
                        </div>
                        <div class="logo--md comp pb-component sg-1">
                            ${markup}
                        </div>
                        <div class="logo--sm comp pb-component sg-2">
                            ${markup}
                        </div>
                        <div class="logo--xs comp pb-component sg-3">
                            ${markup}
                        </div>
                    </div>`,
                xs: `<div class="logo--xs comp pb-component sg-3">${markup}</div>`,
                sm: `<div class="logo--sm comp pb-component sg-2">${markup}</div>`,
                md: `<div class="logo--md comp pb-component sg-1">${markup}</div>`,
                lg: `<div class="logo--lg comp pb-component showcase">${markup}</div>`
            },
            squared: {
                all: `<div class="preview-components squared">
                        <div class="squared--lg comp">
                            ${markup}
                        </div>
                        <div class="squared--md comp">
                            ${markup}
                        </div>
                        <div class="squared--sm comp">
                            ${markup}
                        </div>
                        <div class="squared--xs comp">
                            ${markup}
                        </div>
                    </div>`,
                xs: `<div class="squared--xs comp">${markup}</div>`,
                sm: `<div class="squared--sm comp">${markup}</div>`,
                md: `<div class="squared--md comp">${markup}</div>`,
                lg: `<div class="squared--lg comp">${markup}</div>`
            },
            rounded_square: {
                all: `<div class="preview-components squared-rounded">
                        <div class="squared-rounded--xs comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--sm comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--md comp">
                            ${markup}
                        </div>
                        <div class="squared-rounded--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                xs: `<div class="squared-rounded--xs comp">${markup}</div>`,
                sm: `<div class="squared-rounded--sm comp">${markup}</div>`,
                md: `<div class="squared-rounded--md comp">${markup}</div>`,
                lg: `<div class="squared-rounded--lg comp">${markup}</div>`
            },
            round: {
                all: `<div class="preview-components round">
                        <div class="round--xs comp">
                            ${markup}
                        </div>
                        <div class="round--sm comp">
                            ${markup}
                        </div>
                        <div class="round--md comp">
                            ${markup}
                        </div>
                        <div class="round--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                xs: `<div class="round--xs comp">${markup}</div>`,
                sm: `<div class="round--sm comp">${markup}</div>`,
                md: `<div class="round--md comp">${markup}</div>`,
                lg: `<div class="round--lg comp">${markup}</div>`
            },
            button: {
                all: `<div class="preview-components button">
                        <div class="button--sm comp">
                            ${markup}
                        </div>
                        <div class="button--md comp">
                            ${markup}
                        </div>
                        <div class="button--lg comp">
                            ${markup}
                        </div>
                    </div>`,
                sm: `<div class="button--sm comp">${markup}</div>`,
                md: `<div class="button--md comp">${markup}</div>`,
                lg: `<div class="button--lg comp">${markup}</div>`
            },
            nested: {
                all: `<div class="preview-components nested">
                        <div class="nested--right comp">
                            ${markup}
                        </div>
                        <div class="nested--left comp">
                            ${markup}
                        </div>
                    </div>`,
                left: `<div class="nested--left comp">${markup}</div>`,
                right: `<div class="nested--right comp">${markup}</div>`
            }
        };
        return components;
    }
    get html() {
        return this.observer.markup;
    }
    get header() {
        return {
            name: this.observer.name,
            category: this.observer.category,
            markup: this.markup
        };
    }
    get viewBox() {
        if (this.observer.values.has("viewBox")) return this.parseViewBoxString(this.observer.values.get("viewBox"));
        else {
            console.log("no viewbox property");
            return false;
        }
    }
    set viewBox(string) {
        if (Array.isArray(string)) string = this.formatViewBoxArray(string);
        // make sure its a string
        this.observer.values.set("viewBox", string);
    // console.log('viewbox set to',string, this.observer.values.get('viewBox'));
    }
    set pos(args) {
        let [index, val] = args;
        let viewbox = this.observer.values.get("viewBox");
        // convert to array
        let vb = this.parseViewBoxString(viewbox);
        // swap values
        vb[index] = val;
        // convert back to a string
        viewbox = this.formatViewBoxArray(vb);
        return;
    }
    set vbx(x) {
        this.pos = [
            0,
            x
        ];
    }
    set vby(y) {
        this.pos = [
            1,
            y
        ];
    }
    set vbw(w) {
        this.pos = [
            2,
            w
        ];
    }
    set vbh(h) {
        this.pos = [
            3,
            h
        ];
    }
    set rotation(deg) {
        this.observer.values.set("rotation", deg);
        return deg;
    }
    get rotation() {
        return this.observer.values.rotation;
    }
    save(value) {
        // this.props = value;
        // this.versions.push(value);
        // console.dir('saving current observer as a new icon',this.observer,this.props)
        let cpy = new IconNode(this.observer);
        // console.dir('heres the copy',cpy)
        // return new IconNode(props)
        return cpy;
    }
    copy() {
        window.navigator.clipboard.writeText(this.svg);
        console.log("copied");
        return true;
    }
    use() {
        return structuredClone(this.props);
    }
    parseElement(element) {
        if (!element) {
            console.log("invalid operation");
            return;
        }
        let icon = element.querySelector("svg");
        let values = new Map([
            [
                "height",
                icon.getAttribute("height")
            ],
            [
                "width",
                icon.getAttribute("width")
            ],
            [
                "x",
                icon.getAttribute("x")
            ],
            [
                "y",
                icon.getAttribute("y")
            ],
            [
                "viewBox",
                icon.getAttribute("viewBox")
            ],
            [
                "transform",
                {
                    value: icon.getAttribute("transform")
                }
            ],
            [
                "rotation",
                icon.dataset.rotation
            ]
        ]);
        return values;
    }
    parseViewBoxString(string) {
        if (Array.isArray(string)) {
            console.log("I think you trying to parse an array... try a string next time");
            return string;
        }
        return string.split(/\s+|,/).map((value)=>Number(value));
    }
    formatViewBoxArray(array) {
        if (!Array.isArray(array)) {
            console.log("I think your trying to format a string... try an array next time");
            return array;
        }
        return array.join(" ");
    }
    createWrapper(props, opts = {
        useValues: false
    }) {
        let { name , category , markup , values  } = props || this;
        // console.log(props)
        let el = document.createElement("div");
        el.dataset.category = category;
        el.dataset.name = name;
        el.dataset.cid = this.cid;
        el.dataset.id = this.id;
        el.innerHTML = markup;
        // console.log(el)
        let icon = el.querySelector("svg");
        if (!icon) {
            console.log(props._id, "is an invalid object");
            return undefined;
        }
        if (!icon.getAttribute("viewBox")) {
            console.warn("setting default viewbox in", category);
            icon.setAttribute("viewBox", "0 0 24 24");
            this.markup = icon.outerHTML;
        } else if (values && opts.useValues) return this.getUpdatedClone(el, values);
        return el;
    }
    getComponent(type, size) {
        if (!this.previews[type] || type == "all") return `type ${type} not found`;
        if (!this.previews[type][size] || size == "all") return `type ${type} found but not component ${size}`;
        return this.previews[type][size];
    }
    getLogo(type) {
        let component = this.previews.logos[type];
        if (!component) {
            console.log(type, "doesn	 exist try one of these", Array.from(Object.getOwnPropertyNames(this.previews.logos)).filter((name)=>name !== "all"));
            return false;
        } else return component;
    }
    getSquared(type) {
        let component = this.previews.logos[type];
        if (!component) {
            console.log(type, "doesn	 exist try one of these", Array.from(Object.getOwnPropertyNames(this.previews.squared)).filter((name)=>name !== "all"));
            return false;
        } else return component;
    }
    getRoundedSquare(type) {
        let component = this.previews.logos[type];
        if (!component) {
            console.log(type, "doesn	 exist try one of these", Array.from(Object.getOwnPropertyNames(this.previews.rounded_square)).filter((name)=>name !== "all"));
            return false;
        } else return component;
    }
    getButton(type) {
        let component = this.previews.logos[type];
        if (!component) {
            console.log(type, "doesn	 exist try one of these", Array.from(Object.getOwnPropertyNames(this.previews.button)).filter((name)=>name !== "all"));
            return false;
        } else return component;
    }
    getNested(type) {
        let component = this.previews.nested[type];
        if (!component) {
            console.log(type, "doesn	 exist try one of these", Array.from(Object.getOwnPropertyNames(this.previews.nested)).filter((name)=>name !== "all"));
            return false;
        } else return component;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6CzCI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "preview", ()=>preview);
var _sliderJs = require("../utils/slider.js");
const preview = {
    currentIcon: undefined,
    currentProps: undefined,
    viewBoxScale: [],
    startingViewbox: [
        0,
        0,
        20,
        20
    ],
    observer: {},
    element: $("#PREVIEW"),
    components: $('.preview__modals--modal[data-tab="preview"]'),
    nameField: $(".title-group__name .label.name"),
    categoryField: $(".title-group__category .label.category"),
    vbxInput: $(".input-field.x .input"),
    vbyInput: $(".input-field.y .input"),
    vbhInput: $(".input-field.h .input"),
    vbwInput: $(".input-field.w .input"),
    vbhLabel: $(".input-field.h .label"),
    vbwLabel: $(".input-field.w .label"),
    get display () {
        return $(".current-icon", this.element);
    },
    get targetElement () {
        return $("svg", this.display);
    },
    get markup () {
        return this.targetElement.outerHTML;
    },
    set markup (html){
        if (this.currentProps) this.currentProps.markup = this.markup;
        return;
    },
    get previews () {
        return this.currentIcon.previews;
    },
    set previews (html){
        this.components.innerHTML = this.previews.all;
    },
    get viewBox () {
        return this.currentIcon.viewBox;
    },
    set viewBox (string){
        this.currentIcon.viewBox = string;
        return;
    },
    get VBX () {
        return Number(this.viewBox[0]);
    },
    get VBY () {
        return Number(this.viewBox[1]);
    },
    get VBH () {
        return Number(this.viewBox[2]);
    },
    get VBW () {
        return Number(this.viewBox[3]);
    },
    vbxLabel: new (0, _sliderJs.MouseTrackingSlider)($(".input-field.x .label"), {
        onMouseMove: ({ x  })=>preview.updateWithMouseTracker.call(preview, 0, x),
        onMouseUp: ()=>{
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    vbyLabel: new (0, _sliderJs.MouseTrackingSlider)($(".input-field.y .label"), {
        onMouseMove: ({ x  })=>preview.updateWithMouseTracker.call(preview, 1, x),
        onMouseUp: ()=>{
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    zoomSlider: new (0, _sliderJs.Slider)($("#zoomSlider"), {
        onMouseMove: ({ pct  })=>preview.updateWithSlider(pct),
        onMouseDown: ({ pct  })=>preview.updateWithSlider(pct),
        onMouseUp: ()=>{
            preview.startingViewbox = preview.viewBox;
            preview.updatePreviews();
        }
    }),
    rotationSlider: new (0, _sliderJs.Slider)($("#rotationSlider"), {
        onMouseMove: ({ deg  })=>{
            preview.updateRotation.call(preview, deg);
            preview.targetElement.dataset.rotation = deg.deg;
            preview.currentIcon.rotation = deg.deg;
        },
        onMouseUp: ()=>{
            preview.updatePreviews();
        }
    }),
    showBorder () {
        this.display.style.border = "1px dotted red";
        return this;
    },
    hideBorder () {
        this.display.style.border = "";
        return this;
    },
    toggleBorder () {
        if (!this.display.style.border) this.showBorder();
        else this.hideBorder();
        return this;
    },
    async copyToClipboard () {
        try {
            await window.navigator.clipboard.writeText(this.markup);
            alert("element copied");
        } catch (err) {
            console.error("Failed to copy", err);
        }
    },
    updateNameField (string1) {
        this.nameField.textContent = string1;
        return this;
    },
    updateCategoryField (string1) {
        this.categoryField.textContent = string1;
        return this;
    },
    updateDisplayElement (html1) {
        this.display.innerHTML = html1;
        return this;
    },
    setViewboxValues (array) {
        let stringValue = array.join(" ");
        this.vbxInput.value = `${array[0]}`;
        this.currentIcon.vbx = Number(array[0]);
        this.vbyInput.value = `${array[1]}`;
        this.currentIcon.vby = Number(array[1]);
        this.vbhInput.value = `${array[2]}`;
        this.currentIcon.vbh = Number(array[2]);
        this.vbwInput.value = `${array[3]}`;
        this.currentIcon.vbw = Number(array[3]);
        this.targetElement.setAttribute("viewBox", stringValue);
        this.currentIcon.viewBox = stringValue;
        this.currentProps.markup = this.markup;
        return this;
    },
    updateWithMouseTracker (index, value) {
        let values = [
            ...this.startingViewbox
        ];
        let x = values[index];
        let xi = Number(x);
        let adjusted = xi + value;
        values[index] = adjusted;
        this.setViewboxValues(values);
        return this;
    },
    updateWithSlider (pct) {
        if (!this.startingViewbox) {
            console.warn("no initial viewbox value to update");
            return;
        }
        let valuesToScaleFrom = [
            ...this.viewBoxScale
        ], values = [
            ...this.startingViewbox
        ], x = valuesToScaleFrom[2], y = valuesToScaleFrom[3], xi = Number(x), yi = Number(y), grow = (factor, ...nums)=>nums.map((num)=>Math.trunc(num * (factor / 100) + num));
        shrink = (factor, ...nums)=>nums.map((num)=>Math.abs(Math.trunc(num * (factor / 100) - num)));
        if (pct >= 50) {
            let factor = (pct - 50) * 2, adjustedValues = shrink(factor, xi, yi), [h, w] = adjustedValues;
            if (h < 0 || w < 0) return;
            values[2] = h;
            values[3] = w;
        } else if (pct < 50) {
            let factor = Math.abs(pct * 2 - 100), adjustedValues = grow(factor, xi, yi), [h, w] = adjustedValues;
            values[2] = h;
            values[3] = w;
        } else if (!pct || isNaN(pct)) console.error("invalid percent value, skipping unset");
        this.setViewboxValues(values);
        return this;
    },
    updateRotation (deg) {
        // let degrees = values.deg;
        if (deg || deg === 0) {
            this.targetElement.setAttribute("transform", `rotate(${deg})`);
            this.targetElement.dataset.rotation = deg;
            this.currentIcon.rotation = deg;
            if (this.currentProps) this.currentProps.markup = this.markup;
        }
        return this;
    },
    updatePreviews () {
        this.previews = "updated";
        return this;
    },
    getComponent (type, size) {
        if (!this.currentIcon) return;
        return this.currentIcon.getComponent(type, size);
    },
    save () {
        let node = this.currentIcon.save();
        return node;
    },
    update (icon) {
        this.currentIcon = icon;
        this.currentProps = icon.observer;
        let { name , category , markup , viewBox , rotation , isFavorite  } = icon;
        if (isFavorite) $(".btn-favit").classList.add("icon-is-favorite");
        else $(".btn-favit").classList.remove("icon-is-favorite");
        this.startingViewbox = viewBox;
        this.viewBoxScale = viewBox;
        this.updateDisplayElement(markup);
        this.updateCategoryField(category);
        this.setViewboxValues(viewBox);
        this.updateNameField(name);
        this.updatePreviews();
        this.zoomSlider.setPercent(50);
        if (rotation) this.rotationSlider.setDegrees(rotation);
        else this.rotationSlider.setDegrees(0);
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../utils/slider.js":"ck1Ki"}],"ck1Ki":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Slider", ()=>Slider);
parcelHelpers.export(exports, "MouseTrackingSlider", ()=>MouseTrackingSlider);
class Slider {
    constructor(element, { onMouseUp , onMouseDown , onMouseMove  }){
        const self = this;
        this.container = element;
        this.track = element.querySelector(".slider-track");
        this.handle = element.querySelector(".slider-handle");
        this.onMouseDown = onMouseDown || null;
        this.onMouseMove = onMouseMove || null;
        this.onMouseUp = onMouseUp || null;
        this.coords = {
            get max () {
                return this.track.width - this.handleMidpoint;
            },
            get min () {
                return 0 + this.handleMidpoint;
            },
            get handleSize () {
                return this.handle.width;
            },
            get handleMidpoint () {
                return this.handleSize / 2;
            },
            get handlePosition () {
                return this.handle.x + this.handleMidpoint;
            },
            get distanceTraveled () {
                return this.handlePosition - this.trackStart;
            },
            get trackWidth () {
                return this.track.width - this.handleSize;
            },
            get trackStart () {
                return this.trackLeft + this.handleMidpoint;
            },
            get trackLeft () {
                return this.track.x;
            },
            get track () {
                return self.track.getBoundingClientRect();
            },
            get handle () {
                return self.handle.getBoundingClientRect();
            },
            clamp (val) {
                let x;
                let max = this.max;
                let min = this.min;
                if (isNaN(val)) throw new Error(`clamp function expects a number...you passed ${val}`);
                if (val >= max) x = max;
                else if (val <= min) x = min;
                else x = val;
                return x;
            }
        };
        this.MAX = {
            px: this.coords.track.width,
            pct: 100,
            deg: 360
        };
        this.MIN = {
            px: 0,
            pct: 0,
            deg: 0
        };
        this.state = {
            px: undefined,
            deg: undefined,
            pct: undefined
        };
        this.handle.addEventListener("mousedown", this.handleDrag.bind(this));
        this.track.addEventListener("mousedown", this.handleClick.bind(this));
    }
    update(event) {
        return this.setHandle(this.getDistanceTraveled(event));
    }
    setHandle(distanceTraveled) {
        let clamped = this.coords.clamp(distanceTraveled);
        this.handle.style.transform = `translateX(${clamped - this.coords.handleMidpoint}px)`;
        if (distanceTraveled <= 0) return this.MIN;
        if (distanceTraveled >= this.coords.track.width) return this.MAX;
        let distance = Math.trunc(distanceTraveled);
        let distanceInPercent = Math.trunc(distanceTraveled / this.coords.track.width * 100);
        let distanceInDegrees = Math.trunc(distanceTraveled / this.coords.track.width * 360);
        let values = {
            px: distance,
            pct: distanceInPercent,
            deg: distanceInDegrees
        };
        // this.state = values;
        return values;
    }
    handleDrag(event) {
        event.stopPropagation();
        let controller = new AbortController();
        document.addEventListener("mousemove", (event)=>{
            let state = this.update(event);
            if (this.onMouseMove) this.onMouseMove(state);
        }, {
            signal: controller.signal
        });
        document.addEventListener("mouseup", ()=>{
            controller.abort();
            if (this.onMouseUp) this.onMouseUp();
        }, true);
    }
    handleClick(event) {
        console.log("handling click");
        let state = this.update(event);
        if (this.onMouseDown) this.onMouseDown(state);
    }
    reset() {
        this.setHandle(0);
    }
    disable() {
        this.handle.removeEventListener("mousedown", this.handleDrag);
        this.track.removeEventListener("mousedown", this.handleClick);
    }
    getDistanceTraveled(event) {
        return event.clientX - this.coords.trackLeft;
    }
    convertValue(type, value) {
        let max = this.coords.track.width;
        if (type === "pct") return max * (value / 100);
        if (type === "deg") return max * (value / 360);
        if (type === undefined) {
            console.warn("you passed an invalid type to the sliders conver function", type, value);
            return undefined;
        }
        console.error("something went wrong in the convert value function", type, value);
        return;
    }
    setFrom(type, value) {
        return this.setHandle(this.convertValue(type, value));
    }
    setDegrees(value) {
        return this.setFrom("deg", value);
    }
    setPercent(value) {
        return this.setFrom("pct", value);
    }
    setPixels(value) {
        return this.setHandle(value);
    }
}
class MouseTrackingSlider {
    constructor(target, { onMouseMove , onMouseUp , onMouseDown  }){
        this.xPosInitial = null;
        this.yPosInitial = null;
        this.target = target;
        this.onMouseMove = onMouseMove;
        this.onMouseUp = onMouseUp;
        this.onMouseDown = onMouseDown;
        target.addEventListener("mousedown", this.track.bind(this));
    }
    handleDrag(event) {
        let xZeroed = event.clientX - this.xPosInitial;
        let yZeroed = event.clientY - this.yPosInitial;
        let vx = Math.floor(xZeroed / 3);
        let vy = Math.floor(yZeroed / 3);
        if (this.onMouseMove) this.onMouseMove({
            x: Number(vx),
            y: Number(vy)
        });
    }
    track(event) {
        if (!this.xPosInitial) this.xPosInitial = event.pageX;
        if (!this.yPosInitial) this.yPosInitial = event.pageY;
        let controller = new AbortController();
        document.addEventListener("mousemove", this.handleDrag.bind(this), {
            signal: controller.signal
        });
        document.addEventListener("mouseup", ()=>{
            controller.abort();
            this.xPosInitial = null;
            this.yPosInitial = null;
            if (this.onMouseUp) this.onMouseUp();
        });
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jYair":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DashboardPanel", ()=>DashboardPanel);
var _icon = require("./icon");
function DashboardPanel(list) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("content-wrapper");
    list.forEach((prop)=>wrapper.appendChild((0, _icon.showcase)(prop)));
    return wrapper.innerHTML;
}

},{"./icon":"NF9Az","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"NF9Az":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showcase", ()=>showcase);
function showcase(props) {
    let { name , category , id , cid , markup , rebased  } = props;
    let el = document.createElement("div");
    el.classList.add("showcase");
    el.classList.add("svg-wrapper");
    el.dataset.category = category;
    el.dataset.name = name;
    el.dataset.cid = cid;
    el.dataset.id = id;
    el.innerHTML = markup || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z"></path></svg>`;
    if (rebased) el.dataset.rebased = rebased;
    return el;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"34b3R":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "MenuList", ()=>MenuList);
parcelHelpers.export(exports, "MenuListItem", ()=>MenuListItem);
parcelHelpers.export(exports, "A2CMenuList", ()=>A2CMenuList);
parcelHelpers.export(exports, "A2CLink", ()=>A2CLink);
var _domHelpers = require("../utils/DOM-helpers");
var _dateJs = require("../utils/Date.js");
var _domHelpersJs = require("../utils/DOM-helpers.js");
function MenuList(listOfNames) {
    this.element = (0, _domHelpers.ulit)();
    this.element.classList.add("menu-items");
    this.addItem = (name)=>{
        const newLink = MenuListItem(name);
        (0, _domHelpers.appendit)(this.element, newLink);
        return newLink;
    };
    this.appendTo = (parent)=>(0, _domHelpers.appendit)(parent, this.element);
    this.cloneTo = (parent)=>(0, _domHelpers.appendit)(parent, this.element.cloneNode(true));
    this.replaceItems = (listOfNames)=>{
        this.innerHTML = "";
        listOfNames.forEach(this.addItem);
    };
    Object.defineProperty(this, "links", {
        get () {
            return $$(".modal__menu--items-item", this.element);
        }
    });
    listOfNames.forEach(this.addItem);
}
const MenuListItem = (name)=>{
    const li = document.createElement("li");
    li.classList.add("modal__menu--items-item");
    li.dataset.tab = name;
    li.textContent = (0, _domHelpersJs.capitalize)(name);
    return li;
};
function A2CMenuList(listOfNames) {
    this.element = (0, _domHelpers.ulit)();
    this.element.classList.add("menu-items");
    this.links = new Map();
    this.appendTo = (parent)=>(0, _domHelpers.appendit)(parent, this.element);
    this.cloneTo = (parent)=>(0, _domHelpers.appendit)(parent, this.element.cloneNode(true));
    this.replaceItems = (listOfNames)=>{
        this.innerHTML = "";
        listOfNames.forEach(this.addItem);
    };
    this.addItem = (name, collectionSize)=>{
        const link = new A2CLink(name, collectionSize);
        this.links.set(name, link);
        (0, _domHelpers.appendit)(this.element, link.element);
        return link;
    };
    listOfNames.forEach(this.addItem);
}
function A2CLink(name, collectionSize) {
    this.createdOn = new Date(Date.now());
    this.prettier = this.createdOn.toDateString();
    this.getTimeSince = ()=>(0, _dateJs.from)(this.createdOn).string;
    this.element = document.createElement("div");
    this.element.classList.add("collection-wrapper");
    this.element.dataset.collection = name;
    this.updateStamp = ()=>$(".stamp", this.element).outerHTML = this.stamp();
    this.updateCollectionSize = ()=>$(".num", this.element).outerHTML = this.size();
    this.size = ()=>`<span class="num">${collectionSize}</span>`;
    this.stamp = ()=>`<span class="stamp">Updated ${this.getTimeSince()}<span>`;
    this.element.innerHTML = `<span class="name">${(0, _domHelpersJs.capitalize)(name)}</span><span class="numberOfIcons"><span class="num">${collectionSize || "NAN"}</span><span>  Icons </span></span><span class="timestamp">${this.stamp()}</span>`;
}

},{"../utils/DOM-helpers":"e6U0L","../utils/Date.js":"fcLsm","../utils/DOM-helpers.js":"e6U0L","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fcLsm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "date", ()=>date);
parcelHelpers.export(exports, "stamp", ()=>stamp);
parcelHelpers.export(exports, "thisMonth", ()=>thisMonth);
parcelHelpers.export(exports, "thisYear", ()=>thisYear);
parcelHelpers.export(exports, "daysInMonth", ()=>daysInMonth);
parcelHelpers.export(exports, "msnMonth", ()=>msnMonth);
parcelHelpers.export(exports, "hoursAgo", ()=>hoursAgo);
parcelHelpers.export(exports, "secondsAgo", ()=>secondsAgo);
parcelHelpers.export(exports, "secondsLeft", ()=>secondsLeft);
parcelHelpers.export(exports, "toSeconds", ()=>toSeconds);
parcelHelpers.export(exports, "toSecondsFloat", ()=>toSecondsFloat);
parcelHelpers.export(exports, "toMinutes", ()=>toMinutes);
parcelHelpers.export(exports, "toMinutesFloat", ()=>toMinutesFloat);
parcelHelpers.export(exports, "minutesAgo", ()=>minutesAgo);
parcelHelpers.export(exports, "toHours", ()=>toHours);
parcelHelpers.export(exports, "toHoursFloat", ()=>toHoursFloat);
parcelHelpers.export(exports, "toDays", ()=>toDays);
parcelHelpers.export(exports, "toDaysFloat", ()=>toDaysFloat);
parcelHelpers.export(exports, "toMonths", ()=>toMonths);
parcelHelpers.export(exports, "toMonthsFloat", ()=>toMonthsFloat);
parcelHelpers.export(exports, "toYears", ()=>toYears);
// const minutesInYear = msnYear;
parcelHelpers.export(exports, "from", ()=>from);
parcelHelpers.export(exports, "getRemainder", ()=>getRemainder);
const mns = 0.001;
const snm = 1 / 60;
const mnh = 1 / 60;
const hnd = 1 / 24;
const dny = 1 / 365;
const mny = 1 / 12;
const msns = 1000;
const msnMinute = 60000;
const msnHour = 3600000;
const msnDay = 86400000;
const msnYear = msnDay * 365;
const date = {
    standard: undefined,
    default: undefined,
    universal: undefined,
    east: undefined,
    west: undefined,
    central: undefined,
    leap: false,
    dayMap: {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thurday",
        5: "Friday",
        6: "Saturday",
        7: null
    },
    monthMap: {
        "January": 31,
        get "February" () {
            if (this.leap) return 29;
            return 28;
        },
        "March": 31,
        "April": 30,
        "May": 31,
        "June": 30,
        "July": 31,
        "August": 31,
        "September": 30,
        "October": 31,
        "November": 30,
        "December": 31
    },
    days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        null
    ],
    daysABRV: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        null
    ],
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        null
    ],
    monthsABRV: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Nov",
        "Dec",
        null
    ],
    isLeap: (year)=>{
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    },
    getLeaps: (to, from)=>{
        function countFrom(lowest, highest) {
            let leapSince = 0;
            for(let i = lowest; i <= highest; i++)if (date.isLeap(i)) leapSince++;
            return leapSince;
        }
        return to < from ? countFrom(to, from) : countFrom(from, to);
    }
};
function stamp() {
    return Date.now();
}
function thisMonth() {
    let month = new Date(Date.now()).getMonth;
    return date.months[month];
}
function thisYear() {
    return new Date(Date.now()).getFullYear();
}
function daysInMonth(month, year) {
    let days = date.monthMap[month];
    if (date.isLeap(year && (month == "February" || month == "Feb"))) days = 29;
    return days;
}
function msnMonth(month, year) {
    let days = daysInMonth(month, year);
    let msInMonth = days * msnDay;
    return msInMonth;
}
function hoursAgo(stamp) {
    const then = toHours(stamp);
    const now = toHours(Date.now());
    const diffy = now - then;
    return diffy;
}
function secondsAgo(stamp) {
    const then = toSecondsFloat(stamp);
    const now = toSecondsFloat(Date.now());
    const diffy = now - then;
    const ago = {
        seconds: Math.floor(diffy),
        milliseconds: null
    };
    return ago;
}
function secondsLeft(milliseconds) {
    const minutes = toMinutesFloat(milliseconds);
    return minutes;
}
function toSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
}
function toSecondsFloat(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
}
function toMinutes(milliseconds) {
    let seconds = toSeconds(milliseconds);
    let minutes = Math.floor(seconds / 60);
    return minutes;
}
function toMinutesFloat(milliseconds) {
    const minutes = toSecondsFloat(milliseconds) / 60;
    const floored = Math.floor(minutes);
    const seconds = Math.floor((minutes - floored) / snm);
    const ago = {
        floored: floored,
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} : minutes, and ${seconds} : seconds ago`
    };
    return ago;
}
function minutesAgo(stamp) {
    const now = toMinutesFloat(Date.now()).minutes;
    const then = toMinutesFloat(stamp).minutes;
    const minutes = Math.floor(now - then);
    const seconds = Math.floor((now - then - Math.floor(now - then)) / snm);
    const ago = {
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} minutes, and ${seconds} seconds ago`
    };
    return ago;
}
function toHours(milliseconds) {
    let minutes = toMinutes(milliseconds);
    let hours = Math.floor(minutes / 60);
    return hours;
}
function toHoursFloat(milliseconds) {
    let minutes = toMinutesFloat(milliseconds);
    let hours = minutes / 60;
    return hours;
}
function toDays(milliseconds) {
    let hours = toHours(milliseconds);
    let days = Math.floor(hours / 24);
    return days;
}
function toDaysFloat(milliseconds) {
    let hours = toHoursFloat(milliseconds);
    let days = hours / 24;
    return days;
}
function toMonths(milliseconds) {}
function toMonthsFloat(milliseconds) {}
function toYears(milliseconds) {
    let days = toDays(milliseconds);
    let years = Math.floor(days / 365);
    return years;
}
function from(since) {
    const now = Date.now();
    const then = since.getTime();
    const monthsInYear = 1 / 12;
    const msInWeek = 604800000;
    const msInDay = 86400000;
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    const monthOf = date.months[since.getMonth()];
    const daysIn = date.monthMap[monthOf];
    const dayOf = since.getDate();
    const days = daysIn - dayOf;
    const leapSince = date.getLeaps(since.getFullYear(), new Date(now).getFullYear());
    let msAgo = now - then;
    let context = "ago";
    if (msAgo < 0) context = "til";
    msAgo = Math.abs(msAgo);
    const years = msAgo / msnYear;
    const monthsAgo = getRemainder(years);
    const months = monthsAgo / monthsInYear;
    // const weeks = monthsAgo / weeksInYear;
    const weeksAgo = Math.floor(msAgo / msInWeek);
    const daysAgo = Math.floor(msAgo / msInDay) + leapSince;
    const hoursAgo = Math.floor(msAgo / msInHour);
    const minutesAgo = Math.floor(msAgo / msInMin);
    const secondsAgo = Math.floor(msAgo / msInSec);
    const ago = {
        since: new Date(now),
        then: new Date(then),
        years: Math.floor(years),
        months: Math.floor(months),
        days: days,
        yearsAgo: years,
        weeksAgo: weeksAgo,
        daysAgo: daysAgo,
        hoursAgo: hoursAgo,
        minutesAgo: minutesAgo,
        secondsAgo: secondsAgo,
        leaps: leapSince,
        string: undefined
    };
    if (ago.yearsAgo >= 1) {
        if (ago.months >= 1) ago.string = `${ago.years} Years, ${ago.months} Months ${context}`;
        else if (ago.months < 1) ago.string = `${ago.years} Years ${context}`;
    } else if (ago.weeksAgo < 4 && ago.weeksAgo > 2) ago.string = `${ago.weeksAgo} Weeks ${context}`;
    else if (ago.daysAgo < 14 && ago.daysAgo > 2) ago.string = `${ago.daysAgo} Days ${context}`;
    else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
        if (ago.hoursAgo < 2 && ago.hoursAgo >= 1) ago.string = `${ago.hoursAgo} Hour ${context}`;
        else ago.string = `${ago.hoursAgo} Hours ${context}`;
    } else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) ago.string = `${ago.minutesAgo} Minutes ${context}`;
    else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) ago.string = `${ago.secondsAgo} Seconds ${ago}`;
    else if (ago.secondsAgo < 30) ago.string = `Just Now`;
    else return ago;
    ago.time = ago.string.split(" ")[0];
    ago.suffix = ago.string.split(" ")[1];
    ago["context"] = context;
    return ago;
}
function getRemainder(float) {
    return float - Math.floor(float);
}
// 333309223436
const testDay = new Date("2012-02-08T00:00:00");
const yesterday = new Date("2022-08-30T00:00:00");
const coupleHoursAgo = new Date("2022-08-31T16:32:00");
const nextHour = new Date(Date.now() + msnHour);
const thirtyTwoMintues = new Date(Date.now() + msnMinute * 32);
const testFrom = from(nextHour); // console.log(testFrom)

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eC8U0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Tabber", ()=>Tabber);
parcelHelpers.export(exports, "Modal", ()=>Modal);
parcelHelpers.export(exports, "DynamicModal", ()=>DynamicModal);
var _axios = require("axios");
var _axiosDefault = parcelHelpers.interopDefault(_axios);
var _observers = require("./Observers");
class Tabber {
    contructor() {
        this.current = undefined;
        this.previous = undefined;
    }
    setActive(value, event) {
        // console.log(value,this.current)
        if (this.current != value) {
            // console.log(this.current == value)
            if (this.current) this.current.close(event);
            this.previous = this.current;
            this.current = value;
        // console.log(value,this.current)
        }
    }
    closeActive(event) {
        if (this.current && this.current.state !== "inactive") this.current.close(event);
    }
}
class Modal {
    // basic modal class that handles open / close / toggle / methods
    // also hooks into the tabber interface to ensure only one modal of a group is open at once
    constructor(element){
        this.element = element;
        this.openTimeLine = (0, _observers.Observable).create(this);
        this.closeTimeLine = (0, _observers.Observable).create(this);
        this.togglers = new Set();
        this.openers = new Set();
        this.closers = new Set();
        this.status = "inactive";
    }
    set state({ status , event  }) {
        // console.log(status,this.status)
        if (status == "inactive") this.close(event);
        else if (status == "active") this.open(event);
        else console.log("active and inactive are the only two states needed here", status);
    }
    get state() {
        return this.status;
    }
    // delegates sideEffects to the onOpen observer then changes the "status"
    open(e) {
        if (!this.openTimeLine.isEmpty && this.state !== "active") this.openTimeLine.notify(e);
        this.status = "active";
    }
    // delegates sideEffects to the onClose observer then changes the "status"
    close(e) {
        if (!this.closeTimeLine.isEmpty && this.state !== "inactive") this.closeTimeLine.notify(e);
        this.status = "inactive";
    }
    // simple switch that calls open/close based on the current state of the modal
    toggle(event) {
        // console.log(this.state,this.status,this)
        if (this.state == "inactive") this.state = {
            status: "active",
            event
        };
        else if (this.state == "active") this.state = {
            status: "inactive",
            event
        };
        else console.log("err something went wrong with the modal toggler");
        return this;
    }
    // register DOM Element event listener that calls this toggle method
    bindToggler(...elements) {
        elements.forEach((element)=>{
            // console.log(element)
            if (this.togglers.has(element)) return `${element} is already bound as a toggler`;
            this.togglers.add(element);
            element.addEventListener("click", (e)=>this.toggle.call(this, e));
        });
        return this;
    }
    // register DOM Element event listener that calls this open method
    bindOpener(...elements) {
        elements.forEach((element)=>{
            // console.log(element)
            if (this.openers.has(element)) return `${element} is already bound as a opener`;
            this.openers.add(element);
            element.addEventListener("click", (e)=>this.open.call(this, e, true));
        });
        return this;
    }
    // register DOM Element event listener that calls this close method
    bindCloser(...elements) {
        elements.forEach((element)=>{
            // console.log(element)
            if (this.closers.has(element)) return `${element} is already bound as a closer`;
            this.closers.add(element);
            element.addEventListener("click", (e)=>this.close.call(this, e));
        });
        return this;
    }
    // registers a common Tab Interface between modals of a group 
    bindTabber(reference) {
        this.Tabber = reference;
        this.openTimeLine.prioritize(()=>this.Tabber.setActive(this));
        return this;
    }
    onOpen(...fns) {
        this.openTimeLine.subscribe(...fns);
        return this;
    }
    onClose(...fns) {
        this.closeTimeLine.subscribe(...fns);
        return this;
    }
}
class DynamicModal extends Modal {
    // adds functionality to handle a modals loader/suspense component
    // open/close observers will prioritize async fetching/showing data
    // comes with a render method that defines the static HTML as opposed to a basic modal with predefined HTML
    constructor(element, config = {
        type: "lazy",
        endpoint: undefined,
        dataHandler: undefined,
        requestHandler: undefined,
        responseHandler: undefined,
        hydrationHandler: undefined
    }){
        super(element);
        this.type = config.type || "lazy";
        this.endpoint = config.endpoint;
        this.suspense = `<div class="loading-container"><span class="loader"></span></div>`;
        this.errRes = `<div>Error Fetching Resources</div>`;
        this.handleData = config.dataHandler;
        this.handleRequest = config.requestHandler;
        this.handleResponse = config.responseHandler;
        this.handleHydration = config.hydrationHandler;
        this.ready = false;
        this.pending = false;
        this.hasChanged = false;
        this.initial = true;
        this.value = "";
        // super
        this.openTimeLine.prioritize(this.checkForUpdatesToRender.bind(this));
        if (config.type === "eager") this.update();
    }
    // set flags for next call to getData()
    setReady() {
        // console.log(`setting state to ready for ${this.element}`)
        this.pending = false;
        this.ready = true;
        if (this.initial) this.inital = false;
        return;
    }
    // set flags for next call to getData()
    setPending() {
        // console.log(`setting state to pending for ${this.element}`)
        this.pending = true;
        this.ready = false;
        return;
    }
    async update() {
        // console.log('triggering update')
        // set flags && result/value for getData to "bounce"
        this.value = this.suspense;
        this.setPending();
        this.renderSuspense();
        // call predefined request handler callback (DOM method) with suspense HTML string
        // if (handleRequest) handleRequest(this.suspense);
        // fetch resources from predefined endpoint
        // console.log(this.endpoint)
        const res = await (0, _axiosDefault.default).get(this.endpoint);
        // console.log(res.data)
        if (res) {
            // if res.ok call predifined request handler (DOM methods/tranformer) with the data and a flag
            // this.value = handleResponse('success', data)
            this.renderComponent(res.data);
            this.setReady();
        } else {
            // if !res.ok handle call response with an error flag 
            // this.value = handleResponse('error', data)
            this.renderError();
            this.setReady();
        }
        return this.value;
    }
    getData() {
        // if data is ready and hasn't changed || data is pending result will be an html string
        // return the html string
        if (this.ready && !this.hasChanged || this.pending) return this.value;
        // if not it means the data has changed or has never been fetched
        // so start the process of fetching data then return the loader
        this.update() // sets result to `<loading>` then returns a thenable
        ;
        return this.value;
    }
    notifyChange() {
        if (this.type === "lazy") {
            console.log("flagging change -- type lazy");
            this.hasChanged = true;
        }
        if (this.type === "eager") {
            console.log("flagging change -- type eager");
            this.update();
        }
    }
    checkForUpdatesToRender() {
        console.log("checking for updates");
        if (this.ready && !this.hasChanged || this.pending) {
            console.log("everything still checks out");
            return true;
        }
        if (this.hasChanged) {
            console.log("data has changed fetching changes");
            this.update();
            this.hasChanged = false;
            return false;
        } else if (this.initial) {
            console.log("rendering initial state");
            this.update();
            return false;
        }
    }
    renderSuspense() {
        this.element.innerHTML = this.suspense;
    }
    renderError() {
        this.element.innerHTML = this.errRes;
    }
    renderComponent(data) {
        this.element.innerHTML = this.handleData(data);
        if (this.handleHydration) // console.log('hydrating component')
        this.handleHydration(this.element);
    }
}

},{"axios":"jo6P5","./Observers":"4cTQY","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4cTQY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Observer", ()=>Observer);
parcelHelpers.export(exports, "Observable", ()=>Observable);
parcelHelpers.export(exports, "EventEmitter", ()=>EventEmitter);
parcelHelpers.export(exports, "Task", ()=>Task) //   OLD CODE SANDBOX
 /* 
class Notifier {
    constructor(target) {

        // extends a simple Observer pattern
        // separates STATEFUL methods as "Priorities"
        // from DOM methods as "subscribers"

        this.Target = target
        this.priorities = []
        this.subscribers = []

    }

    subscribe(fn) {
        this.subscribers.push(fn.bind(this.Target))
        return fn;
    }
    unsubscribe(fn) {
        this.subscribers = this.subscribers.filter(f => f != fn)
        return fn;
    }
    prioritize(fn) {
        this.priorities.push(fn.bind(this.Target))
        return fn
    }
    unprioritize(fn) {
        this.priorities = this.priorities.filter(f => f != fn);
    }
    notify() {
        if (this.hasPriorities) {
            this.priorities.forEach(fn => fn.call(this.Target))
        }
        if (!this.isEmpty)
            this.subscribers.forEach(fn => fn.call(this.Target));
    }

    get isEmpty() {
        return !(this.subscribers.length > 0);
    }
    get hasPriorities() {
            return this.priorities.length > 0
    }
}

*/ ;
class Observer {
    constructor(target){
        this.Target = target;
        this.subscribers = new Set();
        this.priorities = new Set();
    }
    subscribe(...fns) {
        fns.forEach((fn)=>{
            if (this.Target) fn = fn.bind(this.Target);
            this.subscribers.add(fn);
        });
        return this;
    }
    unsubscribe(fn) {
        this.subscribers.delete(fn);
        return this;
    }
    prioritize(fn) {
        if (this.Target) fn = fn.bind(this.Target);
        this.priorities.add(fn);
    }
    unprioritize(fn) {
        this.priorities.delete(fn);
    }
    notify(...values) {
        for (const fn of this.priorities)fn(...values);
        for (const fn of this.subscribers)fn(...values);
    }
    get isEmpty() {
        return this.subscribers.size === 0;
    }
    get hasPriorities() {
        return this.priorities.size > 0;
    }
}
class Observable {
    constructor(target){
        this.observer = new Observer(target);
    }
    subscribe(...fns) {
        this.observer.subscribe(...fns);
        return this;
    }
    unsubscribe(fn) {
        this.observer.unsubscribe(fn);
        return this;
    }
    prioritize(fn) {
        this.observer.prioritize(fn);
        return this;
    }
    unprioritize(fn) {
        this.observer.unprioritize(fn);
        return this;
    }
    notify(...values) {
        this.observer.notify(...values);
        return this;
    }
    get isEmpty() {
        return this.observer.isEmpty;
    }
    get hasPriorities() {
        return this.observer.hasPriorities;
    }
    get listeners() {
        return this.observer.listeners;
    }
    get priorities() {
        return this.observer.priorities;
    }
    static create(target) {
        return new Observable(target);
    }
    static observe(obj) {
        if (obj != null) {
            Object.assign(obj, {
                subscribe: this.subscribe.bind(obj),
                unsubscribe: this.unsubscribe.bind(obj),
                prioritize: this.prioritize.bind(obj),
                unprioritize: this.unprioritize.bind(obj),
                notify: this.notify.bind(obj),
                subscribe: this.subscribe.bind(obj),
                get isEmpty () {
                    return this.observer.isEmpty;
                },
                get hasPriorities () {
                    return this.observer.hasPriorities;
                }
            });
            return obj;
        }
    }
}
class EventEmitter {
    constructor(events){
        this.events = events || new Map();
    }
    on(event, listener) {
        if (!this.events.has(event)) this.events.set(event, new Observable());
        this.events.get(event).subscribe(listener);
    }
    once(event, listener) {
        const singleton = (...args)=>{
            listener(...args);
            this.off(event, singleton);
        };
        this.on(event, singleton);
    }
    off(event, listener) {
        if (!this.events.has(event)) return;
        this.events.get(event).unsubscribe(listener);
    }
    clear(event) {
        if (this.events.has(event)) return;
        this.events.set(event, new Observable());
    }
    emit(event, ...args) {
        if (!this.events.has(event)) return;
        this.events.get(event).notify(...args);
    }
}
class Task {
    constructor(promiseFn1){
        this.state = undefined; // [undefined || pending || ready ]
        this.result = undefined;
        this.task = promiseFn1;
        this.emitter = new EventEmitter();
    }
    async run(...args) {
        try {
            this.state = "pending";
            this.emit("pending");
            this.result = await promiseFn.call(...args);
            this.state = "ready";
            this.emit("ready", this.result);
        } catch (error) {
            console.error(error);
            this.state = "error";
            this.result = error;
            this.emit("error", error);
        }
    }
    register(event, listener) {
        this.emitter.on(event, listener);
        return this;
    }
    remove(event, listener) {
        this.emitter.off(event, listener);
        return this;
    }
    emit(event, ...args) {
        this.emitter.emit(event, ...args);
        return this;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"62IGe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Bucket", ()=>Bucket);
parcelHelpers.export(exports, "Bench", ()=>Bench);
parcelHelpers.export(exports, "Collection", ()=>Collection);
var _cursor = require("./structs/Cursor");
var _cursorDefault = parcelHelpers.interopDefault(_cursor);
class Bucket {
    constructor(id, type){
        this.items = new Map();
        this.identity = "bucket";
        this.id = id || "none";
        this.type = type || "none";
        this.idn = 0;
    }
    get size() {
        return this.items.size;
    }
    copyNode(node) {
        let copy = structuredClone(node);
        return copy;
    }
    copyValues() {
        const copies = Array.from(this.items.entries()).map(copyNode);
        return copies;
    }
    copyAll() {
        const copy = new Map();
        this.useKeys().forEach((key)=>{
            copy.set(key, copyNode(this.items.get(key)));
        });
        return copy;
    }
    push(key, value1, opts = {
        useRef: true,
        quiet: true
    }) {
        let obj = value1;
        if (this.type == "index") value1.cid = this.idn++;
        if (this.type == "collection") value1.id = this.idn++;
        if (!opts.useRef) obj = structuredClone(value1);
        if (key && !this.items.has(key)) {
            this.items.set(key, obj);
            if (!opts.quiet) console.log(`item ${key} was successfully pushed`);
            return true;
        }
        console.log("item was not pushed...", key, "already exists in you bucket");
        return false;
    }
    pluck(key) {
        if (this.items.has(key)) {
            this.items.delete(key);
            console.log(key, "successfully plucked");
            return true;
        } else {
            console.log(key, "its not here");
            return false;
        }
    }
    has(key) {
        return this.items.has(key);
    }
    use(key, opts = {
        useRef: true
    }) {
        if (!opts.useRef) return structuredClone(this.items.get(key));
        return this.items.get(key);
    }
    useValues(map = this.items) {
        const values = Array.from(map.values());
        return values;
    }
    useKeys(map = this.items) {
        const keyset = Array.from(map.keys());
        return keyset;
    }
    spread(map, opts) {
        let duplicates = this.compare(map);
        // prevent duplicates
        if (duplicates.length > 0) {
            console.log(`${duplicates.length} duplicates found in the keyset`);
            console.log("no items were added");
            console.log(duplicates);
            return false;
        }
        map.forEach(value, (key)=>{
            this.push(key, value, {
                quiet: true,
                ...opts
            });
        });
        return true;
    }
    compare(map) {
        let keys = this.useKeys(map);
        let keycheck = keys.map((key)=>{
            if (this.has(key)) return key;
        });
        return keycheck;
    }
    wipe() {
        this.items = new Map();
    }
}
class Bench {
    constructor(){
        this.refs = new Map();
    }
    get que() {
        const copies = Array.from(this.refs.entries()).map((index)=>{
            index = structuredClone(index);
            index["isCopy"] = true;
            return index;
        });
        return copies;
    }
    use(id, useCopy = false) {
        if (useCopy) return structuredClone(this.refs.get(id));
        return this.refs.get(id);
    }
    useValues() {
        return Array.from(this.refs.values());
    }
    useEntries() {
        return Array.from(this.refs.entries());
    }
    useCopies() {
        const copies = Array.from(this.refs.entries()).map((index)=>{
            index = structuredClone(index);
            index["isCopy"] = true;
            return index;
        });
        return copies;
    }
    push(key, value1) {
        if (!this.refs.has(key)) {
            this.refs.set(key, value1);
            return true;
        }
        console.log("this is already in your bench");
        return false;
    }
    pluck(id) {
        if (this.refs.has(id)) {
            this.refs.delete(id);
            return true;
        } else {
            console.log("its not here");
            return false;
        }
    }
    get size() {
        return this.refs.size;
    }
    has(id) {
        return this.refs.has(id);
    }
    wipe() {
        this.refs = new Map();
    }
}
class Collection {
    constructor(id, type){
        this.bucket = new Bucket(id, type);
        this.items = this.bucket.items;
        this.cursor = new (0, _cursorDefault.default)([]);
        this.indexes = {};
    }
    get size() {
        return this.bucket.size;
    }
    get keys() {
        return this.bucket.useKeys();
    }
    get values() {
        return this.bucket.useValues();
    }
    use(key) {
        return this.bucket.use(key, {
            useRef: true
        });
    }
    useCopy(key) {
        return this.bucket.use(key);
    }
    addOne(key, value1, opts) {
        let status = this.bucket.push(key, value1, opts);
        if (status) this.cursor.addOne(key);
        return status;
    }
    addMany(map, opts) {
        let status = this.bucket.spread(map, opts);
        if (status) this.cursor.addMany(Array.from(map.keys()));
        return status;
    }
    updateValues(map, opts = {
        startingIndex: undefined
    }) {
        this.bucket.wipe();
        this.bucket.spread(map);
        this.cursor.update(this.bucket.useKeys(), opts.startingIndex);
        return this.items;
    }
    updateIndex() {}
    updateId(id) {
        this.id = id;
    }
    has(key) {
        return this.bucket.has(key);
    }
    remove(key) {
        let status = this.bucket.pluck(key);
        if (status) this.cursor.pluck(this.items.useKeys().indexOf(key));
    }
    drop() {
        this.items = new Bucket();
        this.cursor = new (0, _cursorDefault.default)([]);
    }
}

},{"./structs/Cursor":"lvUnV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["gcbWt","gLLPy"], "gLLPy", "parcelRequire35ce")

//# sourceMappingURL=index.ffc03c4e.js.map
