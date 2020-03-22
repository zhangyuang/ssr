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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// 通过使用该HOC使得组件只在客户端进行渲染
var react_1 = __importStar(require("react"));
function onlyCsr(WrappedComponent) {
    var OnlyCsrClass = /** @class */ (function (_super) {
        __extends(OnlyCsrClass, _super);
        function OnlyCsrClass(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                isCsr: false
            };
            return _this;
        }
        OnlyCsrClass.prototype.componentDidMount = function () {
            this.setState({
                isCsr: true
            });
        };
        OnlyCsrClass.prototype.render = function () {
            return this.state.isCsr ? react_1.default.createElement(WrappedComponent, __assign({}, this.props)) : react_1.default.createElement("div", null);
        };
        return OnlyCsrClass;
    }(react_1.Component));
    for (var key in WrappedComponent) {
        // 静态属性传递
        // @ts-ignore for this issue https://github.com/Microsoft/TypeScript/issues/6480
        OnlyCsrClass[key] = WrappedComponent[key];
    }
    return OnlyCsrClass;
}
exports.default = onlyCsr;
