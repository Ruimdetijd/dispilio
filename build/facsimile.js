"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
class Facsimile extends React.PureComponent {
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        if (this.osd)
            this.osd.destroy();
    }
    render() {
        return (React.createElement("div", { className: "facsimile" },
            React.createElement("div", { id: "openseadragon", style: { height: '100%' } })));
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.props.facsimilePaths.length)
                return;
            const OpenSeaDragon = yield Promise.resolve().then(() => require('openseadragon'));
            if (this.osd == null) {
                this.osd = OpenSeaDragon({
                    constrainDuringPan: true,
                    id: "openseadragon",
                    navigatorPosition: 'BOTTOM_LEFT',
                    prefixUrl: "/node_modules/openseadragon/build/openseadragon/images/",
                    showNavigationControl: false,
                    showNavigator: true,
                    visibilityRatio: 1.0,
                });
            }
            this.osd.open(this.props.facsimilePaths[0]);
        });
    }
}
exports.default = Facsimile;