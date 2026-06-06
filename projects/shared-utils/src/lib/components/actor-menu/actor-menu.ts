import { AfterViewInit, Component, input, output } from '@angular/core';
import { ModelItem } from '../model-item/model-item';
import { ModelInfo } from '../../models';

@Component({
  selector: 'lib-actor-menu',
  imports: [ModelItem],
  templateUrl: './actor-menu.html',
  styleUrl: './actor-menu.css',
})
export class ActorMenu implements AfterViewInit {
  models = input<ModelInfo[]>();
  getModelId = output<number>();
  editClick = output();
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngAfterViewInit() {
    this.initTooltips();
  }

  private initTooltips() {
    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((el) => {
        const tooltip = new (window as any).bootstrap.Tooltip(el, {
          html: true,
          template:
            '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 100px;border:solid 4px red;"></div></div>',
        });
      });
    });
  }

  handleEdit() {
    this.editClick.emit();
  }

  actorImage(star: ModelInfo) {
    return `<img class='star-image' src='${star.image}' alt='${star.Name}'/>`;
  }

  selectModel(star: ModelInfo) {
    this.getModelId.emit(star.ID);
  }
}
