import { ForecastService } from "./forecast.service";
export declare class ForecastController {
    private readonly forecastService;
    constructor(forecastService: ForecastService);
    getFrAll(f: any): Promise<any[] | string>;
    getFr(f: any, g: any): Promise<any[] | string>;
    getFG(f: any, g: any): Promise<any[] | string>;
}
