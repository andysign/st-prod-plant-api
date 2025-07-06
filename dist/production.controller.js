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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const production_service_1 = require("./production.service");
const production_data_dto_1 = require("./dto/production-data.dto");
const group_grade_dto_1 = require("./dto/group-grade.dto");
const swagger_2 = require("@nestjs/swagger");
const swagger_3 = require("@nestjs/swagger");
const swagger_4 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const csv42_1 = require("csv42");
const c2md = require("csv-to-markdown-table");
const GetProdDataApiQuery = {
    name: "fmt",
    required: false,
    description: "Set to 'csv' or 'md' to receive data in the respective format.",
    enum: ["csv", "md"],
};
const GetProdDataApiResponse = {
    status: 200,
    description: "A list of production data records.",
    type: [production_data_dto_1.ProductionDataDto],
};
const PostProductionT1ApiQuery = {
    schema: {
        type: "object",
        properties: {
            files: {
                description: "Files: sequence.csv (daily sequence for an entire month) and groups.csv (optional)",
                type: "array",
                items: { type: "file" },
                minItems: 1,
                maxItems: 2,
            },
        },
    },
};
const PostProductionT1ApiResponse = {
    status: 200,
    description: "CSV data processed successfully.",
    schema: {
        type: "object",
        properties: {
            response: { type: "file", example: "OK" },
        },
    },
};
const PostProductionT2ApiQuery = {
    schema: {
        type: "object",
        properties: {
            csvFile: { type: "string", format: "binary" },
        },
    },
};
const PostProductionT2ApiResponse = {
    status: 200,
    description: "CSV data processed successfully.",
    schema: {
        type: "object",
        properties: {
            response: {
                type: "string",
                example: "OK",
            },
        },
    },
};
const GetGroupsApiQuery = {
    name: "fmt",
    required: false,
    description: "Set to 'csv' or 'md' to receive data in the respective format.",
    enum: ["csv", "md"],
};
const GetGroupsApiResponse = {
    status: 200,
    description: "A list of db grades w their corresponding groups on the right.",
    type: [group_grade_dto_1.GroupGradeDto],
};
const PostGroupsBodyObj = {
    schema: {
        type: "object",
        properties: {
            file: { type: "string", format: "binary", description: "groups.csv" },
        },
        required: ["file"],
    },
};
const PostGroupsResponse = {
    status: 201,
    description: "Post groups OK response.",
    schema: {
        type: "object",
        example: { response: "OK" },
    },
};
let ProductionController = class ProductionController {
    constructor(productionService) {
        this.productionService = productionService;
    }
    getHello() {
        return "NestJs API. Go to /api/v0/ pls.";
    }
    prodDataWGrs(f) {
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.productionService.getProdDataWithGroups();
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.productionService.getProdDataWithGroups();
    }
    postProdDataT1(files) {
        let sequenceFile = null;
        let groupsFile = null;
        const filesLen = files.length;
        if (filesLen < 1)
            throw new common_3.BadRequestException("Attach min 1 item(s)");
        if (filesLen > 2)
            throw new common_3.BadRequestException("Attach max 2 item(s)");
        if (filesLen >= 1 && files[0].size)
            sequenceFile = files[0];
        if (filesLen > 1 && files[1].size)
            groupsFile = files[1];
        return this.productionService.uploadProdDataT1(sequenceFile, groupsFile);
    }
    postProdDataT2(file) {
        return this.productionService.uploadProdDataT2(file);
    }
    getProdData(f) {
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.productionService.getProdData();
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.productionService.getProdData();
    }
    postGroups(file) {
        return this.productionService.uploadGroups(file);
    }
    getGroupsData(f) {
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.productionService.getGroupsData();
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.productionService.getGroupsData();
    }
};
exports.ProductionController = ProductionController;
__decorate([
    (0, common_1.Get)("/"),
    (0, swagger_2.ApiOperation)({ summary: "ROOT" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("/prod/all"),
    (0, swagger_2.ApiOperation)({ summary: "Get the complete production data w/ groups" }),
    (0, swagger_2.ApiQuery)(GetProdDataApiQuery),
    (0, swagger_2.ApiResponse)(GetProdDataApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "prodDataWGrs", null);
__decorate([
    (0, common_1.Post)("/prod/data/type-one"),
    (0, swagger_2.ApiOperation)({ summary: "Upload a sequence of heats of specified grades" }),
    (0, swagger_3.ApiConsumes)("multipart/form-data"),
    (0, swagger_4.ApiBody)(PostProductionT1ApiQuery),
    (0, swagger_2.ApiResponse)(PostProductionT1ApiResponse),
    (0, swagger_2.ApiResponse)({ status: 400, description: "Invalid CSV data provided." }),
    (0, common_4.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    __param(0, (0, common_2.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "postProdDataT1", null);
__decorate([
    (0, common_1.Post)("/prod/data/type-two"),
    (0, swagger_2.ApiOperation)({ summary: "Upload coarse breakdown into dif product groups" }),
    (0, swagger_3.ApiConsumes)("multipart/form-data"),
    (0, swagger_4.ApiBody)(PostProductionT2ApiQuery),
    (0, swagger_2.ApiResponse)(PostProductionT2ApiResponse),
    (0, swagger_2.ApiResponse)({ status: 400, description: "Invalid CSV data provided." }),
    (0, common_4.UseInterceptors)((0, platform_express_1.FileInterceptor)("csvFile")),
    __param(0, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "postProdDataT2", null);
__decorate([
    (0, common_1.Get)("/prod/data"),
    (0, swagger_2.ApiOperation)({ summary: "Get the production table" }),
    (0, swagger_2.ApiQuery)(GetProdDataApiQuery),
    (0, swagger_2.ApiResponse)(GetProdDataApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "getProdData", null);
__decorate([
    (0, common_1.Post)("/prod/groups"),
    (0, swagger_2.ApiOperation)({ summary: "Upload CSV data to update/insert prod groups" }),
    (0, swagger_3.ApiConsumes)("multipart/form-data"),
    (0, swagger_4.ApiBody)(PostGroupsBodyObj),
    (0, swagger_2.ApiResponse)(PostGroupsResponse),
    (0, common_4.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "postGroups", null);
__decorate([
    (0, common_1.Get)("/prod/groups"),
    (0, swagger_2.ApiOperation)({ summary: "Get all groups and their connected steel grades" }),
    (0, swagger_2.ApiQuery)(GetGroupsApiQuery),
    (0, swagger_2.ApiResponse)(GetGroupsApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductionController.prototype, "getGroupsData", null);
exports.ProductionController = ProductionController = __decorate([
    (0, swagger_1.ApiTags)("Production"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [production_service_1.ProductionService])
], ProductionController);
//# sourceMappingURL=production.controller.js.map