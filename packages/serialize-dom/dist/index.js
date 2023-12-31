(function() {
    (function (exports) {
        'use strict';
  
        // const process = (typeof globalThis !== "undefined" && globalThis.process) || {};
        // process.env = process.env || {};
        // process.env.__SMARTUI_BROWSERIFIED__ = true;
  
        // Returns a mostly random uid.
        function uid() {
            return `_${Math.random().toString(36).substr(2, 9)}`;
        } // Marks elements that are to be serialized later with a data attribute.
  
  
        function prepareDOM(dom) {
            for (let elem of dom.querySelectorAll('input, textarea, select, iframe, canvas, video, style')) {
                if (!elem.getAttribute('data-smartui-element-id')) {
                    elem.setAttribute('data-smartui-element-id', uid());
                }
            }
        }
  
        // Translates JavaScript properties of inputs into DOM attributes.
        function serializeInputElements(dom, clone) {
            for (let elem of dom.querySelectorAll('input, textarea, select')) {
                let inputId = elem.getAttribute('data-smartui-element-id');
                let cloneEl = clone.querySelector(`[data-smartui-element-id="${inputId}"]`);
    
                switch (elem.type) {
                    case 'checkbox':
                    case 'radio':
                    if (elem.checked) {
                        cloneEl.setAttribute('checked', '');
                    }
        
                    break;
        
                    case 'select-one':
                    if (elem.selectedIndex !== -1) {
                        cloneEl.options[elem.selectedIndex].setAttribute('selected', 'true');
                    }
        
                    break;
        
                    case 'select-multiple':
                    for (let option of elem.selectedOptions) {
                        cloneEl.options[option.index].setAttribute('selected', 'true');
                    }
        
                    break;
        
                    case 'textarea':
                    cloneEl.innerHTML = elem.value;
                    break;
        
                    default:
                    cloneEl.setAttribute('value', elem.value);
                }
            }
        }
    
        // embedded documents are serialized and their contents become root-relative.
    
        function setBaseURI(dom) {
            if (!new URL(dom.baseURI).hostname) return;
            let $base = document.createElement('base');
            $base.href = dom.baseURI;
            dom.querySelector('head').prepend($base);
        } // Recursively serializes iframe documents into srcdoc attributes.
    
    
        function serializeFrames(dom, clone, _ref) {
            let {
                enableJavaScript
            } = _ref;
    
            for (let frame of dom.querySelectorAll('iframe')) {
                let smartuiElementId = frame.getAttribute('data-smartui-element-id');
                let cloneEl = clone.querySelector(`[data-smartui-element-id="${smartuiElementId}"]`);
                let builtWithJs = !frame.srcdoc && (!frame.src || frame.src.split(':')[0] === 'javascript'); // delete frames within the head since they usually break pages when
                // rerendered and do not effect the visuals of a page
    
                if (clone.head.contains(cloneEl)) {
                    cloneEl.remove(); // if the frame document is accessible and not empty, we can serialize it
                } else if (frame.contentDocument && frame.contentDocument.documentElement) {
                    // js is enabled and this frame was built with js, don't serialize it
                    if (enableJavaScript && builtWithJs) continue; // the frame has yet to load and wasn't built with js, it is unsafe to serialize
        
                    if (!builtWithJs && !frame.contentWindow.performance.timing.loadEventEnd) continue; // recersively serialize contents
        
                    let serialized = serializeDOM({
                    domTransformation: setBaseURI,
                    dom: frame.contentDocument,
                    enableJavaScript
                    }); // assign to srcdoc and remove src
        
                    cloneEl.setAttribute('srcdoc', serialized);
                    cloneEl.removeAttribute('src'); // delete inaccessible frames built with js when js is disabled because they
                    // break asset discovery by creating non-captured requests that hang
                } else if (!enableJavaScript && builtWithJs) {
                    cloneEl.remove();
                }
            }
        }
    
        // Returns true if a stylesheet is a CSSOM-based stylesheet.
        function isCSSOM(styleSheet) {
            var _styleSheet$ownerNode, _styleSheet$ownerNode2;
    
            // no href, has a rulesheet, and isn't already in the DOM
            return !styleSheet.href && styleSheet.cssRules && !((_styleSheet$ownerNode = styleSheet.ownerNode) !== null && _styleSheet$ownerNode !== void 0 && (_styleSheet$ownerNode2 = _styleSheet$ownerNode.innerText) !== null && _styleSheet$ownerNode2 !== void 0 && _styleSheet$ownerNode2.trim().length);
        } // Outputs in-memory CSSOM into their respective DOM nodes.
    
    
        function serializeCSSOM(dom, clone) {
            for (let styleSheet of dom.styleSheets) {
                if (isCSSOM(styleSheet)) {
                    let style = clone.createElement('style');
                    let styleId = styleSheet.ownerNode.getAttribute('data-smartui-element-id');
                    let cloneOwnerNode = clone.querySelector(`[data-smartui-element-id="${styleId}"]`);
                    style.type = 'text/css';
                    style.setAttribute('data-smartui-cssom-serialized', 'true');
                    style.innerHTML = Array.from(styleSheet.cssRules).reduce((prev, cssRule) => prev + cssRule.cssText, '');
                    cloneOwnerNode.parentNode.insertBefore(style, cloneOwnerNode.nextSibling);
                }
            }
        }
    
        // Serialize in-memory canvas elements into images.
        function serializeCanvas(dom, clone) {
            for (let canvas of dom.querySelectorAll('canvas')) {
                // Note: the `.toDataURL` API requires WebGL canvas elements to use
                // `preserveDrawingBuffer: true`. This is because `.toDataURL` uses the
                // drawing buffer, which is cleared after each render for WebGL by default.
                let dataUrl = canvas.toDataURL(); // skip empty canvases
        
                if (!dataUrl || dataUrl === 'data:,') continue; // create an image element in the cloned dom
        
                let img = clone.createElement('img');
                img.src = dataUrl; // copy canvas element attributes to the image element such as style, class,
                // or data attributes that may be targeted by CSS
        
                for (let {
                    name,
                    value
                } of canvas.attributes) {
                    img.setAttribute(name, value);
                } // mark the image as serialized (can be targeted by CSS)
        
        
                img.setAttribute('data-smartui-canvas-serialized', ''); // set a default max width to account for canvases that might resize with JS
        
                img.style.maxWidth = img.style.maxWidth || '100%'; // insert the image into the cloned DOM and remove the cloned canvas element
        
                let smartuiElementId = canvas.getAttribute('data-smartui-element-id');
                let cloneEl = clone.querySelector(`[data-smartui-element-id=${smartuiElementId}]`);
                cloneEl.parentElement.insertBefore(img, cloneEl);
                cloneEl.remove();
            }
        }
    
        // Captures the current frame of videos and sets the poster image
        function serializeVideos(dom, clone) {
            for (let video of dom.querySelectorAll('video')) {
                // If the video already has a poster image, no work for us to do
                if (video.getAttribute('poster')) continue;
                let videoId = video.getAttribute('data-smartui-element-id');
                let cloneEl = clone.querySelector(`[data-smartui-element-id="${videoId}"]`);
                let canvas = document.createElement('canvas');
                let width = canvas.width = video.videoWidth;
                let height = canvas.height = video.videoHeight;
                let dataUrl;
                canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    
                try {
                    dataUrl = canvas.toDataURL();
                } catch {} // If the canvas produces a blank image, skip
    
                if (!dataUrl || dataUrl === 'data:,') continue;
                cloneEl.setAttribute('poster', dataUrl);
            }
        }
    
        function doctype(dom) {
            let {
                name = 'html',
                publicId = '',
                systemId = ''
            } = (dom === null || dom === void 0 ? void 0 : dom.doctype) ?? {};
            let deprecated = '';
    
            if (publicId && systemId) {
                deprecated = ` PUBLIC "${publicId}" "${systemId}"`;
            } else if (publicId) {
                deprecated = ` PUBLIC "${publicId}"`;
            } else if (systemId) {
                deprecated = ` SYSTEM "${systemId}"`;
            }
    
            return `<!DOCTYPE ${name}${deprecated}>`;
        } // Serializes a document and returns the resulting DOM string.
    
    
        function serializeDOM(options) {
            let {
                dom = document,
                // allow snake_case or camelCase
                enableJavaScript = options === null || options === void 0 ? void 0 : options.enable_javascript,
                domTransformation = options === null || options === void 0 ? void 0 : options.dom_transformation
            } = options || {};
            prepareDOM(dom);
            let clone = dom.cloneNode(true);
            serializeInputElements(dom, clone);
            serializeFrames(dom, clone, {
                enableJavaScript
            });
            serializeVideos(dom, clone);
    
            if (!enableJavaScript) {
                serializeCSSOM(dom, clone);
                serializeCanvas(dom, clone);
            }
    
            let doc = clone.documentElement;
    
            if (domTransformation) {
            try {
                domTransformation(doc);
            } catch (err) {
                console.error('Could not transform the dom:', err.message);
            }
            }
    
            return doctype(dom) + doc.outerHTML;
        }
    
        exports["default"] = serializeDOM;
        exports.serialize = serializeDOM;
        exports.serializeDOM = serializeDOM;
    
        Object.defineProperty(exports, '__esModule', { value: true });
  
    })(this.SmartUIDOM = this.SmartUIDOM || {});
}).call(window);
  
if (typeof define === "function" && define.amd) {
    define([], () => window.SmartUIDOM);
} else if (typeof module === "object" && module.exports) {
    module.exports = window.SmartUIDOM;
}