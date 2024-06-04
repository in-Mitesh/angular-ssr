import {
  Component,
  OnInit,
  inject,
  OnDestroy,
  WritableSignal,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subscription,
} from 'rxjs';

import {SearchService} from '../../core/services';
import {IMovieTv, IResult} from '../../shared/models';
import {CustomError} from '../../shared/models/errors.model';
import {MovieTvCardComponent} from '../../shared/components';
import { SeoService } from '../../core/services/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MovieTvCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  // Services
  private titleService: Title = inject(Title);
  private searchService: SearchService = inject(SearchService);
  private seoService:SeoService=inject(SeoService);

  // Properties
  public searchForm: FormGroup;
  public subs: Subscription = new Subscription();
  public media: WritableSignal<IResult[]> = signal<IResult[]>([]);

  // State
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.titleService.setTitle('mojmovie | Search');

    this.searchForm = new FormGroup({
      search: new FormControl<string>('', {nonNullable: true}),
    });


    this.listeningSearch();
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
  private listeningSearch(): void {
    this.subs.add(
      this.searchForm
        .get('search')
        ?.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value: string): void => {
          if (value && value?.length > 0) {
            this.onSearch(value);
          } else {
            this.media.set([]);
          }
        })
    );
  }

  public onSearch(query: string): void {
    this.isLoading.set(true);

    const movies$: Observable<IMovieTv> =
      this.searchService.searchMovies(query,1);
    const tvShows$: Observable<IMovieTv> =
      this.searchService.searchTvShows(query);

    movies$.pipe(combineLatestWith(tvShows$),debounceTime(1000)).subscribe({
      next: ([movies, tvShows]): void => {
        this.isLoading.set(false);
        const moviesData: IResult[] = movies.results
          ? movies.results?.slice(0, 9).map((m) => ({...m, isMovie: true}))
          : [];
        const tvShowsData: IResult[] = tvShows.results
          ? tvShows.results?.slice(0, 9).map((m) => ({...m, isMovie: false}))
          : [];

        this.media.set([...moviesData, ...tvShowsData]);
      },
      error: (error: CustomError): void => {
        this.isLoading.set(false);
        console.error(error.status_message);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
