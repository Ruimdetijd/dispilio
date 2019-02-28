(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["XMLio"] = factory();
	else
		root["XMLio"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/evaluator/exporters.ts":
/*!************************************!*\
  !*** ./src/evaluator/exporters.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction exportAsXml(tree, _xmlOptions) {\n    if (tree == null)\n        return '';\n    const xml = new XMLSerializer().serializeToString(tree);\n    return xml;\n}\nexports.exportAsXml = exportAsXml;\nfunction exportAsData(tree, dataOptions) {\n    function elementToDataElement(el) {\n        const attributes = Array.from(el.attributes)\n            .reduce((prev, curr) => {\n            prev[curr.name] = el.getAttribute(curr.name);\n            return prev;\n        }, {});\n        return { name: el.nodeName.toLowerCase(), attributes, children: [] };\n    }\n    if (!dataOptions.deep) {\n        return elementToDataElement(tree.documentElement);\n    }\n    const nodeByData = new Map();\n    const whatToShow = dataOptions.text ? NodeFilter.SHOW_ALL : NodeFilter.SHOW_ELEMENT;\n    var treeWalker = tree.createTreeWalker(tree.documentElement, whatToShow);\n    const output = elementToDataElement(treeWalker.currentNode);\n    nodeByData.set(treeWalker.currentNode, output);\n    while (treeWalker.nextNode()) {\n        let dataNode;\n        if (treeWalker.currentNode.nodeType === 1) {\n            dataNode = elementToDataElement(treeWalker.currentNode);\n            nodeByData.set(treeWalker.currentNode, dataNode);\n        }\n        else if (treeWalker.currentNode.nodeType === 3) {\n            if (!treeWalker.currentNode.textContent.trim().length)\n                continue;\n            dataNode = treeWalker.currentNode.textContent;\n        }\n        const parentDataNode = nodeByData.get(treeWalker.currentNode.parentElement);\n        parentDataNode.children.push(dataNode);\n    }\n    return output;\n}\nexports.exportAsData = exportAsData;\nfunction exportAsText(tree, textOptions) {\n    var treeWalker = tree.createTreeWalker(tree, NodeFilter.SHOW_TEXT);\n    const text = [];\n    const firstText = treeWalker.currentNode.nodeValue != null ? treeWalker.currentNode.nodeValue.trim() : '';\n    text.push(firstText);\n    while (treeWalker.nextNode()) {\n        text.push(treeWalker.currentNode.nodeValue.trim());\n    }\n    return text\n        .filter(t => t != null && t.length)\n        .join(textOptions.join);\n}\nexports.exportAsText = exportAsText;\nfunction exportAsDOM(tree, _domOptions) {\n    return tree;\n}\nexports.exportAsDOM = exportAsDOM;\n\n\n//# sourceURL=webpack://XMLio/./src/evaluator/exporters.ts?");

/***/ }),

/***/ "./src/evaluator/proxy-handler.ts":
/*!****************************************!*\
  !*** ./src/evaluator/proxy-handler.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/evaluator/utils.ts\");\nexports.COLON_REPLACE = '_-_-_-_';\nfunction createProxyName(name) {\n    return name.replace(/:/ug, exports.COLON_REPLACE);\n}\nfunction revertProxyName(name) {\n    const re = new RegExp(exports.COLON_REPLACE, 'ug');\n    return name.replace(re, ':');\n}\nfunction getDepth(node, parent) {\n    let depth = 0;\n    while (node !== parent) {\n        depth += 1;\n        node = node.parentNode;\n    }\n    return depth;\n}\nfunction addProxies(doc) {\n    const toReplace = [];\n    var treeWalker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);\n    while (treeWalker.nextNode()) {\n        const node = treeWalker.currentNode;\n        for (const attr of node.attributes) {\n            const colonIndex = attr.name.indexOf(':');\n            if (colonIndex > 0 &&\n                attr.name.slice(0, colonIndex + 1) !== 'xmlns:') {\n                node.setAttribute(createProxyName(attr.name), node.getAttribute(attr.name));\n            }\n        }\n        if (node.nodeName.indexOf(':') > 0) {\n            toReplace.push({\n                depth: getDepth(node, doc),\n                node\n            });\n        }\n    }\n    toReplace\n        .sort((a, b) => b.depth - a.depth)\n        .forEach(rep => {\n        const proxyElement = utils_1.renameElement(doc, rep.node, createProxyName(rep.node.nodeName));\n        utils_1.replaceElement(rep.node, proxyElement);\n    });\n    return doc;\n}\nexports.addProxies = addProxies;\nfunction removeProxies(doc) {\n    const toReplace = [];\n    var treeWalker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);\n    while (treeWalker.nextNode()) {\n        const node = treeWalker.currentNode;\n        for (const attr of node.attributes) {\n            if (attr.name.indexOf(exports.COLON_REPLACE) > 0) {\n                node.removeAttribute(attr.name);\n            }\n        }\n        if (node.nodeName.indexOf(exports.COLON_REPLACE) > 0) {\n            toReplace.push({\n                depth: getDepth(node, doc),\n                node\n            });\n        }\n    }\n    toReplace\n        .sort((a, b) => b.depth - a.depth)\n        .forEach(rep => {\n        const originalElement = utils_1.renameElement(doc, rep.node, revertProxyName(rep.node.nodeName));\n        utils_1.replaceElement(rep.node, originalElement);\n    });\n    return doc;\n}\nexports.removeProxies = removeProxies;\n\n\n//# sourceURL=webpack://XMLio/./src/evaluator/proxy-handler.ts?");

/***/ }),

/***/ "./src/evaluator/transformers.ts":
/*!***************************************!*\
  !*** ./src/evaluator/transformers.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/evaluator/utils.ts\");\nconst proxy_handler_1 = __webpack_require__(/*! ./proxy-handler */ \"./src/evaluator/proxy-handler.ts\");\nfunction exclude(trees, data) {\n    return trees.map(tree => {\n        const selector = (Array.isArray(data.selector)) ? data.selector : [data.selector];\n        selector.forEach(s => {\n            utils_1.selectElements(tree, s)\n                .forEach(el => el.parentNode.removeChild(el));\n        });\n        return tree;\n    });\n}\nexports.exclude = exclude;\nfunction change(trees, data) {\n    return trees.map(tree => {\n        const targets = utils_1.selectElements(tree, data.selector);\n        Array.from(targets).forEach(data.changeFunc);\n        return tree;\n    });\n}\nexports.change = change;\nfunction replace(trees, data) {\n    return trees.map(tree => replaceInTree(tree, data));\n}\nexports.replace = replace;\nfunction replaceInTree(doc, data) {\n    const targets = utils_1.selectElements(doc, data.targetSelector);\n    if (!targets.length)\n        console.log('WARNING', `No targets found for ${data.targetSelector}`);\n    const used = [];\n    Array.from(targets)\n        .forEach(target => {\n        used.push(target);\n        const sourceSelector = data.sourceSelectorFunc(target);\n        let sources = [];\n        if (sourceSelector instanceof Node) {\n            sources.push(sourceSelector);\n        }\n        else {\n            const sourceElements = utils_1.selectElements(doc, sourceSelector);\n            sources = Array.from(sourceElements).filter(source => used.indexOf(source) === -1);\n        }\n        if (!sources.length) {\n            const attrs = Array.from(target.attributes).reduce((prev, curr) => {\n                if (curr.name.indexOf(proxy_handler_1.COLON_REPLACE) > -1)\n                    return prev;\n                if (curr.name === 'class' && curr.value === '')\n                    return prev;\n                prev += `[${curr.name}=${curr.value}]`;\n                return prev;\n            }, '');\n            console.log('WARNING', `No sources (${sourceSelector}) found for target: ${data.targetSelector}${attrs}`);\n            return;\n        }\n        let [firstSource, ...otherSources] = sources;\n        if (!data.removeSource)\n            firstSource = firstSource.cloneNode(true);\n        used.push(firstSource);\n        utils_1.replaceElement(target, firstSource);\n        if (!otherSources.length)\n            return;\n        otherSources\n            .filter(source => used.indexOf(source) === -1)\n            .forEach(source => {\n            if (!data.removeSource)\n                source = source.cloneNode(true);\n            used.push(source);\n            firstSource.parentNode.insertBefore(source, firstSource.nextSibling);\n        });\n    });\n    return doc;\n}\n\n\n//# sourceURL=webpack://XMLio/./src/evaluator/transformers.ts?");

/***/ }),

/***/ "./src/evaluator/utils.ts":
/*!********************************!*\
  !*** ./src/evaluator/utils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst proxy_handler_1 = __webpack_require__(/*! ./proxy-handler */ \"./src/evaluator/proxy-handler.ts\");\nconst pseudos = [':empty', ':not(', ':first-child', ':last-child', ':nth-child(', ':nth-last-child', ':nth-of-type', ':first-of-type', ':last-of-type', ':only-child'];\nfunction unwrap(wrapper) {\n    return wrapper.firstChild;\n}\nexports.unwrap = unwrap;\nfunction unwrapStringFunction(func) {\n    const outerFunc = new Function(`return ${func}`);\n    return outerFunc();\n}\nexports.unwrapStringFunction = unwrapStringFunction;\nfunction replacer(match, offset, string) {\n    if (pseudos.some(pseudo => string.slice(offset, offset + pseudo.length) === pseudo))\n        return match;\n    return proxy_handler_1.COLON_REPLACE;\n}\nfunction selectElements(doc, selector) {\n    if (selector.indexOf(':') > 0) {\n        selector = selector.replace(/:/ug, replacer);\n    }\n    const elements = doc.querySelectorAll(selector);\n    return Array.from(elements);\n}\nexports.selectElements = selectElements;\nfunction renameElement(doc, el, newName) {\n    const newEl = doc.createElement(newName);\n    Array.from(el.attributes).forEach(attr => newEl.setAttribute(attr.name, el.getAttribute(attr.name)));\n    if (el.className.length) {\n        newEl.className = el.className;\n    }\n    let nextNode = el.firstChild;\n    while (nextNode) {\n        newEl.appendChild(nextNode.cloneNode(true));\n        nextNode = nextNode.nextSibling;\n    }\n    return newEl;\n}\nexports.renameElement = renameElement;\nfunction replaceElement(oldEl, newEl) {\n    if (oldEl.parentNode == null)\n        return;\n    oldEl.parentNode.replaceChild(newEl, oldEl);\n}\nexports.replaceElement = replaceElement;\n\n\n//# sourceURL=webpack://XMLio/./src/evaluator/utils.ts?");

/***/ }),

/***/ "./src/handler.defaults.ts":
/*!*********************************!*\
  !*** ./src/handler.defaults.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst handlerDefaults = {\n    change: {\n        active: true,\n        changeFunc: (el) => el,\n        selector: '',\n        type: 'change',\n    },\n    exclude: {\n        active: true,\n        selector: [],\n        type: 'exclude',\n    },\n    rename: {\n        active: true,\n        selector: '',\n        newName: '',\n        type: 'rename',\n    },\n    replace: {\n        active: true,\n        removeSource: true,\n        sourceSelectorFunc: () => '',\n        targetSelector: '',\n        type: 'replace',\n    },\n    select: {\n        active: true,\n        selector: '',\n        type: 'select',\n    },\n    xml: {\n        active: true,\n        type: 'xml'\n    },\n    data: {\n        active: true,\n        deep: true,\n        text: true,\n        type: 'data'\n    },\n    text: {\n        active: true,\n        join: ' ',\n        type: 'text'\n    },\n    dom: {\n        active: true,\n        type: 'dom'\n    }\n};\nexports.default = handlerDefaults;\n\n\n//# sourceURL=webpack://XMLio/./src/handler.defaults.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst handler_defaults_1 = __webpack_require__(/*! ./handler.defaults */ \"./src/handler.defaults.ts\");\nexports.handlerDefaults = handler_defaults_1.default;\nconst validators_1 = __webpack_require__(/*! ./validators */ \"./src/validators.ts\");\nconst transformers_1 = __webpack_require__(/*! ./evaluator/transformers */ \"./src/evaluator/transformers.ts\");\nconst exporters_1 = __webpack_require__(/*! ./evaluator/exporters */ \"./src/evaluator/exporters.ts\");\nconst utils_1 = __webpack_require__(/*! ./evaluator/utils */ \"./src/evaluator/utils.ts\");\nconst proxy_handler_1 = __webpack_require__(/*! ./evaluator/proxy-handler */ \"./src/evaluator/proxy-handler.ts\");\nclass XMLio {\n    constructor(doc) {\n        this.transformers = [];\n        this.docs = [];\n        this.createOutput = (exporters) => {\n            const hasSelect = this.transformers.some(t => t.type === 'select');\n            const output = this.docs\n                .map((tree) => proxy_handler_1.removeProxies(tree))\n                .map(tree => {\n                let outputPart = exporters.map(exporter => {\n                    if (exporter.type === 'xml')\n                        return exporters_1.exportAsXml(tree, exporter);\n                    if (exporter.type === 'data')\n                        return exporters_1.exportAsData(tree, exporter);\n                    if (exporter.type === 'text')\n                        return exporters_1.exportAsText(tree, exporter);\n                    if (exporter.type === 'dom')\n                        return exporters_1.exportAsDOM(tree, exporter);\n                });\n                return outputPart.length === 1 ? outputPart[0] : outputPart;\n            });\n            if (!hasSelect && output.length !== 1)\n                console.error('Output should contain one element!');\n            return hasSelect ? output : output[0];\n        };\n        doc = proxy_handler_1.addProxies(doc);\n        this.root = [doc.cloneNode(true)];\n        this.docs = [doc];\n    }\n    export(options) {\n        if (options == null)\n            options = [handler_defaults_1.default.xml];\n        else {\n            if (!Array.isArray(options))\n                options = [options];\n            options = options.map(option => (Object.assign({}, handler_defaults_1.default[option.type], option)));\n        }\n        this.applyTransformers();\n        const output = this.createOutput(options);\n        this.reset();\n        return output;\n    }\n    persist() {\n        this.applyTransformers();\n        this.root = this.docs.map(tree => tree.cloneNode(true));\n        this.reset();\n        return this;\n    }\n    addTransform(transformer) {\n        transformer = Object.assign({}, handler_defaults_1.default[transformer.type], transformer);\n        const validate = validators_1.default[transformer.type];\n        if (validate(transformer))\n            this.transformers.push(transformer);\n        return this;\n    }\n    change(selector, changeFunc) {\n        return this.addTransform({\n            changeFunc,\n            selector,\n            type: 'change',\n        });\n    }\n    rename(selector, newName) {\n        return this.addTransform({\n            newName,\n            selector,\n            type: 'rename',\n        });\n    }\n    exclude(selector) {\n        return this.addTransform({\n            selector,\n            type: 'exclude',\n        });\n    }\n    replace(targetSelector, sourceSelectorFunc, removeSource = true) {\n        return this.addTransform({\n            removeSource,\n            sourceSelectorFunc,\n            targetSelector,\n            type: 'replace',\n        });\n    }\n    select(selector) {\n        return this.addTransform({\n            selector,\n            type: 'select',\n        });\n    }\n    reset() {\n        this.transformers = [];\n        this.docs = this.root.map(el => el.cloneNode(true));\n    }\n    applyTransformers() {\n        this.transformers.forEach((transformer) => {\n            if (transformer.type === 'exclude')\n                this.docs = transformers_1.exclude(this.docs, transformer);\n            if (transformer.type === 'replace')\n                this.docs = transformers_1.replace(this.docs, transformer);\n            if (transformer.type === 'select')\n                this.docs = this.selectTransformer(this.docs, transformer);\n            if (transformer.type === 'change')\n                this.docs = transformers_1.change(this.docs, transformer);\n            if (transformer.type === 'rename')\n                this.docs = this.renameTransformer(this.docs, transformer);\n        });\n    }\n    renameTransformer(docs, data) {\n        return docs.map(doc => {\n            const oldEls = utils_1.selectElements(doc, data.selector);\n            oldEls.forEach(oldEl => {\n                const newEl = utils_1.renameElement(doc, oldEl, data.newName);\n                utils_1.replaceElement(oldEl, newEl);\n            });\n            return doc;\n        });\n    }\n    selectTransformer(docs, data) {\n        return docs\n            .map(doc => utils_1.selectElements(doc, data.selector)\n            .map(el => {\n            const docCopy = doc.cloneNode(true);\n            docCopy.replaceChild(el, docCopy.documentElement);\n            return docCopy;\n        }))\n            .reduce((prev, curr) => prev.concat(curr), []);\n    }\n}\nexports.default = XMLio;\n\n\n//# sourceURL=webpack://XMLio/./src/index.ts?");

/***/ }),

/***/ "./src/validators.ts":
/*!***************************!*\
  !*** ./src/validators.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst validators = {\n    change: function (props) {\n        return props.changeFunc.length > 0 && props.selector.length > 0;\n    },\n    exclude: function (props) {\n        return props.selector.length > 0;\n    },\n    rename: function (props) {\n        return props.selector.length > 0 && props.newName.length > 0;\n    },\n    replace: function (props) {\n        return props.targetSelector.length > 0 && props.sourceSelectorFunc.length > 0;\n    },\n    select: function (props) {\n        return props.selector.length > 0;\n    }\n};\nexports.default = validators;\n\n\n//# sourceURL=webpack://XMLio/./src/validators.ts?");

/***/ })

/******/ })["default"];
});