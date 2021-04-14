import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export declare type DefaultConfig = PowerPartial<EggAppConfig>;
declare const _default: (appInfo: EggAppInfo) => PowerPartial<EggAppConfig>;
export default _default;
