import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footbar',
  standalone: true,
  imports: [],
  templateUrl: './footbar.component.html',
  styleUrl: './footbar.component.scss'
})
export class FootbarComponent {
siteName: string=environment.siteName;

}
