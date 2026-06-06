import { Component, input, OnInit, output, signal } from '@angular/core';
import { ActorInfo } from '../../models';

@Component({
  selector: 'lib-model-avatar',
  imports: [],
  templateUrl: './model-avatar.html',
  styleUrl: './model-avatar.css',
})
export class ModelAvatar implements OnInit {
  model = input<ActorInfo>();
  active = input<boolean>(false);
  size = input<string>('lg');
  clicked = output<ActorInfo>();
  source = signal('');

  ngOnInit(): void {
    this.source.set(this.model()?.image!);
  }

  handleClick() {
    this.clicked.emit(this.model()!);
  }

  setErrorImage() {
    this.source.set('https://s3.amazonaws.com/sploosh.me.uk/assets/no-img-women.jpg');
  }
}
