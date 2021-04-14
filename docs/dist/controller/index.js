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
exports.Index = void 0;
const decorator_1 = require("@midwayjs/decorator");
const ssr_core_vue3_1 = require("ssr-core-vue3");
let Index = class Index {
    async handler() {
        try {
            this.ctx.apiService = this.apiService;
            this.ctx.apiDeatilservice = this.apiDeatilservice;
            const stream = await ssr_core_vue3_1.render(this.ctx, {
                stream: true
            });
            this.ctx.body = stream;
        }
        catch (error) {
            console.log(error);
            this.ctx.body = error;
        }
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], Index.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject('ApiService'),
    __metadata("design:type", Object)
], Index.prototype, "apiService", void 0);
__decorate([
    decorator_1.Inject('ApiDetailService'),
    __metadata("design:type", Object)
], Index.prototype, "apiDeatilservice", void 0);
__decorate([
    decorator_1.Get('/'),
    decorator_1.Get('/docs/:page'),
    decorator_1.Get('/blog'),
    decorator_1.Get('/blog:router'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Index.prototype, "handler", null);
Index = __decorate([
    decorator_1.Provide(),
    decorator_1.Controller('/')
], Index);
exports.Index = Index;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3l1dWFuZy9EZXNrdG9wL2dpdGh1Yi9zc3IvZG9jcy9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUV0RSxpREFBc0M7QUFVdEMsSUFBYSxLQUFLLEdBQWxCLE1BQWEsS0FBSztJQWNoQixLQUFLLENBQUMsT0FBTztRQUNYLElBQUk7WUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFBO1lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFBO1lBQ2pELE1BQU0sTUFBTSxHQUFHLE1BQU0sc0JBQU0sQ0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUM5QyxNQUFNLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQTtTQUN2QjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7U0FDdEI7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQXpCQztJQURDLGtCQUFNLEVBQUU7O2tDQUNPO0FBR2hCO0lBREMsa0JBQU0sQ0FBQyxZQUFZLENBQUM7O3lDQUNFO0FBR3ZCO0lBREMsa0JBQU0sQ0FBQyxrQkFBa0IsQ0FBQzs7K0NBQ1E7QUFNbkM7SUFKQyxlQUFHLENBQUMsR0FBRyxDQUFDO0lBQ1IsZUFBRyxDQUFDLGFBQWEsQ0FBQztJQUNsQixlQUFHLENBQUMsT0FBTyxDQUFDO0lBQ1osZUFBRyxDQUFDLGNBQWMsQ0FBQzs7OztvQ0FhbkI7QUExQlUsS0FBSztJQUZqQixtQkFBTyxFQUFFO0lBQ1Qsc0JBQVUsQ0FBQyxHQUFHLENBQUM7R0FDSCxLQUFLLENBMkJqQjtBQTNCWSxzQkFBSyJ9