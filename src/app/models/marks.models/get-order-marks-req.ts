export class GetOrderMarksReqModel {
    constructor(
        public token: string,
        public dateStart: Date,
        public dateEnd: Date,
        public storeloc: string,
        public order: string
    ) { }
}