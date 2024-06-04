import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeWhitespace',
  standalone: true
})
export class RemoveWhitespacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {    
    return value.includes(' ')?value.replaceAll(' ','-'):value;
  }

}
