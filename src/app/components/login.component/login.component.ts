import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginQuery } from "src/app/models/login.models/login-query";
import { LoginResponse } from "src/app/models/login.models/login-response";
import { LoginService } from "src/app/services/login.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TokenService } from "src/app/services/token.service";


@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
    constructor(
        private router: Router,
        private tokenService: TokenService,
        private loginService: LoginService,
        private snackbarService: SnackbarService
    ) { }
    isLoginUser = false;
    loginQuery = new LoginQuery("", "");

    inputType: string = 'password'
    userForm: FormGroup = new FormGroup({
        "login": new FormControl('', Validators.required),
        "password": new FormControl('', Validators.required),
    })
    onClickLogin() {
        this.loginService.getLogin(new LoginQuery(this.userForm.value.login, this.userForm.value.password)).subscribe({
            next: response => {
                if (this.checkResponse(response)) {
                    this.tokenService.setCookie(response);
                    this.tokenService.logEvent(true);
                    this.router.navigate(['/orders/ready-build']);
                }
                else
                    this.snackbarService.openRedSnackBar("Неверный логин или пароль")
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        });
    }

    checkResponse(response: LoginResponse): boolean {
        if (response)
            if (response.token)
                if (response.token.length > 0)
                    return true;
                else return false;
            else return false;
        else return false;
    }
}