export class GetCollectorsReportAnswerModel {
    constructor(
        public orderId: string,
        public collectDate: string,
        public article: string,
        public count: string,
        public coefficient: string,
        public collector: string
    ) { }
}