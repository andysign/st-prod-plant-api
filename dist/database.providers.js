"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sqlite3 = require("sqlite3");
exports.databaseProviders = [
    {
        provide: "DATABASE_CONNECTION",
        useFactory: async () => {
            const db = new sqlite3.Database(":memory:");
            db.serialize(() => {
                db.run(`
          CREATE TABLE production_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            month INTEGER,
            grade TEXT,
            batches INTEGER,
            UNIQUE(year, month, grade)
          );
        `);
                db.run(`
          CREATE TABLE groups_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade TEXT NOT NULL UNIQUE,
            group_name TEXT NOT NULL
          );
        `);
            });
            return db;
        },
    },
];
//# sourceMappingURL=database.providers.js.map