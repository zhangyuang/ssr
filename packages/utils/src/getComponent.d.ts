import { FC } from './interface/fc';
import { RouteItem } from './interface/route';
declare const getComponent: (Routes: RouteItem[], path: string) => (() => FC) | (() => FC);
export default getComponent;
