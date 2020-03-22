import React from 'react';
import PropTypes from 'prop-types';
declare function Loadable(opts: any): {
    new (props: any): {
        componentWillMount(): void;
        componentDidMount(): Promise<void>;
        getInitialProps(): Promise<void>;
        _loadModule(): void;
        componentWillUnmount(): void;
        _clearTimeouts(): void;
        retry(): void;
        render(): any;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextTypes: {
        loadable: PropTypes.Requireable<PropTypes.InferProps<{
            report: PropTypes.Validator<(...args: any[]) => any>;
        }>>;
    };
    preload(): any;
    contextType?: React.Context<any> | undefined;
};
declare namespace Loadable {
    var Map: typeof LoadableMap;
    var Capture: typeof import("./loadable").Capture;
    var preloadAll: () => Promise<unknown>;
    var preloadReady: () => Promise<unknown>;
}
declare function LoadableMap(opts: any): {
    new (props: any): {
        componentWillMount(): void;
        componentDidMount(): Promise<void>;
        getInitialProps(): Promise<void>;
        _loadModule(): void;
        componentWillUnmount(): void;
        _clearTimeouts(): void;
        retry(): void;
        render(): any;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextTypes: {
        loadable: PropTypes.Requireable<PropTypes.InferProps<{
            report: PropTypes.Validator<(...args: any[]) => any>;
        }>>;
    };
    preload(): any;
    contextType?: React.Context<any> | undefined;
};
export declare class Capture extends React.Component {
    static propTypes: {
        report: PropTypes.Validator<(...args: any[]) => any>;
    };
    static childContextTypes: {
        loadable: PropTypes.Validator<PropTypes.InferProps<{
            report: PropTypes.Validator<(...args: any[]) => any>;
        }>>;
    };
    getChildContext(): {
        loadable: {
            report: any;
        };
    };
    render(): string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactPortal | null | undefined;
}
export default Loadable;
