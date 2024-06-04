import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { IMovieTv, IResult } from '../../shared/models';
import { MovieTvCardComponent, MovieTvListComponent } from '../../shared/components';
import { SpinnerComponent } from "../../shared/components/spinner/spinner.component";
import { SearchService } from '../../core/services';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CustomError } from '../../shared/models/errors.model';

@Component({
  selector: 'app-anime',
  standalone: true,
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
  imports: [MovieTvListComponent, SpinnerComponent,MovieTvCardComponent]
})
export class AnimeComponent implements OnInit {

  //Services
  searchService: SearchService = inject(SearchService);
  private titleService: Title = inject(Title);


  //property
  public animeMovies: Array<IResult> = [];
  public animeSeries: Array<IResult> = [];
  pageNo:number=1;

  // State
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.titleService.setTitle(environment.siteName + '|  Anime');
    this.getAnime(this.pageNo);
  }

  public getAnime(page:number):void{

    this.isLoading.set(true);
     const $animeMovies:Observable<IMovieTv>=  this.searchService.searchMovies('Anime',page);
     $animeMovies.subscribe({
      next:(results:IMovieTv)=>{
      this.animeMovies=[...this.animeMovies ,...results.results];
      this.isLoading.set(false);
     },
    error:(error:CustomError)=>{
      this.isLoading.set(false);
      console.error(error.status_message);
    }});

  }

  loadMoreData() {
   this.getAnime(++this.pageNo);   
  }
  



}
