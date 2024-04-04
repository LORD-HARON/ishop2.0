export class LoginResponse {
    constructor(
        public login: string,
        public token: string,
        public cn: string,
        public title: string,
        public department: string,
        public adminCount: string,
    ) { }
}