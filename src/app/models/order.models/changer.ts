import { OrderBodyAnsw } from "./order-body-answ";

export class Changer {
    constructor(
        public token: string,
        public changeData: OrderBodyAnsw,
        public userName: string
    ) { }
}