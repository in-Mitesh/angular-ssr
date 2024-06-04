import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '' ,
    loadComponent:()=> 
      import("./modules/homepage/homepage.component").then((m)=>m.HomepageComponent)    
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./modules/search/search.component').then(
        (m) => m.SearchComponent
      ),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./modules/movies/movies.component').then(
        (m) => m.MoviesComponent
      ),
  },
  {
    path: 'tv-shows',
    loadComponent: () =>
      import('./modules/tv-shows/tv-shows.component').then(
        (m) => m.TvShowsComponent
      ),
  },
  {
    path: 'movies/:id/:title',
    loadComponent: () =>
      import('./modules/details/details.component').then(
        (m) => m.DetailsComponent
      ),
  },
  {
    path: 'tv-shows/:id/:title',
    loadComponent: () =>
      import('./modules/details/details.component').then(
        (m) => m.DetailsComponent
      ),
  },
  {
    path: 'view',
    loadComponent: () =>
      import('./modules/view-all/view-all.component').then(
        (m) => m.ViewAllComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./modules/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path:'anime',
    loadComponent:()=> import('./modules/anime/anime.component').then((m)=> m.AnimeComponent)
  }
  ,

  {
    path: '**',
    redirectTo: '404',
  },
];
