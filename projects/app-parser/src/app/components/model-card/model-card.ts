import { Component, input, OnInit, output, signal } from '@angular/core';
import { DashModel, ModelInfo } from 'shared-utils';

@Component({
  selector: 'app-model-card',
  imports: [],
  templateUrl: './model-card.html',
  styleUrl: './model-card.css',
})
export class ModelCard implements OnInit {
  model = input<ModelInfo>();
  source = signal('');
  select = output<ModelInfo>();

  ngOnInit(): void {
    this.source.set(this.model()?.image!);
  }

  selectModel(model: ModelInfo) {
    this.select.emit(model);
  }

  setErrorImage() {
    this.source.set('https://s3.amazonaws.com/sploosh.me.uk/assets/no-img-women.jpg');
  }
}
