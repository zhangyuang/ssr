"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ssr_server_utils_1 = require("ssr-server-utils");
class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async didReady() {
        await ssr_server_utils_1.initialSSRDevProxy(this.app);
    }
}
exports.default = AppBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy95dXVhbmcvRGVza3RvcC9naXRodWIvc3NyL2RvY3Mvc3JjLyIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQXFEO0FBR3JELE1BQU0sV0FBVztJQUVmLFlBQWEsR0FBRztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUTtRQUNaLE1BQU0scUNBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3BDLENBQUM7Q0FDRjtBQUVELGtCQUFlLFdBQVcsQ0FBQSJ9