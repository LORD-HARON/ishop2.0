import { GetMarksReportAnswerModel } from "./get-marks-report-answer";

export class GetMarksExcelModel {
    constructor(
        public token: string,
        public marks: GetMarksReportAnswerModel[]
    ) { }
}