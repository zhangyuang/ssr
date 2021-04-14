import { Application } from 'egg';
declare class AppBootHook {
    app: Application;
    constructor(app: any);
    didReady(): Promise<void>;
}
export default AppBootHook;
