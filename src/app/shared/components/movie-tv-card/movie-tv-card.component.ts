import {Component, input, InputSignal} from '@angular/core';
import {DatePipe, DecimalPipe, JsonPipe, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

import {ImgMissingDirective} from '../../directives';
import {IResult} from '../../models';
import { RemoveWhitespacePipe } from '../../pipes/remove-whitespace.pipe';
import { JSDocComment } from '@angular/compiler';

@Component({
  selector: 'app-movie-tv-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    ImgMissingDirective,
    DatePipe,
    DecimalPipe,
    JsonPipe,    
    RemoveWhitespacePipe
  ],
  templateUrl: './movie-tv-card.component.html',
  styles: ``,
})
export class MovieTvCardComponent {
  // Inputs
  model: InputSignal<IResult> = input.required<IResult>();
  isMovie: InputSignal<boolean> = input.required<boolean>();
}
