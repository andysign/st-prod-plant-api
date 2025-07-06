"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const production_controller_1 = require("./production.controller");
const production_service_1 = require("./production.service");
const forecast_controller_1 = require("./forecast.controller");
const forecast_service_1 = require("./forecast.service");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const database_module_1 = require("./database.module");
const multer_1 = require("multer");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, platform_express_1.MulterModule.register({ storage: (0, multer_1.memoryStorage)() })],
        controllers: [production_controller_1.ProductionController, forecast_controller_1.ForecastController, admin_controller_1.AdminController],
        providers: [production_service_1.ProductionService, forecast_service_1.ForecastService, admin_service_1.AdminService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map