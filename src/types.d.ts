declare module 'openseadragon'

interface ExtractedItem {
	count: number
	node: DataNode
	id: string
}

type Metadata = [string, string][]
	
declare const enum Orientation {
	Horizontal,
	Vertical
}
interface State {
	activeId: string
	dataNodeTree: DataNode,
	extractors: Extractor[]
	input: string
	orientation: Orientation
}

interface Extractor {
	color: string
	id: string
	items?: ExtractedItem[]
	idAttribute?: string
	selector: string
	title: string
}