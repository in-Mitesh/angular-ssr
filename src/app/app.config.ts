import {ApplicationConfig, PLATFORM_ID} from '@angular/core';
import { provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {register} from 'swiper/element/bundle';

import {routes} from './app.routes';
import {httpInterceptor} from './core/interceptors';
import { environment } from '../environments/environment';
import { provideClientHydration } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';



register();



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([httpInterceptor])),
    provideAnimations(), provideClientHydration(),
    
  ],

};
