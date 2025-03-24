export class GetCollectorsReportAnswerModel {
    constructor(
        public orderId: string,
        public collectDate: string,
        public article: string,
        public count: number,
        public coefficient: number,
        public collector: string,
        public storeLoc: string
    ) { }
}