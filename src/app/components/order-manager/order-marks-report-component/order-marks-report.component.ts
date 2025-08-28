import { Component, OnInit } from "@angular/core";
import { MarksService } from "src/app/services/marks.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TokenService } from "src/app/services/token.service";
import { PropList } from "../order-history.component/order-history.component";
import { GetMarksReportAnswerModel } from "src/app/models/marks.models/get-marks-report-answer";
import { PageEvent } from "@angular/material/paginator";
import { GetOrderMarksReqModel } from "src/app/models/marks.models/get-order-marks-req";
import { Observable } from "rxjs";
import { trueStatus } from "src/app/pipes/translateShitStatus.pipe";
import { GetCollectorsExcelModel } from "src/app/models/collectors.models/get-collectors-excel";
import { GetMarksExcelModel } from "src/app/models/marks.models/get-marks-excel";

@Component({
    selector: 'app-order-marks-report',
    templateUrl: './order-marks-report.component.html',
    styleUrls: ['./order-marks-report.component.scss']
})
export class OrderMarksReportComponent implements OnInit {
    constructor(
        private marksService: MarksService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private changePipe: trueStatus
    ) { }

    storeList: PropList[] = [
        { status: '%', statusName: 'Все' },
        { status: '11', statusName: 'Брест' },
        { status: '18', statusName: 'Партизанский' },
        { status: '21', statusName: 'Тимирязева' },
        { status: '22', statusName: 'Каменогорская' },
        { status: '24', statusName: 'Независимости' },
        { status: '25', statusName: 'Молодечно' },
        { status: '32', statusName: 'Outleto' },
        { status: '33', statusName: 'Гродно' },
        { status: '34', statusName: 'Expobel' },
        { status: '35', statusName: 'Горецкого' },
    ]
    displayedColumns: string[] = ['№ заказа', 'Торговый объект', 'Кол-во вишек', 'Дата завершения']
    pagedMarksReportList: GetMarksReportAnswerModel[] = []
    marksReportList: GetMarksReportAnswerModel[] = []
    pageEvent: PageEvent;
    listLenght = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25, 50];
    newPageSizeOptions: number[] = []
    currentPage = 0
    showPageSizeOptions = true;
    startDate: Date = new Date
    endDate: Date = new Date
    selectedStore: string = '%'
    selectedOrder: string
    ngOnInit(): void {

    }
    getReport() {
        // const start = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US')
        // const end = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US')
        let data = new GetOrderMarksReqModel(this.tokenService.getToken(), this.startDate, this.endDate, this.selectedStore, this.selectedOrder ?? '%')
        this.marksService.GetMarksReport(data).subscribe({
            next: result => {
                this.marksReportList = result
                this.listLenght = result.length
                this.updatePagedProducts()
            },
            error: error => {
                console.log(error);
            }
        })
    }
    getExcelReport() {
        const ChangeMarksList = this.marksReportList.forEach(x => x.storeloc = this.changePipe.transform(x.storeloc, "store")!)
        this.marksService.getExportToExcel(new GetMarksExcelModel(this.tokenService.getToken(), this.marksReportList))
    }
    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updatePagedProducts();
    }

    updatePagedProducts() {
        const startIndex = this.currentPage * this.pageSize;
        this.newPageSizeOptions = [...this.pageSizeOptions, this.listLenght]
        this.pagedMarksReportList = this.marksReportList.slice(startIndex, startIndex + this.pageSize);
    }
}