import { afterNextRender, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { filter } from 'rxjs';

import { BodyComponent, NavbarComponent } from './shared/components';
import { FootbarComponent } from './shared/components/footbar/footbar.component';
import DisableDevtool from 'disable-devtool';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, BodyComponent, FootbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // Services
  private viewportScroller: ViewportScroller = inject(ViewportScroller);
  private router: Router = inject(Router);

  // Properties
  public title = 'mojmovie';

  constructor() {

    if (typeof window !== "undefined" && isPlatformBrowser(PLATFORM_ID)) {
        //  DisableDevtool.isRunning;
    }

  }

  ngOnInit(): void {

   if (isPlatformBrowser(PLATFORM_ID)) {
      initFlowbite();

    }
    this.subscribeToRouterEvents();
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((): void => {
        this.scrollToTop();
      });
  }

  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}


// export default import('disable-devtool').then((m)=>m);
