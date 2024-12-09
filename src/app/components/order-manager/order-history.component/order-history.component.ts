import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { GetHistoryModel } from "src/app/models/history.models/get-history";
import { GetLogsExcelModel } from "src/app/models/history.models/get-logs-excel";
import { HistoryReportModel } from "src/app/models/history.models/history-report";
import { HistoryService } from "src/app/services/history.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TokenService } from "src/app/services/token.service";


export interface PropList {
    statusName: string,
    status: string
}
@Component({
    selector: 'app-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
    constructor(
        private snackBarService: SnackbarService,
        private historyService: HistoryService,
        private tokenService: TokenService
    ) { }
    startDate: Date = new Date
    endDate: Date = new Date
    selectedUser: string
    selectedOrder: string
    selectedStatus: string = '%'
    selectedStore: string = '%'
    selectedDelivery: string = '%'
    logsList: HistoryReportModel[]

    //#region property list 
    statusList: PropList[] = [
        { status: '%', statusName: 'Все' },
        { status: 'не принят', statusName: 'Готов к сборке' },
        { status: 'в паузе', statusName: 'Некомплект' },
        { status: 'завершен', statusName: 'Готов к отгрузке' },
        { status: 'Отправлен', statusName: 'Отправлен' },
        { status: 'Выполнен', statusName: 'Выполнен' },
        { status: 'Отмена', statusName: 'Вернуть в секцию' },
        { status: 'Заблокирован', statusName: 'Отменен' },
    ]
    storeList: PropList[] = [
        { status: '%', statusName: 'Все' },
        { status: '8', statusName: 'Долгиновский' },
        { status: '11', statusName: 'Брест' },
        { status: '18', statusName: 'Партизанский' },
        { status: '21', statusName: 'Тимирязева' },
        { status: '22', statusName: 'Каменогорская' },
        { status: '24', statusName: 'Независимости' },
        { status: '25', statusName: 'Молодечно' },
        { status: '32', statusName: 'Outleto' },
        { status: '34', statusName: 'Expobel' },
        { status: '35', statusName: 'Горецкого' },
    ]
    displayedColumns: string[] = ['Логин', 'ФИО', '№ Заказа', 'Тип доставки', 'Склад', 'Статус', 'Дата действия']
    deliveryTypes: PropList[] = [
        { status: '%', statusName: 'Все' },
        { status: '', statusName: 'Самовывоз' },
        { status: 'mileby', statusName: 'Доставка' },
        { status: 'belpost', statusName: 'Белпочта' },
        { status: 'dostavka24', statusName: 'Доставка 24' }
    ]
    //#endregion

    getHistory() {
        let start = formatDate(this.startDate, 'dd.MM.yyyy 00:00:00', 'en-US')
        let end = formatDate(this.endDate, 'dd.MM.yyyy 21:00:00', 'en-US')
        this.historyService.GetHistory(new GetHistoryModel(this.tokenService.getToken(), this.selectedOrder, this.selectedStatus, this.selectedStore, this.selectedUser, this.selectedDelivery, start, end)).subscribe({
            next: result => {
                this.logsList = result
            },
            error: error => {
                console.log(error)
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    exportExcel() {
        this.historyService.ExportToExcel(new GetLogsExcelModel(this.tokenService.getToken(), this.logsList))
    }
    clearFilter() {
        this.selectedUser = ''
        this.selectedOrder = ''
        this.selectedStatus = '%'
        this.selectedStore = '%'
        this.selectedDelivery = '%'
    }

    ngOnInit(): void {

    }

}