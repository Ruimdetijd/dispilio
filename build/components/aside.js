"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_1 = require("@emotion/styled");
const extracted_items_1 = require("../extracted-items");
const index_components_1 = require("../index.components");
const HANDLE_HEIGHT = '48px';
const HANDLE_WIDTH = '32px';
exports.TOP_OFFSET = '96px';
const Wrapper = styled_1.default.aside `
	display: grid;
	grid-template-columns: ${HANDLE_WIDTH} ${HANDLE_WIDTH} auto;
	grid-template-rows: auto ${HANDLE_HEIGHT} auto;
	height: calc(100vh - ${exports.TOP_OFFSET});
	position: sticky;
	top: ${exports.TOP_OFFSET};
	transition: transform 250ms;

`;
const Handle = styled_1.default.div `
	background-color: #EEE;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
	cursor: pointer;
	grid-column: 2;
	grid-row: 2;
	line-height: ${HANDLE_HEIGHT};
	text-align: center;
	user-select: none;

	& > div {
		transition: transform 500ms;
		${(props) => {
    if (!props.visible) {
        return `transform: scale(-1, 1);`;
    }
}}
	}
`;
const Body = styled_1.default.div `
	background-color: #EEE;
	box-sizing: border-box;
	grid-row: 1 / span 3;
	grid-column: 3;
	padding: 32px;
`;
class Aside extends React.Component {
    render() {
        return (React.createElement(Wrapper, null,
            React.createElement(Handle, { onClick: this.props.setVisible, visible: this.props.asideVisible },
                React.createElement("div", null, "\u2771")),
            React.createElement(Body, null,
                React.createElement("ul", null, this.props.metadata
                    .map(([key, value], index) => React.createElement(index_components_1.MetadataItem, { key: key + index },
                    React.createElement("span", null, key),
                    React.createElement("span", null, value)))),
                this.props.extractors.map(extractor => React.createElement(extracted_items_1.default, { activeId: this.props.activeId, extractor: extractor, key: extractor.id, onClick: this.props.onClick })))));
    }
}
exports.default = Aside;
