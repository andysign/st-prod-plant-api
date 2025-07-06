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
exports.ForecastController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const forecast_service_1 = require("./forecast.service");
const csv42_1 = require("csv42");
const c2md = require("csv-to-markdown-table");
const GetForecastApiQueryFmt = {
    name: "fmt",
    required: false,
    description: "Set to 'csv' / 'md' to retrieve in the respective format.",
    enum: ["csv", "md"],
};
const GetForecastApiQueryGrade = {
    name: "grade",
    required: true,
    description: "The grade(s) to forecast (comma-separated).",
    example: "B500A,A36",
};
const GetForecastApiResponse = {
    status: 200,
    description: "Historical data followed by a one-month forecast.",
    schema: {
        type: "array",
        items: {
            type: "object",
            properties: {
                DateYearAndMonth: {
                    type: "string",
                    example: "2024-06",
                    description: "The year and month for the row.",
                },
                Forecast: {
                    type: "string",
                    example: "N",
                    description: "Indicates if the row is a forecast or not (Y / N)",
                },
            },
            required: ["DateYearAndMonth", "Forecast"],
            additionalProperties: {
                type: "string",
                description: "Dynamically cols for each grade, eg: 'Grade_0_B500A'.",
                example: "119 (11900 Tons)",
            },
            example: {
                DateYearAndMonth: "2024-06",
                Forecast: "N",
                Grade_0_B500A: "119 (11900 Tons)",
                Grade_1_A5888: "219 (21900 Tons)",
            },
        },
    },
};
const GetForecastApiQueryGroup = {
    name: "group",
    required: true,
    description: "The group to forecast.",
    example: "Rebar",
};
let ForecastController = class ForecastController {
    constructor(forecastService) {
        this.forecastService = forecastService;
    }
    getFrAll(f) {
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.forecastService.getForecastAllGrades();
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.forecastService.getForecastAllGrades();
    }
    getFr(f, g) {
        const grades = g === null || g === void 0 ? void 0 : g.split(",");
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.forecastService.getForecastByGrades(grades);
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.forecastService.getForecastByGrades(grades);
    }
    getFG(f, g) {
        const group = g;
        if (f === "csv" || f === "md") {
            return new Promise(async (res) => {
                const data = await this.forecastService.getForecastByGroup(group);
                if (f === "csv") {
                    res((0, csv42_1.json2csv)(data));
                }
                else {
                    res(c2md((0, csv42_1.json2csv)(data, { eol: "\n" }).trimEnd(), ",", true));
                }
            });
        }
        return this.forecastService.getForecastByGroup(group);
    }
};
exports.ForecastController = ForecastController;
__decorate([
    (0, common_1.Get)("/prod/forecast"),
    (0, swagger_1.ApiOperation)({ summary: "Get hist months & a forecast one for all grades" }),
    (0, swagger_1.ApiQuery)(GetForecastApiQueryFmt),
    (0, swagger_1.ApiResponse)(GetForecastApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ForecastController.prototype, "getFrAll", null);
__decorate([
    (0, common_1.Get)("/prod/forecast-by-grades"),
    (0, swagger_1.ApiOperation)({ summary: "Get hist months followed by and a forecasted one" }),
    (0, swagger_1.ApiQuery)(GetForecastApiQueryFmt),
    (0, swagger_1.ApiQuery)(GetForecastApiQueryGrade),
    (0, swagger_1.ApiResponse)(GetForecastApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __param(1, (0, common_1.Query)("grade")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ForecastController.prototype, "getFr", null);
__decorate([
    (0, common_1.Get)("/prod/forecast-by-groups"),
    (0, swagger_1.ApiOperation)({ summary: "Get hist months & a forecast one for a group" }),
    (0, swagger_1.ApiQuery)(GetForecastApiQueryFmt),
    (0, swagger_1.ApiQuery)(GetForecastApiQueryGroup),
    (0, swagger_1.ApiResponse)(GetForecastApiResponse),
    __param(0, (0, common_1.Query)("fmt")),
    __param(1, (0, common_1.Query)("group")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ForecastController.prototype, "getFG", null);
exports.ForecastController = ForecastController = __decorate([
    (0, swagger_1.ApiTags)("Forecast"),
    (0, common_1.Controller)(""),
    __metadata("design:paramtypes", [forecast_service_1.ForecastService])
], ForecastController);
//# sourceMappingURL=forecast.controller2.js.map