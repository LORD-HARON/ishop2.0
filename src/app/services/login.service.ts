import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environments";
import { LoginQuery } from "../models/login.models/login-query";
import { LoginResponse } from "../models/login.models/login-response";
import { Observable } from "rxjs";
import { Status } from "../models/status";
import { Token } from "@angular/compiler";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    private urlLogin = environment.apiUrlLog + '/auth/?data'; //адрес для логинизации
    private urlLogout = environment.apiUrlLog + '/logout/'; //адрес для логаута


    constructor(private http: HttpClient) { }

    getLogin(login: LoginQuery): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.urlLogin}`, login);
    }

    postLogout(login: Token): Observable<Status> {
        return this.http.post<Status>(`${this.urlLogout}`, login);
    }
}