import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component/login.component';
import { OrdersFormComponent } from './components/order-manager/orders-form.component/orders-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialsModule } from './app.materials.module';
import { HttpClientModule } from '@angular/common/http';
import { NavigateComponent } from './components/navigate.component/navigate.component';
import { OrderCanceledComponent } from './components/order-manager/order-types/order-canceled.component/order-canceled.component';
import { OrderCompletedComponent } from './components/order-manager/order-types/order-completed.component/order-completed.component';
import { OrderInAssemblyComponent } from './components/order-manager/order-types/order-in-assembly.component/order-in-assembly.component';
import { OrderUncompletedComponent } from './components/order-manager/order-types/order-uncompleted.component/order-uncompleted.component';
import { OrderReturnToRetailComponent } from './components/order-manager/order-types/order-return-to-retail.component/order-return-to-retail.component';
import { OrderReadyBuildComponent } from './components/order-manager/order-types/order-ready-build.component/order-ready-build.component';
import { OrderReadyShipmentComponent } from './components/order-manager/order-types/order-ready-shipment.component/order-ready-shipment.component';
import { OrderHistoryComponent } from './components/order-manager/order-history.component/order-history.component';
import { OrderListFormComponent } from './components/order-manager/order-list-form.component/order-list-form.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SplitPipe } from './pipes/split.pipe';
import { ConfirmDialogComponent } from './components/order-manager/order-list-form.component/order-list-form.component';
import { InvoiceDialogComponent } from './components/order-manager/order-list-form.component/order-list-form.component';
import { ShowDataOrderForm } from './components/order-manager/order-list-form.component/order-list-form.component';
import { SafeUrlPipe } from './pipes/safeUrl.pipe';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { OrderCheckBarcodeDialogComponent, OrderComponent } from './components/order-manager/order.component/order.component';
import { NgxPrintModule } from 'ngx-print';
import { BarcodePrintFormComponent } from './components/order-manager/order.component/barcode-prints/barcode-print-form.component/barcode-print-form.component';
import { PrintBelpostBarcodeComponent } from './components/order-manager/order.component/barcode-prints/print-belpost-barcode.component/print-belpost-barcode.component';
import { trueStatus } from './pipes/translateShitStatus.pipe';
import { InstructionDialogComponent } from './components/order-manager/orders-form.component/orders-form.component';
import { InvoiseSettingsComponent } from './components/order-manager/orders-form.component/invoice-settings.component/invoice-settings.component';
import { BarcodeInputCountDialogComponent } from './components/order-manager/order.component/order.component';
import { OrderSentComponent } from './components/order-manager/order-types/order-sent.component/order-sent.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrdersFormComponent,
    NavigateComponent,
    OrderCanceledComponent,
    OrderCompletedComponent,
    OrderInAssemblyComponent,
    OrderUncompletedComponent,
    OrderReturnToRetailComponent,
    OrderReadyBuildComponent,
    OrderReadyShipmentComponent,
    OrderHistoryComponent,
    OrderListFormComponent,
    SplitPipe,
    ConfirmDialogComponent,
    InvoiceDialogComponent,
    ShowDataOrderForm,
    SafeUrlPipe,
    OrderComponent,
    PrintBelpostBarcodeComponent,
    BarcodePrintFormComponent,
    trueStatus,
    InstructionDialogComponent,
    InvoiseSettingsComponent,
    BarcodeInputCountDialogComponent,
    OrderCheckBarcodeDialogComponent,
    OrderSentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    MatNativeDateModule,
    NgxPrintModule
  ],
  providers: [MatNativeDateModule, { provide: MAT_DATE_LOCALE, useValue: 'ru-Ru' }],
  bootstrap: [AppComponent],

})
export class AppModule { }
