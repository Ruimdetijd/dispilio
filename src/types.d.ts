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

interface Extractor {
	color: string
	id: string
	items?: ExtractedItem[]
	idAttribute?: string
	selector: string
	title: string
}