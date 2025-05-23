import { Component, OnInit, ViewChild } from "@angular/core";
import { PropList } from "../order-history.component/order-history.component";
import { CollectorsModel } from "src/app/models/collectors.models/collectors";
import { map, Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { CollectorsService } from "src/app/services/collectors.service";
import { TokenService } from "src/app/services/token.service";
import { Token } from "src/app/models/token";
import { SnackbarService } from "src/app/services/snackbar.service";
import { GetCollectorsReportAnswerModel } from "src/app/models/collectors.models/get-collectors-report-answer";
import { GetCollectorsReportModel } from "src/app/models/collectors.models/get-collectors-report";
import { formatDate } from "@angular/common";
import { GetCollectorsExcelModel } from "src/app/models/collectors.models/get-collectors-excel";
import { trueStatus } from "src/app/pipes/translateShitStatus.pipe";
import { MatPaginator, MatPaginatorIntl, PageEvent } from "@angular/material/paginator";


@Component({
    selector: 'app-collectors-report',
    templateUrl: './order-collectors-report.component.html',
    styleUrls: ['./order-collectors-report.component.scss'],
})
export class OrderCollectorsReportComponent implements OnInit {
    constructor(
        private collectorsService: CollectorsService,
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private changePipe: trueStatus
    ) { }
    startDate: Date = new Date
    endDate: Date = new Date
    selectedUser: string
    selectedStore: string = '%'
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
    displayedColumns: string[] = ['№ Заказа', 'Дата сборки', 'Артикул', 'Кол-во шт. в заявке', 'Коэфициент', 'ФИО', 'ТО']

    filteredOptions: Observable<string[]>;
    collectorsList: string[] = []
    myControl = new FormControl();
    collectorsReportList: GetCollectorsReportAnswerModel[] = []
    ngOnInit(): void {
        this.getCollectors()
    }
    getReport() {
        const start = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US')
        const end = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US')
        const user = this.selectedUser ? this.selectedUser : '%'
        this.collectorsService.GetCollectorsReport(new GetCollectorsReportModel(this.tokenService.getToken(), start, end, this.selectedStore, user)).subscribe({
            next: result => {
                this.collectorsReportList = result
                this.listLenght = result.length
                this.updatePagedProducts()
            },
            error: error => {
                console.log(error);
            }
        })
    }
    getExcelReport() {
        const ChangeCollectorList = this.collectorsReportList.forEach(x => x.storeLoc = this.changePipe.transform(x.storeLoc, "store")!)
        this.collectorsService.getExportToExcel(new GetCollectorsExcelModel(this.tokenService.getToken(), this.collectorsReportList))
    }
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

    pageEvent: PageEvent;
    listLenght = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25, 50];
    newPageSizeOptions: number[] = []
    currentPage = 0
    showPageSizeOptions = true;

    pagedCollectorsReportList: GetCollectorsReportAnswerModel[] = []

    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updatePagedProducts();
    }

    updatePagedProducts() {
        const startIndex = this.currentPage * this.pageSize;
        this.newPageSizeOptions = [...this.pageSizeOptions, this.listLenght]
        this.pagedCollectorsReportList = this.collectorsReportList.slice(startIndex, startIndex + this.pageSize);
    }
}
