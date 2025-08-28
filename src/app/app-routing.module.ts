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
import { OrderMarksReportComponent } from './components/order-manager/order-marks-report-component/order-marks-report.component';


const childRoutes: Routes = [
  { path: 'ready-build', component: OrderReadyBuildComponent },
  { path: 'uncompleted', component: OrderUncompletedComponent },
  { path: 'ready-shipment', component: OrderReadyShipmentComponent },
  { path: 'sent', component: OrderReadyShipmentComponent },
  { path: 'return-to-retail', component: OrderReturnToRetailComponent },
  { path: 'canceled', component: OrderCanceledComponent },
  { path: 'completed', component: OrderCompletedComponent },
  { path: 'statushistory', component: OrderHistoryComponent },
  { path: 'order/:id', component: OrderComponent, data: { id: '1', barcodes: '' } },
  { path: 'collectors-report', component: OrderCollectorsReportComponent },
  { path: 'marks-report', component: OrderMarksReportComponent }
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
