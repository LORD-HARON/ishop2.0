export class DirectorModel {
    constructor(
        public id?: number,
        public fio?: string,
        public storeloc?: number | null,
        public power_of_attorney?: string,
        public dolj?: string,
        public doc_dolj?: string,
        public storeName?: string
    ) { }
}