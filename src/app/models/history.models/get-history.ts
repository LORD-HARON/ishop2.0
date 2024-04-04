export class GetHistoryModel {
    constructor(
        public token: string,
        public order?: string,
        public status?: string,
        public store?: string,
        public user?: string,
        public deliveryType?: string,
        public startDate?: string,
        public endDate?: string
    ) { }
}