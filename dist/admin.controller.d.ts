import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listTables(): Promise<string[]>;
    resetDatabase(): Promise<any>;
}
