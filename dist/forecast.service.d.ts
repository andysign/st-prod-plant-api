import { Database } from "sqlite3";
export declare class ForecastService {
    private db;
    constructor(db: Database);
    private processDataByMonth;
    private simpleMovingAverage;
    private forecastAndAppendToRows;
    getForecastAllGrades(): Promise<any[]>;
    getForecastByGrades(grades: string[]): Promise<any[]>;
    getForecastByGroup(group: string): Promise<any[]>;
}
