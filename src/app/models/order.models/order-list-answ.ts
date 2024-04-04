import { ClientInfo } from "./client-info";
import { OrderHeader } from "./order-header";

export class OrderListAnsw {
    constructor(
        public id: string,
        public order: OrderHeader,
        public aboutClient: ClientInfo,
        public aboutWoker: string,
        public place: string,
        public info: string,
        public status: string,
        public repeatStatus: string,
    ) { }
}