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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const GetDbListTablesResponse = {
    status: 200,
    schema: { type: "array", items: { type: "string" } },
};
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    listTables() {
        return this.adminService.listTables();
    }
    resetDatabase() {
        return this.adminService.resetDatabase();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_2.ApiOperation)({ summary: "Get the name of every single db table" }),
    (0, common_1.Get)("/db/list/tables"),
    (0, swagger_2.ApiResponse)(GetDbListTablesResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listTables", null);
__decorate([
    (0, common_1.Delete)("/db/reset"),
    (0, swagger_2.ApiOperation)({ summary: "Reset the database to its initial state" }),
    (0, swagger_2.ApiResponse)({ status: 200, description: "Database reset successfully." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetDatabase", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("DbManagement"),
    (0, common_1.Controller)(""),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map