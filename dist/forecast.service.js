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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastService = void 0;
const common_1 = require("@nestjs/common");
const sqlite3_1 = require("sqlite3");
const convFactor = 100;
let ForecastService = class ForecastService {
    constructor(db) {
        this.db = db;
    }
    processDataByMonth(rows, grades) {
        const dataByMonth = {};
        rows.forEach((row) => {
            const yearMonthKey = `${row.year}-${String(row.month).padStart(2, "0")}`;
            if (!dataByMonth[yearMonthKey]) {
                dataByMonth[yearMonthKey] = {
                    DateYearAndMonth: yearMonthKey,
                    Forecast: "N",
                };
            }
        });
        grades.forEach((grade, i) => {
            const gradeRows = rows.filter((r) => r.grade === grade);
            const batchesByYearMonth = {};
            gradeRows.forEach((row) => {
                const yearMonthKey = `${row.year}-${String(row.month).padStart(2, "0")}`;
                batchesByYearMonth[yearMonthKey] = row.batches;
            });
            for (const yearMonthKey in dataByMonth) {
                dataByMonth[yearMonthKey][`Grade_${i}_${grade}`] =
                    batchesByYearMonth[yearMonthKey] || 0;
            }
        });
        return dataByMonth;
    }
    simpleMovingAverage(vals, periods) {
        if (vals.length < periods)
            return null;
        const sum = vals.slice(-periods).reduce((a, v) => a + v, 0);
        return sum / periods;
    }
    forecastAndAppendToRows(rows) {
        if (rows.length === 0)
            return [];
        const firstRow = rows[0];
        const keys = Object.keys(firstRow).filter((k) => k.startsWith("Grade_"));
        if (keys.length === 0)
            return rows;
        const last = rows[rows.length - 1];
        const date = new Date(last.DateYearAndMonth);
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        const newDateY = newDate.getFullYear();
        const newDateM = newDate.getMonth();
        const forecastRow = {
            DateYearAndMonth: `${newDateY}-${String(newDateM + 1).padStart(2, "0")}`,
            Forecast: "Y",
        };
        for (const key of keys) {
            const values = rows.map((r) => r[key]);
            const sma = this.simpleMovingAverage(values, values.length);
            forecastRow[key] = sma !== null ? Math.round(sma) : 0;
        }
        rows.push(forecastRow);
        rows.forEach((row) => {
            for (const key of keys) {
                row[key] = `${row[key]} (${row[key] * convFactor} Tons)`;
            }
        });
        return rows;
    }
    getForecastAllGrades() {
        const sql = `SELECT DISTINCT grade FROM production_data`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err)
                    return reject(err);
                const grades = rows === null || rows === void 0 ? void 0 : rows.map(({ grade }) => grade);
                if (!grades || grades.length === 0)
                    resolve([]);
                const placeholders = grades === null || grades === void 0 ? void 0 : grades.map(() => "?").join(",");
                const sql = `
          SELECT year, month, grade, batches
          FROM production_data
          WHERE grade IN (${placeholders})
          ORDER BY year, month
        `;
                this.db.all(sql, grades, (err, rows) => {
                    if (err)
                        return reject(err);
                    if (rows.length === 0)
                        return resolve([]);
                    const dataByMonth = this.processDataByMonth(rows, grades);
                    const result = this.forecastAndAppendToRows(Object.values(dataByMonth));
                    resolve(result);
                });
            });
        });
    }
    getForecastByGrades(grades) {
        const placeholders = grades === null || grades === void 0 ? void 0 : grades.map(() => "?").join(",");
        const sql = `
      SELECT year, month, grade, batches
      FROM production_data
      WHERE grade IN (${placeholders})
      ORDER BY year, month
    `;
        return new Promise((resolve, reject) => {
            if (!grades || grades.length === 0)
                resolve([]);
            this.db.all(sql, grades, (err, rows) => {
                if (err)
                    return reject(err);
                if (rows.length === 0)
                    return resolve([]);
                const dataByMonth = this.processDataByMonth(rows, grades);
                const result = this.forecastAndAppendToRows(Object.values(dataByMonth));
                resolve(result);
            });
        });
    }
    getForecastByGroup(group) {
        const sql = `SELECT grade FROM groups_data WHERE group_name = ?`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [group], (err, rows) => {
                if (err)
                    return reject(err);
                const grades = rows === null || rows === void 0 ? void 0 : rows.map((r) => r.grade);
                if (!grades || grades.length === 0)
                    resolve([]);
                const placeholders = grades.map(() => "?").join(",");
                const sql = `
          SELECT year, month, grade, batches
          FROM production_data
          WHERE grade IN (${placeholders})
          ORDER BY year, month
        `;
                this.db.all(sql, grades, (err, rows) => {
                    if (err)
                        return reject(err);
                    if (rows.length === 0)
                        return resolve([]);
                    const dataByMonth = this.processDataByMonth(rows, grades);
                    Object.keys(dataByMonth).forEach((d) => {
                        const _a = dataByMonth[d], { DateYearAndMonth, Forecast } = _a, rest = __rest(_a, ["DateYearAndMonth", "Forecast"]);
                        const vals = Object.values(rest);
                        const sum = vals.reduce((a, b) => a + b);
                        dataByMonth[d] = {
                            DateYearAndMonth,
                            Forecast,
                            Grade_Grades_Grouped: sum,
                        };
                    });
                    const result = this.forecastAndAppendToRows(Object.values(dataByMonth));
                    resolve(result);
                });
            });
        });
    }
};
exports.ForecastService = ForecastService;
exports.ForecastService = ForecastService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [sqlite3_1.Database])
], ForecastService);
//# sourceMappingURL=forecast.service.js.map