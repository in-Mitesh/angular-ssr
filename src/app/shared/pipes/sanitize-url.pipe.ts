import { InputSignal, Pipe, PipeTransform, inject,input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl',
  standalone: true
})
export class SanitizeUrlPipe implements PipeTransform {

  sanitizer = inject(DomSanitizer);

  serverList:string[] = (['https://vidsrc.xyz/embed/','https://vidsrc.in/embed/','https://vidsrc.pm/embed/','https://vidsrc.net/embed/']); 

  transform(value: string, currentServer: number) {    
   
        return  this.sanitizer.bypassSecurityTrustResourceUrl(this.serverList[currentServer]+value);
    
    
  }

}
