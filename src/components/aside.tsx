import * as React from 'react'
import styled from '@emotion/styled';
import ExtractedItems from '../extracted-items'
import { MetadataItem } from '../index.components'
import { State as MainProps } from '../index'

const HANDLE_HEIGHT = '48px';
const HANDLE_WIDTH = '32px';
export const TOP_OFFSET = '96px';

const Wrapper = styled.aside`
	display: grid;
	grid-template-columns: ${HANDLE_WIDTH} ${HANDLE_WIDTH} auto;
	grid-template-rows: auto ${HANDLE_HEIGHT} auto;
	height: calc(100vh - ${TOP_OFFSET});
	position: sticky;
	top: ${TOP_OFFSET};

	${(props: HProps) => {
		if (!props.visible) {
			return `
				position: fixed;
				right: 0;
				width: 64px;
			`
		}
	}}
`

interface HProps { visible: boolean }
const Handle = styled.div`
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
		${(props: HProps) => {
			if (!props.visible) {
				return `transform: scale(-1, 1);`
			}
		}}
	}
`

const Body = styled.div`
	background-color: #EEE;
	box-sizing: border-box;
	grid-row: 1 / span 3;
	grid-column: 3;
	padding: 32px;
`

interface State {
}
interface Props {
	onClick: (activeId: string) => void
	setVisible: () => void
}
export default class Aside extends React.Component<MainProps & Props, State> {
	render() {
		return (
			<Wrapper visible={this.props.asideVisible}>
				<Handle
					onClick={this.props.setVisible}
 					visible={this.props.asideVisible}
				>
					<div>❱</div>
				</Handle>
				<Body>
					<ul>
						{
							this.props.metadata
								.map(([key, value], index) => 
									<MetadataItem key={key + index}>
										<span>{key}</span>
										<span>{value}</span>
									</MetadataItem>
								)
						}	
					</ul>
					{
						this.props.extractors.map(extractor =>
							<ExtractedItems
								activeId={this.props.activeId}
								extractor={extractor}
								key={extractor.id}
								onClick={this.props.onClick}
							/>
						)
					}
				</Body>
			</Wrapper>
		)
	}
}