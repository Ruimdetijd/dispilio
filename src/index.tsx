/// <reference path="./types.d.ts" />

import * as React from 'react'
import { Layers, Text, TextWrapper, Main, OrientationButton, WordWrapButton, Menu } from './index.components'
import XMLio from 'xmlio'
import { generateId, fetchXML } from './utils'
import Facsimile from './facsimile'
import Aside from './components/aside'

export const ID_ATTRIBUTE_NAME = '__id'
export const COLOR_ATTRIBUTE_NAME = '__color'
export const FACSTHUMB_ATTRIBUTE_NAME = '__facsthumb'

function Noop(props: any) {
	return props.children
}

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement('mark')
	textRange.surroundContents(el)
}

interface ExtractedFacsimile {
	id: string
	path: string
}

interface ExtractedFacsimileData {
	facsimiles: ExtractedFacsimile[]
	attr: string
	selector: string
}

export type FacsimileExtractor = (xmlio: XMLio) => ExtractedFacsimileData

export interface FacsThumbProps {
	extractedFacsimileData: ExtractedFacsimileData
	onClick: (ev: MouseEvent) => void
	setState: (nextState: Partial<State>) => void
	state: State
}

export interface Props {
	components?: DispilioComponents
	extractors?: Extractor[]
	facsimileExtractor?: FacsimileExtractor
	metadataExtractor?: (xmlio: XMLio) => Metadata
	metadata?: Metadata
	highlight?: string[]
	url?: string
	xmlio?: XMLio
}
export interface State {
	activeId: string
	asideVisible: boolean
	dataNodeTree: DataNode,
	extractors: Extractor[]
	facsimiles: ExtractedFacsimile[]
	input: string
	metadata: Metadata
	orientation: Orientation
	wordwrap: boolean
	xmlio: XMLio
}
export default class Dispilio extends React.Component<Props, State> {
	private extractedFacsimileData: ExtractedFacsimileData
	private textRef: React.RefObject<HTMLDivElement>

	state: State = {
		activeId: null,
		asideVisible: true,
		dataNodeTree: null,
		extractors: [],
		facsimiles: [],
		input: null,
		metadata: this.props.metadata,
		orientation: Orientation.Horizontal,
		wordwrap: false,
		xmlio: this.props.xmlio
	}

	static defaultProps: Partial<Props> = {
		components: {},
		extractors: [],
		highlight: [],
		metadata: [],
	}

	constructor(props: Props) {
		super(props)
		this.textRef = React.createRef()
	}

	async componentDidMount() {
		if (this.state.xmlio == null && this.props.url == null) {
			console.error('Dispilio needs an `xmlio` or `url` prop')
			return
		}
		if (this.state.xmlio != null) this.init()
		else {
			const xmlio = await fetchXML(this.props.url)
			this.setState({ xmlio }, () => {
				this.init()
			})
		}
	}

	componentDidUpdate(prevProps: Props, _prevState: State) {
		if (prevProps.xmlio !== this.props.xmlio) {
			this.setState({ xmlio: this.props.xmlio }, () => {
				this.init()	
			})
		}

		if (prevProps.highlight.length && !this.props.highlight.length) {
			for (const el of this.textRef.current.querySelectorAll('mark')) {
				el.replaceWith(...el.childNodes)
			} 
		}

		// TODO fix too much rerenders
		if (
			this.props.highlight.length &&
			this.state.dataNodeTree != null // &&
			// _prevState.dataNodeTree !== this.state.dataNodeTree
		) {
			const treeWalker = document.createTreeWalker(this.textRef.current, NodeFilter.SHOW_TEXT)
			const map = new Map()
			const re = new RegExp(this.props.highlight.join('|'), 'gui')

			while (treeWalker.nextNode()) {
				let result: RegExpMatchArray
				const indices: RegExpMatchArray[] = []
				while (result = re.exec(treeWalker.currentNode.textContent)) {
					indices.push(result)
				}

				if (indices.length) {
					map.set(treeWalker.currentNode, indices)
				}
			}

			for (const [node, indices] of map.entries()) {
				let currentNode = node
				let prevIndex = 0
				let prevFoundLength = 0
				for (const result of indices) {
					wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0])
					currentNode = currentNode.nextSibling.nextSibling
					prevIndex = result.index
					prevFoundLength = result[0].length

				}
			}
		}
	}

	render() {
		if (this.state.dataNodeTree == null) return null
		const component = this.dataToComponent(this.state.dataNodeTree)

		return (
			<Main asideVisible={this.state.asideVisible}>
				<Layers orientation={this.state.orientation}>
					<Facsimile
						facsimiles={this.state.facsimiles}
						orientation={this.state.orientation}
					/>
					<TextWrapper orientation={this.state.orientation}>
						<Menu>
							<div>
								
							</div>
							<div>
								{
									this.props.components.hasOwnProperty('lb') &&
									<WordWrapButton
										onClick={() => this.setState({ wordwrap: !this.state.wordwrap })}
										wordwrap={this.state.wordwrap}
									/>
								}
								<OrientationButton
									onClick={() => {
										this.setState({
											orientation: this.state.orientation === Orientation.Horizontal ?
												Orientation.Vertical : Orientation.Horizontal
										})
									}}
									orientation={this.state.orientation}
								/>
							</div>
						</Menu>
						<div style={{ display: 'grid', gridTemplateColumns: 'auto 480px auto', overflow: 'auto' }}>
							<Text 
								hasLb={this.props.components.hasOwnProperty('lb')}
								hasFacs={this.props.facsimileExtractor != null}
								ref={this.textRef}
								wordwrap={this.state.wordwrap}
							>
								<div>{ component }</div>
							</Text>
						</div>
					</TextWrapper>
				</Layers>
				<Aside
					{...this.state}
					onClick={this.setActiveId}
					setVisible={() => this.setState({ asideVisible: !this.state.asideVisible })}
				/>
			</Main>
		)
	}

	private init() {
		const nextState: Partial<State> = {}

		this.props.extractors.forEach(extractor => {
			// Add a cache for used IDs. When a used ID is encountered,
			// the same internal ID is used.
			const cache = new Map()
			this.state.xmlio.change(extractor.selector, (el: HTMLElement) => {
				const id = (extractor.idAttribute != null) ?
					el.getAttribute(extractor.idAttribute) :
					el.textContent

				// Create an internal ID, to match a component to a node (and vice versa).
				// Ideally, extractor.idAttribute would be used, but this is not possible,
				// because two IDs from different extractors could be the same, for example:
				// "paris" for a person and a place
				const internalId = cache.has(id) ? cache.get(id) : generateId(6)
				cache.set(id, internalId)
				el.setAttribute(ID_ATTRIBUTE_NAME, internalId)
				// el.setAttribute(COLOR_ATTRIBUTE_NAME, extractor.color)
				return el
			})
		})
		// Persist the changes made to the extracted elements
		this.state.xmlio.persist()

		// Prepare facsimile thumbnails
		if (this.props.facsimileExtractor != null) {
			this.extractedFacsimileData = this.props.facsimileExtractor(this.state.xmlio)

			// If the text has facsimiles
			if (this.extractedFacsimileData.facsimiles.length) {
				// Set the first facsimile as the default
				nextState.facsimiles = this.extractedFacsimileData.facsimiles

				// Add an attribute to every facs thumb element
				this.state.xmlio.change(
					this.extractedFacsimileData.selector,
					(el: HTMLElement) => {
						// Use the attr provided by extractedFacsimileData to retrieve the ID of the current element
						// const id = el.getAttribute(extractedFacsimileData.attr)
						// With the ID find the associated path
						// const facsimile = extractedFacsimileData.facsimiles.find(facs => facs.id === id)
						// Set the path to the element
						el.setAttribute(FACSTHUMB_ATTRIBUTE_NAME, '')

						// TODO should we exract and lookup the path in the component?

						return el
					}
				)
			}
		}
		// Persist the changes made to the facs thumb elements
		this.state.xmlio.persist()

		nextState.extractors = this.props.extractors.map(extractor => {
			// Select the nodes from the DOM
			let nodes = this.props.xmlio
				.select(extractor.selector)
				// Only export deep if there is not an idAttribute. With an idAttribute,
				// data is loaded from an external data source. Without the idAttribute,
				// the node's content is shown
				.export({ type: 'data', deep: extractor.idAttribute == null })

			// If nothing was found, items is an empty array. Stop further execution
			if (nodes == null) {
				extractor.items = []
				return extractor
			}

			// If nodes is not null and is not an array, only one node was exported,
			// turn it into an array, so it can be reduced
			if (!Array.isArray(nodes)) nodes = [nodes]

			// Reduce the nodes to ExtractedItems, which adds a count
			const mapValues = (nodes as DataNode[])
				.reduce((prev, node) => {
					const value = extractor.idAttribute == null ?
						node.children.map(c => typeof c === 'string' ? c : '').join('') :
						node.attributes[extractor.idAttribute]

					// If the ID attr does not exist on the Map, add it
					if (!prev.has(value)) {
						prev.set(value, {
							count: 1,
							node: node,
							id: value,
						})
					// If the ID attr does exist, update the count
					} else {
						const tmp = prev.get(value)
						prev.set(value, {
							...tmp,
							count: tmp.count + 1,
						})
					}
					return prev
				}, new Map<string, ExtractedItem>())
				.values()

			// Change MapIterator to Array, and update items
			extractor.items = Array.from(mapValues)

			return extractor
		})


		nextState.dataNodeTree = this.state.xmlio.exclude(['note']).export({ type: 'data' }) as DataNode

		if (this.props.metadataExtractor != null) {
			nextState.metadata = this.props.metadataExtractor(this.state.xmlio)
		}

		this.setState(nextState as State)
	}

	private setActiveId = (activeId: string) => {
		if (activeId === this.state.activeId) activeId = null
		this.setState({ activeId })
	}

	private handleComponentClick(ev: MouseEvent, data: DataNode) {
		ev.stopPropagation()
		if (data.attributes.hasOwnProperty(ID_ATTRIBUTE_NAME)) {
			this.setActiveId(data.attributes[ID_ATTRIBUTE_NAME])
		}
	}

	private getComponentClass(tagName: string) {
		return (this.props.components.hasOwnProperty(tagName)) ?
			this.props.components[tagName] :
			Noop
	}

	private getAttributes(node: DataNode, index: number) {
		// Prepare attributes. React does not accept all attribute names (ref, class, style)
		const unacceptedAttributes = ['ref', 'class', 'style']
		const nodeAttributes = { ...node.attributes }
		unacceptedAttributes.forEach(un => {
			if (nodeAttributes.hasOwnProperty(un)) {
				nodeAttributes[`_${un}`] = nodeAttributes[un]
				delete nodeAttributes[un]
			}
		})

		let componentProps: DispilioComponentProps | ExtractorProps | FacsThumbProps | LbProps
		// Set the default attributes. React expects a key for siblings. Plus, some event handlers.
		componentProps = {
			key: index,
		}

		if (node.attributes.hasOwnProperty(ID_ATTRIBUTE_NAME)) {
			componentProps = {
				...componentProps,
				activeId: this.state.activeId,
				onClick: (ev: MouseEvent) => this.handleComponentClick(ev, node)
			} as ExtractorProps
		}

		if (node.attributes.hasOwnProperty(FACSTHUMB_ATTRIBUTE_NAME)) {
			componentProps = {
				...componentProps,
				extractedFacsimileData: this.extractedFacsimileData,
				setState: (nextState) => this.setState(nextState as State),
				state: this.state
			} as FacsThumbProps
		}

		if (node.name === 'lb') {
			componentProps = {
				...componentProps,
				wordwrap: this.state.wordwrap
			} as LbProps
		}

		return { ...nodeAttributes, ...componentProps }
	}

	private dataToComponent(root: DataNode, index?: number): any {
		// If root is null or undefined, return null, which is a valid output for a React.Component
		if (root == null) return null

		// If root is a string, just return the string, which is a valid child for a React.Component
		if (typeof root === 'string') return root

		// Map children to component
		const children = (root.children != null) ?
			root.children.map((child, index) => this.dataToComponent(child, index)) :
			[]

		// Create the React.Component
		return React.createElement(
			this.getComponentClass(root.name),
			this.getAttributes(root, index),
			// this.props.components[root.name], // Component class
			// { ...attributes, ...defaultAttributes }, // Attributes
			children
		)
	}
}
