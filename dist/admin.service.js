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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const sqlite3_1 = require("sqlite3");
const parse = require("csv-parse/lib/sync");
const initialProductionData = `
Year 	, Month 	, Grade   	, Batches 	
2024 	, 6     	, B500A   	, 119     	
2024 	, 6     	, A36     	, 9       	
2024 	, 6     	, C35     	, 4       	
2024 	, 6     	, A53/A53 	, 4       	
2024 	, 7     	, B500A   	, 119     	
2024 	, 7     	, A36     	, 9       	
2024 	, 7     	, C35     	, 4       	
2024 	, 7     	, A53/A53 	, 4       	
2024 	, 8     	, B500A   	, 1       	
2024 	, 8     	, A36     	, 5       	
2024 	, 8     	, C35     	, 3       	
2024 	, 8     	, A53/A53 	, 5       	
`;
const initialGroupsData = `
Grade    	, Group 	
B500A    	, Rebar 	
A36      	, MBQ   	
C35      	, SBQ   	
C40      	, SBQ   	
A53/A543 	, CHQ   	
`;
let AdminService = class AdminService {
    constructor(db) {
        this.db = db;
    }
    parseCsv(data) {
        return parse(data, {
            columns: (header) => header.map((col) => col.trim()),
            skip_empty_lines: true,
            cast: (value) => value.trim(),
            trim: true,
        });
    }
    insertDefIntoProductionDatabase(dataArray) {
        this.db.serialize(() => {
            this.db.run("BEGIN TRANSACTION;");
            const stmt = this.db.prepare("INSERT INTO production_data (year, month, grade, batches) VALUES (?, ?, ?, ?)");
            dataArray.forEach((row) => stmt.run(row.year, row.month, row.grade, row.batches));
            stmt.finalize();
            this.db.run("COMMIT;");
        });
    }
    insertDefIntoGroupsDatabase(dataArray) {
        this.db.serialize(() => {
            this.db.run("BEGIN TRANSACTION;");
            const stmt = this.db.prepare("INSERT INTO groups_data (grade, group_name) VALUES (?, ?)");
            dataArray.forEach((row) => stmt.run(row.grade, row.groupName));
            stmt.finalize();
            this.db.run("COMMIT;");
        });
    }
    initDatabase() {
        try {
            const recordsProduction = this.parseCsv(initialProductionData);
            const productionDataArray = recordsProduction.map((row) => ({
                year: parseInt(row.Year),
                month: parseInt(row.Month),
                grade: row.Grade,
                batches: parseInt(row.Batches),
            }));
            this.insertDefIntoProductionDatabase(productionDataArray);
            console.log("Inserted into DB:", productionDataArray.length, "records");
            const recordsGroups = this.parseCsv(initialGroupsData);
            const groupsDataArray = recordsGroups.map((row) => ({
                grade: row.Grade,
                groupName: row.Group,
            }));
            this.insertDefIntoGroupsDatabase(groupsDataArray);
            console.log("Inserted into the DB:", groupsDataArray.length, "records");
        }
        catch (error) {
            console.error("Error parsing CSV:", error);
        }
    }
    listTables() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows.map((row) => row.name));
                }
            });
        });
    }
    resetDatabase() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("DELETE FROM production_data;", (err) => {
                    if (err)
                        return reject(err);
                });
                this.db.run("DELETE FROM groups_data;", (err) => {
                    if (err)
                        return reject(err);
                });
                this.initDatabase();
                resolve({ response: "OK" });
            });
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [sqlite3_1.Database])
], AdminService);
//# sourceMappingURL=admin.service.js.map