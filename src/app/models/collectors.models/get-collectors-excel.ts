import { GetCollectorsReportAnswerModel } from "./get-collectors-report-answer";

export class GetCollectorsExcelModel {
    constructor(
        public token: string,
        public report: GetCollectorsReportAnswerModel[]
    ) { }
}