import { Database } from "sqlite3";
export declare class AdminService {
    private db;
    constructor(db: Database);
    private parseCsv;
    private insertDefIntoProductionDatabase;
    private insertDefIntoGroupsDatabase;
    private initDatabase;
    listTables(): Promise<string[]>;
    resetDatabase(): Promise<any>;
}
