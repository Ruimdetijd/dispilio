"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const index_components_1 = require("./index.components");
const extracted_items_1 = require("./extracted-items");
const utils_1 = require("./utils");
const facsimile_1 = require("./facsimile");
exports.ID_ATTRIBUTE_NAME = '__id';
exports.COLOR_ATTRIBUTE_NAME = '__color';
function Noop(props) {
    return props.children;
}
class Entry extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            activeId: null,
            dataNodeTree: null,
            extractors: [],
            input: null,
            orientation: 0
        };
        this.setActiveId = (activeId) => {
            if (activeId === this.state.activeId)
                activeId = null;
            this.setState({ activeId });
        };
    }
    componentDidMount() {
        if (this.props.xmlio != null)
            this.init();
    }
    componentDidUpdate(prevProps, _prevState) {
        if (prevProps.xmlio !== this.props.xmlio) {
            this.init();
        }
    }
    render() {
        if (this.state.dataNodeTree == null)
            return null;
        const component = this.dataToComponent(this.state.dataNodeTree);
        return (React.createElement(index_components_1.Main, null,
            React.createElement(index_components_1.Layers, { orientation: this.state.orientation },
                React.createElement(facsimile_1.default, { facsimileExtractor: this.props.facsimileExtractor, xmlio: this.props.xmlio }),
                React.createElement(index_components_1.TextWrapper, null, component)),
            React.createElement("aside", null,
                React.createElement("ul", null, this.props.metadata
                    .map(([key, value], index) => React.createElement(index_components_1.MetadataItem, { key: key + index },
                    React.createElement("span", null, key),
                    React.createElement("span", null, value)))),
                this.state.extractors.map(extractor => React.createElement(extracted_items_1.default, { activeId: this.state.activeId, extractor: extractor, key: extractor.id, onClick: this.setActiveId })))));
    }
    init() {
        this.props.extractors.forEach(extractor => {
            const cache = new Map();
            this.props.xmlio.change(extractor.selector, (el) => {
                const id = (extractor.idAttribute != null) ?
                    el.getAttribute(extractor.idAttribute) :
                    el.textContent;
                const internalId = cache.has(id) ? cache.get(id) : utils_1.generateId(6);
                cache.set(id, internalId);
                el.setAttribute(exports.ID_ATTRIBUTE_NAME, internalId);
                el.setAttribute(exports.COLOR_ATTRIBUTE_NAME, extractor.color);
                return el;
            });
        });
        this.props.xmlio.persist();
        const extractors = this.props.extractors.map(extractor => {
            let nodes = this.props.xmlio
                .select(extractor.selector)
                .export({ type: 'data', deep: extractor.idAttribute == null });
            if (nodes == null) {
                extractor.items = [];
                return extractor;
            }
            if (!Array.isArray(nodes) && nodes.hasOwnProperty('name')) {
                nodes = [nodes];
            }
            const mapValues = nodes
                .reduce((prev, curr) => {
                const value = extractor.idAttribute == null ?
                    curr.children.map(c => typeof c === 'string' ? c : '').join('') :
                    curr.attributes[extractor.idAttribute];
                if (!prev.has(value)) {
                    prev.set(value, {
                        count: 1,
                        node: curr,
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
        const dataNodeTree = this.props.xmlio.exclude(['note']).export({ type: 'data' });
        this.setState({ dataNodeTree, extractors });
    }
    handleComponentClick(ev, data) {
        ev.stopPropagation();
        if (data.attributes.hasOwnProperty(exports.ID_ATTRIBUTE_NAME)) {
            this.setActiveId(data.attributes[exports.ID_ATTRIBUTE_NAME]);
        }
    }
    dataToComponent(root, index) {
        if (root == null)
            return null;
        if (typeof root === 'string')
            return root;
        if (!this.props.components.hasOwnProperty(root.name))
            this.props.components[root.name] = Noop;
        if (root.children == null)
            root.children = [];
        const defaultAttributes = {
            dataNodeName: root.name,
            activeId: this.state.activeId,
            key: index,
            onClick: (ev) => this.handleComponentClick(ev, root)
        };
        const unacceptedAttributes = ['ref', 'class', 'style'];
        const attributes = Object.assign({}, root.attributes);
        unacceptedAttributes.forEach(un => {
            if (attributes.hasOwnProperty(un)) {
                attributes[`_${un}`] = attributes[un];
                delete attributes[un];
            }
        });
        return React.createElement(this.props.components[root.name], Object.assign({}, attributes, defaultAttributes), root.children.map((child, index) => this.dataToComponent(child, index)));
    }
}
Entry.defaultProps = {
    components: {},
    extractors: [],
    metadata: []
};
exports.default = Entry;
