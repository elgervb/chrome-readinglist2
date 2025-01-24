import { Directive, ElementRef, InjectionToken, inject, input } from '@angular/core';

export const DEFAULT_LAZY_IMAGE = new InjectionToken<string>('default.lazy.image');

@Directive({ selector: '[appLazyImg]' })
export class LazyImgDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private defaultPath = inject(DEFAULT_LAZY_IMAGE, { optional: true });


  readonly appLazyImg = input<string>(undefined);

  private observer: IntersectionObserver;

  constructor() {
    const el = this.el;

    this.observer = new IntersectionObserver(entries => this.loading(entries), {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    this.observer.observe(el.nativeElement);
  }

  loading(changes: IntersectionObserverEntry[]) {
    changes.forEach(change => {
      // Are we in viewport?
      if (change.intersectionRatio > 0) {
        // Stop watching and load the image
        this.observer.unobserve(this.el.nativeElement);
        this.preloadImage(this.el);
      }
    });
  }

  private preloadImage(image: ElementRef) {
    const element: HTMLImageElement = image.nativeElement;
    element.src = this.appLazyImg();
    element.onerror = () => {
      if (this.defaultPath) {
        element.src = this.defaultPath;
      }
    };
  }

}
