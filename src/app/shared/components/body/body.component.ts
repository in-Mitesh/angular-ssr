import {Component, OnInit, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './body.component.html',
  styles: ``,
})
export class BodyComponent implements OnInit{
   
  ngOnInit(): void {
   
  }



}
