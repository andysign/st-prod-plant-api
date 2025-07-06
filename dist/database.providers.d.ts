import * as sqlite3 from "sqlite3";
export declare const databaseProviders: {
    provide: string;
    useFactory: () => Promise<sqlite3.Database>;
}[];
