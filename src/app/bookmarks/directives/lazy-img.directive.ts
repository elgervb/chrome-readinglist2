import { Directive, ElementRef, inject, InjectionToken, input } from '@angular/core';

export const DEFAULT_LAZY_IMAGE = new InjectionToken<string>('default.lazy.image');

@Directive({ selector: '[appLazyImg]' })
export class LazyImgDirective {

  readonly appLazyImg = input<string>(undefined);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly defaultPath = inject(DEFAULT_LAZY_IMAGE, { optional: true });
  private readonly observer: IntersectionObserver;

  constructor() {
    const { el } = this;

    this.observer = new IntersectionObserver(entries => this.loading(entries), {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    this.observer.observe(el.nativeElement);
  }

  loading(changes: IntersectionObserverEntry[]): void {
    changes.forEach(change => {
      // Are we in viewport?
      if (change.intersectionRatio > 0) {
        // Stop watching and load the image
        this.observer.unobserve(this.el.nativeElement);
        this.preloadImage(this.el);
      }
    });
  }

  private preloadImage(image: ElementRef): void {
    const element: HTMLImageElement = image.nativeElement;
    element.src = this.appLazyImg();
    element.onerror = () => {
      if (this.defaultPath) {
        element.src = this.defaultPath;
      }
    };
  }

}
