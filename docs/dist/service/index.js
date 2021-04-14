"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiIndexService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const mock_1 = require("../mock");
let ApiIndexService = class ApiIndexService {
    async index() {
        return await Promise.resolve(mock_1.default);
    }
};
ApiIndexService = __decorate([
    decorator_1.Provide('ApiService')
], ApiIndexService);
exports.ApiIndexService = ApiIndexService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3l1dWFuZy9EZXNrdG9wL2dpdGh1Yi9zc3IvZG9jcy9zcmMvIiwic291cmNlcyI6WyJzZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1EQUE2QztBQUM3QyxrQ0FBMEI7QUFHMUIsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZTtJQUMxQixLQUFLLENBQUMsS0FBSztRQUNULE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7Q0FDRixDQUFBO0FBSlksZUFBZTtJQUQzQixtQkFBTyxDQUFDLFlBQVksQ0FBQztHQUNULGVBQWUsQ0FJM0I7QUFKWSwwQ0FBZSJ9