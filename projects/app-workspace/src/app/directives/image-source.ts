import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appImageSource]',
})
export class ImageSource implements OnChanges, OnInit {
  @Input('appImageSource') image?: string | null = '';
  constructor(private el: ElementRef<HTMLTextAreaElement>) {
    // this.updateImage();
  }

  ngOnInit(): void {
    this.updateImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateImage();
  }

  updateImage() {
    if (!this.image) return;
    this.el.nativeElement.style.backgroundImage = `url(${correct(this.image)})`;
    this.checkImageSize();
  }

  checkImageSize() {
    if (!this.image) return;
    const im = new Image();
    im.onload = () => {
      if (im.width > im.height) {
        this.el.nativeElement.style.backgroundSize = '100% 100%';
      }
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
