import * as React from 'react'
import { MetadataItem, Layers, TextWrapper, Main } from './index.components'
import ExtractedItems from './extracted-items'
import XMLio from 'xmlio'
import { generateId } from './utils'
import Facsimile from './facsimile'

export const ID_ATTRIBUTE_NAME = '__id'
export const COLOR_ATTRIBUTE_NAME = '__color'

function Noop(props: any) {
	return props.children
}

type DefaultProps = Pick<Props, 'components' | 'extractors' | 'metadata'>

export interface Props {
	components?: { [tagName: string]: any }
	extractors?: Extractor[]
	facsimileExtractor?: (xmlio: XMLio) => string[]
	metadata?: Metadata
	xmlio: XMLio
}
export default class Entry extends React.Component<Props, State> {
	state: State = {
		activeId: null,
		dataNodeTree: null,
		extractors: [],
		input: null,
		orientation: Orientation.Horizontal
	}

	static defaultProps: DefaultProps = {
		components: {},
		extractors: [],
		metadata: []
	}

	componentDidMount() {
		if (this.props.xmlio != null) this.init()
	}

	componentDidUpdate(prevProps: Props, _prevState: State) {
		if (prevProps.xmlio !== this.props.xmlio) {
			this.init()	
		}
	}

	render() {
		if (this.state.dataNodeTree == null) return null

		const component = this.dataToComponent(this.state.dataNodeTree)
		
		return (
			<Main>
				<Layers orientation={this.state.orientation}>
					<Facsimile
						facsimileExtractor={this.props.facsimileExtractor}
						xmlio={this.props.xmlio}
					/>
					<TextWrapper>
						{ component }
					</TextWrapper>
				</Layers>
				<aside>
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
						this.state.extractors.map(extractor =>
							<ExtractedItems
								activeId={this.state.activeId}
								extractor={extractor}
								key={extractor.id}
								onClick={this.setActiveId}
							/>
						)
					}
				</aside>
			</Main>
		)
	}

	private init() {
		this.props.extractors.forEach(extractor => {
			// Add a cache for used IDs. When a used ID is encountered,
			// the same internal ID is used.
			const cache = new Map()
			this.props.xmlio.change(extractor.selector, (el: HTMLElement) => {
				const id = (extractor.idAttribute != null) ?
					el.getAttribute(extractor.idAttribute) :
					el.textContent

				// Create an internal ID, to match a component to a node (and vice versa).
				// Ideally, extractor.idAttribute would be used, but this is not possible,
				// because two IDs from different extractors could be the same, for example:
				// "paris" for a person and a place
				// TODO just use the ID (extractor.idAttribute) as an id, it is unique
				const internalId = cache.has(id) ? cache.get(id) : generateId(6)
				cache.set(id, internalId)
				el.setAttribute(ID_ATTRIBUTE_NAME, internalId)
				el.setAttribute(COLOR_ATTRIBUTE_NAME, extractor.color)
				return el
			})
		})
		this.props.xmlio.persist()

		const extractors = this.props.extractors.map(extractor => {
			// Select the nodes from the DOM
			let nodes = this.props.xmlio
				.select(extractor.selector)
				// Only export deep if there is not an idAttribute. With an idAttribute,
				// data is loaded from an external data source. Without the idAttribute,
				// the node's content is shown
				.export({ type: 'data', deep: extractor.idAttribute == null })

			if (nodes == null) {
				extractor.items = []
				return extractor
			}

			if (!Array.isArray(nodes) && nodes.hasOwnProperty('name')) {
				nodes = [nodes]
			}

			// Reduce the nodes to ExtractedItems
			const mapValues = (nodes as DataNode[])
				.reduce((prev, curr) => {
					const value = extractor.idAttribute == null ?
						curr.children.map(c => typeof c === 'string' ? c : '').join('') :
						curr.attributes[extractor.idAttribute]

					// If the ID attr does not exist on the Map, add it
					if (!prev.has(value)) {
						prev.set(value, {
							count: 1,
							node: curr,
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

			// Change MapIterator to Array, and add array to map
			extractor.items = Array.from(mapValues)

			return extractor
		})


		const dataNodeTree = this.props.xmlio.exclude(['note']).export({ type: 'data' }) as DataNode

		this.setState({ dataNodeTree, extractors })
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

	private dataToComponent(root: DataNode, index?: number): any {
		// If root is null or undefined, return null, which is a valid output for a React.Component
		if (root == null) return null

		// If root is a string, just return the string, which is a valid child for a React.Component
		if (typeof root === 'string') return root

		// If there is no predefined React.Component, use the Noop (no-op, no operation) Component,
		// which just returns it's children
		if (!this.props.components.hasOwnProperty(root.name)) this.props.components[root.name] = Noop

		// If root does not have children, add an empty array, so it can be `map`ed
		if (root.children == null) root.children = []

		// Set the default attributes. React expects a key for siblings. Plus, some event handlers.
		const defaultAttributes = {
			dataNodeName: root.name,
			activeId: this.state.activeId,
			key: index,
			onClick: (ev: MouseEvent) => this.handleComponentClick(ev, root)
		}

		// Prepare attributes. React does not accept all attribute names (ref, class, style)
		const unacceptedAttributes = ['ref', 'class', 'style']
		const attributes = { ...root.attributes }
		unacceptedAttributes.forEach(un => {
			if (attributes.hasOwnProperty(un)) {
				attributes[`_${un}`] = attributes[un]
				delete attributes[un]
			}
		})

		// Create the React.Component
		return React.createElement(
			this.props.components[root.name], // Component class
			{ ...attributes, ...defaultAttributes }, // Attributes
			root.children.map((child, index) => this.dataToComponent(child, index)) // Children
		)
	}
}