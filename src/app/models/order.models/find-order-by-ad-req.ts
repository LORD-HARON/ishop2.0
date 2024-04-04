export class FindOrderByAdReq {
    constructor(
        public token: string,
        public adres: string,
        public store: string,
    ) { }
}