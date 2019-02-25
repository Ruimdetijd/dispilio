"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const aside_1 = require("./components/aside");
const styled_1 = require("@emotion/styled");
const Wrapper = styled_1.default.div `
	background: white;
	position: sticky;
	top: ${(props) => props.orientation === 0 ?
    aside_1.TOP_OFFSET :
    `calc((((100vh - ${aside_1.TOP_OFFSET}) / 2) + ${aside_1.TOP_OFFSET}))`};
	height: ${(props) => props.orientation === 0 ?
    `calc(100vh - ${aside_1.TOP_OFFSET})` :
    `calc((100vh - ${aside_1.TOP_OFFSET}) / 2)`};
	grid-column: 1;
	grid-row: ${(props) => props.orientation === 0 ? 1 : 2};
	z-index: 1;
`;
class Facsimile extends React.PureComponent {
    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.facsimiles !== this.props.facsimiles) {
            this.osd.open(this.props.facsimiles.map(f => f.path));
        }
    }
    componentWillUnmount() {
        if (this.osd)
            this.osd.destroy();
    }
    render() {
        return (React.createElement(Wrapper, Object.assign({}, this.props),
            React.createElement("div", { id: "openseadragon", style: { height: '100%' } })));
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.props.facsimiles.length)
                return;
            const OpenSeaDragon = yield Promise.resolve().then(() => require('openseadragon'));
            if (this.osd == null) {
                this.osd = OpenSeaDragon({
                    constrainDuringPan: true,
                    id: "openseadragon",
                    navigatorPosition: 'BOTTOM_LEFT',
                    prefixUrl: "/node_modules/openseadragon/build/openseadragon/images/",
                    showHomeControl: false,
                    showRotationControl: true,
                    showZoomControl: false,
                    showNavigator: true,
                    visibilityRatio: 1.0,
                });
            }
            const facs = this.props.facsimiles.map(f => f.path);
            this.osd.open(facs[0]);
        });
    }
}
exports.default = Facsimile;
