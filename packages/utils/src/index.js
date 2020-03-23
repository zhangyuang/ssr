"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getinitialProps_1 = __importDefault(require("./components/getinitialProps"));
exports.GetinitialProps = getinitialProps_1.default;
exports.getWrappedComponent = getinitialProps_1.default;
var onlyCsr_1 = __importDefault(require("./components/onlyCsr"));
exports.onlyCsr = onlyCsr_1.default;
var getComponent_1 = __importDefault(require("./getComponent"));
exports.getComponent = getComponent_1.default;
var loadable_1 = __importDefault(require("./loadable"));
exports.Loadable = loadable_1.default;
var preloadComponent_1 = require("./preloadComponent");
exports.preloadComponent = preloadComponent_1.preloadComponent;
