import { Context } from 'egg';
import { IApiService, IApiDetailService } from '../interface';
interface IEggContext extends Context {
    apiService: IApiService;
    apiDeatilservice: IApiDetailService;
}
export declare class Index {
    ctx: IEggContext;
    apiService: IApiService;
    apiDeatilservice: IApiDetailService;
    handler(): Promise<void>;
}
export {};
