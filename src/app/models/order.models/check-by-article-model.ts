export class CheckByArticleModel {
    constructor(
        public token: string,
        public barcode: string,
        public article: string
    ) { }
}