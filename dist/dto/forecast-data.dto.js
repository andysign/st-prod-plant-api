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
exports.ForecastDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ForecastDataDto {
}
exports.ForecastDataDto = ForecastDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2024-06",
        description: "The year and month for the data row (YYYY-MM).",
    }),
    __metadata("design:type", String)
], ForecastDataDto.prototype, "DateYearAndMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "N",
        description: "Indicates if the row is a forecast or not (Y/N).",
        enum: ["Y", "N"],
    }),
    __metadata("design:type", String)
], ForecastDataDto.prototype, "Forecast", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "N",
        description: "Show the historical or forecast val in batches and tons.",
        required: false,
    }),
    __metadata("design:type", String)
], ForecastDataDto.prototype, "Grade_Index_GradeName", void 0);
//# sourceMappingURL=forecast-data.dto.js.map