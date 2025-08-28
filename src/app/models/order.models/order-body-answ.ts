import { ClientInfo } from "./client-info";
import { OrderBody } from "./order-body";


export class OrderBodyAnsw {
    constructor(
        public num: string,
        public sub_num: string,
        public name: string,
        public belPost: boolean,
        public postCode: string,
        public postCount: number,
        public aboutClient: ClientInfo,
        public body: Array<OrderBody>,
        public place: string[],
        public marksCount: number
    ) { }
}
