import { Component, effect, input, output, signal } from '@angular/core';
import { DashModel } from '../../models';

@Component({
  selector: 'lib-model-card',
  imports: [],
  templateUrl: './model-card.html',
  styleUrl: './model-card.css',
})
export class ModelCard {
  model = input<DashModel>();
  size = input<'sm' | 'lg'>('lg');
  source = signal('');
  select = output<DashModel>();

  private fallbackImage = 'https://s3.amazonaws.com/sploosh.me.uk/assets/no-img-women.jpg';

  constructor() {
    effect(() => {
      this.source.set(this.model()?.image || this.fallbackImage);
    });
  }

  selectModel(model: DashModel) {
    this.select.emit(model);
  }

  setErrorImage() {
    this.source.set(this.fallbackImage);
  }
}