import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {INavbarLink} from '../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent {
  // Properties
  public appTitle = 'mojmovie';
  public navbarLinks: INavbarLink[] = [
    {
      path: 'home',
      label: 'HOME',
    },
    {
      path: 'search',
      label: 'SEARCH',
    },
    {
      path: 'movies',
      label: 'MOVIES',
    },
    {
      path: 'tv-shows',
      label: 'TV SHOWS',
    },
    // {
    //   path:'live-ipl',
    //   label:'LIVE IPL'
    // },
    // {
    //   path:'anime',
    //   label:'ANIMES'
    // },
    
  ];
}
