import { ProductionService } from "./production.service";
import { ProductionDataDto } from "./dto/production-data.dto";
import { GroupGradeDto } from "./dto/group-grade.dto";
export declare class ProductionController {
    private readonly productionService;
    constructor(productionService: ProductionService);
    getHello(): string;
    prodDataWGrs(f: string): Promise<ProductionDataDto[] | string>;
    postProdDataT1(files: any): Promise<object>;
    postProdDataT2(file: Express.Multer.File): Promise<object>;
    getProdData(f: string): Promise<ProductionDataDto[] | string>;
    postGroups(file: Express.Multer.File): Promise<object>;
    getGroupsData(f: string): Promise<GroupGradeDto[] | string>;
}
