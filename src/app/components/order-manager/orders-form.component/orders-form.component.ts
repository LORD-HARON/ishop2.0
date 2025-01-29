import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import { OrderListAnsw } from "src/app/models/order.models/order-list-answ";
import { OrderSearchService } from "src/app/services/order-search.service";
import { OrderService } from "src/app/services/order.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TimerService } from "src/app/services/timer.service";
import { TokenService } from "src/app/services/token.service";
import { InvoiceDialogComponent } from "../order-list-form.component/order-list-form.component";
import { InvoiseSettingsComponent } from "./invoice-settings.component/invoice-settings.component";
import { AdaptiveService } from "src/app/services/adaptive.service";
import { CollecotrsSettingComponent } from "./collectors-setting.component/collectors-setting.component";

@Component({
    selector: 'app-orders-form',
    templateUrl: './orders-form.component.html',
    styleUrls: ['./orders-form.component.scss']
})
export class OrdersFormComponent implements OnInit {
    @Input() data: string
    tabIndex: number;
    searchNumOrder: string = '';
    timerValue: any = 120;
    intervalId: any;
    checkedOrders = false;
    pause = false;
    isAdminIshop: boolean = false;
    isChecked: boolean = false;
    screenWidth: number
    constructor(
        private dialog: MatDialog,
        private tokenService: TokenService,
        private timerService: TimerService,
        private orderService: OrderService,
        private snackbarService: SnackbarService,
        private orderSearchService: OrderSearchService,
        private router: Router,
        private adaptive: AdaptiveService) { }
    ngOnInit(): void {
        this.screenWidth = this.adaptive.GetCurrentWidth()
        this.tabIndex = Number(localStorage.getItem('tabIndex'))
        console.log(this.tokenService.getToken())
        this.intervalId = setInterval(() => {
            this.timerValue = this.timerValue - 1;
            if (this.timerValue == 0) {
                this.snackbarService.openSnackBar('Список заказов был обновлен', 'Ok');
                this.timerService.updateEvent(this.tabIndex);
                this.timerValue = 120;
            }
        }, 1000);
        this.isAdminIshop = this.tokenService.getTitle() == 'ishopAdmin' ? true : false
    }
    ngOnDestroy() {
        clearInterval(this.intervalId);
    }

    selectedTab($event) {

        this.tabIndex = $event.index;
        localStorage.setItem('tabIndex', String(this.tabIndex));
        if (this.searchNumOrder)
            this.orderSearchService.searchEvent({ order: this.searchNumOrder, shop: this.tabIndex });
        console.log();
        this.timerValue = 120;
    }
    onChanged(listOrders: Array<OrderListAnsw>) {
        if (listOrders.length > 0)
            this.checkedOrders = true;
        else
            this.checkedOrders = false;
    }
    onInputSearchData($event) {
        this.searchNumOrder = $event;
        this.timerValue = 120;
    }

    onClearNumOrder() {
        this.searchNumOrder = '';
        this.orderSearchService.searchEvent({ order: this.searchNumOrder, shop: this.tabIndex });
    }
    onSearchOrder() {
        this.timerValue = 120;
        if (!this.pause) {
            this.orderSearchService.searchEvent({ order: this.searchNumOrder, shop: this.tabIndex, check: this.isChecked });
            this.pause = true;
            let t = timer(0, 1000).subscribe(vl => {
                console.log(vl);
                if (vl >= 3) {
                    this.pause = false;
                    t.unsubscribe();
                }
            });
        }
    }
    openDataInvoiceDialog() {
        const dialogRef = this.dialog.open(InvoiseSettingsComponent);
        dialogRef.afterClosed().subscribe(result => {
        })
    }
    openCollectorsSettingDialog() {
        const dialogRef = this.dialog.open(CollecotrsSettingComponent);
        dialogRef.afterClosed().subscribe(result => {
        })
    }
    opentInstructionDialog() {
        const dialogRef = this.dialog.open(InstructionDialogComponent)
        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
        })
    }
    onClickLogout() {
        localStorage.clear();
        this.tokenService.deleteCookie();
        this.router.navigate(['/login']);
    }
}


@Component({
    selector: 'app-instructions-dialog',
    templateUrl: './instructions.dialog/instructions.dialog.html',
    styleUrls: ['./instructions.dialog/instructions.dialog.scss']
})
export class InstructionDialogComponent {

}