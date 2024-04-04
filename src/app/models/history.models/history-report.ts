export class HistoryReportModel {
    constructor(
        public id: number,
        public login?: string,
        public fio?: string,
        public order?: string,
        public deliveryType?: string,
        public sklad?: string,
        public status?: string,
        public actionDate?: Date
    ) { }
}