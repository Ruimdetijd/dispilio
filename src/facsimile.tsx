import * as React from 'react'
import { State as EntryState } from './index'
import { TOP_OFFSET } from './components/aside';

// TODO change facsimile when user scroll past a <pb />

type Props = Pick<EntryState, 'facsimiles' | 'orientation'>
export default class Facsimile extends React.PureComponent<Props> {
	private osd: any

	componentDidMount() {
		this.init()
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.facsimiles !== this.props.facsimiles) {
			this.osd.open(this.props.facsimiles.map(f => f.path))
		}
	}

	componentWillUnmount() {
		if (this.osd) this.osd.destroy()
	}

	render() {
		const style: React.CSSProperties = this.props.orientation === 0 ?
			{ position: 'sticky', top: TOP_OFFSET, height: `calc(100vh - ${TOP_OFFSET})`} :
			{}

		return (
			<div style={style}>
				<div id="openseadragon" style={{ height: '100%' }}></div>
			</div>
		)
	}

	private async init() {
		if (!this.props.facsimiles.length) return

		const OpenSeaDragon = await import('openseadragon')
		if (this.osd == null) {
			this.osd = OpenSeaDragon({
				constrainDuringPan: true,
				id: "openseadragon",
				navigatorPosition: 'BOTTOM_LEFT',
				prefixUrl: "/node_modules/openseadragon/build/openseadragon/images/",
				// sequenceMode: true,
				// showReferenceStrip: true,
				showHomeControl: false,
				showRotationControl: true,
				showZoomControl: false,
				// showNavigationControl: false,
				showNavigator: true,
				visibilityRatio: 1.0,
			})
		}

		const facs = this.props.facsimiles.map(f => f.path)
		this.osd.open(facs[0])
	}
}
