"use strict";
// @ts-nocheck
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];
function isWebpackReady(getModuleIds) {
    if (typeof __webpack_modules__ !== 'object') { // eslint-disable-line
        return false;
    }
    return getModuleIds().every(function (moduleId) {
        return (typeof moduleId !== 'undefined' &&
            typeof __webpack_modules__[moduleId] !== 'undefined' // eslint-disable-line
        );
    });
}
function load(loader) {
    var promise = loader();
    var state = {
        loading: true,
        loaded: null,
        error: null
    };
    state.promise = promise
        .then(function (loaded) {
        state.loading = false;
        state.loaded = loaded;
        return loaded;
    })
        .catch(function (err) {
        state.loading = false;
        state.error = err;
        console.log(err);
    });
    return state;
}
function loadMap(obj) {
    var state = {
        loading: false,
        loaded: {},
        error: null
    };
    var promises = [];
    try {
        Object.keys(obj).forEach(function (key) {
            var result = load(obj[key]);
            if (!result.loading) {
                state.loaded[key] = result.loaded;
                state.error = result.error;
            }
            else {
                state.loading = true;
            }
            promises.push(result.promise);
            result.promise
                .then(function (res) {
                state.loaded[key] = res;
            })
                .catch(function (err) {
                state.error = err;
            });
        });
    }
    catch (err) {
        state.error = err;
    }
    state.promise = Promise.all(promises)
        .then(function (res) {
        state.loading = false;
        return res;
    })
        .catch(function (err) {
        state.loading = false;
        throw err;
    });
    return state;
}
function resolve(obj) {
    return obj && obj.__esModule ? obj.default : obj;
}
function render(loaded, props, Layout) {
    var Loadable = resolve(loaded);
    return (Layout ? react_1.default.createElement(Layout, null,
        react_1.default.createElement(Loadable, __assign({}, props))) : react_1.default.createElement(Loadable, __assign({}, props)));
}
function createLoadableComponent(loadFn, options) {
    var _a;
    if (!options.loading) {
        throw new Error('react-loadable requires a `loading` component');
    }
    var opts = Object.assign({
        loader: null,
        loading: null,
        delay: 200,
        timeout: null,
        render: render,
        webpack: null,
        modules: null
    }, options);
    var res = null;
    function init() {
        if (!res) {
            res = loadFn(opts.loader);
        }
        return res.promise;
    }
    ALL_INITIALIZERS.push(init);
    if (typeof opts.webpack === 'function') {
        READY_INITIALIZERS.push(function () {
            if (isWebpackReady(opts.webpack)) {
                return init();
            }
        });
    }
    var _this = null;
    var popStateFn = function () {
        // 使用popStateFn保存函数防止addEventListener重复注册
        if (_this && _this.getInitialProps) {
            _this.getInitialProps();
        }
    };
    return _a = /** @class */ (function (_super) {
            __extends(LoadableComponent, _super);
            function LoadableComponent(props) {
                var _this_1 = _super.call(this, props) || this;
                init();
                _this_1.state = {
                    error: res.error,
                    pastDelay: false,
                    timedOut: false,
                    loading: res.loading,
                    loaded: res.loaded,
                    extraProps: {},
                    getProps: false
                };
                return _this_1;
            }
            LoadableComponent.preload = function () {
                return init();
            };
            LoadableComponent.prototype.componentWillMount = function () {
                this._mounted = true;
                this._loadModule();
            };
            LoadableComponent.prototype.componentDidMount = function () {
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
                                getProps = !window.__USESSR__ || (props.history && props.history.action === 'PUSH');
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
            LoadableComponent.prototype.getInitialProps = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var props, WrappedComponent, extraProps, _a, Layout;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                props = this.props;
                                WrappedComponent = this.state.loaded;
                                if (!(WrappedComponent && WrappedComponent.default.getInitialProps)) return [3 /*break*/, 2];
                                return [4 /*yield*/, WrappedComponent.default.getInitialProps(props)];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = {};
                                _b.label = 3;
                            case 3:
                                extraProps = _a;
                                Layout = WrappedComponent && WrappedComponent.default.Layout;
                                this.setState({
                                    extraProps: extraProps,
                                    getProps: true,
                                    Layout: Layout
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            LoadableComponent.prototype._loadModule = function () {
                var _this_1 = this;
                if (this.context.loadable && Array.isArray(opts.modules)) {
                    opts.modules.forEach(function (moduleName) {
                        _this_1.context.loadable.report(moduleName);
                    });
                }
                if (!res.loading) {
                    return;
                }
                if (typeof opts.delay === 'number') {
                    if (opts.delay === 0) {
                        this.setState({ pastDelay: true });
                    }
                    else {
                        this._delay = setTimeout(function () {
                            _this_1.setState({ pastDelay: true });
                        }, opts.delay);
                    }
                }
                if (typeof opts.timeout === 'number') {
                    this._timeout = setTimeout(function () {
                        _this_1.setState({ timedOut: true });
                    }, opts.timeout);
                }
                var update = function () {
                    if (!_this_1._mounted) {
                        return;
                    }
                    _this_1.setState({
                        error: res.error,
                        loaded: res.loaded,
                        loading: res.loading
                    });
                    _this_1._clearTimeouts();
                };
                res.promise
                    .then(function (Module) { return __awaiter(_this_1, void 0, void 0, function () {
                    var moduleProps, Layout;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(Module.default && Module.default.getInitialProps)) return [3 /*break*/, 2];
                                return [4 /*yield*/, Module.default.getInitialProps(this.props)];
                            case 1:
                                moduleProps = _a.sent();
                                Layout = Module.default.Layout;
                                this.setState({
                                    moduleProps: moduleProps,
                                    Layout: Layout
                                });
                                _a.label = 2;
                            case 2:
                                update();
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .catch(function (_) {
                    update();
                });
            };
            LoadableComponent.prototype.componentWillUnmount = function () {
                this._mounted = false;
                this._clearTimeouts();
            };
            LoadableComponent.prototype._clearTimeouts = function () {
                clearTimeout(this._delay);
                clearTimeout(this._timeout);
            };
            LoadableComponent.prototype.retry = function () {
                this.setState({ error: null, loading: true, timedOut: false });
                res = loadFn(opts.loader);
                this._loadModule();
            };
            LoadableComponent.prototype.render = function () {
                if (this.state.loading || this.state.error) {
                    return react_1.default.createElement(opts.loading, {
                        isLoading: this.state.loading,
                        pastDelay: this.state.pastDelay,
                        timedOut: this.state.timedOut,
                        error: this.state.error,
                        retry: this.retry
                    });
                }
                else if (this.state.loaded) {
                    return opts.render(this.state.loaded, Object.assign({}, this.props, this.state.extraProps, this.state.moduleProps), this.state.Layout);
                }
                else {
                    return null;
                }
            };
            return LoadableComponent;
        }(react_1.default.Component)),
        _a.contextTypes = {
            loadable: prop_types_1.default.shape({
                report: prop_types_1.default.func.isRequired
            })
        },
        _a;
}
function Loadable(opts) {
    return createLoadableComponent(load, opts);
}
function LoadableMap(opts) {
    if (typeof opts.render !== 'function') {
        throw new Error('LoadableMap requires a `render(loaded, props)` function');
    }
    return createLoadableComponent(loadMap, opts);
}
Loadable.Map = LoadableMap;
var Capture = /** @class */ (function (_super) {
    __extends(Capture, _super);
    function Capture() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Capture.prototype.getChildContext = function () {
        return {
            loadable: {
                report: this.props.report
            }
        };
    };
    Capture.prototype.render = function () {
        return react_1.default.Children.only(this.props.children);
    };
    Capture.propTypes = {
        report: prop_types_1.default.func.isRequired
    };
    Capture.childContextTypes = {
        loadable: prop_types_1.default.shape({
            report: prop_types_1.default.func.isRequired
        }).isRequired
    };
    return Capture;
}(react_1.default.Component));
exports.Capture = Capture;
Loadable.Capture = Capture;
function flushInitializers(initializers) {
    var promises = [];
    while (initializers.length) {
        var init = initializers.pop();
        promises.push(init());
    }
    return Promise.all(promises).then(function () {
        if (initializers.length) {
            return flushInitializers(initializers);
        }
    });
}
Loadable.preloadAll = function () {
    return new Promise(function (resolve, reject) {
        flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
    });
};
Loadable.preloadReady = function () {
    return new Promise(function (resolve, reject) {
        // We always will resolve, errors should be handled within loading UIs.
        flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
    });
};
exports.default = Loadable;
