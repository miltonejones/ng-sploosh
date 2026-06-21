import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { ModelInfo } from '../../models';
import { correct, ImageFix } from '../../directives/image-fix';

@Component({
  selector: 'lib-model-item',
  imports: [ImageFix],
  templateUrl: './model-item.html',
  styleUrl: './model-item.css',
})
export class ModelItem implements OnChanges {
  model = input<ModelInfo>();
  error = signal(false);
  select = output<ModelInfo>();

  setError() {
    this.error.set(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      this.error.set(false);
    }
  }

  handleSelect(star: ModelInfo) {
    this.select.emit(star);
  }

  actorImage(star: ModelInfo) {
    const fixedSrc = correct(star.image || '');
    return `<img class='star-image' width='140' style='width:100px;aspect-ratio:9/16' src='${fixedSrc}' alt='${star.Name}'/>`;
  }
}
