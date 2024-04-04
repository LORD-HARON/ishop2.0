import { HistoryReportModel } from "./history-report";


export class GetLogsExcelModel {
    constructor(
        public token: string,
        public history: HistoryReportModel[]
    ) { }
}