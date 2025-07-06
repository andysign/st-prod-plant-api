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
exports.ProductionService = void 0;
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
let ProductionService = class ProductionService {
    constructor(db) {
        this.db = db;
        this.initDatabase();
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
    processGroupCsv(file) {
        const csvData = file.buffer.toString("utf8");
        const records = this.parseCsv(csvData);
        const processedData = {};
        for (const r of records) {
            if (r.Grade && r.Group)
                processedData[r.Grade] = r.Group;
        }
        const processedDataArr = Object.entries(processedData);
        return processedDataArr;
    }
    processSequenceCsv(file) {
        const csvData = file.buffer.toString("utf8");
        const records = this.parseCsv(csvData);
        const gradeCounts = {};
        let year = null;
        let month = null;
        for (const r of records) {
            if (r.Grade && r.Grade !== "-") {
                year = new Date(r.Date).getFullYear();
                month = new Date(r.Date).getMonth() + 1;
                gradeCounts[r.Grade] = (gradeCounts[r.Grade] || 0) + 1;
            }
        }
        if (year === null)
            return [];
        const processedArr = Object.entries(gradeCounts).map(([grade, batches]) => [
            year,
            month,
            grade,
            batches,
        ]);
        return processedArr;
    }
    upsertGroups(data) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION;");
                const stmt = this.db.prepare(`INSERT INTO groups_data (grade, group_name)
           VALUES (?, ?)
           ON CONFLICT(grade) DO UPDATE SET group_name = excluded.group_name;`);
                for (const [grade, groupName] of data)
                    stmt.run(grade, groupName);
                stmt.finalize((err) => {
                    const command = err ? "ROLLBACK;" : "COMMIT;";
                    this.db.run(command, (runErr) => {
                        if (err || runErr) {
                            reject(err || runErr);
                        }
                        else {
                            console.log("Upserted into the db:", data.length, "ele");
                            resolve();
                        }
                    });
                });
            });
        });
    }
    upsertProductionData(data) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION;");
                const stmt = this.db.prepare(`INSERT INTO production_data (year, month, grade, batches)
           SELECT ?, ?, ?, ?
           WHERE EXISTS (SELECT 1 FROM groups_data WHERE grade = ?)
           ON CONFLICT(year, month, grade) DO UPDATE SET batches = excluded.batches;`);
                for (const [year, month, grade, batches] of data) {
                    stmt.run(year, month, grade, batches, grade);
                }
                stmt.finalize((err) => {
                    const command = err ? "ROLLBACK;" : "COMMIT;";
                    this.db.run(command, (runErr) => {
                        if (err || runErr) {
                            reject(err || runErr);
                        }
                        else {
                            console.log("Upserted into the db:", data.length, "records");
                            resolve();
                        }
                    });
                });
            });
        });
    }
    getHello() {
        return "NestJs API. Go to /api/v0/ pls.";
    }
    getProdDataWithGroups() {
        const sql = `
      SELECT
          pd.year, pd.month, gd.group_name, pd.grade, pd.batches
      FROM
          production_data pd
      INNER JOIN
          groups_data gd ON pd.grade = gd.grade
      ORDER BY
          pd.year, pd.month, gd.group_name;
    `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    uploadProdDataT1(sequenceFile, groupsFile) {
        return new Promise((resolve) => {
            if (groupsFile) {
                const processedGroups = this.processGroupCsv(groupsFile);
                this.upsertGroups(processedGroups).then(() => {
                    const processedData = this.processSequenceCsv(sequenceFile);
                    this.upsertProductionData(processedData).then(() => {
                        resolve({ result: "OK" });
                    });
                });
            }
            else {
                console.log("Using internal groups");
                const processedData = this.processSequenceCsv(sequenceFile);
                this.upsertProductionData(processedData).then(() => {
                    resolve({ result: "OK. Inserted using internal groups" });
                });
            }
        });
    }
    uploadProdDataT2(file) {
        return new Promise((resolve) => {
            const csvData = file.buffer.toString("utf8");
            const r = this.parseCsv(csvData);
            const conv = (n) => Math.ceil(parseInt(n) / 100);
            const grs = r.map((e) => [e["Grade"], e["Quality group"]]);
            const prs = r.map((e) => [e.Year, e.Month, e.Grade, conv(e.Tons)]);
            Promise.all([
                this.upsertGroups(grs),
                this.upsertProductionData(prs),
            ]).then(() => {
                resolve({ response: "OK" });
            });
        });
    }
    getProdData() {
        const sql = `SELECT * FROM production_data;`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    uploadGroups(file) {
        return new Promise((res) => {
            const processedData = this.processGroupCsv(file);
            this.upsertGroups(processedData).then(() => res({ response: "OK" }));
        });
    }
    getGroupsData() {
        const sql = `SELECT * FROM groups_data;`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
};
exports.ProductionService = ProductionService;
exports.ProductionService = ProductionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [sqlite3_1.Database])
], ProductionService);
//# sourceMappingURL=production.service.js.map