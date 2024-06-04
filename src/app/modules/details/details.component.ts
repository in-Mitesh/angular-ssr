import {
  afterNextRender,
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatestWith, Observable, Subject, take, takeUntil } from 'rxjs';
import { CurrencyPipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';

import {
  IMovie,
  IMovieTv,
  IMovieVideos,
  IResult,
  ITvShow,
  IVideoData,
} from '../../shared/models';
import { MoviesService, SearchService, TvShowsService } from '../../core/services';
import { CustomError } from '../../shared/models/errors.model';
import { SpinnerComponent } from '../../shared/components';
import { ImgMissingDirective } from '../../shared/directives';
import { MovieInfoComponent } from '../movies/components';
import { TvShowInfoComponent } from '../tv-shows/components';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    SpinnerComponent,
    ImgMissingDirective,
    MovieInfoComponent,
    TvShowInfoComponent,
    CurrencyPipe
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  // host: {ngSkipHydration: 'true'},

})
export class DetailsComponent implements OnInit, OnDestroy {



  // Services
  private titleService: Title = inject(Title);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private moviesService: MoviesService = inject(MoviesService);
  private tvShowsService: TvShowsService = inject(TvShowsService);
  private searchService: SearchService = inject(SearchService);
  private seoService:SeoService=inject(SeoService);

  // Properties
  private destroy$: Subject<void> = new Subject<void>();
  public contentType = '';
  public movie: IMovie;
  public recommendedMovies: IResult[] = [];
  public movieVideos: IVideoData[] = [];
  public tv: ITvShow;
  public recommendedTvShows: IResult[] = [];

  // State
  public isMovie: boolean;
  public isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {

    this.route.paramMap.subscribe((params)=>{
      
      const id =params.get('id')+'';
      this.isLoading.set(true);      
      this.contentType = this.router.url.split('/')[1];
      // let id = isPlatformBrowser(PLATFORM_ID)? history.state.id :undefined ;
      // const splitUrl = this.router.url.split('/');
      this.isMovie = this.contentType === 'movies'        
    
     if (this.isMovie) {   
        this.getMovie(id);
      } else {
        this.getTvShow(id);
      }
    
  
    })
    
  }

  private getMovie(id: string): void {
    const movie$: Observable<IMovie> = this.moviesService
      .getMovie(id)
      .pipe(take(1), takeUntil(this.destroy$));
    const recommended$: Observable<IMovieTv> = this.getRecommendedMovies(id);
    const videos$: Observable<IMovieVideos> = this.getMovieVideo(id);

    movie$.pipe(combineLatestWith(recommended$, videos$)).subscribe({
      next: ([movie, recommended, videos]): void => {
        this.movie = movie;
        this.recommendedMovies = recommended.results ?? [];
        this.movieVideos = videos.results ?? [];
        this.titleService.setTitle('mojmovie | ' + this.movie.title);     
        this.isLoading.set(false);
        this.genrateMetaTags();
      },
      error: (error: CustomError): void => {
        this.isLoading.set(false);
        console.error(error.status_message);
      },
    });
  }

  private genrateMetaTags(){
    this.seoService.genrateSeoMetaTags({
      discription: this.movie.overview,
      title:`mojmovie | ${this.movie.title}`,
      image:`https://image.tmdb.org/t/p/w1280${(this.isMovie ? this.movie.backdrop_path : this.tv.backdrop_path)}`,
      type:'Website',
      url:`${isPlatformBrowser(PLATFORM_ID)?window.location.hostname:''}` ,
      author:'Mitesh',
      keywords:`${this.movie.genres.map((d)=> d.name)}`,
      imageType:'image/png',
      height:'300',
      width:'400'
       });
  }

  private getTvShow(id: string): void {
    const tvShow$: Observable<ITvShow> = this.tvShowsService
      .getTVShow(id)
      .pipe(take(1), takeUntil(this.destroy$));
    const recommended$: Observable<IMovieTv> = this.getRecommendTVShows(id);

    tvShow$.pipe(combineLatestWith(recommended$)).subscribe({
      next: ([tvShow, recommended]): void => {
        this.tv = tvShow;
        this.recommendedTvShows = recommended.results ?? [];
        this.titleService.setTitle('mojmovie | ' + this.tv.name);
        this.isLoading.set(false);
       this.genrateMetaTags();
      },
      error: (error: CustomError): void => {
        this.isLoading.set(false);
        console.error(error.status_message);
      },
    });
  }

  private getRecommendedMovies(id: string): Observable<IMovieTv> {
    return this.moviesService
      .getRecommendedMovies(id)
      .pipe(take(1), takeUntil(this.destroy$));
  }

  private getMovieVideo(id: string): Observable<IMovieVideos> {
    return this.moviesService
      .getMovieVideos(id)
      .pipe(take(1), takeUntil(this.destroy$));
  }

  private getRecommendTVShows(id: string): Observable<IMovieTv> {
    return this.tvShowsService
      .getRecommendTVShows(id)
      .pipe(take(1), takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
