"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const aside_1 = require("./components/aside");
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
        const style = this.props.orientation === 0 ?
            { position: 'sticky', top: aside_1.TOP_OFFSET, height: `calc(100vh - ${aside_1.TOP_OFFSET})` } :
            {};
        return (React.createElement("div", { style: style },
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
