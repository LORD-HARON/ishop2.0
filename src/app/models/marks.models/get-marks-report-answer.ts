export class GetMarksReportAnswerModel {
    constructor(
        public order: string,
        public storeloc: string,
        public marksCount: number,
        public completeDate: Date
    ) { }
}