import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { OrderListAnsw } from "src/app/models/order.models/order-list-answ";
import { formatDate, Location } from '@angular/common';
import { timer } from 'rxjs';
import { environment } from 'src/app/environments/environments';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TimerService } from 'src/app/services/timer.service';
import { StoreService } from 'src/app/services/store.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { OrderSearchService } from 'src/app/services/order-search.service';
import { OrderListReq } from 'src/app/models/order.models/order-list-req';
import { FindOrderReq } from 'src/app/models/order.models/find-order-req';
import { FindOrderByAdReq } from 'src/app/models/order.models/find-order-by-ad-req';
import { PauseOrderReq } from 'src/app/models/order.models/pause-order-req';
import { ToCassa } from 'src/app/models/order.models/to-cassa';
import { SplitPipe } from 'src/app/pipes/split.pipe';
import { OrderBodyReq } from 'src/app/models/order.models/order-body-req';
import { OrderBody } from 'src/app/models/order.models/order-body';
import { OrderBodyAnsw } from 'src/app/models/order.models/order-body-answ';
import { DataInvoiceService } from 'src/app/services/data-invoice.service';
import { ManagerModel } from 'src/app/models/invoice.models/manager';
import { AdaptiveService } from 'src/app/services/adaptive.service';
@Component({
    selector: 'app-order-list-form',
    templateUrl: './order-list-form.component.html',
    styleUrls: ['./order-list-form.component.scss']
})
export class OrderListFormComponent implements OnInit {
    @Input() data: string;
    @Output() onChanged = new EventEmitter<Array<OrderListAnsw>>();
    @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

    orderListAnsw: OrderListAnsw[] = [];
    listOrders: Array<OrderListAnsw> = [];
    selectedColumns: string[]
    displayedColumns = ['Статус', 'Заказ', 'Заказчик', 'Сборщик', 'Место', 'Примичание', 'Действие', 'Отправлен повторно'];
    displayedTsdColumns = ['Статус', 'Заказ', 'Место', 'Действие']
    idShops: Array<any> = [
        { index: 0, id: '%' },
        { index: 1, id: '22' },
        { index: 2, id: '21' },
        { index: 3, id: '18' },
        { index: 4, id: '24' },
        { index: 5, id: '32' },
        { index: 6, id: '34' },
        { index: 7, id: '35' },
        { index: 8, id: '33' },
        { index: 9, id: '11' },
        { index: 10, id: '25' },
    ];
    listStatus: Array<any> = [
        { path: '/orders/ready-build', status: 'gs' },
        { path: '/orders/uncompleted', status: 'ns' },
        { path: '/orders/ready-shipment', status: 'rs' },
        { path: '/orders/sent', status: 'se' },
        { path: '/orders/canceled', status: 'ob' },
        { path: '/orders/return-to-retail', status: 'os' },
        { path: '/orders/archive', status: 'as' },
        { path: '/orders/completed', status: 'oc' }
    ];
    countRecord = 0;
    scrollHeight = 1350;
    splitElement = ';';
    confirmText: string = 'Да';
    cancelText: string = 'Нет';
    cancelClicked = false;
    confirmClicked = false;
    isAdminIshop: boolean = false;
    searchValue: any = null;
    checkColumn: boolean = false;
    isChecked: boolean = false
    checkIcon: string = 'check_box_outline_blank'
    screenWidth: number
    //! #region OrderList functions 
    constructor(
        public dialog: MatDialog,
        private router: Router,
        private location: Location,
        private timerService: TimerService,
        private storeService: StoreService,
        private orderService: OrderService,
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private orderSearchService: OrderSearchService,
        private adaptive: AdaptiveService
    ) {
        this.orderSearchService.events$.forEach(value => {

            this.searchOrder(value)
        });
        this.timerService.events$.forEach(value => {
            if (value) {
                this.loadData(value);
                this.countRecord = 0;
            }
        });
    }
    checkORderList(element): string {
        if (this.listOrders.some(x => x == element))
            return 'check_box'
        else
            return 'check_box_outline_blank'
    }
    ngOnInit(): void {
        this.screenWidth = this.adaptive.GetCurrentWidth()
        this.selectedColumns = this.screenWidth > 1000 ? this.displayedColumns : this.displayedTsdColumns
        this.loadData(this.searchValue);
        this.isAdminIshop = this.tokenService.getTitle() == 'ishopAdmin' ? true : false
    }
    loadData(value) {
        if (value == null) {
            let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data ?? '%', this.getStatus() ?? 'gs', this.countRecord.toString());
            this.orderService.getOrders(orderListReq).subscribe({
                next: response => {
                    if (response) {
                        this.orderListAnsw = response;
                    }
                },
                error: error => {
                    console.log(error);
                    this.snackbarService.openRedSnackBar()
                }
            });
        }
        else {
            if (this.data === this.getShop(value)) {
                let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data, this.getStatus() ?? 'gs', this.countRecord.toString());
                this.orderService.getOrders(orderListReq).subscribe({
                    next: response => {
                        if (response) {
                            this.orderListAnsw = response;
                        }
                    },
                    error: error => {
                        console.log(error);
                        this.snackbarService.openRedSnackBar()
                    }
                });
            }
        }
    }

    ngAfterViewInit() {
        this.scrollbarRef.scrolled.subscribe(e => { console.log(e); this.onScroll(e) });
    }

    onScroll($event) {
        let tempScrollPercent = $event.currentTarget.scrollTop * 100 / this.scrollHeight;
        if (tempScrollPercent > 85) {
            this.dynamicLoadScroll();
            this.scrollHeight = this.scrollHeight + 1600;
        }
    }

    dynamicLoadScroll() {
        if (this.orderListAnsw.length >= this.countRecord) {
            this.countRecord = this.countRecord + 40;
            this.scrollHeight = this.scrollHeight + this.countRecord;
            let orderListReq = new OrderListReq(this.tokenService.getToken(), this.data ?? '%', this.getStatus() ?? 'gs', this.countRecord.toString());
            this.orderService.getOrders(orderListReq).subscribe({
                next: response => {
                    if (response) {
                        this.orderListAnsw = this.orderListAnsw.concat(response);
                    }
                },
                error: error => {
                    console.log(error);
                    this.snackbarService.openRedSnackBar()
                }
            });
        }
    }

    getStatus() {
        return this.listStatus.find(element => element.path === this.location.path()).status;
    }

    getShop(index) {
        return index ? this.idShops.find(element => element.index === index).id : '%';
    }

    searchOrder(searchValue: any) {
        if (searchValue.order) {
            if (searchValue.order && this.getShop(searchValue.shop) === this.data) {
                this.searchValue = searchValue;
                if (this.searchValue.check === false) {
                    let findOrderReq = new FindOrderReq(this.tokenService.getToken(), searchValue.order, this.data);
                    this.orderService.orderSearch(findOrderReq).subscribe({
                        next: response => {
                            if (response) {
                                this.orderListAnsw = response;
                            }
                        },
                        error: error => {
                            console.log(error);
                            this.snackbarService.openRedSnackBar()
                        }
                    });
                } else {
                    let findOrderByAd = new FindOrderByAdReq(this.tokenService.getToken(), searchValue.order, this.data);
                    this.orderService.orderSearchByAdres(findOrderByAd).subscribe({
                        next: response => {
                            if (response) {
                                this.orderListAnsw = response;
                                console.log(this.orderListAnsw);
                            }
                        },
                        error: error => {
                            console.log(error);
                            this.snackbarService.openRedSnackBar()
                        }
                    });
                }
            }
        } else {
            this.loadData(null);
        }
    }

    onClickPauseOrGo(element: OrderListAnsw) {
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num, this.tokenService.getLogin(), `${element.order.num}.${element.place}`);
        this.orderService.orderPause(pauseOrderReq).subscribe({
            next: response => {
                if (response.status) {
                    switch (response.status) {
                        case 'true':
                            if (element.status === 'не принят')
                                element.status = 'ОТЛОЖЕН';
                            else
                                if (element.status === 'ОТЛОЖЕН')
                                    element.status = 'не принят';
                            break;
                        case 'null':
                            this.snackbarService.openRedSnackBar('Подзаказ не найден')
                            break;
                        case 'error':
                            this.snackbarService.openRedSnackBar('Ошибка')
                            break
                        case 'BadAuth':
                            this.snackbarService.openRedSnackBar('Токен устарел')
                            break
                    }

                }
            },
            error: error => {
                console.log(error);
            }
        });
    }

    onClickShow(id) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`/order/${id}`])
        );
        window.open(url, "_blank");
    }

    onClickWriteToCashbox(element: OrderListAnsw) {
        element.order.isCassaPause = true;
        let t = timer(0, 1000).subscribe(vl => {
            console.log(vl);
            if (vl >= 20) {
                element.order.isCassaPause = false;
                t.unsubscribe();
            }
        });
        let toCassa = new ToCassa(this.tokenService.getToken(), element.order.num, element.order.sub_num);
        this.orderService.orderWriteToCashbox(toCassa).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.snackbarService.openSnackGreenBar('Заказ записан в кассу!');
                        break
                    case 'error':
                        this.snackbarService.openRedSnackBar('Ошибка записи в кассу');
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен устарел')
                        break
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        });
    }

    turnOnCheckColumn(e) {
        this.checkIcon = this.isChecked === false ? "check_box_outline_blank" : "check_box"
        this.checkColumn = e;
        if (e === false) {
            this.cleanListOrders();
            this.onChanged.emit(this.listOrders);
        }
    }

    selectOrder(element: OrderListAnsw) {
        if (!this.listOrders.includes(element))
            this.listOrders.push(element);
        else
            if (this.listOrders.includes(element))
                this.removeOrderFromListOrders(element);
        this.onChanged.emit(this.listOrders);
    }

    removeOrderFromListOrders(element: OrderListAnsw): void {
        this.listOrders = this.listOrders.filter(e => e.id !== element.id);
    }

    cleanListOrders() {
        this.listOrders = [];
    }

    onClickReturnProduct(element: OrderListAnsw) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "60%",
            data: { element: element },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.status) {
                let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num, this.tokenService.getLogin(), `${element.order.num}.${element.place}`);
                this.orderService.orderReturn(pauseOrderReq).subscribe({
                    next: response => {
                        switch (response.status) {
                            case 'BadAtuth':
                                this.snackbarService.openRedSnackBar('Неверная идентификация.');
                                break;
                            case 'fail':
                                this.snackbarService.openRedSnackBar('Неверный запрос.');
                                break;
                            case 'false ':
                                this.snackbarService.openRedSnackBar('Подзаказ не найден.');
                                break;
                            case 'error':
                                this.snackbarService.openRedSnackBar('Статус заказа не соотвествует.');
                                break;
                            case 'returned already':
                                this.snackbarService.openSnackGreenBar('Подзаказ был уже возвращен');
                                break;
                            default:
                                this.snackbarService.openSnackGreenBar('Подзаказ возвращен');
                                break;
                        }
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        });
    }

    // onClickReturnToAssembly(id) {
    //     let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), id, this.tokenService.getLogin(), `${element.order.num}.${element.place}`);
    //     this.orderService.orderReturnToAssembly(pauseOrderReq).subscribe({
    //         next: response => {
    //             if (response.status === 'true')
    //                 this.snackbarService.openSnackGreenBar('Подзаказ возвращен в сборку');
    //             else this.snackbarService.openRedSnackBar('Операция не выполнена', this.action, this.styleNoConnect);
    //         },
    //         error: error => {
    //             console.log(error);
    //             this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
    //         }
    //     });
    // }

    onDelete(element: OrderListAnsw) {
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num, this.tokenService.getLogin(), `${element.order.num}.${element.place}`);
        this.orderService.orderDelete(pauseOrderReq).subscribe({
            next: response => {

                switch (response.status) {
                    case 'true':
                        this.snackbarService.openSnackGreenBar('Подзаказ удален');
                        if (this.searchValue)
                            this.searchOrder(this.searchValue);
                        else this.loadData(null);
                        break
                    case 'error':
                        this.snackbarService.openRedSnackBar('Операция не выполнена');
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен устарел');
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Некорректный запрос');
                        break
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar();
            }
        });
    }

    onClickSendToBitrix(element: OrderListAnsw) {
        element.order.isSendToBitrix = true;
        let t = timer(0, 1000).subscribe(vl => {
            console.log(vl);
            if (vl >= 20) {
                element.order.isSendToBitrix = false;
                t.unsubscribe();
            }
        });
        let findOrderReq = new FindOrderReq(this.tokenService.getToken(), element.order.num, '');
        this.orderService.orderSendToBitrix(findOrderReq).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.snackbarService.openSnackGreenBar('Отправлено в OMS');
                        break
                    case 'error':
                        this.snackbarService.openRedSnackBar('Операция не выполнена');
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен устарел')
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Некорректный запрос')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar();
            }
        });
    }

    ngOnDestroy() {
        this.data = '';
    }

    sub_order_id: any;
    isActive: string
    ShowDialogDataOrder(element) {
        this.isActive = element;
    }
    HideDialogDataOrder(element) {
        this.isActive = '';
    }
    action = 'Ok';
    openCompliteDialog(element: OrderListAnsw, dialogType: number): void {
        const compliteDialog = this.dialog.open(ConfirmDialogComponent, {
            data: { action: this.action, element: element, dialogType: dialogType },
            disableClose: true,
        });
        compliteDialog.afterClosed().subscribe(result => {
            switch (result) {
                case 'OMS':
                    this.snackbarService.openSnackGreenBar('Заказ отправлен в OMS');
                    break
                case 'Assembly':
                    this.snackbarService.openSnackGreenBar('Заказ отправлен в сборку');
                    break
                case 'AssemblyError':
                    this.snackbarService.openSnackGreenBar('Операция не выполнена')
                    break;
                case 'Cassa':
                    this.snackbarService.openSnackGreenBar('Заказ отправлен в кассу');
                    break;
                case 'Prog-Cassa':
                    this.snackbarService.openSnackGreenBar('Заказ отправлен в прог. кассу');
                    break;
                case 'Prog-Cassa-false':
                    this.snackbarService.openRedSnackBar('Заказ не отправлен в прог. кассу');
                    break
                case 'Complete':
                    this.snackbarService.openSnackGreenBar('Заказ завершен');
                    break;
                case 'returnToRetail':
                    this.snackbarService.openSnackGreenBar('Заказ возвращен в секцию');
                    break;
                case 'error':
                    this.snackbarService.openRedSnackBar();
                    break;
                case 'BadAuth':
                    this.snackbarService.openRedSnackBar('Токен устарел');
                    break;
                case 'null':
                    this.snackbarService.openRedSnackBar('Некоректный запрос');
                    break;
                case 'delete':
                    this.snackbarService.openSnackGreenBar('Заказ удален')
                    break;
            }
        });
    }

    openInvoiceDialog(element: OrderListAnsw, dialogType: number) {
        const invoiceDialog = this.dialog.open(InvoiceDialogComponent, {
            data: { dialogType: dialogType, element: element }
        })
        invoiceDialog.afterClosed().subscribe(result => {
            console.log(result)
            if (result === false)
                this.snackbarService.openRedSnackBar()
        })
    }
    //#endregion
}

export interface DialogSetting {
    type: string,
    action: string,
    atention: string,
    title: string
}
@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog/confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog/confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    constructor(
        private snackbarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private tokenService: TokenService,
        private orderService: OrderService,
        public dialogRef: MatDialogRef<OrderListFormComponent>
    ) { }

    @Input() action: string = this.data.action;
    @Input() dialogType: number = this.data.dialogType;
    disableButton = false;

    //!#region Order operations 
    onColickCompleteOrder(element: OrderListAnsw = this.data.element) {
        this.disableButton = true;
        let findOrderReq = new FindOrderReq(this.tokenService.getToken(), element.order.num, element.order.name);
        this.orderService.orderCompliteOrder(findOrderReq).subscribe({
            next: response => {
                console.log(response);

                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('Complete');
                        break
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth');
                        break
                    case 'null':
                        this.dialogRef.close('null');
                        break
                    case 'error':
                        this.dialogRef.close('error');
                        break
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }

    onClickSendToBitrix(element: OrderListAnsw = this.data.element) {
        this.disableButton = true;
        let findOrderReq = new FindOrderReq(this.tokenService.getToken(), element.order.num, element.order.name);
        this.orderService.orderSendToBitrix(findOrderReq).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('OMS')
                        break
                    case 'error':
                        this.dialogRef.close('error')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                    case 'null':
                        this.dialogRef.close('null')
                        break
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }

    onClickReturnToAssembly(id = this.data.element.sub_num, order_num = `${this.data.element.num}.${this.data.element.num}`) {
        this.disableButton = true;
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), id, this.tokenService.getLogin(), order_num);
        this.orderService.orderReturnToAssembly(pauseOrderReq).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('Assembly')
                        break
                    case 'error':
                        this.dialogRef.close('AssemblyError')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }

    onClickWriteToCashbox(element: OrderListAnsw = this.data.element) {
        this.disableButton = true;
        let toCassa = new ToCassa(this.tokenService.getToken(), element.order.num, element.order.sub_num);
        this.orderService.orderWriteToCashbox(toCassa).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('Cassa')
                        break
                    case 'error':
                        this.dialogRef.close('error')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                }
                this.dialogRef.close('Cassa')
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }
    onClickWriteToProgrammCassa(element: OrderListAnsw = this.data.element) {
        this.disableButton = true;
        let toCassa = new ToCassa(this.tokenService.getToken(), element.order.num, element.order.sub_num);
        this.orderService.orderToProgrammCassa(toCassa).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('Prog-Cassa')
                        break
                    case 'false':
                        this.dialogRef.close('Prog-Cassa-false')
                        break
                    case 'error':
                        this.dialogRef.close('error')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                    case 'NULL':
                        this.dialogRef.close('null')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }

    onClickReturnToRetail(element: OrderListAnsw = this.data.element) {
        this.disableButton = true;
        let returnToRetailOrder = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num, this.tokenService.getLogin(), `${element.order.num}.${element.place}`);
        this.orderService.orderReturnToRetail(returnToRetailOrder).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('returnToRetail')
                        break
                    case 'error':
                        this.dialogRef.close('error')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }

    onDelete(element: OrderListAnsw = this.data.element) {
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), element.order.sub_num, this.tokenService.getLogin(), `${element.order.num}.${String(element.place)}`);
        this.orderService.orderDelete(pauseOrderReq).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.dialogRef.close('delete')
                        break
                    case 'error':
                        this.dialogRef.close('error')
                        break;
                    case 'BadAuth':
                        this.dialogRef.close('BadAuth')
                        break
                }
            },
            error: error => {
                console.log(error);
                this.dialogRef.close('error');
            }
        });
    }
    //#endregion
}

@Component({
    selector: 'app-invoice-dialog',
    templateUrl: './invoice-dialog/invoice-dialog.html',
    styleUrls: ['./invoice-dialog/invoice-dialog.scss']
})
export class InvoiceDialogComponent {
    //! #region OrderInvoice
    daysCount = ['1 (один)', '3 (три)', '5 (пять)', '10 (десять)'];
    // manager = ['менеджер__________________Иванов/', 'менеджер__________________Петров/'];
    selectedDaysCount: string;
    selectedManager: any;
    selectedDate = new Date()
    nowFormatted: string;
    url!: string;
    showIFrame: boolean = false;

    ManagerList: ManagerModel[]

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataInvoiseService: DataInvoiceService,
        private tokenService: TokenService

    ) {

    }
    @Input() dialogType: number = this.data.dialogType;
    @Input() order: OrderListAnsw = this.data.element
    ngOnInit(): void {
        this.getManager()
    }

    getManager() {
        this.dataInvoiseService.getManagers(this.tokenService.getToken()).subscribe(
            {
                next: result => {
                    if (result)
                        this.ManagerList = result
                },
                error: error => {
                    console.log(error)
                }
            })
    }


    showInvoice() {
        const sendManager = `${this.selectedManager.job_title}________________/${this.selectedManager.fio}/`
        const invoiceNum = `СЧ29.${this.order.order.num}.${this.order.order.name}`;
        this.showIFrame = true;
        console.log(this.nowFormatted)
        this.nowFormatted = formatDate(this.selectedDate, 'dd.MM.yyyy', 'en-US');
        if (this.order.order.delivery_type === '')
            this.url = `${environment.apiUrl}/api/FastReport/ShowReportWithoutDelivery?Id=${this.order.order.sub_num}&EndTime=${this.selectedDaysCount}&Manager=${sendManager}&Date=${this.nowFormatted}&NameDocument=${invoiceNum}&DaysForBank=${this.selectedDaysCount}`
        else
            this.url = `${environment.apiUrl}/api/FastReport/ShowReportInvoice?Id=${this.order.order.sub_num}&EndTime=${this.selectedDaysCount}&Manager=${sendManager}&Date=${this.nowFormatted}&NameDocument=${invoiceNum}&DaysForBank=${this.selectedDaysCount}`
    }
    // showDogovor() {
    //   this.url = `${environment.apiUrl}/api/FastReport/ShowReportInvoice?Id=${this.order.order.sub_num}&EndTime=${this.selectedDaysCount}&Manager=${this.selectedManager}&Date=${this.nowFormatted}`
    // }
    // showDogoworBelpost() {
    //   this.url = `${environment.apiUrl}/api/FastReport/ShowReportInvoice?Id=${this.order.order.sub_num}&EndTime=${this.selectedDaysCount}&Manager=${this.selectedManager}&Date=${this.nowFormatted}`
    // }
    //#endregion
}

@Component({
    selector: 'app-show-data-order-form',
    templateUrl: './show-data-order-form/show-data-order-form.html',
    styleUrls: ['./show-data-order-form/show-data-order-form.scss']
})
export class ShowDataOrderForm {
    //! #region Show data dialog
    @Input() sub_order_id: any;
    orderBodyAnsw?: OrderBody[];
    constructor(
        private tokenService: TokenService,
        private orderService: OrderService
    ) { }
    ngOnInit(): void {
        let orderBodyReq = new OrderBodyReq(this.tokenService.getToken(), this.sub_order_id)
        this.orderService.getSuborder(orderBodyReq).subscribe({
            next: response => {
                if (response) {
                    this.getData(response);
                }
            },
            error: error => {
                console.log(error);
            }
        });
        console.log();
    }

    getData(response: OrderBodyAnsw) {
        this.orderBodyAnsw = response.body;
        console.log(this.orderBodyAnsw);
    }
    //#endregion
}
