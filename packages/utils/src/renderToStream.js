"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var useCdn_1 = require("./useCdn");
var renderToStream = function (ctx, config) { return __awaiter(void 0, void 0, void 0, function () {
    var baseDir, isLocal, useCDN, serverJs, csr, renderLayout, str, serverRes, stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseDir = config.baseDir || process.cwd();
                isLocal = process.env.NODE_ENV === 'development' || config.env === 'local' // 标志非正式环境
                ;
                useCDN = config.useCDN;
                global.isLocal = isLocal;
                serverJs = config.serverJs;
                if (!useCDN) return [3 /*break*/, 2];
                return [4 /*yield*/, useCdn_1.useCdn(serverJs)];
            case 1:
                serverJs = _a.sent();
                _a.label = 2;
            case 2:
                if (isLocal && typeof serverJs === 'string') {
                    // 本地开发环境下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
                    !useCDN && delete require.cache[serverJs];
                }
                if (ctx.request && ctx.request.query) {
                    // 兼容express和koa的query获取
                    csr = ctx.request.query.csr;
                }
                if (!(config.type !== 'ssr' || csr)) return [3 /*break*/, 4];
                renderLayout = require('yk-cli/lib/renderLayout').default;
                return [4 /*yield*/, renderLayout(ctx)];
            case 3:
                str = _a.sent();
                return [2 /*return*/, str];
            case 4:
                if (!global.renderToNodeStream) {
                    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
                    global.renderToNodeStream = require(baseDir + '/node_modules/react-dom/server').renderToNodeStream;
                }
                if (!global.serverStream || isLocal) {
                    global.serverStream = typeof serverJs === 'string' ? require(serverJs).default : serverJs;
                }
                return [4 /*yield*/, global.serverStream(ctx)];
            case 5:
                serverRes = _a.sent();
                stream = global.renderToNodeStream(serverRes);
                return [2 /*return*/, stream];
        }
    });
}); };
exports.default = renderToStream;
