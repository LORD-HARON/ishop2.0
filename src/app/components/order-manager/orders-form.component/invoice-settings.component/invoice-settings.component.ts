import { Component, OnInit } from "@angular/core";
import { DirectorModel } from "src/app/models/invoice.models/director";
import { ManagerModel } from "src/app/models/invoice.models/manager";
import { RequestModel } from "src/app/models/invoice.models/request";
import { DataInvoiceService } from "src/app/services/data-invoice.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { TokenService } from "src/app/services/token.service";
@Component({
    selector: 'app-invoice-settings',
    templateUrl: './invoice-settings.component.html',
    styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiseSettingsComponent implements OnInit {
    displayedColumns: string[] = ['ФИО', 'Должность', 'Действие'];
    displayedColumns1: string[] = ['ФИО', 'Место хранения', 'Доверенность', 'Должность', 'Должность по тексту', 'Действие'];
    constructor(
        private dataInvoiceService: DataInvoiceService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService) {
    }
    managerList: Array<ManagerModel> = [new ManagerModel(0, '', '')]
    directorsList: Array<DirectorModel> = [new DirectorModel(0, '', 0, '')]
    manager_fio: string;
    job_title: string
    editable: boolean = false

    director_fio: string
    storelock: number | null | undefined
    dover: string
    dolj: string
    doc_dolj: string
    updateId: number;
    storeFullName: string
    ngOnInit(): void {
    }
    selectConteiner: number = 1

    switchConteiner(element) {
        switch (element) {
            case 2:
                this.selectConteiner = element;
                this.getMangers();
                break;
            case 3:
                this.selectConteiner = element;
                this.getDirectors();
                break;
            default:
                this.selectConteiner = 1;
                break;
        }
    }
    switchEditable(fio, job, id) {
        this.editable = !this.editable
        this.manager_fio = fio
        this.job_title = job
        this.updateId = id
    }
    switchEditableDir(fio, store, dover, id, doc_dolj) {
        this.editable = !this.editable
        this.director_fio = fio
        this.storelock = store
        this.dover = dover
        this.updateId = id
        this.doc_dolj = doc_dolj
    }

    getMangers() {
        this.dataInvoiceService.getManagers(this.tokenService.getToken()).subscribe({
            next: result => {
                if (result)
                    this.managerList = result
                console.log(this.managerList)
            },
            error: error => {
                console.log(error);
            }
        })
    }
    createMangers() {
        const createManager = new ManagerModel(0, this.manager_fio, this.job_title)
        this.dataInvoiceService.createManagers(createManager).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.getMangers()
                        this.snackBarService.openSnackGreenBar('Менеджер добавлен');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
                this.manager_fio = ''
                this.job_title = ''
            },
            error: error => {
                console.log(error);
            }
        })
    }
    updateManagers() {
        const updateManager = new ManagerModel(this.updateId, this.manager_fio, this.job_title)
        this.dataInvoiceService.updateManagers(updateManager).subscribe({
            next: result => {
                console.log(result)
                switch (result.status) {
                    case 'true':
                        this.getMangers()
                        this.snackBarService.openSnackGreenBar('Менеджер обновлен');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
                this.editable = !this.editable
                this.manager_fio = ''
                this.job_title = ''
            },
            error: error => {
                console.log(error)
            }
        })
    }

    deleteManagers(element) {
        const deleteManager = new RequestModel(this.tokenService.getToken(), element)
        this.dataInvoiceService.deleteManagers(deleteManager).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.getMangers()
                        this.snackBarService.openSnackGreenBar('Менеджер удален');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
            },
            error: error => {
                console.log(error)
            }
        })
    }

    getDirectors() {
        this.dataInvoiceService.getDirectors(this.tokenService.getToken()).subscribe({
            next: result => {
                if (result)
                    this.directorsList = result
            },
            error: error => {
                console.log(error)
            }
        })
    }

    createDirectors() {
        const createDirector = new DirectorModel(0, this.director_fio, this.storelock, this.dover, this.dolj, this.doc_dolj, this.storeFullName)
        this.dataInvoiceService.createDirectors(createDirector).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.getDirectors()
                        this.snackBarService.openSnackGreenBar('Директор добавлен');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
                this.director_fio = ''
                this.storelock = null
                this.dover = ''
                this.doc_dolj = ''
                this.storeFullName = ''
            },
            error: error => {
                console.log(error)
            }
        })
    }

    updateDirectors() {
        const updateDirector = new DirectorModel(this.updateId, this.director_fio, this.storelock, this.dover, this.dolj, this.doc_dolj, this.storeFullName)
        this.dataInvoiceService.updateDirectors(updateDirector).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.getDirectors()
                        this.snackBarService.openSnackGreenBar('Директор обновлен');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
                this.editable = !this.editable
                this.director_fio = ''
                this.storelock = null
                this.dover = ''
                this.doc_dolj = ''
                this.storeFullName = ''
            },
            error: error => {
                console.log(error)
            }
        })
    }

    deleteDirectors(element) {
        const deleteDirector = new RequestModel(this.tokenService.getToken(), element)
        this.dataInvoiceService.deleteDirectors(deleteDirector).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.getDirectors()
                        this.snackBarService.openSnackGreenBar('Директор удален');
                        break
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение');
                        break
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не дейсивителен');
                        break
                }
            },
            error: error => {
                console.log(error)
            }
        })
    }

}