import * as React from 'react';
import { Props as EntryProps } from './index';
declare type Props = Pick<EntryProps, 'facsimileExtractor' | 'xmlio'>;
export default class Facsimile extends React.PureComponent<Props> {
    private osd;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private init;
}
export {};
