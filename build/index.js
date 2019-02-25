"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const index_components_1 = require("./index.components");
const utils_1 = require("./utils");
const facsimile_1 = require("./facsimile");
const aside_1 = require("./components/aside");
exports.ID_ATTRIBUTE_NAME = '__id';
exports.COLOR_ATTRIBUTE_NAME = '__color';
exports.FACSTHUMB_ATTRIBUTE_NAME = '__facsthumb';
function Noop(props) {
    return props.children;
}
function wrap(node, index, found) {
    const textRange = document.createRange();
    textRange.setStart(node, index);
    textRange.setEnd(node, index + found.length);
    const el = document.createElement('mark');
    textRange.surroundContents(el);
}
class Dispilio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: null,
            asideVisible: true,
            dataNodeTree: null,
            extractors: [],
            facsimiles: [],
            input: null,
            metadata: this.props.metadata,
            orientation: 0,
            wordwrap: false,
            xmlio: this.props.xmlio
        };
        this.setActiveId = (activeId) => {
            if (activeId === this.state.activeId)
                activeId = null;
            this.setState({ activeId });
        };
        this.textRef = React.createRef();
    }
    componentDidMount() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.state.xmlio == null && this.props.url == null) {
                console.error('Dispilio needs an `xmlio` or `url` prop');
                return;
            }
            if (this.state.xmlio != null)
                this.init();
            else {
                const xmlio = yield utils_1.fetchXML(this.props.url);
                this.setState({ xmlio }, () => {
                    this.init();
                });
            }
        });
    }
    componentDidUpdate(prevProps, _prevState) {
        if (prevProps.xmlio !== this.props.xmlio) {
            this.setState({ xmlio: this.props.xmlio }, () => {
                this.init();
            });
        }
        if (prevProps.highlight.length && !this.props.highlight.length) {
            for (const el of this.textRef.current.querySelectorAll('mark')) {
                el.replaceWith(...el.childNodes);
            }
        }
        if (this.props.highlight.length &&
            this.state.dataNodeTree != null) {
            const treeWalker = document.createTreeWalker(this.textRef.current, NodeFilter.SHOW_TEXT);
            const map = new Map();
            const re = new RegExp(this.props.highlight.join('|'), 'gui');
            while (treeWalker.nextNode()) {
                let result;
                const indices = [];
                while (result = re.exec(treeWalker.currentNode.textContent)) {
                    indices.push(result);
                }
                if (indices.length) {
                    map.set(treeWalker.currentNode, indices);
                }
            }
            for (const [node, indices] of map.entries()) {
                let currentNode = node;
                let prevIndex = 0;
                let prevFoundLength = 0;
                for (const result of indices) {
                    wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0]);
                    currentNode = currentNode.nextSibling.nextSibling;
                    prevIndex = result.index;
                    prevFoundLength = result[0].length;
                }
            }
        }
    }
    render() {
        if (this.state.dataNodeTree == null)
            return null;
        const component = this.dataToComponent(this.state.dataNodeTree);
        return (React.createElement(index_components_1.Main, { asideVisible: this.state.asideVisible },
            React.createElement(index_components_1.Layers, { orientation: this.state.orientation },
                React.createElement(facsimile_1.default, { facsimiles: this.state.facsimiles, orientation: this.state.orientation }),
                React.createElement(index_components_1.TextWrapper, { orientation: this.state.orientation },
                    React.createElement(index_components_1.Menu, null,
                        React.createElement("div", null),
                        React.createElement("div", null,
                            this.props.components.hasOwnProperty('lb') &&
                                React.createElement(index_components_1.WordWrapButton, { onClick: () => this.setState({ wordwrap: !this.state.wordwrap }), wordwrap: this.state.wordwrap }),
                            React.createElement(index_components_1.OrientationButton, { onClick: () => {
                                    this.setState({
                                        orientation: this.state.orientation === 0 ?
                                            1 : 0
                                    });
                                }, orientation: this.state.orientation }))),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'auto 480px auto', overflow: 'auto' } },
                        React.createElement(index_components_1.Text, { hasLb: this.props.components.hasOwnProperty('lb'), hasFacs: this.props.facsimileExtractor != null, ref: this.textRef, wordwrap: this.state.wordwrap },
                            React.createElement("div", null, component))))),
            React.createElement(aside_1.default, Object.assign({}, this.state, { onClick: this.setActiveId, setVisible: () => this.setState({ asideVisible: !this.state.asideVisible }) }))));
    }
    init() {
        const nextState = {};
        this.props.extractors.forEach(extractor => {
            const cache = new Map();
            this.state.xmlio.change(extractor.selector, (el) => {
                const id = (extractor.idAttribute != null) ?
                    el.getAttribute(extractor.idAttribute) :
                    el.textContent;
                const internalId = cache.has(id) ? cache.get(id) : utils_1.generateId(6);
                cache.set(id, internalId);
                el.setAttribute(exports.ID_ATTRIBUTE_NAME, internalId);
                return el;
            });
        });
        this.state.xmlio.persist();
        if (this.props.facsimileExtractor != null) {
            this.extractedFacsimileData = this.props.facsimileExtractor(this.state.xmlio);
            if (this.extractedFacsimileData.facsimiles.length) {
                nextState.facsimiles = this.extractedFacsimileData.facsimiles;
                this.state.xmlio.change(this.extractedFacsimileData.selector, (el) => {
                    el.setAttribute(exports.FACSTHUMB_ATTRIBUTE_NAME, '');
                    return el;
                });
            }
        }
        this.state.xmlio.persist();
        nextState.extractors = this.props.extractors.map(extractor => {
            let nodes = this.props.xmlio
                .select(extractor.selector)
                .export({ type: 'data', deep: extractor.idAttribute == null });
            if (nodes == null) {
                extractor.items = [];
                return extractor;
            }
            if (!Array.isArray(nodes))
                nodes = [nodes];
            const mapValues = nodes
                .reduce((prev, node) => {
                const value = extractor.idAttribute == null ?
                    node.children.map(c => typeof c === 'string' ? c : '').join('') :
                    node.attributes[extractor.idAttribute];
                if (!prev.has(value)) {
                    prev.set(value, {
                        count: 1,
                        node: node,
                        id: value,
                    });
                }
                else {
                    const tmp = prev.get(value);
                    prev.set(value, Object.assign({}, tmp, { count: tmp.count + 1 }));
                }
                return prev;
            }, new Map())
                .values();
            extractor.items = Array.from(mapValues);
            return extractor;
        });
        nextState.dataNodeTree = this.state.xmlio.exclude(['note']).export({ type: 'data' });
        if (this.props.metadataExtractor != null) {
            nextState.metadata = this.props.metadataExtractor(this.state.xmlio);
        }
        this.setState(nextState);
    }
    handleComponentClick(ev, data) {
        ev.stopPropagation();
        if (data.attributes.hasOwnProperty(exports.ID_ATTRIBUTE_NAME)) {
            this.setActiveId(data.attributes[exports.ID_ATTRIBUTE_NAME]);
        }
    }
    getComponentClass(tagName) {
        return (this.props.components.hasOwnProperty(tagName)) ?
            this.props.components[tagName] :
            Noop;
    }
    getAttributes(node, index) {
        const unacceptedAttributes = ['ref', 'class', 'style'];
        const nodeAttributes = Object.assign({}, node.attributes);
        unacceptedAttributes.forEach(un => {
            if (nodeAttributes.hasOwnProperty(un)) {
                nodeAttributes[`_${un}`] = nodeAttributes[un];
                delete nodeAttributes[un];
            }
        });
        let componentProps;
        componentProps = {
            key: index,
        };
        if (node.attributes.hasOwnProperty(exports.ID_ATTRIBUTE_NAME)) {
            componentProps = Object.assign({}, componentProps, { activeId: this.state.activeId, onClick: (ev) => this.handleComponentClick(ev, node) });
        }
        if (node.attributes.hasOwnProperty(exports.FACSTHUMB_ATTRIBUTE_NAME)) {
            componentProps = Object.assign({}, componentProps, { extractedFacsimileData: this.extractedFacsimileData, setState: (nextState) => this.setState(nextState), state: this.state });
        }
        if (node.name === 'lb') {
            componentProps = Object.assign({}, componentProps, { wordwrap: this.state.wordwrap });
        }
        return Object.assign({}, nodeAttributes, componentProps);
    }
    dataToComponent(root, index) {
        if (root == null)
            return null;
        if (typeof root === 'string')
            return root;
        const children = (root.children != null) ?
            root.children.map((child, index) => this.dataToComponent(child, index)) :
            [];
        return React.createElement(this.getComponentClass(root.name), this.getAttributes(root, index), children);
    }
}
Dispilio.defaultProps = {
    components: {},
    extractors: [],
    highlight: [],
    metadata: [],
};
exports.default = Dispilio;
