/// <reference types="node" />
import { Context } from 'midway';
export interface Global extends NodeJS.Global {
    renderToNodeStream: (element: React.ReactElement) => NodeJS.ReadableStream;
    serverStream: (ctx: Context) => Promise<React.ReactElement>;
    isLocal: boolean;
}
