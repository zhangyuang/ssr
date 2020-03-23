"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var _this = null;
var popStateFn = function () {
    // 使用popStateFn保存函数防止addEventListener重复注册
    if (_this && _this.getInitialProps) {
        _this.getInitialProps();
    }
};
function GetInitialProps(WrappedComponent) {
    var GetInitialPropsClass = /** @class */ (function (_super) {
        __extends(GetInitialPropsClass, _super);
        function GetInitialPropsClass(props) {
            var _this_1 = _super.call(this, props) || this;
            _this_1.state = {
                extraProps: {},
                getProps: false
            };
            return _this_1;
        }
        GetInitialPropsClass.prototype.componentDidMount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var props, getProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            props = this.props;
                            if (window.__USE_SSR__) {
                                _this = this; // 修正_this指向，保证_this指向当前渲染的页面组件
                                window.addEventListener('popstate', popStateFn);
                            }
                            getProps = !window.__USE_SSR__ || (props.history && props.history.action === 'PUSH');
                            if (!getProps) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getInitialProps()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        GetInitialPropsClass.prototype.getInitialProps = function () {
            return __awaiter(this, void 0, void 0, function () {
                var props, extraProps, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            props = this.props;
                            if (!WrappedComponent.preload) return [3 /*break*/, 2];
                            return [4 /*yield*/, WrappedComponent.preload()];
                        case 1:
                            // react-loadable 情况
                            WrappedComponent = (_b.sent()).default;
                            _b.label = 2;
                        case 2:
                            if (!WrappedComponent.getInitialProps) return [3 /*break*/, 4];
                            return [4 /*yield*/, WrappedComponent.getInitialProps(props)];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = {};
                            _b.label = 5;
                        case 5:
                            extraProps = _a;
                            this.setState({
                                extraProps: extraProps,
                                getProps: true
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        GetInitialPropsClass.prototype.render = function () {
            // 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
            return react_1.default.createElement(WrappedComponent, __assign({}, Object.assign({}, this.props, this.state.getProps ? {} : window.__INITIAL_DATA__, this.state.extraProps)));
        };
        return GetInitialPropsClass;
    }(react_1.Component));
    return react_router_dom_1.withRouter(GetInitialPropsClass);
}
exports.default = GetInitialProps;
