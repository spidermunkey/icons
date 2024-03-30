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
})({"iZmuB":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "7051237ee4996a4b";
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

},{}],"6YvUA":[function(require,module,exports) {
var _indexJs = require("./index.js");
window.mojo = (0, _indexJs.mojo);
for(const prop in 0, _indexJs.mojo)window[prop] = (0, _indexJs.mojo)[prop];
// console.log(window.clearField = mojo.clearField)
console.log(clearField);
console.log(getRoot);

},{"./index.js":"bJptM"}],"bJptM":[function(require,module,exports) {
// import * as dateLib from './javascript/date.js';
// import * as domLib from './javascript/dom.js';
// import * as helpers from './javascript/helpers.js';
// import * as modals from './javascript/modals.js';
// import * as observables from './javascript/observables.js';
// import * as sliders from './javascript/sliders.js';
// import * as structs from './javascript/structs.js';
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "mojo", ()=>mojo);
var _boilerJs = require("./javascript/lib/boiler.js");
var _utilsJs = require("./javascript/lib/utils.js");
const mojo = {
    ..._boilerJs,
    ..._utilsJs
};

},{"./javascript/lib/boiler.js":"7pxMs","./javascript/lib/utils.js":"c9n9z","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7pxMs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getRoot", ()=>getRoot);
parcelHelpers.export(exports, "getVar", ()=>getVar);
parcelHelpers.export(exports, "setVar", ()=>setVar);
parcelHelpers.export(exports, "addClass", ()=>addClass);
parcelHelpers.export(exports, "removeClass", ()=>removeClass);
parcelHelpers.export(exports, "$", ()=>$);
parcelHelpers.export(exports, "$$", ()=>$$);
parcelHelpers.export(exports, "log", ()=>log);
parcelHelpers.export(exports, "err", ()=>err);
parcelHelpers.export(exports, "each", ()=>each);
parcelHelpers.export(exports, "listenAll", ()=>listenAll);
parcelHelpers.export(exports, "listen", ()=>listen);
parcelHelpers.export(exports, "responseOk", ()=>responseOk);
parcelHelpers.export(exports, "throttle", ()=>throttle);
parcelHelpers.export(exports, "nextTick", ()=>nextTick);
parcelHelpers.export(exports, "toDecimal", ()=>toDecimal);
parcelHelpers.export(exports, "focusInput", ()=>focusInput);
parcelHelpers.export(exports, "followMouseFromEventTarget", ()=>followMouseFromEventTarget);
parcelHelpers.export(exports, "followMouseFromCoords", ()=>followMouseFromCoords);
parcelHelpers.export(exports, "createToggleList", ()=>createToggleList);
parcelHelpers.export(exports, "frag", ()=>frag);
parcelHelpers.export(exports, "div", ()=>div);
parcelHelpers.export(exports, "ul", ()=>ul);
parcelHelpers.export(exports, "li", ()=>li);
parcelHelpers.export(exports, "span", ()=>span);
parcelHelpers.export(exports, "input", ()=>input);
parcelHelpers.export(exports, "appendElement", ()=>appendElement);
parcelHelpers.export(exports, "setBlank", ()=>setBlank);
parcelHelpers.export(exports, "wipeElement", ()=>wipeElement);
parcelHelpers.export(exports, "capitalize", ()=>capitalize);
parcelHelpers.export(exports, "uppercase", ()=>uppercase);
parcelHelpers.export(exports, "lowercase", ()=>lowercase);
parcelHelpers.export(exports, "exclaim", ()=>exclaim);
parcelHelpers.export(exports, "first", ()=>first);
parcelHelpers.export(exports, "last", ()=>last);
parcelHelpers.export(exports, "clearField", ()=>clearField);
parcelHelpers.export(exports, "clearForm", ()=>clearForm);
parcelHelpers.export(exports, "focusInputOnClick", ()=>focusInputOnClick);
parcelHelpers.export(exports, "allChecked", ()=>allChecked);
parcelHelpers.export(exports, "noneChecked", ()=>noneChecked);
parcelHelpers.export(exports, "oneChecked", ()=>oneChecked);
parcelHelpers.export(exports, "oneUnchecked", ()=>oneUnchecked);
parcelHelpers.export(exports, "disable", ()=>disable);
parcelHelpers.export(exports, "enable", ()=>enable);
parcelHelpers.export(exports, "throttleInput", ()=>throttleInput);
parcelHelpers.export(exports, "check", ()=>check);
parcelHelpers.export(exports, "uncheck", ()=>uncheck);
parcelHelpers.export(exports, "checkAll", ()=>checkAll);
parcelHelpers.export(exports, "uncheckAll", ()=>uncheckAll);
parcelHelpers.export(exports, "currentTime", ()=>currentTime);
parcelHelpers.export(exports, "mouseClickRight", ()=>mouseClickRight);
parcelHelpers.export(exports, "mouseClickLeft", ()=>mouseClickLeft);
parcelHelpers.export(exports, "isNumberKey", ()=>isNumberKey);
parcelHelpers.export(exports, "highlightInput", ()=>highlightInput);
parcelHelpers.export(exports, "isBackspaceKey", ()=>isBackspaceKey);
parcelHelpers.export(exports, "isEmptyNumberInput", ()=>isEmptyNumberInput);
parcelHelpers.export(exports, "elementClicked", ()=>elementClicked);
parcelHelpers.export(exports, "toClipboard", ()=>toClipboard);
parcelHelpers.export(exports, "mergeObj", ()=>mergeObj);
parcelHelpers.export(exports, "uuid", ()=>uuid);
const root = document.documentElement;
const docStyle = root.style;
function getRoot(element) {
    return element.documentElement.style;
}
function getVar(variableName) {
    return getComputedStyle(root).getPropertyValue(variableName);
}
function setVar(variableName, value) {
    return root.style.setProperty(variableName, value);
}
function addClass(element, classToAdd) {
    element.classList.add(classToAdd);
}
function removeClass(element, classToRemove) {
    element.classList.remove(classToRemove);
}
function $(arg, context = document) {
    const element = context.querySelector(arg);
    if (!element || !(element instanceof Element)) return null;
    element.listen = function(callback, listener = "click", capture = false) {
        element.addEventListener(listener, callback, capture);
        return element;
    };
    return element;
}
function $$(arg, element = document) {
    const array = Array.from(element.querySelectorAll(arg));
    return array;
}
function log() {
    console.log.apply(this, arguments);
}
function err() {
    console.log.apply(this, arguments);
}
function each(argList, callback) {
    return argList.map(callback);
}
function listenAll(elements, callback, listener = "click") {
    each(elements, (element)=>listen(element, callback, listener));
    return elements;
}
function listen(element = document, callback, listener = "click", capture = false) {
    if (!element) {
        console.warn("no element passed to listen export function");
        return;
    }
    // let context = this;
    element.addEventListener(listener, function(event) {
        // callback.element = element;
        // callback.event = event;
        callback.apply(callback, [
            event,
            ...arguments,
            element
        ]);
    }, capture);
}
function responseOk(response) {
    // axios
    return response.status === 200 && response.statusText === "OK";
}
function throttle(fn, wait = 60) {
    var time = Date.now();
    return function() {
        if (time + wait - Date.now() < 0) {
            fn.call(this, ...arguments);
            time = Date.now();
        } else return;
    };
}
function nextTick(callback) {
    return setTimeout(callback, 0);
}
function toDecimal(num) {
    return num / 100;
}
function focusInput(input, value) {
    if (!!value) input.value = value;
    input.select();
    return input;
}
function followMouseFromEventTarget(event) {
    const { currentTarget: target  } = event;
    const rect = target.getBoundingClientRect(), mouseXFromTarget = e.clientX - rect.left, mouseYFromTarget = e.clientY - rect.top;
    return {
        x: mouseXFromTarget,
        y: mouseYFromTarget,
        mouseX: e.clientX,
        mouseY: e.clientY
    };
}
function followMouseFromCoords(coords) {
    return function(event) {
        const { clientX , clientY  } = event;
        const { x , y  } = coords;
        return {
            x: clientX - x,
            y: clientY - y,
            mouseX: clientX,
            mouseY: clientY
        };
    };
}
function createToggleList(elements, classList = [
    "active"
]) {
    // console.log('creating a toggle list with elements',elements,'toggling between the class(s)',classList)
    function toggle(element) {
        elements.forEach((element)=>element.classList.remove(...classList));
        element.classList.add(...classList);
    }
    elements.forEach((element)=>{
        // console.log(element)
        element.addEventListener("click", toggle);
    });
    return {
        classList,
        elements: [
            ...elements
        ],
        toggle,
        add: function(element) {
            this.elements.push(element);
        }
    };
}
function frag() {
    return document.createDocumentFragment();
}
function div(classList = [], styleProps = {}, attrs = {}, children) {
    const div = document.createElement("div");
    if (classList.length > 0) div.classList.add(...classList);
    if (styleProps) for(prop in styleProps){
        console.log(prop);
        console.log(styleProps[prop]);
        div.style[prop] = styleProps[prop];
    }
    if (children) children.forEach(div.appendChild);
    return div;
}
function ul() {
    return document.createElement("ul");
}
function li() {
    return document.createElement("li");
}
function span() {
    return document.createElement("span");
}
function input() {
    return document.createElement("input");
}
function appendElement(parent, child) {
    parent.append(child);
}
function setBlank(destination) {
    const element = document.createElement("div");
    destination.appendChild(element);
    return element;
}
function wipeElement(element) {
    element.innerHTML = "";
    return element;
}
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}
function uppercase(str) {
    return [
        ...str
    ].map((x)=>x = x.toUpperCase()).join("");
}
function lowercase(str) {
    return [
        ...str
    ].map((x)=>x = x.toLowerCase()).join("");
}
function exclaim(str) {
    return str + "!";
}
function first(value) {
    return value[0];
}
function last(value) {
    return value[value.length - 1];
}
function clearField(input) {
    input.value = "";
    return input;
}
function clearForm(form) {
    $$("input", form).map(clearField);
    return form;
}
function focusInputOnClick(event, placholder) {
    let input = event.target;
    if (input.nodeName !== "INPUT") return;
    if (placholder && typeof placholder == "string") input.value = placholder;
    // console.log(placholder)
    input.select();
    return input;
}
function allChecked(inputGroup) {
    return inputGroup.every((inp)=>inp.checked == true);
}
function noneChecked(inputGroup) {
    return inputGroup.every((inp)=>inp.checked == false);
}
function oneChecked(inputGroup) {
    return inputGroup.some((inp)=>inp.checked == true);
}
function oneUnchecked(inputGroup) {
    return inputGroup.some((inp)=>inp.checked == false);
}
function disable(submitInput) {
    submitInput.disabled = true;
}
function enable(submitInput) {
    submitInput.disabled = "";
}
function throttleInput(input, time) {
    /* 
        https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
        The disabled attribute is supported by 
        <button>, <fieldset>, <optgroup>, <option>, <select>, <textarea> and <input>.
    */ input.disabled = true;
    setTimeout(()=>input.disabled = false, time);
    return;
}
function check(input) {
    input.checked = true;
}
function uncheck(input) {
    input.checked = false;
}
function checkAll(inputGroup) {
    inputGroup.forEach((inp)=>inp.checked = true);
}
function uncheckAll(inputGroup) {
    inputGroup.forEach((inp)=>inp.checked = false);
}
function currentTime() {
    return new Date().toLocaleTimeString();
}
function mouseClickRight(event) {
    return event.button === 2;
}
function mouseClickLeft(event) {
    return event.button === 0;
}
function isNumberKey(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}
function highlightInput(input) {
    input.focus();
    input.select();
    return input;
}
function isBackspaceKey(event) {
    return event.keyCode == 8;
}
function isEmptyNumberInput(input) {
    return input.value === 0 || input.value === "0" || input.value === "";
}
function elementClicked(elementClass, event) {
    return event.target.closest(elementClass);
}
function toClipboard(value, message) {
    window.navigator.clipboard.writeText(value);
    if (message) console.log("message from clipboard", message);
}
function mergeObj(targetObj, mergingObj) {
    return {
        ...structuredClone(targetObj),
        ...structuredClone(mergingObj)
    };
}
function uuid() {
    let timmy = Date.now().toString(36).toLocaleLowerCase();
    // random high number
    let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    // random high num to hex => "005EIPQUTQ64" => add 0s to make sure its 12digits
    randy = randy.toString(36).slice(0, 12).padStart(12, "0").toLocaleUpperCase();
    // coerce into a string
    return "".concat(timmy, "-", randy);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"c9n9z":[function(require,module,exports) {
// -------------------------
// STRUCTS
// -----------------------------------------
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Cursor", ()=>Cursor);
parcelHelpers.export(exports, "Bucket", ()=>Bucket);
parcelHelpers.export(exports, "Collection", ()=>Collection);
// -------------------------
// OBSERVABLES
// -----------------------------------------
parcelHelpers.export(exports, "Observer", ()=>Observer);
parcelHelpers.export(exports, "Observable", ()=>Observable);
parcelHelpers.export(exports, "EventEmitter", ()=>EventEmitter);
parcelHelpers.export(exports, "Task", ()=>Task);
// -------------------------
// COMPONENTS
// -----------------------------------------
parcelHelpers.export(exports, "MenuList", ()=>MenuList);
parcelHelpers.export(exports, "MenuListItem", ()=>MenuListItem);
parcelHelpers.export(exports, "Modal", ()=>Modal);
parcelHelpers.export(exports, "DynamicModal", ()=>DynamicModal);
parcelHelpers.export(exports, "Toggler", ()=>Toggler);
parcelHelpers.export(exports, "Tabber", ()=>Tabber);
parcelHelpers.export(exports, "Slider", ()=>Slider);
parcelHelpers.export(exports, "MouseTrackingSlider", ()=>MouseTrackingSlider);
// -------------------------
// DATE & TIME
// -----------------------------------------
parcelHelpers.export(exports, "DateTime", ()=>DateTime);
// refactor timer to be used without the dom.
// add TimerElement and TrackerElements to build on top of refactor
parcelHelpers.export(exports, "Time", ()=>Time);
parcelHelpers.export(exports, "Timer", ()=>Timer);
parcelHelpers.export(exports, "TimeTracker", ()=>TimeTracker);
parcelHelpers.export(exports, "scrollTrap", ()=>scrollTrap);
class Cursor {
    // Allows extends a basic array allowing easy access to the next and previous elements in a list
    // according to a pointer in memory
    // EXPECTS INDEXES TO START FROM 1 INSTEAD OF ZERO
    // INDEX OF 0 == "FIRST"
    // INDEX OF length-1 = "LAST"
    // expects callers to add one when using array indexes
    constructor(array, startingIndex = 1){
        if (!Array.isArray(array)) throw new Error(`expecting an array you passed ${array}`);
        if (isNaN(startingIndex)) throw new Error(`expecting a number for startingIndex you passed ${startingIndex}`);
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
        this.pointer = startingIndex;
        this.items = [
            "first",
            ...elements,
            "last"
        ];
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
class Collection {
    constructor(){
        this.bucket = new Bucket();
        this.cursor = new Cursor([]);
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
        this.items = new Bucket();
        this.cursor = new Cursor([]);
    }
}
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
    on(event, ...listeners) {
        if (!this.events.has(event)) this.events.set(event, new Observable());
        listeners.forEach((listener)=>{
            this.events.get(event).subscribe(listener);
        });
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
class MenuList {
    constructor(listOfNames, classList, dataset){
        this.element = document.createElement("ul");
        this.element.classList.add(...classList);
        this.items = [];
        listOfNames.forEach((name)=>this.addItem(name));
    }
    get clone() {
        return this.element.cloneNode(true);
    }
    addItem(name) {
        const newLink = new MenuListItem(name);
        // console.log('adding menu item ',name, ' to ', this);
        this.element.append(newLink.element);
        this.items.push(newLink);
        return newLink;
    }
    render(container) {
        container.innerHTML = "";
        container.append(this.element);
    }
    append(container) {
        container.append(this.clone);
    }
    replaceItems(listOfNames) {
        this.innerHTML = "";
        this.items = [];
        listOfNames.forEach(this.addItem);
    }
    updateItem(element, callback) {
        this.items.forEach((MenuListItem)=>{
            if (MenuListItem.element == element) callback(MenuListItem);
        });
    }
    updateItemName(element, name) {
        this.items.forEach((MenuListItem)=>{
            if (MenuListItem.element == element) MenuListItem.name = name;
        });
    }
}
class MenuListItem {
    constructor(name, classNames = [], contentClassNames = []){
        this.name = name;
        this.element = document.createElement("li");
        this.content = document.createElement("span");
        this.element.append(this.content);
        this.element.classList.add(...classNames);
        this.content.classList.add(...contentClassNames);
        this.element.dataset.tab = name;
        this.content.textContent = name;
    }
    setName(newName) {
        this.content.textContent = newName;
        this.element.dataset.tab = newName;
        this.name = newName;
    }
}
class Modal {
    // basic modal class that handles open / close / toggle / methods
    // also hooks into the tabber interface to ensure only one modal of a group is open at once
    constructor(element, toggleClass = "active"){
        this.element = element;
        this.openTimeLine = Observable.create(this);
        this.closeTimeLine = Observable.create(this);
        this.togglers = new Set();
        this.openers = new Set();
        this.closers = new Set();
        this.status = "inactive";
        this.toggleClass = toggleClass || "active";
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
        this.element.classList.add(this.toggleClass);
        if (!this.openTimeLine.isEmpty && this.state !== "active") this.openTimeLine.notify(e);
        this.status = "active";
    }
    // close modal
    // change [ status ]
    close(e) {
        this.element.classList.remove(this.toggleClass);
        if (!this.closeTimeLine.isEmpty && this.state !== "inactive") this.closeTimeLine.notify(e);
        this.status = "inactive";
    }
    // open - close modal
    // change status
    toggle(event) {
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
        // console.dir('BINDING toggle element(s)', elements)
        elements.forEach((element)=>{
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
        const res = await axios.get(this.endpoint);
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
        this.update(); // sets result to `<loading>` then returns a thenable
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
class Toggler {
    constructor(button, modal, state){
        this.state = state || "inactive";
        this.modal = modal;
        this.button = button;
    // button.addEventListener('click', this.toggle.bind(this))
    }
    enable() {
        this.modal.setAttribute("active", "true");
        this.button.classList.add("active");
        this.state = "active";
    }
    disable() {
        this.modal.setAttribute("active", "false");
        this.button.classList.remove("active");
        this.state = "inactive";
    }
    toggle() {
        if (this.state === "active") {
            this.disable();
            return;
        }
        if (this.state === "inactive") {
            this.enable();
            return;
        }
    }
}
function Tabber() {
    this.current = undefined;
    this.previous = undefined;
    this.setActive = function(value, event) {
        if (this.current != value) {
            if (this.current) this.current.close(event);
            this.previous = this.current;
            this.current = value;
        }
    };
    this.closeActive = function(event) {
        if (this.current && this.current.state !== "inactive") this.current.close(event);
    };
}
class Slider {
    constructor(targetElement, actions = {}){
        const self = this;
        this.container = targetElement;
        this.track = targetElement.querySelector(".slider-track") || targetElement;
        this.handle = targetElement.querySelector(".slider-handle") || targetElement.querySelector(".slider-handle");
        console.log("container", targetElement, "container", this.container, "track", this.track);
        this.onMouseDown = actions.onMouseDown || function(state) {
            console.log("mouse down", state);
        };
        this.onMouseUp = actions.onMouseUp || function(state) {
            console.log("mouse up", state);
        };
        this.onMouseMove = function(...args) {
            requestAnimationFrame(actions.onMouseMove.bind(this, ...args));
        };
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
        this.handle.addEventListener("mousedown", this.handleDrag.bind(this), true);
        this.track.addEventListener("click", this.handleClick.bind(this), true);
    }
    handleDrag(event) {
        event.stopImmediatePropagation();
        let initialMouseUpIfAny = document.onmouseup;
        let controller = new AbortController();
        let state;
        document.addEventListener("mousemove", update.bind(this), {
            capture: true,
            signal: controller.signal
        });
        document.onmouseup = abort.bind(this);
        function update(event) {
            state = this.update(event);
            this.onMouseMove(state);
        }
        function cleanup() {
            document.removeEventListener("mousemove", update.bind(this), {
                capture: true,
                signal: controller.signal
            });
            document.onmouseup = initialMouseUpIfAny;
        }
        function abort() {
            controller.abort();
            this.onMouseUp(state);
            nextTick(cleanup);
        }
    }
    handleClick(event) {
        if (event.target == this.handle) return;
        let state = this.update(event);
        this.onMouseDown(state);
        this.onMouseUp(state);
    }
    update(event) {
        this.state = this.setHandle(this.getDistanceTraveled(event));
        return this.state;
    }
    setHandle(distanceTraveled) {
        let clamped = this.coords.clamp(distanceTraveled);
        this.handle.style.transform = `translateX(${clamped - this.coords.handleMidpoint}px)`;
        if (distanceTraveled <= 0) return {
            px: 0,
            pct: 0,
            deg: 0
        };
        if (distanceTraveled >= this.coords.track.width) return {
            px: this.coords.track.width,
            pct: 100,
            deg: 360
        };
        let distance = Math.trunc(distanceTraveled);
        let distanceInPercent = Math.trunc(distanceTraveled / this.coords.track.width * 100);
        let distanceInDegrees = Math.trunc(distanceTraveled / this.coords.track.width * 360);
        let values = {
            px: distance,
            pct: distanceInPercent,
            deg: distanceInDegrees
        };
        return values;
    }
    reset() {
        return this.update(0);
    }
    disable() {
        this.handle.removeEventListener("mousedown", this.handleDrag.bind(this), true);
        this.track.removeEventListener("mousedown", this.handleClick.bind(this), true);
        return this.state;
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
        this.state = this.setHandle(this.convertValue(type, value));
        // console.log('state', state, 'slider state', this.state)
        return this.state;
    }
    setDegrees(value) {
        return this.setFrom("deg", value);
    }
    setPercent(value) {
        return this.setFrom("pct", value);
    }
    setPixels(value) {
        this.state = this.setHandle(value);
        return this.state;
    }
}
class MouseTrackingSlider {
    constructor(targetElement, actions = {}){
        this.initialPosition_x = null;
        this.initialPosition_y = null;
        this.targetElement = targetElement;
        this.onMouseMove = actions.onMouseMove || function() {
            console.log(targetElement, "triggering mouseMove");
        };
        this.onMouseDown = actions.onMouseDown || function() {
            console.log(targetElement, "triggered mouseDown");
        };
        this.onMouseUp = actions.onMouseUp || function() {
            console.log(targetElement, "triggered mouseUp");
        };
        targetElement.addEventListener("mousedown", this.track.bind(this), true);
        targetElement.addEventListener("click", this.handleClick.bind(this));
    }
    track(event) {
        if (event.button !== 0) return;
        if (!this.initialPosition_x) this.initialPosition_x = event.pageX;
        if (!this.initialPosition_y) this.initialPosition_y = event.pageY;
        let controller = new AbortController();
        document.addEventListener("mousemove", this.handleDrag.bind(this), {
            signal: controller.signal
        }, true);
        document.addEventListener("mouseup", ()=>{
            controller.abort();
            this.initialPosition_x = null;
            this.initialPosition_y = null;
            event.stopImmediatePropagation();
        });
    }
    handleDrag(event) {
        let distanceFromInitialPosition_x = event.clientX - this.initialPosition_x;
        let distanceFromInitialPosition_y = event.clientY - this.initialPosition_y;
        let debounced_x = Math.floor(distanceFromInitialPosition_x / 3);
        let debounced_y = Math.floor(distanceFromInitialPosition_y / 3);
        this.onMouseMove({
            x: Number(debounced_x),
            y: Number(debounced_y),
            event
        });
    }
    handleClick(event) {
        if (!this.initialPosition_x) this.initialPosition_x = event.pageX;
        if (!this.initialPosition_y) this.initialPosition_y = event.pageY;
        let x = event.clientX - this.initialPosition_x;
        let y = event.clientY - this.initialPosition_y;
        this.onMouseUp({
            x,
            y,
            event
        });
    }
}
class DateTime {
    constructor(dateObject){}
    static mns = 0.001;
    static snm = 1 / 60;
    static mnh = 1 / 60;
    static hnd = 1 / 24;
    static dny = 1 / 365;
    static mny = 1 / 12;
    static msns = 1000;
    static msnMinute = 60000;
    static msnHour = 3600000;
    static msnDay = 86400000;
    static msnYear = DateTime.msnDay * 365;
    // static thisYear() {
    //     let d = new Date()
    //     console.log(d.getFullYear())
    // }
    static daysIn(month) {
        const abbrv = month.slice(0, 3);
        if (DateTime.monthMap[month]) return DateTime.monthMap[month];
        else if (DateTime.monthMap[abbrv]) return DateTime.monthMap[abbrv];
    }
    static dayMap = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thurday",
        5: "Friday",
        6: "Saturday",
        7: null,
        toArray () {
            const arr = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday"
            ];
            arr.abbrv = arr.abbreviate = ()=>arr.map(slice.bind(months, [
                    0,
                    3
                ]));
            return arr;
        }
    };
    static get days() {
        return DateTime.dayMap.toArray();
    }
    static get monthMap() {
        return {
            january: 31,
            get february () {
                if (DateTime.thisYearIsLeap()) return 29;
                return 28;
            },
            march: 31,
            april: 30,
            may: 31,
            june: 30,
            july: 31,
            august: 31,
            september: 30,
            october: 31,
            november: 30,
            december: 31
        };
    }
    static get months() {
        const arr = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];
        arr.abbrv = arr.abbreviate = ()=>arr.map(slice.bind(arr, [
                0,
                3
            ]));
        return arr;
    }
    static get clock() {
        const curDate = new Date();
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];
        const months1 = [
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
            "December"
        ];
        const hours = curDate.getHours();
        const minutes = curDate.getMinutes();
        const seconds = curDate.getSeconds();
        const context = hours >= 12 ? "pm" : "am";
        return {
            dow: days[curDate.getDay()],
            month: months1[curDate.getMonth()],
            date: curDate.getDate(),
            hour: hours <= 12 ? hours : hours - 12,
            minute: minutes,
            second: seconds,
            miliseconds: curDate.getMilliseconds(),
            context,
            time: {
                hour: hours <= 12 ? hours.toString() : (hours - 12).toString(),
                minute: minutes >= 10 ? minutes.toString() : minutes.toString().padStart(2, "0"),
                second: seconds >= 10 ? seconds.toString() : seconds.toString().padStart(2, "0"),
                context,
                get string () {
                    return [
                        this.hour,
                        this.minute,
                        this.second
                    ].join(":") + " " + context;
                },
                get default () {
                    return [
                        this.hour,
                        this.minute
                    ].join(":") + " " + context;
                }
            }
        };
    }
    static get time() {
        return DateTime.clock.time.default;
    }
    static date = {
        standard: undefined,
        default: undefined,
        universal: undefined,
        east: undefined,
        west: undefined,
        central: undefined,
        leap: DateTime.thisYearIsLeap(),
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
        get monthMap () {
            return {
                January: 31,
                get February () {
                    if (DateTime.date.leap) return 29;
                    return 28;
                },
                March: 31,
                April: 30,
                May: 31,
                June: 30,
                July: 31,
                August: 31,
                September: 30,
                October: 31,
                November: 30,
                December: 31
            };
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
        ]
    };
    static now() {
        return new Date();
    }
    static stamp() {
        return {
            day: DateTime.today(),
            month: DateTime.thisMonth(),
            year: DateTime.thisYear(),
            date: DateTime.currentDate(),
            time: DateTime.currentTime(),
            isLeap: DateTime.thisYearIsLeap(),
            ms: Date.now()
        };
    }
    static compareStamps(current, prev) {
        return DateTime.from(new Date(current.ms), prev.ms);
    }
    static weekOf(stamp) {}
    static monthOf(stamp) {}
    static yearOf(stamp) {}
    static today() {
        return DateTime.date.days[new Date().getDay()];
    }
    static currentTime() {
        return new Date().toLocaleTimeString();
    }
    static currentDate() {
        return new Date().getDate();
    }
    static thisMonth() {
        return DateTime.date.months[new Date().getMonth()];
    }
    static thisYear() {
        return new Date().getFullYear();
    }
    static thisYearIsLeap() {
        return DateTime.isLeap(DateTime.thisYear());
    }
    static isLeap(year) {
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }
    static getLeaps(to, from) {
        function countFrom(lowest, highest) {
            let leapSince = 0;
            for(let i = lowest; i <= highest; i++)if (DateTime.isLeap(i)) leapSince++;
            return leapSince;
        }
        return to < from ? countFrom(to, from) : countFrom(from, to);
    }
    static daysInMonth(month, year) {
        let days = date.monthMap[month];
        if (date.isLeap(year && (month == "February" || month == "Feb"))) days = 29;
        return days;
    }
    static msnMonth(month, year) {
        let days = daysInMonth(month, year);
        let msInMonth = days * DateTime.msnDay;
        return msInMonth;
    }
    static hoursAgo(stamp) {
        const then = toHours(stamp);
        const now = toHours(Date.now());
        const diffy = now - then;
        return diffy;
    }
    static secondsAgo(stamp) {
        const then = toSecondsFloat(stamp);
        const now = toSecondsFloat(Date.now());
        const diffy = now - then;
        const ago = {
            seconds: Math.floor(diffy),
            milliseconds: null
        };
        return ago;
    }
    static secondsLeft(milliseconds) {
        const minutes = toMinutesFloat(milliseconds);
        return minutes;
    }
    static toSeconds(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        return seconds;
    }
    static toSecondsFloat(milliseconds) {
        const seconds = milliseconds / 1000;
        return seconds;
    }
    static toMinutes(milliseconds) {
        let seconds = toSeconds(milliseconds);
        let minutes = Math.floor(seconds / 60);
        return minutes;
    }
    static toMinutesFloat(milliseconds) {
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
    static minutesAgo(stamp) {
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
    static toHours(milliseconds) {
        let minutes = toMinutes(milliseconds);
        let hours = Math.floor(minutes / 60);
        return hours;
    }
    static toHoursFloat(milliseconds) {
        let minutes = toMinutesFloat(milliseconds);
        let hours = minutes / 60;
        return hours;
    }
    static toDays(milliseconds) {
        let hours = toHours(milliseconds);
        let days = Math.floor(hours / 24);
        return days;
    }
    static toDaysFloat(milliseconds) {
        let hours = toHoursFloat(milliseconds);
        let days = hours / 24;
        return days;
    }
    static toMonths(milliseconds) {}
    static toMonthsFloat(milliseconds) {}
    static toYears(milliseconds) {
        let days = toDays(milliseconds);
        let years = Math.floor(days / 365);
        return years;
    }
    // const minutesInYear = msnYear;
    static from(since, compare = Date.now()) {
        // since Date , compareMILISECONDS
        const now = compare;
        const then = since.getTime();
        const nowDate = new Date(compare);
        console.log(now, then);
        const monthsInYear = 1 / 12;
        const msnYear = DateTime.msnDay * 365;
        const msInWeek = 604800000;
        const msInDay = 86400000;
        const msInHour = 3600000;
        const msInMin = 60000;
        const msInSec = 1000;
        const minutesInHour = 60;
        const secondsInMinute = 60;
        /* TODO
  
              DAYS ONLY WORKS IF IN SAME MONTH
              CALCULATE MONTHS SINCE AND AMOUNT OF DAYS BETWEEN EACH MONTH
              THEN GET DAYS
  
              MONTHS ALGO IS WRONG TOO!
              WEEKS ALGO IS WRONG!
          */ const monthOf = DateTime.months[since.getMonth()];
        const prevMonthOf = DateTime.months[nowDate.getMonth()];
        const daysIn = DateTime.monthMap[monthOf];
        const prevDaysIn = DateTime.monthMap[prevMonthOf];
        const dayOf = since.getDate();
        const prevDayOf = nowDate.getDate();
        // const days = daysIn - dayOf;
        const days = Math.abs(dayOf - prevDayOf);
        const leapSince = DateTime.getLeaps(since.getFullYear(), new Date(now).getFullYear());
        let msAgo = now - then;
        let context = "ago";
        if (msAgo < 0) context = "til";
        msAgo = Math.abs(msAgo);
        console.log(msAgo);
        const years = msAgo >= msnYear ? msAgo / msnYear : 0;
        const monthsAgo = DateTime.getRemainder(years);
        // const months = monthsAgo / monthsInYear;
        // NULL SEE TODO
        const weeksAgo = msAgo >= msInWeek ? Math.floor(msAgo / msInWeek) : 0;
        // const weeks = monthsAgo / weeksInYear;
        // NULL SEE TODO
        const daysAgo = msAgo >= msInDay ? Math.floor(msAgo / msInDay) + leapSince : 0;
        // NULL SEE TODO
        const hoursAgo = msAgo >= msInHour ? Math.floor(msAgo / msInHour) : 0;
        const hours = hoursAgo;
        const minutesAgo = msAgo >= msInMin ? Math.floor(msAgo / msInMin) : 0;
        const minutes = Math.floor(DateTime.getRemainder(msAgo / msInHour) * minutesInHour);
        const secondsAgo = msAgo >= msInSec ? Math.floor(msAgo / msInSec) : 0;
        const seconds = Math.floor(DateTime.getRemainder(msAgo / msInMin) * secondsInMinute);
        const ago = {
            since: new Date(now),
            then: new Date(then),
            years: Math.floor(years),
            // months: Math.floor(months),
            days: days,
            yearsAgo: years,
            weeksAgo: weeksAgo,
            daysAgo: daysAgo,
            hoursAgo: hoursAgo,
            hours,
            minutesAgo: minutesAgo,
            minutes,
            secondsAgo: secondsAgo,
            seconds,
            milisecondsAgo: msAgo,
            // milliseconds: msAgo,
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
        else if (ago.secondsAgo < 30) {
            // ago.string = `Just Now`
            ago.time = "Just Now";
            ago["context"] = context;
            return ago;
        } else return ago;
        ago.time = ago.string.split(" ")[0];
        ago.suffix = ago.string.split(" ")[1];
        ago["context"] = context;
        return ago;
    }
    static getRemainder(float) {
        // miliseconds left after floored value IN DECIMAL
        return float - Math.floor(float);
    }
}
class Time {
    constructor(){
    // current time
    //      -time.in(ms,hms,hm)
    }
    static get current() {
        return new Date().toLocaleTimeString();
    }
    static setTimer(start, end) {}
    static in(format) {
        format;
    }
    static get current() {
        return {};
    }
    static padNum(num) {
        if (num.toString().length == 1) return num.toString().padStart(2, "0");
        else return num.toString();
    }
    static msToStamp(ms) {
        const msInHour = 3600000;
        const msInMin = 60000;
        const msInSec = 1000;
        const minutesInHour = 60;
        const secondsInMinute = 60;
        const hours = ms >= msInHour ? Math.floor(ms / msInHour) : 0;
        // const hours = hoursAgo;
        // const minutesAgo = ms >= msInMin ? Math.floor(ms / msInMin) : 0;
        const minutes = Math.floor(getRemainder(ms / msInHour) * minutesInHour);
        // const secondsAgo = ms >= msInSec ? Math.floor(ms / msInSec) : 0;
        const seconds = Math.floor(getRemainder(ms / msInMin) * secondsInMinute);
        function getRemainder(float) {
            // miliseconds left after floored value IN DECIMAL
            return float - Math.floor(float);
        }
        return {
            hours,
            minutes,
            seconds,
            get formatted () {
                return {
                    hours: Time.padNum(this.hours),
                    minutes: Time.padNum(this.minutes),
                    seconds: Time.padNum(this.seconds)
                };
            }
        };
    }
}
class Timer {
    // DEFAULTS TO COUNTDOWN
    constructor({ props  }){
        this.currentInterval = null;
        this.days = props.days || [];
        this.title = props.title;
        this.time = props.time;
        this.initial = props.initial || structuredClone(props.time);
        this.id = props.id || uuid();
        this.element = undefined;
        let today = new Date();
        let dow = [
            "sun",
            "mon",
            "tue",
            "wed",
            "thu",
            "fri",
            "sat"
        ];
        this.isToday = this.days.some((day)=>day === dow[today.getDay()]) || null;
    }
    padNum(num) {
        if (num.toString().length == 1) return num.toString().padStart(2, "0");
        else return num.toString();
    }
    play() {
        if (this.currentInterval) return;
        this.currentInterval = setInterval(this.countdown.bind(this), 1000);
    }
    decer() {
        let t = Timer.formatMs(this.time.total - 1000);
        if (Math.round(t.total) < 0) {
            t = Timer.formatMs(0);
            clearInterval(this.currentInterval);
            this.currentInterval = null;
            return;
        }
        return t;
    }
    incer() {
        let t = Timer.formatMs(this.time.total + 1000);
        if (Math.round(t.total) < 0) {
            t = Timer.formatMs(0);
            clearInterval(this.currentInterval);
            this.currentInterval = null;
            return;
        }
        return t;
    }
    pause() {
        clearInterval(this.currentInterval);
        this.currentInterval = null;
        this.showPaused();
        console.log(this);
        return;
    }
    stop() {
        clearInterval(this.currentInterval);
        this.currentInterval = null;
    }
    reset() {
        clearInterval(this.currentInterval);
        this.currentInterval = null;
        this.time = structuredClone(this.initial);
    }
    resetView() {
        this.showPaused();
        this.reset();
        this.update();
    }
    countdown() {
        this.time = this.decer();
        if (this.time.total <= 0) return this.resetView();
        this.update();
    }
    create(type) {
        let html = this.createTimerElement(type);
        let fragment = frag();
        let element = div();
        element.innerHTML = html;
        element.dataset.id = this.id;
        fragment.appendChild(element);
        return fragment;
    }
    showPlaying() {
        if (!this.element) return;
        $(".pause", this.element).classList.add("current");
        $(".play", this.element).classList.remove("current");
    }
    showPaused() {
        console.log(this);
        if (!this.element) return;
        $(".play", this.element).classList.add("current");
        $(".pause", this.element).classList.remove("current");
    }
    render(destination, type) {
        const frag1 = this.create(type);
        this.element = $(`[data-id="${this.id}"]`, frag1);
        destination.appendChild(frag1);
        listen($(".ctrl-wrapper", this.element), ()=>{
            if (!this.currentInterval) {
                this.showPlaying();
                this.play();
            } else if (this.currentInterval) {
                this.showPaused();
                this.pause();
            }
        });
        listen($(".reset", this.element), this.resetView.bind(this));
        listen($(".delete", this.element), this.delete.bind(this));
    }
    update() {
        if (!this.element) return;
        $(".time-slot-wrapper", this.element).innerHTML = this.createTimeSlot();
    }
    async delete() {
        console.log(api, "delete");
        const deleted = api.delete(this.id);
        if (deleted) {
            this.element.remove();
            this.element = null;
        }
    }
    static timeInMs({ hours , minutes , seconds  }) {
        // convert all to ms
        let msSeconds = seconds * 1000, msMinutes = minutes * 60000, msHours = hours * 3600000;
        return msHours + msSeconds + msMinutes;
    }
    static formatMs(ms) {
        const msInSeconds = 1000;
        const msInMinutes = 60000;
        const msInHours = 3600000;
        const approxHour = ms / 3600000;
        const hours = Math.floor(approxHour);
        const hoursFloat = approxHour - hours;
        const approxMinutes = hoursFloat * msInHours / msInMinutes;
        const minutes = Math.floor(approxMinutes);
        const minutesFloat = approxMinutes - minutes;
        const seconds = Math.round(minutesFloat * msInMinutes / msInSeconds);
        return {
            hours,
            minutes,
            seconds,
            total: ms
        };
    }
    createTimerElement(type) {
        return `
          <div class="timer" ${type ? `data-type=${type}` : null} >
              <div class="timer--options">
                  <div class="option delete">
                      <span class="label">delete</span>
                  </div>
                  <div class="option edit">
                      <span class="label">edit</span>
                  </div>
              </div>
              <div class="timer--header">
                  <div class="timer--header-title">
                      <span class="label">${this.title}</span>
                  </div>
                  <div class="timer--header-options">
                      <div class="timer--header-options__icon">
                          <span class="label show">show options</span>
                          <span class="lable hide">hide options</span>
                      </div>
                  </div>
              </div>
              <div class="timer--clock">
                  <div class="timer--clock-controls">
                      <div class="ctrl-wrapper">
                          <div class="play ctrl current">
                              <span class="control">play</span>
                          </div>
                          <div class="pause ctrl">
                              <span class="control">pause</span>
                          </div>
                      </div>
                      <div class="reset">reset</div>
      
                  </div>
      
                  <div class="timer--clock-times">
                      <div class="time-slot-wrapper">${this.createTimeSlot()}</div>
      
                  </div>
              </div>
          </div>`;
    }
    createTimeSlot() {
        const { hours , minutes , seconds  } = this.time;
        let h = this.padNum(hours), m = this.padNum(minutes), s = this.padNum(seconds);
        return `
          <div class="hours time-slot">
              <span class="tenth-hour">${h[0] || 0}</span>
              <span class="zero-hour">${h[1] || 0}</span>
              <span class="label">h</span>
          </div>
          <div class="minutes time-slot">
              <div class="tenth-minute">${m[0] || 0}</div>
              <div class="zero-minute">${m[1] || 0}</div>
              <span class="label">m</span>
          </div>
          <div class="seconds time-slot">
              <div class="tenth-second">${s[0] || 0}</div>
              <div class="zero-second">${s[1] || 0}</div>
              <span class="label">s</span>
          </div>`;
    }
}
class TimeTracker extends Timer {
    constructor({ props  }){
        super({
            props
        });
        this.initial = Timer.formatMs(0);
        this.successTime = props.successTime;
        this.onSuccess = props.onSucces || function() {
            console.log(`${this.title} tracker has completed`);
            if (this.element) $(".timer", this.element).classList.add("complete");
        };
        this.success = false;
        this.resetAfterSuccess = props.resetOnSuccess || false;
    }
    countup() {
        this.time = this.incer();
        if (this.success === false && this.time.total >= this.successTime.total) {
            this.success = true;
            this.onSuccess();
        }
        if (this.resetOnSuccess) return this.resetView();
        else this.update();
    }
    play() {
        if (this.currentInterval) return;
        this.currentInterval = setInterval(this.countup.bind(this), 1000);
    }
}
class scrollTrap {
    constructor(scrollable, tick = 30){
        this.isScrolling = false;
        this.tickReady = false;
        this.direction = "idle";
        this.intermediateScrollPosition = 0;
        this.lastKnownScrollPostion = 0;
        this.tick = tick;
        this.element = scrollable;
        this.lksp = this.lastKnownScrollPostion;
        this.imsp = this.intermediateScrollPosition;
        this.element.addEventListener("scroll", this.handleScroll);
    }
    diff(eventTarget) {
        let last = this.lksp;
        let current = eventTarget.scrollTop;
        let dir = last < current ? "incer" : "decer";
        let diffy = Math.abs(last - current);
        this.direction = dir;
        return [
            diffy,
            dir
        ];
    }
    handleScroll(event) {}
    onScrollUp() {}
    onScrollDown() {}
    alignTrap() {}
}
exports.default = {
    Cursor,
    Bucket,
    Collection,
    Observer,
    Observable,
    EventEmitter,
    Task,
    MenuList,
    MenuListItem,
    Modal,
    DynamicModal,
    Toggler,
    Tabber,
    Slider,
    MouseTrackingSlider,
    DateTime,
    Timer,
    TimeTracker,
    scrollTrap
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["iZmuB","6YvUA"], "6YvUA", "parcelRequire35ce")

//# sourceMappingURL=index.e4996a4b.js.map
