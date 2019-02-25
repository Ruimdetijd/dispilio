import * as React from 'react';
import { State as MainProps } from '../index';
export declare const TOP_OFFSET = "96px";
interface State {
}
interface Props {
    onClick: (activeId: string) => void;
    setVisible: () => void;
}
export default class Aside extends React.Component<MainProps & Props, State> {
    render(): JSX.Element;
}
export {};
