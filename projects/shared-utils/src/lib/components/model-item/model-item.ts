import { Component, input, output, signal } from '@angular/core';
import { ModelInfo } from '../../models';

@Component({
  selector: 'lib-model-item',
  imports: [],
  templateUrl: './model-item.html',
  styleUrl: './model-item.css',
})
export class ModelItem {
  model = input<ModelInfo>();
  error = signal(false);
  select = output<ModelInfo>();

  setError() {
    this.error.set(true);
  }

  handleSelect(star: ModelInfo) {
    this.select.emit(star);
  }
}
