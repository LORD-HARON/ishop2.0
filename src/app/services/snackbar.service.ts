import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private snackBar: MatSnackBar) { }

    openSnackBar(message: string, action: string, className: string = 'standart-snackbar') {
        this.snackBar.open(message, action, {
            duration: 8000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: [className]
        });
    }
    openRedSnackBar(message: string = 'Нет соединения, попробуйте позже.', action: string = 'OK', className: string = 'red-snackbar') {
        this.snackBar.open(message, action, {
            duration: 8000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: [className]
        });
    }
    openSnackGreenBar(message: string, action: string = "OK", className: string = 'green-snackbar') {
        this.snackBar.open(message, action, {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: [className]
        });
    }


}