import * as React from 'react';
import XMLio from 'xmlio';
export declare const ID_ATTRIBUTE_NAME = "__id";
export declare const COLOR_ATTRIBUTE_NAME = "__color";
declare type DefaultProps = Pick<Props, 'components' | 'extractors' | 'metadata'>;
export interface Props {
    components?: {
        [tagName: string]: any;
    };
    extractors?: Extractor[];
    facsimileExtractor?: (xmlio: XMLio) => string[];
    metadataExtractor?: (xmlio: XMLio) => Metadata;
    metadata?: Metadata;
    url?: string;
    xmlio?: XMLio;
}
interface State {
    activeId: string;
    dataNodeTree: DataNode;
    extractors: Extractor[];
    input: string;
    metadata: Metadata;
    orientation: Orientation;
    xmlio: XMLio;
}
export default class Dispilio extends React.Component<Props, State> {
    state: State;
    static defaultProps: DefaultProps;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: Props, _prevState: State): void;
    render(): JSX.Element;
    private init;
    private setActiveId;
    private handleComponentClick;
    private dataToComponent;
}
export {};
