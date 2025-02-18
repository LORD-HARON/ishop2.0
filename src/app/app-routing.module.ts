import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { OrdersFormComponent } from './components/order-manager/orders-form.component/orders-form.component';
import { NavigateComponent } from './components/navigate.component/navigate.component';
import { OrderReadyBuildComponent } from './components/order-manager/order-types/order-ready-build.component/order-ready-build.component';
import { OrderUncompletedComponent } from './components/order-manager/order-types/order-uncompleted.component/order-uncompleted.component';
import { OrderReadyShipmentComponent } from './components/order-manager/order-types/order-ready-shipment.component/order-ready-shipment.component';
import { OrderReturnToRetailComponent } from './components/order-manager/order-types/order-return-to-retail.component/order-return-to-retail.component';
import { OrderCanceledComponent } from './components/order-manager/order-types/order-canceled.component/order-canceled.component';
import { OrderCompletedComponent } from './components/order-manager/order-types/order-completed.component/order-completed.component';
import { OrderHistoryComponent } from './components/order-manager/order-history.component/order-history.component';
import { loginGuard } from './guards/login.guard';
import { OrderComponent } from './components/order-manager/order.component/order.component';
import { OrderCollectorsReportComponent } from './components/order-manager/order-collectors-report.component/order-collectors-report.component';


const childRoutes: Routes = [
  { path: 'ready-build', component: OrderReadyBuildComponent, canActivate: [loginGuard] },
  { path: 'uncompleted', component: OrderUncompletedComponent, canActivate: [loginGuard] },
  { path: 'ready-shipment', component: OrderReadyShipmentComponent, canActivate: [loginGuard] },
  { path: 'sent', component: OrderReadyShipmentComponent, canActivate: [loginGuard] },
  { path: 'return-to-retail', component: OrderReturnToRetailComponent, canActivate: [loginGuard] },
  { path: 'canceled', component: OrderCanceledComponent, canActivate: [loginGuard] },
  { path: 'completed', component: OrderCompletedComponent, canActivate: [loginGuard] },
  { path: 'statushistory', component: OrderHistoryComponent, canActivate: [loginGuard] },
  { path: 'order/:id', component: OrderComponent, data: { id: '1', barcodes: '' }, canActivate: [loginGuard] },
  { path: 'collectors-report', component: OrderCollectorsReportComponent }
]

const routes: Routes = [
  { path: '', redirectTo: '/orders/ready-build', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: NavigateComponent, children: childRoutes, canActivateChild: [loginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
