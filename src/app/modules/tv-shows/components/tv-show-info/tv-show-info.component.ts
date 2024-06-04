import {Component, input, InputSignal} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IResult, ITvShow} from '../../../../shared/models';
import {MovieTvListComponent} from '../../../../shared/components';
import { SanitizeUrlPipe } from "../../../../shared/pipes/sanitize-url.pipe";

@Component({
    selector: 'app-tv-show-info',
    standalone: true,
    templateUrl: './tv-show-info.component.html',
    styleUrl: './tv-show-info.component.scss',
    imports: [DatePipe, MovieTvListComponent, SanitizeUrlPipe]
})
export class TvShowInfoComponent {
  // Inputs
  tvShow: InputSignal<ITvShow> = input.required<ITvShow>();
  recommendedTvShows: InputSignal<IResult[]> = input<IResult[]>([]);
currentServer: number=0;
setServerValue(arg0: number) {
  this.currentServer= arg0;
  }
}
