import { ServerJs } from './interface/config';
declare const useCdn: (serverJs: string) => Promise<ServerJs>;
export { useCdn };
