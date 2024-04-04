export class PauseOrderReq {
    constructor(
        public token: string,
        public sub_num: string,
        public userName: string,
        public orderNum?: string
    ) { }
}