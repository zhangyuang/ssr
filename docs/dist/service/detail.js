"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDetailService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const detail_1 = require("../mock/detail");
let ApiDetailService = class ApiDetailService {
    async index(id) {
        return await Promise.resolve(detail_1.default.data[id]);
    }
};
ApiDetailService = __decorate([
    decorator_1.Provide('ApiDetailService')
], ApiDetailService);
exports.ApiDetailService = ApiDetailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy95dXVhbmcvRGVza3RvcC9naXRodWIvc3NyL2RvY3Mvc3JjLyIsInNvdXJjZXMiOlsic2VydmljZS9kZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbURBQTZDO0FBQzdDLDJDQUFpQztBQUdqQyxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQUMzQixLQUFLLENBQUMsS0FBSyxDQUFFLEVBQUU7UUFDYixPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUM7Q0FDRixDQUFBO0FBSlksZ0JBQWdCO0lBRDVCLG1CQUFPLENBQUMsa0JBQWtCLENBQUM7R0FDZixnQkFBZ0IsQ0FJNUI7QUFKWSw0Q0FBZ0IifQ==