import * as React from 'react';
interface Props {
    activeId: string;
    extractor: Extractor;
    onClick: (activeId: string) => void;
}
interface State {
    active: boolean;
}
export default class ExtractedItems extends React.Component<Props, State> {
    state: State;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export {};
