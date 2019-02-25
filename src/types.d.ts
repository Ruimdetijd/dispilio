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
	// color: string
	id: string
	items?: ExtractedItem[]
	idAttribute?: string
	selector: string
	title?: string
}

interface DispilioComponents {
	[tagName: string]: (props: any) => JSX.Element
}

interface DispilioComponentProps {
	key: number
}

interface ExtractorProps {
	activeId: string
	onClick: (ev: MouseEvent) => void
}

interface LbProps extends DispilioComponentProps {
	wordwrap: boolean
}