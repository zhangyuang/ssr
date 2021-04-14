import { Context } from 'egg';
import { IApiService, IApiDetailService } from '../interface';
export declare class Api {
    ctx: Context;
    service: IApiService;
    detailService: IApiDetailService;
    getIndexData(): Promise<any>;
    getDetailData(): Promise<any>;
}
