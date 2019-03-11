/// <reference path="../src/types.d.ts" />
import * as React from 'react';
import XMLio from 'xmlio';
export declare const ID_ATTRIBUTE_NAME = "__id";
export declare const COLOR_ATTRIBUTE_NAME = "__color";
export declare const FACSTHUMB_ATTRIBUTE_NAME = "__facsthumb";
interface ExtractedFacsimile {
    id: string;
    path: string;
}
interface ExtractedFacsimileData {
    facsimiles: ExtractedFacsimile[];
    attr: string;
    selector: string;
}
export declare type FacsimileExtractor = (xmlio: XMLio) => ExtractedFacsimileData;
export interface FacsThumbProps {
    extractedFacsimileData: ExtractedFacsimileData;
    onClick: (ev: MouseEvent) => void;
    setState: (nextState: Partial<State>) => void;
    state: State;
}
export interface Props {
    components?: DispilioComponents;
    extractors?: Extractor[];
    facsimileExtractor?: FacsimileExtractor;
    metadataExtractor?: (xmlio: XMLio) => Metadata;
    metadata?: Metadata;
    highlight?: string[];
    url?: string;
    xmlio?: XMLio;
}
export interface State {
    activeId: string;
    asideVisible: boolean;
    extractors: Extractor[];
    facsimiles: ExtractedFacsimile[];
    input: string;
    metadata: Metadata;
    orientation: Orientation;
    wordwrap: boolean;
    xmlio: XMLio;
}
export default class Dispilio extends React.Component<Props, State> {
    private extractedFacsimileData;
    private textRef;
    state: State;
    static defaultProps: Partial<Props>;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: Props, _prevState: State): void;
    render(): JSX.Element;
    private init;
    private setActiveId;
    private handleComponentClick;
    private getComponentClass;
    private getAttributes;
    private domToComponent;
}
export {};
