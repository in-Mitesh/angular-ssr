import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {combineLatestWith, Observable, Subject, take, takeUntil} from 'rxjs';

import {TvShowsService} from '../../core/services';
import {IMovieTv, IResult} from '../../shared/models';
import {CustomError} from '../../shared/models/errors.model';
import {MovieTvListComponent, SpinnerComponent} from '../../shared/components';
import { SeoService } from '../../core/services/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tv-shows',
  standalone: true,
  imports: [SpinnerComponent, MovieTvListComponent],
  templateUrl: './tv-shows.component.html',
  styleUrl: './tv-shows.component.scss',
})
export class TvShowsComponent implements OnInit, OnDestroy {
  // Services
  private titleService: Title = inject(Title);
  private tvShowsService = inject(TvShowsService);
  private seoService:SeoService=inject(SeoService);

  // Properties
  private destroy$: Subject<void> = new Subject<void>();
  public onTheAirTvShows: Array<IResult> = [];
  public topRatedTvShows: Array<IResult> = [];
  public popularTvShows: Array<IResult> = [];

  // States
  public isLoading: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.titleService.setTitle('mojmovie | TV Shows');
    this.getAllTvShows();
  }

  private genrateMetaTags(){
    this.seoService.genrateSeoMetaTags({
      discription: 'Collection of  trending Tv Shows',
      title:`mojmovie | ${'Tv-Shows'}`,
      image:`https://i.ibb.co/m8cjP9q/ogImage.png`,
      type:'Website',
      url:`${isPlatformBrowser(PLATFORM_ID)?window.location.hostname:''}` ,
      author:'Mitesh',
      keywords:`${'trending movies, trending tv shows, hot movies, hot tv shows'}`,
      imageType:'image/png',
      height:'300',
      width:'400'
       });
  }

  private getAllTvShows(): void {
    this.isLoading.set(true);
    const onTheAir$: Observable<IMovieTv> = this.getTvShows('on_the_air', 1);
    const popular$: Observable<IMovieTv> = this.getTvShows('popular', 1);
    const topRated$: Observable<IMovieTv> = this.getTvShows('top_rated', 1);

    onTheAir$.pipe(combineLatestWith(popular$, topRated$)).subscribe({
      next: ([onTheAir, popular, topRated]): void => {
        this.handleTvShowsResponse('on_the_air', onTheAir.results);
        this.handleTvShowsResponse('popular', popular.results);
        this.handleTvShowsResponse('top_rated', topRated.results);
        this.genrateMetaTags();
        this.isLoading.set(false);
      },
      error: (error: CustomError): void => {
        this.isLoading.set(false);
        console.error(error.status_message);
      },
    });
  }

  private getTvShows(type: string, page: number): Observable<IMovieTv> {
    return this.tvShowsService
      .getTVShows(type, page)
      .pipe(take(1), takeUntil(this.destroy$));
  }

  private handleTvShowsResponse(type: string, results: IResult[]): void {
    switch (type) {
      case 'on_the_air':
        this.onTheAirTvShows = results || [];
        break;
      case 'popular':
        this.popularTvShows = results || [];
        break;
      case 'top_rated':
        this.topRatedTvShows = results || [];
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
