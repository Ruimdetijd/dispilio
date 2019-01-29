"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_1 = require("@emotion/styled");
const index_components_1 = require("./index.components");
const index_1 = require("./index");
const Wrapper = styled_1.default.div `
	margin-bottom: 2em;

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
`;
const H2 = styled_1.default.h2 `
	cursor: pointer;
	margin: 0;
	margin-bottom: .5em;

	& small {
		${index_components_1.small}
	}
`;
class ExtractedItems extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            active: false
        };
    }
    componentDidUpdate() {
        if (!this.state.active) {
            const activeItem = this.props.extractor.items.find(item => item.node.attributes[index_1.ID_ATTRIBUTE_NAME] === this.props.activeId);
            if (activeItem != null) {
                this.setState({ active: true });
            }
        }
    }
    render() {
        return (React.createElement(Wrapper, null,
            React.createElement(H2, { onClick: () => this.setState({ active: !this.state.active }) },
                this.props.extractor.title,
                !this.state.active &&
                    React.createElement("small", null,
                        "(",
                        this.props.extractor.items.length,
                        ")")),
            this.state.active &&
                React.createElement("ul", null, Array.isArray(this.props.extractor.items) &&
                    this.props.extractor.items.map((item, index) => React.createElement(index_components_1.ItemInText, { active: this.props.activeId === item.node.attributes[index_1.ID_ATTRIBUTE_NAME], count: item.count, key: index, node: item.node, onClick: () => this.props.onClick(item.node.attributes[index_1.ID_ATTRIBUTE_NAME]) }, item.id)))));
    }
}
exports.default = ExtractedItems;
