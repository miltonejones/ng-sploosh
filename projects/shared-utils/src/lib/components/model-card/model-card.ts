import { Component, input, OnInit, output, signal } from '@angular/core';
import { DashModel } from '../../models';

@Component({
  selector: 'lib-model-card',
  imports: [],
  templateUrl: './model-card.html',
  styleUrl: './model-card.css',
})
export class ModelCard implements OnInit {
  model = input<DashModel>();
  size = input<'sm' | 'lg'>('lg');
  source = signal('');
  select = output<DashModel>();

  ngOnInit(): void {
    this.source.set(this.model()?.image!);
  }

  selectModel(model: DashModel) {
    this.select.emit(model);
  }

  setErrorImage() {
    this.source.set('https://s3.amazonaws.com/sploosh.me.uk/assets/no-img-women.jpg');
  }
}
