import * as React from 'react';
import { State as EntryState } from './index';
declare type Props = Pick<EntryState, 'facsimiles' | 'orientation'>;
export default class Facsimile extends React.PureComponent<Props> {
    private osd;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private init;
}
export {};
