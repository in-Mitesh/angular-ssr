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

import {MoviesService} from '../../core/services';
import {IMovieTv, IResult} from '../../shared/models';
import {CustomError} from '../../shared/models/errors.model';
import {MovieTvListComponent, SpinnerComponent} from '../../shared/components';
import { SeoService } from '../../core/services/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [MovieTvListComponent, SpinnerComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit, OnDestroy {
  // Services
  private titleService: Title = inject(Title);
  private moviesService: MoviesService = inject(MoviesService);
  private seoService:SeoService=inject(SeoService);

  // Properties
  private destroy$: Subject<void> = new Subject<void>();
  public nowPlayingMovies: Array<IResult> = [];
  public upcomingMovies: Array<IResult> = [];
  public popularMovies: Array<IResult> = [];

  // States
  public isLoading: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.titleService.setTitle('mojmovie | Movies');
    this.getAllMovies();
  }

  private getAllMovies(): void {
    this.isLoading.set(true);
    const nowPlaying$: Observable<IMovieTv> = this.getMovies('now_playing', 1);
    const popular$: Observable<IMovieTv> = this.getMovies('popular', 1);
    const upcoming$: Observable<IMovieTv> = this.getMovies('upcoming', 1);

    nowPlaying$.pipe(combineLatestWith(popular$, upcoming$)).subscribe({
      next: ([nowPlaying, popular, upcoming]): void => {
        this.handleMoviesResponse('now_playing', nowPlaying.results);
        this.handleMoviesResponse('popular', popular.results);
        this.handleMoviesResponse('upcoming', upcoming.results);
        this.genrateMetaTags();
        this.isLoading.set(false);
      },
      error: (error: CustomError): void => {
        this.isLoading.set(false);
        console.error(error.status_message);
      },
    });
  }
  private genrateMetaTags(){
    this.seoService.genrateSeoMetaTags({
      discription: 'Collection of  trending Tv Movies',
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

  private getMovies(type: string, page: number): Observable<IMovieTv> {
    return this.moviesService
      .getMovies(type, page)
      .pipe(take(1), takeUntil(this.destroy$));
  }

  private handleMoviesResponse(type: string, results: IResult[]): void {
    switch (type) {
      case 'now_playing':
        this.nowPlayingMovies = results || [];
        break;
      case 'popular':
        this.popularMovies = results || [];
        break;
      case 'upcoming':
        this.upcomingMovies = results || [];
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
