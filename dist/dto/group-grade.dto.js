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
exports.GroupGradeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GroupGradeDto {
}
exports.GroupGradeDto = GroupGradeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "B500A" }),
    __metadata("design:type", String)
], GroupGradeDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rebar" }),
    __metadata("design:type", String)
], GroupGradeDto.prototype, "group_name", void 0);
//# sourceMappingURL=group-grade.dto.js.map