"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled_1 = require("@emotion/styled");
const core_1 = require("@emotion/core");
const index_1 = require("./index");
exports.Main = styled_1.default.div `
	display: grid;
	grid-column-gap: 2%;
	grid-template-columns: 83% 15%;
	grid-template-rows: 100% auto;
	height: 100%;
`;
exports.TextWrapper = styled_1.default.div `
	counter-reset: linenumber;
	font-size: 1.2em;
	line-height: 1.5em;
	padding-left: 2em;
	position: relative;
`;
exports.Layers = styled_1.default.div `
	display: grid;
	grid-column-gap: 2%;
	${(props) => {
    if (props.orientation === 0) {
        return `
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 100% auto;
			`;
    }
    if (props.orientation === 1)
        return 'grid-template-rows: 1fr 1fr;';
}}
`;
exports.MetadataItem = styled_1.default.li `
	margin-bottom: .5em;

	& span:first-of-type {
		display: block;
		font-weight: bold;
	}
`;
exports.small = core_1.css `
		color: #444;
		font-size: .8em;
		margin-left: .5em;
`;
exports.ItemInText = styled_1.default.li `
	background-color: ${(props) => props.active ? props.node.attributes[index_1.COLOR_ATTRIBUTE_NAME] : 'initial'};
	border-radius: .2em;
	color: ${(props) => props.active ? 'white' : 'initial'};
	cursor: pointer;
	font-size: 1.2em;
	margin-left: -.2em;
	padding: .2em;

	&:after {
		${exports.small}
		color: ${(props) => props.active ? '#AAA' : 'initial'};
		content: ${(props) => props.count > 1 ? `"(${props.count})"` : ''};
	}
`;
