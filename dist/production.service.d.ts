import { Database } from "sqlite3";
export declare class ProductionService {
    private db;
    constructor(db: Database);
    private parseCsv;
    private insertDefIntoProductionDatabase;
    private insertDefIntoGroupsDatabase;
    private initDatabase;
    private processGroupCsv;
    private processSequenceCsv;
    private upsertGroups;
    private upsertProductionData;
    getHello(): string;
    getProdDataWithGroups(): Promise<any[]>;
    uploadProdDataT1(sequenceFile: File, groupsFile: File | null): Promise<any>;
    uploadProdDataT2(file: any): Promise<any>;
    getProdData(): Promise<any[]>;
    uploadGroups(file: any): Promise<any>;
    getGroupsData(): Promise<any[]>;
}
