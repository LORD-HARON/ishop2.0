import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Token } from '../models/token';
import { Observable } from 'rxjs';
import { CollectorsModel } from '../models/collectors.models/collectors';
import { AddCollectorModel } from '../models/collectors.models/add-collector';
import { Status } from '../models/status';


@Injectable({
    providedIn: 'root'
})
export class CollectorsService {
    constructor(private http: HttpClient) {
    }

    getCollectorsUrl = environment.apiUrl + '/GetCollectors'
    getCollectorsNameUrl = environment.apiUrl + '/GetCollectorsNames'
    addCollectorUrl = environment.apiUrl + '/AddCollector'
    deleteCollectorUrl = environment.apiUrl + '/DeleteCollector'

    GetCollectors(data: Token): Observable<CollectorsModel[]> {
        return this.http.post<CollectorsModel[]>(this.getCollectorsUrl, data)
    }
    GetCollectorsNames(data: Token): Observable<string[]> {
        return this.http.post<string[]>(this.getCollectorsNameUrl, data)
    }
    AddCollector(data: AddCollectorModel): Observable<Status> {
        return this.http.post<Status>(this.addCollectorUrl, data)
    }
    DeleteCollector(data: Token): Observable<Status> {
        return this.http.post<Status>(this.deleteCollectorUrl, data)
    }
}