import { Dialog } from "@angular/cdk/dialog";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

export interface DialogData {
    barcode: string,
    username: string,
    address: string,
    num: string,
    postCount: number
}

@Component({
    selector: 'app-print-belpost-barcode',
    templateUrl: './print-belpost-barcode.component.html',
    styleUrls: ['./print-belpost-barcode.component.scss']
})
export class PrintBelpostBarcodeComponent {

    imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=';
    Arr = Array
    @Input() data: DialogData;
    constructor(
    ) { }
}
