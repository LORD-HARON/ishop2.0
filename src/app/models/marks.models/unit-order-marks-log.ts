export class UnitOrderMarksLogModel {
    constructor(
        public id: number,
        public order: string,
        public subOrder: string,
        public storeloc: string,
        public subMarks: number,
        public orderMarks: number,
        public completeOrderDate: Date
    ) { }
}