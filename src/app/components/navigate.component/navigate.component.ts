import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environments";
import { AdaptiveService } from "src/app/services/adaptive.service";
import { TokenService } from "src/app/services/token.service";
@Component({
    selector: 'app-navigate',
    templateUrl: './navigate.component.html',
    styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent {
    showFiller = true;
    isAdminIshop = false;
    navigateControl: string
    screenWidth: number
    sideMode: string = 'side'
    constructor(
        private router: Router,
        private tokenService: TokenService,
        private adaptiveService: AdaptiveService) { }

    ngOnInit(): void {
        this.screenWidth = this.adaptiveService.GetCurrentWidth()
        this.navigateControl = this.screenWidth > 1000 ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'
        this.isAdminIshop = this.tokenService.getTitle() == ('ishopAdmin' || 'dev') ? true : false
    }

    reload(url: string): void {
        if (this.router.url === url)
            this.router.navigate(['empty'], { state: { url: url } });
    }
    NavigateControl() {
        if (this.navigateControl === 'keyboard_double_arrow_left') {
            this.navigateControl = 'keyboard_double_arrow_right'
        } else {
            this.navigateControl = 'keyboard_double_arrow_left'
        }
    }

}