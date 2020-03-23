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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shelljs_1 = __importDefault(require("shelljs"));
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var resolveDir = function (path) { return path_1.resolve(process.cwd(), path); };
var getServerBundle = function (cdn, path) { return __awaiter(void 0, void 0, void 0, function () {
    var res, str, serverJs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('\x1B[32m get serverBundle from CDN file', cdn);
                return [4 /*yield*/, axios_1.default.get(cdn)];
            case 1:
                res = _a.sent();
                str = res.data;
                shelljs_1.default.mkdir(resolveDir('./.serverBundle'));
                fs_1.default.writeFileSync(path, str);
                serverJs = require(path).default;
                return [2 /*return*/, serverJs];
        }
    });
}); };
var useCdn = function (serverJs) { return __awaiter(void 0, void 0, void 0, function () {
    var version, serverJsPath, _serverJs, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                serverJsPath = '';
                try {
                    version = /\d+(\.\d+)+/.exec(serverJs)[0]; // cdn地址必须带有版本号
                    serverJsPath = resolveDir("./.serverBundle/server" + version + ".js");
                }
                catch (error) {
                    console.log('请检查cdn地址是否符合规范并带有版本号', error);
                }
                delete require.cache[serverJsPath];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 7]);
                fs_1.default.statSync(serverJsPath);
                if (!global.isLocal) return [3 /*break*/, 4];
                return [4 /*yield*/, getServerBundle(serverJs, serverJsPath)];
            case 3:
                // 本地开发环境每次都从cdn拉取文件
                _serverJs = _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 7];
            case 5:
                error_1 = _a.sent();
                return [4 /*yield*/, getServerBundle(serverJs, serverJsPath)];
            case 6:
                // 首次访问本地没有对应的serverJsPath的情况需要从cdn拉取文件
                _serverJs = _a.sent();
                return [3 /*break*/, 7];
            case 7:
                if (!global.isLocal) {
                    // 正式环境直接require serverBundle
                    console.log('\x1B[32m get serverBundle from local file', serverJsPath);
                    _serverJs = require(serverJsPath).default;
                }
                return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                console.log('error', error_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, _serverJs];
        }
    });
}); };
exports.useCdn = useCdn;
