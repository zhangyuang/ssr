"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = (appInfo) => {
    const config = {};
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1611038425326_4049';
    // add your config here
    config.middleware = [];
    config.static = {
        prefix: '/',
        dir: [path_1.join(appInfo.appDir, './build'), path_1.join(appInfo.appDir, './public')]
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3l1dWFuZy9EZXNrdG9wL2dpdGh1Yi9zc3IvZG9jcy9zcmMvIiwic291cmNlcyI6WyJjb25maWcvY29uZmlnLmRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBMkI7QUFLM0Isa0JBQWUsQ0FBQyxPQUFtQixFQUFFLEVBQUU7SUFDckMsTUFBTSxNQUFNLEdBQUcsRUFBbUIsQ0FBQTtJQUVsQyx1RUFBdUU7SUFDdkUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFBO0lBQ2xELHVCQUF1QjtJQUN2QixNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQTtJQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHO1FBQ2QsTUFBTSxFQUFFLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxXQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztLQUN6RSxDQUFBO0lBQ0QsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDLENBQUEifQ==