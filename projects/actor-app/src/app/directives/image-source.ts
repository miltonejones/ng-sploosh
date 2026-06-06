import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

const DEFAULT_IMAGE = 'https://s3.amazonaws.com/sploosh.me.uk/assets/XXX.jpg';

@Directive({
  selector: '[appImageSource]',
})
export class ImageSource implements OnChanges, OnInit {
  @Input('appImageSource') image?: string | null = '';
  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  source?: string | null = '';

  ngOnInit(): void {
    this.checkImageSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkImageSize();
  }

  updateImage() {
    if (!this.image) return;
    this.el.nativeElement.style.backgroundImage = `url(${correct(this.source!)})`;
    // this.checkImageSize();
  }

  checkImageSize() {
    if (!this.image) return;
    const im = new Image();
    im.onload = () => {
      if (im.width > im.height) {
        this.el.nativeElement.style.backgroundSize = '100% 100%';
      }
      this.source = this.image;
      this.updateImage();
    };

    im.onerror = () => {
      this.source = DEFAULT_IMAGE;
      this.el.nativeElement.style.backgroundSize = '100% 100%';
      this.updateImage();
    };

    im.src = correct(this.image);
  }
}

function correct(source: string): string {
  let src = source;
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
