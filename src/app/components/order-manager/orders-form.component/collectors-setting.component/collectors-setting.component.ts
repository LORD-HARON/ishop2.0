import { Component, OnInit } from "@angular/core";
import { AddCollectorModel } from "src/app/models/collectors.models/add-collector";
import { CollectorsModel } from "src/app/models/collectors.models/collectors";
import { Token } from "src/app/models/token";
import { CollectorsService } from "src/app/services/collectors.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TokenService } from "src/app/services/token.service";

@Component({
    selector: 'app-collectors-setting',
    templateUrl: './collectors-setting.component.html',
    styleUrls: ['./collectors-setting.component.scss']
})
export class CollecotrsSettingComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private collectorsService: CollectorsService
    ) { }
    collectorsList: CollectorsModel[] = []
    showingList: CollectorsModel[] = []
    collectorName: string
    selectedStoreloc: number
    filterRow: string
    ngOnInit(): void {
        this.GetCollectors()
    }
    GetCollectors() {
        this.collectorsService.GetCollectors(new Token(this.tokenService.getToken())).subscribe({
            next: result => {
                this.collectorsList = result
                this.showingList = result
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
    FilterItems() {
        this.showingList = this.collectorsList.filter(i => i.collector_name.includes(this.filterRow))
    }
    AddCollectors() {
        this.collectorsService.AddCollector(new AddCollectorModel(this.tokenService.getToken(), this.collectorName, this.selectedStoreloc)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.GetCollectors()
                        this.snackbarService.openSnackGreenBar('Сборщик успешно создан')
                        this.collectorName = ''
                        break;
                    case 'false':
                        this.snackbarService.openRedSnackBar('Ошибка создания сборщика')
                        break;
                    case 'NULL':
                        this.snackbarService.openRedSnackBar('Ошибка создания сборщика')
                        break;
                    case 'error':
                        this.snackbarService.openRedSnackBar()
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
    deleteCollectors(element: number) {
        this.collectorsService.DeleteCollector(new Token(this.tokenService.getToken(), String(element))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.GetCollectors()
                        this.snackbarService.openSnackGreenBar('Сборщик успешно удален')
                        break;
                    case 'false':
                        this.snackbarService.openRedSnackBar('Ошибка удаления')
                        break;
                    case 'NULL':
                        this.snackbarService.openRedSnackBar('Ошибка удаления')
                        break;
                    case 'error':
                        this.snackbarService.openRedSnackBar()
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
}