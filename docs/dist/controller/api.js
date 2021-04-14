"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const decorator_1 = require("@midwayjs/decorator");
let Api = class Api {
    async getIndexData() {
        const data = await this.service.index();
        return data;
    }
    async getDetailData() {
        const { ctx, detailService } = this;
        const id = ctx.params.id;
        const data = await detailService.index(id);
        return data;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], Api.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject('ApiService'),
    __metadata("design:type", Object)
], Api.prototype, "service", void 0);
__decorate([
    decorator_1.Inject('ApiDetailService'),
    __metadata("design:type", Object)
], Api.prototype, "detailService", void 0);
__decorate([
    decorator_1.Get('/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Api.prototype, "getIndexData", null);
__decorate([
    decorator_1.Get('/docs/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Api.prototype, "getDetailData", null);
Api = __decorate([
    decorator_1.Provide(),
    decorator_1.Controller('/api')
], Api);
exports.Api = Api;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy95dXVhbmcvRGVza3RvcC9naXRodWIvc3NyL2RvY3Mvc3JjLyIsInNvdXJjZXMiOlsiY29udHJvbGxlci9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQXNFO0FBTXRFLElBQWEsR0FBRyxHQUFoQixNQUFhLEdBQUc7SUFXZCxLQUFLLENBQUMsWUFBWTtRQUNoQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDdkMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBR0QsS0FBSyxDQUFDLGFBQWE7UUFDakIsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDbkMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7UUFDeEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzFDLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztDQUNGLENBQUE7QUFyQkM7SUFEQyxrQkFBTSxFQUFFOztnQ0FDRztBQUdaO0lBREMsa0JBQU0sQ0FBQyxZQUFZLENBQUM7O29DQUNEO0FBR3BCO0lBREMsa0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQzs7MENBQ0s7QUFHaEM7SUFEQyxlQUFHLENBQUMsUUFBUSxDQUFDOzs7O3VDQUliO0FBR0Q7SUFEQyxlQUFHLENBQUMsUUFBUSxDQUFDOzs7O3dDQU1iO0FBdEJVLEdBQUc7SUFGZixtQkFBTyxFQUFFO0lBQ1Qsc0JBQVUsQ0FBQyxNQUFNLENBQUM7R0FDTixHQUFHLENBdUJmO0FBdkJZLGtCQUFHIn0=