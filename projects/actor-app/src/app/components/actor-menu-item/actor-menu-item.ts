import { Component, input, OnInit, output, signal } from '@angular/core';
import { ActorInfo } from 'shared-utils';

@Component({
  selector: 'app-actor-menu-item',
  imports: [],
  templateUrl: './actor-menu-item.html',
  styleUrl: './actor-menu-item.css',
})
export class ActorMenuItem implements OnInit {
  models = input<ActorInfo[]>([]);
  actor = input<ActorInfo>();
  selectedId = input<number>();
  select = output<ActorInfo>();
  dedupe = output<ActorInfo>();
  duplicate = signal(false);

  dedupeModel(actor: ActorInfo) {
    this.dedupe.emit(actor);
  }
  selectModel(actor: ActorInfo) {
    this.select.emit(actor);
  }

  ngOnInit(): void {
    const count = this.models()?.filter((f) => f.ID === this.actor()?.ID);
    this.duplicate.set(count.length > 1);
  }
}
