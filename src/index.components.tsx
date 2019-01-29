import styled from '@emotion/styled'
import { css } from '@emotion/core'

import { COLOR_ATTRIBUTE_NAME } from './index'

export const Main = styled.div`
	display: grid;
	grid-column-gap: 2%;
	grid-template-columns: 83% 15%;
	grid-template-rows: 100% auto;
	height: 100%;
`

export const TextWrapper = styled.div`
	counter-reset: linenumber;
	font-size: 1.2em;
	line-height: 1.5em;
	padding-left: 2em;
	position: relative;
`

interface LayersProps {
	orientation: Orientation
}
export const Layers = styled.div`
	display: grid;
	grid-column-gap: 2%;
	${(props: LayersProps) => {
		// Yes, I know props.orientation ? 'columns' : 'rows' would be sufficient here
		if (props.orientation === 0) {
			return `
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 100% auto;
			`
		}
		if (props.orientation === 1) return 'grid-template-rows: 1fr 1fr;'

	}}
`

export const MetadataItem = styled.li`
	margin-bottom: .5em;

	& span:first-of-type {
		display: block;
		font-weight: bold;
	}
`

export const small = css`
		color: #444;
		font-size: .8em;
		margin-left: .5em;
`

interface IITProps {
	active: boolean
	count: number
	node: DataNode
}
export const ItemInText = styled.li`
	background-color: ${(props: IITProps) =>
		props.active ? props.node.attributes[COLOR_ATTRIBUTE_NAME] : 'initial'
	};
	border-radius: .2em;
	color: ${(props: IITProps) =>
		props.active ? 'white' : 'initial'
	};
	cursor: pointer;
	font-size: 1.2em;
	margin-left: -.2em;
	padding: .2em;

	&:after {
		${small}
		color: ${(props: IITProps) =>
			props.active ? '#AAA' : 'initial'
		};
		content: ${(props: IITProps) => props.count > 1 ? `"(${props.count})"` : ''};
	}
`