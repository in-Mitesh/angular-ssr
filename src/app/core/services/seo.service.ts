import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  meta = inject(Meta);
  //  title=inject(Title);

  genrateSeoMetaTags(config: openGraph) {
    this.meta.updateTag({ property: 'title', content: config.title });
    this.meta.updateTag({ property: 'description', content: config.discription });
    this.meta.updateTag({ property: 'keywords', content: config.keywords });

    // openGraph card
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.discription });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:type', content: config.type });
    this.meta.updateTag({ property: 'og:url', content: config.url });
    this.meta.updateTag({ property: 'og:image:type', content: config.imageType });
    this.meta.updateTag({ property: 'og:image:width', content: config.width });
    this.meta.updateTag({ property: 'og:image:height', content: config.height });

    // twitter card
    this.meta.updateTag({ property: 'twitter:description', content: config.discription });
    this.meta.updateTag({ property: 'twitter:image', content: config.image });
    this.meta.updateTag({ property: 'twitter:title', content: config.title });
    this.meta.updateTag({ property: 'twitter:url', content: config.url });
    this.meta.updateTag({ property: 'twitter:domain', content: isPlatformBrowser(PLATFORM_ID)?window.location.hostname:'' });



    //  <meta name="twitter:card" content="summary_large_image">
    // <meta property="twitter:domain" content="local-ogp.firebaseapp.com">
    // <meta property="twitter:url" content="https://local-ogp.firebaseapp.com/site/jxe8sUgxZCP5b4ElbJSX">
    // <meta name="twitter:title" content="mojmovie | Watch Movies & TV Shows Online for FREE">
    // <meta name="twitter:description" content="mojmovie is the best website to watch movies, watch tv shows online in HD for FREE! No ADS! No registration is required! WATCH NOW!!!">
    // <meta name="twitter:image" content="https://i.ibb.co/m8cjP9q/ogImage.png">

  }



}

export interface openGraph {
  title: string;
  type: string;
  discription: string;
  image: string;
  url: string;
  keywords: string;
  author: string;
  imageType: string;
  height: string;
  width: string;
}


