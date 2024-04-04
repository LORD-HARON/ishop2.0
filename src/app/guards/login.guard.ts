import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const loginGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const tokenService = inject(TokenService)
    const router = inject(Router)
    let token = tokenService.getToken();
    if (token != "") {
        return true
    }
    else
        router.navigate(['/login'])
    return false
}