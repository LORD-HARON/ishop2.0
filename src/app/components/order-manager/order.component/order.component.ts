import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, Observable, startWith, timer } from "rxjs";
import { BelPostAnsw } from "src/app/models/order.models/belpost-answ";
import { ClientInfo } from "src/app/models/order.models/client-info";
import { OrderBody } from "src/app/models/order.models/order-body";
import { OrderBodyAnsw } from "src/app/models/order.models/order-body-answ";
import { OrderListAnsw } from "src/app/models/order.models/order-list-answ";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/services/order.service";
import { TokenService } from "src/app/services/token.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { environment } from "src/app/environments/environments";
import { FindOrderReq } from "src/app/models/order.models/find-order-req";
import { Changer } from "src/app/models/order.models/changer";
import { BelPostReq } from "src/app/models/order.models/belpost-req";
import { OrderBodyReq } from "src/app/models/order.models/order-body-req";
import { PauseOrderReq } from "src/app/models/order.models/pause-order-req";
import { DeleteItemModel } from "src/app/models/order.models/delete-item";
import { DelPostRequest } from "src/app/models/order.models/del-post-req";
import { MatIconRegistry } from "@angular/material/icon";
import { AdaptiveService } from "src/app/services/adaptive.service";
import { CheckByArticleModel } from "src/app/models/order.models/check-by-article-model";
import { CollectorsService } from "src/app/services/collectors.service";
import { Token } from "src/app/models/token";
import { CollectorsModel } from "src/app/models/collectors.models/collectors";

export interface BelpostData {
    barcode: string,
    username: string,
    address: string,
    num: string,
    // postCount: number
}
interface Collectors {
    name: string
}
@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    @Input() data: string;
    @ViewChild('barcodePrint', { static: true }) barcodePrint: any;
    displayedColumns = ['Артикул', ' ', 'Штрихкод', 'Наименование', 'ед. изм.', 'Количество на складе', 'Требуемое количество', 'Собранное количество', 'Сборщик', 'Коэф.', ''];
    displayedColumnsPrint = ['Артикул', 'Штрихкод', 'Наименование', 'ед. изм.', 'Количество на складе', 'Требуемое количество', 'Собранное количество', 'Стоимость'];
    dataSource: Array<OrderBody> = [new OrderBody('', '', '', '', '0', '0', '0', false, '', '', '', '',)];
    client: ClientInfo = new ClientInfo('', '', '');
    orderId = '';
    isDataChanged = false;
    belpostBarcodes: Array<string> = [];
    param = ';';
    imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=';
    selectedBarcode = '';
    selectedBarcodeFor = '';
    cancelClicked = false;
    confirmClicked = false;
    belpostData: BelpostData | null
    userName = '';

    orderBodyAnsw: OrderBodyAnsw = new OrderBodyAnsw('', '', '', false, '', 0, new ClientInfo('', '', ''), [new OrderBody('', '', '', '', '0', '0', '0', false, '', '', '')], []);
    countReadyСhange: number;
    belPostAnsw: BelPostAnsw
    splitElement = ';';

    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = [' 01Bepx', ' 01Hu3', ' 02Bepx', ' 03Bepx', ' 04Bepx', ' 05Hu3', ' colona1', ' D03Bepx', ' Poddon', ' Telezka', 'A0', 'A00', 'A001', 'A002', 'A003', 'A004', 'A005', 'A006', 'A008', 'A009', 'A010', 'A029', 'A030', 'A031', 'A032', 'A033', 'A034', 'B001'];
    isAdminIshop = false;

    @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService,
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private matIconReg: MatIconRegistry,
        private adaptiveService: AdaptiveService,
        private collectorsService: CollectorsService
    ) {
        this.orderId = route.snapshot.params['id'];
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
        );
    }
    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        // Add our fruit
        if (value) {
            this.fruits.push(value);
        }
        // Clear the input value
        this.fruitInput.nativeElement.value = "";
        this.fruitCtrl.setValue(null);
        this.isDataChanged = true;
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
        this.isDataChanged = true;
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
        this.isDataChanged = true;
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
    }

    completButtonStatus: boolean = true;
    screenWidth: number

    ngOnInit(): void {
        this.getCollectors()
        this.screenWidth = this.adaptiveService.GetCurrentWidth()
        this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
        // this.titleService.setTitle(this.titleService.getTitle() + ' №' + this.orderId);
        let orderBodyReq = new OrderBodyReq(this.tokenService.getToken(), this.orderId)
        this.orderService.getSuborder(orderBodyReq).subscribe({
            next: response => {
                if (response) {
                    console.log(response);
                    this.getData(response);
                }
            },
            error: error => {
                console.log(error);
            }
        });
        this.userName = this.tokenService.getLogin();
        this.isAdminIshop = this.tokenService.getTitle() == 'ishopAdmin' ? true : false

    }
    filteredOptions: Observable<string[]>;
    collectorsList: string[] = []
    myControl = new FormControl();

    getCollectors() {
        this.collectorsService.GetCollectorsNames(new Token(this.tokenService.getToken())).subscribe({
            next: result => {
                this.collectorsList = result
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
    inputAuto(element: string) {
        let test = new Observable<string[]>(x => x.next(this.collectorsList))
        this.filteredOptions = test
            .pipe(
                map(x => this._filterCollectors(x, element))
            )
    }
    private _filterCollectors(value, element: string): string[] {
        // const filterValue = value == '' || value == null ? value : value.toLowerCase();
        return value.filter(option => option.includes(element));
    }
    completOrder() {
        this.dataSource.forEach(i => {
            i.count_g = i.count_e
        })
        this.completButtonStatus = false
        this.isDataChanged = true
    }
    selectBarcode(barcode: any) {
        this.selectedBarcode = barcode;
        console.log(this.selectedBarcode);
    }

    unSelectBarcode() {
        this.selectedBarcode = '';
        console.log('------');
    }

    onClickIcon(barcode) {
        this.selectedBarcodeFor = barcode;
    }

    onCancel() {
        this.selectedBarcodeFor = '';
        this.belpostData = null;
    }

    orderStatus: string;
    getData(response: OrderBodyAnsw) {
        this.orderBodyAnsw = response;
        this.fruits = response.place;
        this.client = this.orderBodyAnsw.aboutClient;
        this.dataSource = this.orderBodyAnsw.body;
        this.dataSource.forEach(element => {
            if (element.count_g != element.count_e) {
                this.completButtonStatus = false
                return
            }
        });
        this.getBelpostBarcodes(this.orderBodyAnsw.postCode);
        this.orderService.orderSearch(new FindOrderReq(this.tokenService.getToken(), this.orderBodyAnsw.num, this.orderBodyAnsw.name)).subscribe({
            next: response => {
                if (response)
                    this.orderStatus = response[0].status;
            },
            error: error => {
                console.log(error);
            }
        });
    }

    getBelpostBarcodes(value: string) {
        if (value)
            this.belpostBarcodes = value.split(this.param).filter(i => i);
        else
            this.belpostBarcodes = [];
    }

    onInputNewCount(event: string, element: OrderBody): void {
        if (event.length >= 0) {
            element.count_g = event;
            element.changed = true;
            this.isDataChanged = this.checkDataChanged();
            if (+element.count_g > +element.count_e)
                element.count_g = element.count_e;
            if (!element.count_g)
                element.count_g = '0';
        }
    }
    onInputNewCollector(event: string, element: OrderBody): void {
        if (!element.collector)
            element.collector = '';
        if (event.length >= 0) {
            element.collector = event;
            element.changed = true;
            this.isDataChanged = this.checkDataChanged();

        }
    }
    onInputNewCoef(event: string, element: OrderBody): void {
        if (event.length >= 0) {
            element.coefficient = event;
            element.changed = true;
            this.isDataChanged = this.checkDataChanged();
            if (!element.coefficient)
                element.coefficient = '';
        }
    }
    onFocusoutCollector(element) {
        if (!element.collector)
            element.collector = '';
    }
    onFocusoutCoef(element) {
        if (!element.coefficient)
            element.coefficient = '0';
    }
    onFocusout(element) {
        if (+element.count_g > +element.count_e)
            element.count_g = element.count_e;
        if (!element.count_g)
            element.count_g = '0';
    }

    onClearCount(element: OrderBody): void {
        element.count_gСhange = element.count_g;
        element.changed = false;
        this.isDataChanged = this.checkDataChanged();
    }
    disableSaveButton: boolean = false

    onSaveChanges(): void {
        this.isDataChanged = false
        this.dataSource.map(element => {
            if (element.count_gСhange)
                element.count_g = element.count_gСhange ? element.count_gСhange.toString() : '0';
            delete element.count_gСhange;
            delete element.changed;
        });
        this.dataSource.map(element => {
            if (Number(element.count_g) > Number(element.count_e))
                element.count_g = element.count_e;
            delete element.count_gСhange;
            delete element.changed;
        });
        this.orderBodyAnsw.place = this.fruits;
        if (!this.orderBodyAnsw.belPost || (this.orderBodyAnsw.belPost && this.belpostBarcodes.length > 0)) {
            let order = new Changer(this.tokenService.getToken(), this.orderBodyAnsw, this.tokenService.getLogin());
            // this.disableSaveButton = true;
            this.orderService.orderSaveChange(order).subscribe({
                next: response => {
                    switch (response.status) {
                        case 'true':
                            this.snackbarService.openSnackGreenBar('Количество изменено');
                            this.ngOnInit();
                            // this.disableSaveButton = false;
                            break;
                        case 'error':
                            this.snackbarService.openRedSnackBar('Ошибка, перезагрузите страницу');
                            // this.disableSaveButton = false;
                            break;
                        case 'BadAuth':
                            this.snackbarService.openRedSnackBar('Токен устарел');
                            // this.disableSaveButton = false;
                            break
                    }
                },
                error: error => {
                    console.log(error);
                    this.snackbarService.openRedSnackBar();
                }
            });
        }
        else
            this.snackbarService.openRedSnackBar('Добавьте штрихкод');
    }

    checkDataChanged(): boolean {
        let result = this.dataSource.filter(d => d.changed === true);
        return result.length > 0
    }

    selectedVal: number
    onStoragePrint() {
        if (this.selectedVal >= 1 && this.selectedVal <= 4) {
            let belPostReq = new BelPostReq(this.tokenService.getToken(), this.orderBodyAnsw.sub_num, this.selectedVal)
            this.orderService.getBarcode(belPostReq).subscribe({
                next: response => {
                    if (response) {
                        this.belPostAnsw = response;
                        let t = timer(0, 100).subscribe(vl => {
                            if (vl >= 10) {
                                // this.barcodePrint._elementRef.nativeElement.click();
                                t.unsubscribe();
                                let orderBodyReq = new OrderBodyReq(this.tokenService.getToken(), this.orderId)
                                this.orderService.getSuborder(orderBodyReq).subscribe({
                                    next: response => {
                                        if (response) {
                                            console.log('barcode added')
                                            this.getData(response);
                                        }
                                    },
                                    error: error => {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
        }
    }

    onPrintBelpost(code: string) {
        this.belpostData = { barcode: code, username: this.orderBodyAnsw.aboutClient.fIO, address: this.orderBodyAnsw.aboutClient.adress, num: this.orderBodyAnsw.num }
        // this.belpostData = { barcode: code, username: this.orderBodyAnsw.aboutClient.fIO, address: this.orderBodyAnsw.aboutClient.adress, num: this.orderBodyAnsw.num, postCount: this.orderBodyAnsw.postCount }
    }

    //!Dialogs

    showDeleteDialog: boolean = true
    belpostDelete(barcode: any) {
        let delPostRequest = new DelPostRequest(this.tokenService.getToken(), this.orderBodyAnsw.sub_num, barcode);
        this.orderService.orderDeleteBelpostBarcode(delPostRequest).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.snackbarService.openSnackGreenBar('Штрихкод Белпочты удален');
                        let orderBodyReq = new OrderBodyReq(this.tokenService.getToken(), this.orderId)
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
                        break
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен не действителен');
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackbarService.openRedSnackBar('Операция не выполнена');
                        break
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar();
            }
        });
    }

    showCompleteDialog: boolean = false
    openCompliteDialog(): void {
        let findOrderReq = new FindOrderReq(this.tokenService.getToken(), this.orderBodyAnsw.num, this.orderBodyAnsw.name);
        this.orderService.orderCompliteOrder(findOrderReq).subscribe({
            next: response => {
                this.showCompleteDialog = false
                switch (response.status) {
                    case 'true':
                        this.orderStatus = "выполнен"
                        this.snackbarService.openSnackGreenBar('Заказ завершен');
                        break
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Неверный токен');
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackbarService.openRedSnackBar();
                        break
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar();
            }
        });
    }

    onClickPauseOrGo() {
        let pauseOrderReq = new PauseOrderReq(this.tokenService.getToken(), this.orderBodyAnsw.sub_num, this.tokenService.getLogin(), `${this.orderBodyAnsw.num}.${this.orderBodyAnsw.place}`);
        this.orderService.orderPause(pauseOrderReq).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.orderStatus = 'ОТЛОЖЕН'
                        this.snackbarService.openSnackGreenBar('В сборке');
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Подзаказ не найден');
                        break;
                    case 'error':
                        this.snackbarService.openRedSnackBar('Ошибка')
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен устарел')
                        break;
                }

            },
            error: error => {
                console.log(error);
            }
        });
    }
    DeleteOrderItem(element: string) {
        this.orderService.orderDeleteItem(new DeleteItemModel(this.tokenService.getToken(), element, this.orderBodyAnsw.sub_num)).subscribe({
            next: response => {
                switch (response.status) {
                    case 'true':
                        this.snackbarService.openSnackGreenBar('Элемент удален, обновите страницу');
                        break
                    case 'null':
                        this.snackbarService.openRedSnackBar('Элемент не найден');
                        break;
                    case 'error':
                        this.snackbarService.openRedSnackBar('Ошибка')
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Токен устарел')
                        break;
                }
            },
            error: error => {
                console.log(error)
                this.snackbarService.openRedSnackBar()
            }
        })
    }

    openStoragePrintBarcodeDialog() {
        const dialogRef = this.dialog.open(BarcodeInputCountDialogComponent, {
            width: "300px",
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result >= 1 && result <= 4) {
                // if (result >= 1 && result <= 100) {
                let belPostReq = new BelPostReq(this.tokenService.getToken(), this.orderBodyAnsw.sub_num, result)
                this.orderService.getBarcode(belPostReq).subscribe({
                    next: response => {
                        if (response) {
                            this.belPostAnsw = response;
                            let t = timer(0, 100).subscribe(vl => {
                                if (vl >= 10) {
                                    // this.barcodePrint._elementRef.nativeElement.click();
                                    t.unsubscribe();
                                    let orderBodyReq = new OrderBodyReq(this.tokenService.getToken(), this.orderId)
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
                                }
                            });
                        }
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        });
    }
    openOderCheckDialog(element: OrderBody) {
        const dialogRef = this.dialog.open(OrderCheckBarcodeDialogComponent, {
            data: { element },
        });
        dialogRef.afterClosed().subscribe({
            next: result => {
                if (result) {
                    this.dataSource.forEach(element => {
                        if (element.article == result.article) {
                            element = result
                        }
                    })
                    console.log(this.dataSource);
                    this.onSaveChanges()
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
    back() {
        this.router.navigate(['/']);
    }
}

@Component({
    selector: 'app-belpost-input-count-dialog',
    templateUrl: './barcode-prints/belpost-input-count-dialog/belpost-input-count-dialog.html',
    styleUrls: ['./barcode-prints/belpost-input-count-dialog/belpost-input-count-dialog.scss']
})
export class BarcodeInputCountDialogComponent {
    // selectedVal: number = 1
    selectedVal: string = ''
    constructor(
        public dialogRef: MatDialogRef<BarcodeInputCountDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        if (+this.selectedVal >= 1 && +this.selectedVal <= 4)
            // if (this.selectedVal >= 1 && this.selectedVal <= 100)
            this.dialogRef.close(+this.selectedVal);
    }
}

@Component({
    selector: 'app-order-check-barcode-dialog',
    templateUrl: './order-dialog/order-check-barcode.dialog/order-check-barcode.dialog.html',
    styleUrls: ['./order-dialog/order-check-barcode.dialog/order-check-barcode.dialog.scss']
})
export class OrderCheckBarcodeDialogComponent implements OnInit {
    constructor(
        private orderService: OrderService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<OrderCheckBarcodeDialogComponent>,

    ) { }
    isDataChanged = false;
    dataSource: OrderBody
    ngOnInit(): void {
        this.dataSource = this.data.element
        console.log(this.dataSource.count_e)
    }
    showCountInput: boolean = false
    barcode: string
    inputHandle(event) {
        var number = event.target.value;
        if (number.length >= 13) {
            this.checkBarcode()
        }
    }
    onInputNewCount(event: string): void {
        if (event.length >= 0) {
            this.dataSource.count_g = event;
            this.dataSource.changed = true;
            this.isDataChanged = this.checkDataChanged();
            if (+this.dataSource.count_g > +this.dataSource.count_e)
                this.dataSource.count_g = this.dataSource.count_e;
            if (!this.dataSource.count_g)
                this.dataSource.count_g = '0';
        }
    }
    checkDataChanged(): boolean {
        return this.dataSource.changed === true ? true : false
    }
    checkBarcode() {
        this.orderService.CheckArticle(new CheckByArticleModel(this.tokenService.getToken(), this.barcode, this.data.element.article)).subscribe({
            next: result => {
                var inputBarcode = document.getElementById('inputBarcode')
                inputBarcode?.blur()
                switch (result.status) {
                    case "true":
                        this.showCountInput = true
                        break;
                    case "null":
                        this.showCountInput = false
                        this.snackBarService.openRedSnackBar("Не найден")
                        break;
                    case "BadAuth":
                        this.showCountInput = false
                        this.snackBarService.openRedSnackBar("Не верный токен")
                        break;
                    case "error":
                        this.showCountInput = false
                        this.snackBarService.openRedSnackBar()
                        break;
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }
    OnSave() {
        this.dialogRef.close(this.dataSource)
    }
    OnCancel() {
        this.dialogRef.close()
    }

}