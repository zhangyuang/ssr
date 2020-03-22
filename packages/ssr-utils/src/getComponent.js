"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var NotFound = function () {
    return (react_1.default.createElement("div", null, "\u8DEF\u7531\u67E5\u8BE2404"));
};
var getComponent = function (Routes, path) {
    // 根据请求的path来匹配到对应的component
    var activeRoute = Routes.find(function (route) { return react_router_dom_1.matchPath(path, route); }) || { Component: function () { return NotFound; } }; // 找不到对应的组件时返回NotFound组件
    var activeComponent = activeRoute.Component;
    return activeComponent;
};
exports.default = getComponent;
