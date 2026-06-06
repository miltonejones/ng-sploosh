import { Component, input, output } from '@angular/core';
import { ActorInfo, ModelAvatar, ModelItem } from 'shared-utils';
import { ActorMenuItem } from '../actor-menu-item/actor-menu-item';

@Component({
  selector: 'app-actor-menu',
  imports: [ModelAvatar, ActorMenuItem],
  templateUrl: './actor-menu.html',
  styleUrl: './actor-menu.css',
})
export class ActorMenu {
  models = input<ActorInfo[]>([]);
  modelSelect = output<ActorInfo>();
  modelDedupe = output<number>();
  selectedId = input<number>();

  selectModel(model: ActorInfo) {
    this.modelSelect.emit(model);
  }

  dedupeModel(model: ActorInfo) {
    this.modelDedupe.emit(model.ID);
  }
}
