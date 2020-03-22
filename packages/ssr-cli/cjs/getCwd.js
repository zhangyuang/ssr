"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var getCwd = function () {
    var cwd = process.cwd();
    if (process.env.APP_ROOT) {
        // avoid repeat cwd path
        if (!path_1.isAbsolute(process.env.APP_ROOT)) {
            return path_1.join(cwd, process.env.APP_ROOT);
        }
        return process.env.APP_ROOT;
    }
    return cwd;
};
exports.getCwd = getCwd;
