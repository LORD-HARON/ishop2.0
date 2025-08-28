import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environments";
import { GetOrderMarksReqModel } from "../models/marks.models/get-order-marks-req";
import { Observable } from "rxjs";
import { GetMarksReportAnswerModel } from "../models/marks.models/get-marks-report-answer";
import { GetMarksExcelModel } from "../models/marks.models/get-marks-excel";
import { saveAs } from 'file-saver'
import { SnackbarService } from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class MarksService {
    constructor(
        private http: HttpClient,
        private snackBarService: SnackbarService
    ) { }

    getMarksReportUrl = environment.apiUrl + '/GetMarksReport'
    exportMarksReportToExcel = environment.apiUrl + '/ExportMarksReportToExcel'

    GetMarksReport(data: GetOrderMarksReqModel): Observable<GetMarksReportAnswerModel[]> {
        return this.http.post<GetMarksReportAnswerModel[]>(this.getMarksReportUrl, data)
    }
    getExportToExcel(data: GetMarksExcelModel) {
        this.http.post(this.exportMarksReportToExcel, data, { responseType: 'blob' }).subscribe({
            next: result => {
                saveAs(result, 'print')
            },
            error: error => {
                console.log(error)
                this.snackBarService.openRedSnackBar()
            }
        })
    }
}

