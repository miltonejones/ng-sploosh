import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[libImageFix]',
})
export class ImageFix implements OnInit, OnChanges {
  @Input('libImageFix') source?: string | null = '';
  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['source']) {
      if (!this.source) return;
      this.el.nativeElement.src = correct(this.source);
    }
  }

  ngOnInit(): void {
    if (!this.source) return;
    this.el.nativeElement.src = correct(this.source);
  }
}

export function correct(source: string): string {
  let src = source;
  console.log({ source });
  if (source?.indexOf('img.javdoe.sh') > 0) {
    src = source
      .replace('img.javdoe.sh', 'javdoe.sh/media/videos')
      .replace('/javdoe.sh/media', '/pics.javdoe.sh/media');
  }
  if (source?.indexOf('/javdoe.sh/media') > 0) {
    src = source.replace('/javdoe.sh/media', '/pics.javdoe.sh/media');
  }
  return src;
}
