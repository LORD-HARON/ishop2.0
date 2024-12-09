import { Component, Input, OnInit } from "@angular/core";
import { BelPostAnsw } from "src/app/models/order.models/belpost-answ";
@Component({
    selector: 'app-barcode-print-form',
    templateUrl: './barcode-print-form.component.html',
    styleUrls: ['./barcode-print-form.component.scss']
})
export class BarcodePrintFormComponent implements OnInit {
    @Input() data: BelPostAnsw;
    // imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=';
    imgSource = 'https://barcodeapi.org/api/auto/'
    constructor() { }

    ngOnInit(): void {
        this.data;
        // this.imgSource = this.imgSource + this.data.barcodes[0];
    }
}