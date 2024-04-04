import { Injectable } from '@angular/core';
import { HostListener } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AdaptiveService {
    //! адаптив
    screenHeight: number
    screenWidth: number
    shortTable: boolean = false
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }
    constructor() {
        this.onResize()
    }
    GetCurrentWidth(): number {
        return this.screenWidth;
    }
    GetCurrentHeight(): number {
        return this.screenHeight
    }
}