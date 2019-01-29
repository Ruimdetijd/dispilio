import * as React from 'react'
import { Props as EntryProps } from './index'

type Props = Pick<EntryProps, 'facsimileExtractor' | 'xmlio'>
export default class Facsimile extends React.PureComponent<Props> {
	private osd: any

	componentDidMount() {
		this.init()
	}

	componentWillUnmount() {
		if (this.osd) this.osd.destroy()
	}

	render() {
		return (
			<div className="facsimile">
				<div id="openseadragon" style={{ height: '100%' }}></div>
			</div>
		)
	}

	private async init() {
		if (this.props.facsimileExtractor == null) return

		const OpenSeaDragon = await import('openseadragon')
		if (this.osd == null) {
			this.osd = OpenSeaDragon({
				constrainDuringPan: true,
				id: "openseadragon",
				navigatorPosition: 'BOTTOM_LEFT',
				prefixUrl: "/node_modules/openseadragon/build/openseadragon/images/",
				showNavigationControl: false,
				showNavigator: true,
				visibilityRatio: 1.0,
			})
		}

		const facsimilePaths = this.props.facsimileExtractor(this.props.xmlio)
		this.osd.open(facsimilePaths[0])
	}
}
