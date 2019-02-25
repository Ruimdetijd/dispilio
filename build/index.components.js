"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_1 = require("@emotion/styled");
const core_1 = require("@emotion/core");
const index_1 = require("./index");
const aside_1 = require("./components/aside");
exports.Main = styled_1.default.div `
	display: grid;
	grid-template-columns: ${(props) => props.asideVisible ? '80% 20%' : 'auto 64px'};
`;
exports.Layers = styled_1.default.div `
	display: grid;
	${(props) => {
    if (props.orientation === 0) {
        return `
				grid-template-columns: auto 576px;
				grid-template-rows: 100% auto;
			`;
    }
    if (props.orientation === 1) {
        return `
				grid-template-columns: 100%;
				grid-template-rows: calc((100vh - ${aside_1.TOP_OFFSET}) / 2) calc((100vh - ${aside_1.TOP_OFFSET}) / 2) auto;
			`;
    }
}}
`;
exports.TextWrapper = styled_1.default.div `
	display: grid;
	grid-column: ${(props) => props.orientation === 0 ? 2 : 1};
	grid-row: ${(props) => props.orientation === 0 ? '1 / span 2' : '1 / span 3'};
	grid-template-rows: 64px auto;
	${(props) => props.orientation === 0 ?
    `padding: 0 32px 0 64px;` :
    `padding-bottom: calc((100vh - ${aside_1.TOP_OFFSET}) / 2)`}
`;
exports.Menu = styled_1.default.div `
	background-color: white;
	border-bottom: 1px solid #CCC;
	display: grid;
	grid-template-columns: 1fr 1fr;
	height: 64px;
	position: sticky;
	top: ${aside_1.TOP_OFFSET};
	z-index: 1;

	& > div {
		align-items: center;
		display: grid;
		grid-template-columns: repeat(auto-fill, 48px);
		justify-items: center;
	}

	& > div:first-of-type {
	}

	& > div:last-of-type {
		direction: rtl;
	}
`;
exports.Text = styled_1.default.div `
	color: #222;
	counter-reset: linenumber;
	font-family: 'Merriweather', serif;
	font-size: 1.1rem;
	grid-column: 2;
	line-height: 2rem;
	padding-top: 32px;
	padding-left: ${(props) => {
    let paddingLeft = 0;
    if (props.hasFacs)
        paddingLeft += 48;
    if (props.wordwrap && props.hasLb) {
        paddingLeft += props.hasFacs ? 26 : 42;
    }
    return `${paddingLeft}px`;
}};
	padding-bottom: 33vh;
	position: relative;
`;
exports.MetadataItem = styled_1.default.li `
	margin-bottom: 1em;

	& span:first-of-type {
		color: #888;
		display: block;
		font-size: .75rem;
		margin-bottom: .25rem;
		text-transform: uppercase;
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
exports.SVGButton = function (props) {
    return (React.createElement("svg", { onClick: props.onClick, style: { cursor: 'pointer' }, viewBox: "0 0 40 30", width: "24px" },
        React.createElement("title", null, props.title),
        React.createElement("g", { fill: "#444", stroke: "#444" }, props.children)));
};
exports.OrientationButton = function (props) {
    return (React.createElement(exports.SVGButton, { onClick: props.onClick, title: `Switch to ${props.orientation === 0 ? 'vertical' : 'horizontal'} layout` },
        React.createElement("rect", { width: "40", height: "30", fill: "white", stroke: "#444" }),
        React.createElement("rect", { width: "40", height: "8" }),
        props.orientation === 0 ?
            React.createElement("rect", { width: "40", height: "4", y: "16" }) :
            React.createElement("rect", { width: "4", height: "30", x: "18" })));
};
exports.WordWrapButton = function (props) {
    return (React.createElement(exports.SVGButton, { onClick: props.onClick, title: `${props.wordwrap ? 'Disable' : 'Enable'} wordwrap` },
        React.createElement("polygon", { points: "4,18 20,9 20,27" }),
        React.createElement("line", { x1: "20", y1: "18", x2: "32", y2: "18", strokeWidth: "6" }),
        React.createElement("line", { x1: "32", y1: "21", x2: "32", y2: "4", strokeWidth: "6" })));
};
