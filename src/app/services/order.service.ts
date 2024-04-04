import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environments";
import { OrderListAnsw } from "../models/order.models/order-list-answ";
import { Observable } from "rxjs";
import { Status } from "../models/status";
import { Injectable } from "@angular/core";
import { OrderListReq } from "../models/order.models/order-list-req";
import { FindOrderReq } from "../models/order.models/find-order-req";
import { FindOrderByAdReq } from "../models/order.models/find-order-by-ad-req";
import { OrderBodyReq } from "../models/order.models/order-body-req";
import { OrderBodyAnsw } from "../models/order.models/order-body-answ";
import { PauseOrderReq } from "../models/order.models/pause-order-req";
import { ToCassa } from "../models/order.models/to-cassa";
import { BelPostReq } from "../models/order.models/belpost-req";
import { BelPostAnsw } from "../models/order.models/belpost-answ";
import { Changer } from "../models/order.models/changer";
import { DelPostRequest } from "../models/order.models/del-post-req";
import { DeleteItemModel } from "../models/order.models/delete-item";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    urlOrder = environment.apiUrl + '/ishop';
    urlGetOders = this.urlOrder + '/orderlist/';
    urlOrderSearch = this.urlOrder + '/findorder/';
    urlOrderSearchByAdres = this.urlOrder + '/findorderbyad/'
    urlGetSuborder = this.urlOrder + '/suborder/';
    urlToCassa = this.urlOrder + '/cassa/';
    urlPause = this.urlOrder + '/pause/';
    urlBelpost = this.urlOrder + '/belpost/';
    urlReturn = this.urlOrder + '/back/';  //! delete
    urlReturnToAssembly = this.urlOrder + '/backorder/';
    urlDlete = this.urlOrder + '/delete/';
    urlToBitrix = this.urlOrder + '/oms/';
    urlSaveChange = this.urlOrder + '/change/';
    urlDelpost = this.urlOrder + '/delpost/';
    urlEndOrder = this.urlOrder + '/endOrder/';
    urlReturnToRetail = this.urlOrder + '/returnToRetail/';
    urlGetHistory = this.urlOrder + '/GetHistory/';
    urlGetHistoryByDate = this.urlOrder + '/statusHistoryByDate/';
    urlGetHistoryByOrder = this.urlOrder + '/GetHistoryByOrder/';
    urlDeleteOrderItem = this.urlOrder + '/deleteItem/'
    constructor(private http: HttpClient) { }

    getOrders(data: OrderListReq): Observable<Array<OrderListAnsw>> {
        return this.http.post<any>(`${this.urlGetOders}`, data);
    }
    orderSearch(data: FindOrderReq): Observable<Array<OrderListAnsw>> {
        return this.http.post<any>(`${this.urlOrderSearch}`, data);
    }

    orderSearchByAdres(data: FindOrderByAdReq): Observable<Array<OrderListAnsw>> {
        return this.http.post<any>(`${this.urlOrderSearchByAdres}`, data)
    }

    getSuborder(data: OrderBodyReq): Observable<OrderBodyAnsw> {
        return this.http.post<any>(`${this.urlGetSuborder}`, data);
    }

    orderPause(data: PauseOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlPause}`, data);
    }

    orderGo(data: any): Observable<any> {
        return this.http.post<any>(`${this.urlOrder}`, data);
    }

    orderShow(data: any): Observable<any> {
        return this.http.post<any>(`${this.urlOrder}`, data);
    }

    orderWriteToCashbox(data: ToCassa): Observable<Status> {
        return this.http.post<Status>(`${this.urlToCassa}`, data);
    }

    orderReturnToAssembly(data: PauseOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlReturnToAssembly}`, data);
    }

    getBarcode(data: BelPostReq): Observable<BelPostAnsw> {
        return this.http.post<BelPostAnsw>(`${this.urlBelpost}`, data);
    }

    orderReturn(data: PauseOrderReq): Observable<Status> { //! delete
        return this.http.post<Status>(`${this.urlReturn}`, data);
    }

    orderDelete(data: PauseOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlDlete}`, data);
    }

    orderSendToBitrix(data: FindOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlToBitrix}`, data);
    }

    orderSaveChange(data: Changer): Observable<Status> {
        return this.http.post<Status>(`${this.urlSaveChange}`, data);
    }

    orderDeleteBelpostBarcode(data: DelPostRequest): Observable<Status> {
        return this.http.post<Status>(`${this.urlDelpost}`, data);
    }

    orderCompliteOrder(data: FindOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlEndOrder}`, data);
    }

    orderReturnToRetail(data: PauseOrderReq): Observable<Status> {
        return this.http.post<Status>(`${this.urlReturnToRetail}`, data);
    }
    orderDeleteItem(data: DeleteItemModel): Observable<Status> {
        return this.http.post<Status>(this.urlDeleteOrderItem, data)
    }
}
