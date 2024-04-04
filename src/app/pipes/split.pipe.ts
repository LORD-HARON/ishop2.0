import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'split'
})
export class SplitPipe implements PipeTransform {

    nullString: string[]
    transform(val: string, param: string): string[] {
        if (val == null)
            return this.nullString
        else
            return val.split(param).filter(i => i);
    }
}
