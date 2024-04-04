import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status } from 'src/app/models/status';
import { environment } from '../environments/environments';
import { ManagerModel } from '../models/invoice.models/manager';
import { DirectorModel } from '../models/invoice.models/director';
import { RequestModel } from '../models/invoice.models/request';
@Injectable({
    providedIn: 'root'
})
export class DataInvoiceService {

    constructor(private http: HttpClient) {
    }

    getManager = environment.apiUrl + '/GetManagers?token='
    createManager = environment.apiUrl + '/CreateManager/'
    updateManager = environment.apiUrl + '/UpdateManager/'
    deleteManager = environment.apiUrl + '/DeleteManager/'

    getDirector = environment.apiUrl + '/GetDirector?'
    createDirector = environment.apiUrl + '/CreateDirector/'
    updateDirector = environment.apiUrl + '/UpdateDirector/'
    deleteDirector = environment.apiUrl + '/DeleteDirector/'

    getManagers(data): Observable<Array<ManagerModel>> {
        return this.http.get<Array<ManagerModel>>(`${this.getManager}${data}/`);
    }
    createManagers(data: ManagerModel): Observable<Status> {
        return this.http.post<Status>(this.createManager, data)
    }
    updateManagers(data: ManagerModel): Observable<Status> {
        return this.http.post<Status>(this.updateManager, data)
    }
    deleteManagers(data: RequestModel): Observable<Status> {
        return this.http.post<Status>(this.deleteManager, data)
    }

    getDirectors(data): Observable<Array<DirectorModel>> {
        return this.http.get<Array<DirectorModel>>(`${this.getDirector}token=${data}`)
    }
    createDirectors(data: DirectorModel): Observable<Status> {
        return this.http.post<Status>(this.createDirector, data)
    }
    updateDirectors(data: DirectorModel): Observable<Status> {
        return this.http.post<Status>(this.updateDirector, data)
    }
    deleteDirectors(data: RequestModel): Observable<Status> {
        return this.http.post<Status>(this.deleteDirector, data)
    }
}
