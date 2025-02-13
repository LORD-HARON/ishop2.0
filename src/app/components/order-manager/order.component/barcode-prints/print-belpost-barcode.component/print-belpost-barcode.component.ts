import { Dialog } from "@angular/cdk/dialog";
import { Component, Input, OnInit } from "@angular/core";

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
export class PrintBelpostBarcodeComponent implements OnInit {

    imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=';
    // @Input() belpostData: DialogData;
    @Input() data: DialogData;
    dataList: DialogData[] = []
    constructor(
        // public dialogRef: MatDialogRef<PrintBelpostBarcodeComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit(): void {
        for (let index = 1; index <= this.data.postCount; index++) {
            this.dataList.push({ barcode: this.data.barcode, username: this.data.username, address: this.data.address, num: this.data.num, postCount: index })
        }
    }

}
