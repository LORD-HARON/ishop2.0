export class GetCollectorsReportModel {
    constructor(
        public token: string,
        public dateStart: string,
        public dateEnd: string,
        public store: string,
        public user: string
    ) { }
}